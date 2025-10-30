// File: backend/services/launchpadIntegration.js
// Integration with Jupiter, Raydium, and Pumpkin launchpads

const axios = require('axios');

class LaunchpadIntegration {
  constructor() {
    this.jupiterAPI = 'https://quote-api.jup.ag/v6';
    this.raydiumAPI = 'https://api.raydium.io/v2';
    this.pumpkinAPI = 'https://api.pump.fun'; // Mock endpoint
  }

  /**
   * Jupiter Aggregator - Get best swap route
   */
  async getJupiterQuote(inputMint, outputMint, amount, slippageBps = 50) {
    try {
      const response = await axios.get(`${this.jupiterAPI}/quote`, {
        params: {
          inputMint,
          outputMint,
          amount,
          slippageBps,
        }
      });
      
      return {
        success: true,
        data: response.data,
        route: response.data.routePlan,
        outputAmount: response.data.outAmount,
        priceImpact: response.data.priceImpactPct
      };
    } catch (error) {
      console.error('Jupiter quote error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Execute Jupiter swap
   */
  async executeJupiterSwap(quoteResponse, userPublicKey) {
    try {
      const response = await axios.post(`${this.jupiterAPI}/swap`, {
        quoteResponse,
        userPublicKey,
        wrapUnwrapSOL: true,
      });
      
      return {
        success: true,
        swapTransaction: response.data.swapTransaction
      };
    } catch (error) {
      console.error('Jupiter swap error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Raydium - Get pool information
   */
  async getRaydiumPoolInfo(poolId) {
    try {
      const response = await axios.get(`${this.raydiumAPI}/main/pool/${poolId}`);
      
      return {
        success: true,
        pool: response.data,
        liquidity: response.data.liquidity,
        volume24h: response.data.volume24h,
        apy: response.data.apy
      };
    } catch (error) {
      console.error('Raydium pool error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Raydium - Get all pools
   */
  async getRaydiumPools() {
    try {
      const response = await axios.get(`${this.raydiumAPI}/main/pairs`);
      
      return {
        success: true,
        pools: response.data
      };
    } catch (error) {
      console.error('Raydium pools error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get new token launches across all platforms
   */
  async getNewLaunches() {
    try {
      const [jupiterTokens, raydiumPools] = await Promise.all([
        this.getJupiterTokenList(),
        this.getRaydiumPools()
      ]);
      
      // Filter for recent launches (last 24h)
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const newLaunches = [];
      
      if (raydiumPools.success) {
        raydiumPools.pools.forEach(pool => {
          if (new Date(pool.createdTime).getTime() > oneDayAgo) {
            newLaunches.push({
              platform: 'Raydium',
              token: pool.baseMint,
              symbol: pool.baseSymbol,
              name: pool.baseName,
              liquidity: pool.liquidity,
              launchTime: pool.createdTime
            });
          }
        });
      }
      
      return {
        success: true,
        launches: newLaunches,
        count: newLaunches.length
      };
    } catch (error) {
      console.error('New launches error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get Jupiter token list
   */
  async getJupiterTokenList() {
    try {
      const response = await axios.get('https://token.jup.ag/all');
      return {
        success: true,
        tokens: response.data
      };
    } catch (error) {
      console.error('Jupiter token list error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate optimal slippage based on market conditions
   */
  calculateDynamicSlippage(liquidity, volume24h, volatility) {
    let baseSlippage = 50; // 0.5%
    
    // Adjust for liquidity
    if (liquidity < 10000) {
      baseSlippage += 200; // +2% for low liquidity
    } else if (liquidity < 100000) {
      baseSlippage += 100; // +1% for medium liquidity
    }
    
    // Adjust for volatility
    if (volatility > 0.1) {
      baseSlippage += 150; // +1.5% for high volatility
    }
    
    // Cap at 5%
    return Math.min(baseSlippage, 500);
  }

  /**
   * Get token prices from multiple sources
   */
  async getTokenPrices(mints) {
    try {
      const prices = {};
      
      for (const mint of mints) {
        const quote = await this.getJupiterQuote(
          mint,
          'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          1000000, // 1 token (assuming 6 decimals)
          50
        );
        
        if (quote.success) {
          prices[mint] = parseFloat(quote.outputAmount) / 1000000;
        }
      }
      
      return {
        success: true,
        prices
      };
    } catch (error) {
      console.error('Token prices error:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Monitor new token launches and execute sniper strategy
   */
  async sniperBot(config) {
    const {
      targetLiquidity = 50000,
      maxBuyAmount = 1000,
      stopLossPercent = 10,
      takeProfitPercent = 50,
      dynamicSlippage = true
    } = config;
    
    try {
      const newLaunches = await this.getNewLaunches();
      
      if (!newLaunches.success) {
        return { success: false, error: 'Failed to fetch launches' };
      }
      
      const opportunities = newLaunches.launches.filter(launch => 
        parseFloat(launch.liquidity) >= targetLiquidity
      );
      
      const trades = [];
      
      for (const opportunity of opportunities) {
        const slippage = dynamicSlippage 
          ? this.calculateDynamicSlippage(
              parseFloat(opportunity.liquidity),
              0, // Would need volume data
              0.05 // Assumed volatility
            )
          : 100; // 1% default
        
        trades.push({
          token: opportunity.token,
          symbol: opportunity.symbol,
          platform: opportunity.platform,
          liquidity: opportunity.liquidity,
          recommendedSlippage: slippage / 100 + '%',
          buyAmount: Math.min(maxBuyAmount, parseFloat(opportunity.liquidity) * 0.01)
        });
      }
      
      return {
        success: true,
        opportunities: trades,
        count: trades.length
      };
    } catch (error) {
      console.error('Sniper bot error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

const launchpadService = new LaunchpadIntegration();

module.exports = {
  LaunchpadIntegration,
  launchpadService
};

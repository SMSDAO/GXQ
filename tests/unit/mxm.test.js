// File: tests/unit/mxm.test.js
// 🧪 Unit Tests for MXM (Model eXecution Manager)

// Mock mongoose before requiring MXM
jest.mock('mongoose', () => {
  const SchemaClass = class {
    constructor() {}
  };
  SchemaClass.Types = { Mixed: {} };
  
  return {
    Schema: SchemaClass,
    model: jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn()
    }))
  };
});

const { MXM } = require('../../backend/models/MXM');

describe('MXM - Model eXecution Manager', () => {
  let mxm;

  beforeEach(() => {
    mxm = new MXM();
  });

  test('should register default executors', () => {
    expect(mxm.executors.size).toBeGreaterThan(0);
    expect(mxm.executors.has('arbitrage')).toBe(true);
    expect(mxm.executors.has('swap')).toBe(true);
    expect(mxm.executors.has('flashloan')).toBe(true);
  });

  test('should register custom executor', () => {
    const customExecutor = async (input) => ({ success: true, data: input });
    mxm.registerExecutor('custom', customExecutor);
    
    expect(mxm.executors.has('custom')).toBe(true);
  });

  test('should execute swap job successfully', async () => {
    const input = { tokenIn: 'ETH', tokenOut: 'USDC', amountIn: '1.0' };
    const executor = mxm.executors.get('swap');
    
    const result = await executor(input);
    
    expect(result.success).toBe(true);
    expect(result.amountOut).toBeDefined();
    expect(parseFloat(result.amountOut)).toBeGreaterThan(0);
  });

  test('should execute arbitrage job successfully', async () => {
    const input = { 
      tokenIn: 'ETH', 
      tokenOut: 'USDC', 
      amountIn: '1.0',
      dexes: ['Uniswap', 'Sushiswap']
    };
    const executor = mxm.executors.get('arbitrage');
    
    const result = await executor(input);
    
    expect(result.success).toBe(true);
    expect(result.profit).toBeDefined();
    expect(parseFloat(result.profit)).toBeGreaterThan(0);
  });

  test('should execute flashloan job successfully', async () => {
    const input = { 
      token: 'USDC', 
      amount: '10000',
      strategy: 'arbitrage'
    };
    const executor = mxm.executors.get('flashloan');
    
    const result = await executor(input);
    
    expect(result.success).toBe(true);
    expect(result.borrowed).toBe('10000');
    expect(result.netProfit).toBeDefined();
  });

  test('should execute liquidity provision successfully', async () => {
    const input = { 
      token0: 'ETH',
      token1: 'USDC',
      amount0: '1.0',
      amount1: '3000',
      pool: 'ETH-USDC'
    };
    const executor = mxm.executors.get('liquidity');
    
    const result = await executor(input);
    
    expect(result.success).toBe(true);
    expect(result.lpTokens).toBeDefined();
  });

  test('should execute NFT minting successfully', async () => {
    const input = { 
      recipient: '0x1234567890abcdef',
      metadata: { name: 'Test Badge', tier: 'gold' },
      tier: 'gold'
    };
    const executor = mxm.executors.get('nftMint');
    
    const result = await executor(input);
    
    expect(result.success).toBe(true);
    expect(result.tokenId).toBeDefined();
    expect(result.tier).toBe('gold');
  });
});

module.exports = {};

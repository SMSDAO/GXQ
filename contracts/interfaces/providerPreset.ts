/**
 * ============================================================================
 * TradeOS TypeScript Module
 * Auto-generated header by add-code-blocks.js
 * Part of the TradeOS V1.1 Full Stack Platform
 * ============================================================================
 */

export const providerPreset = {
  ETH:   "0xC02aaa39b223FE8D0a0e5C4F27eAD9083C756Cc2", // WETH
  BTC:   "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
  USDC:  "0xA0b86991c6218b36c1d19d4a2e9Eb0cE3606eB48",
  USDT:  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  DAI:   "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  AAVE:  "0x7BeA39867e4169DBe237dE6ef5fD2D1103dB155B",
  UNI:   "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  SUSHI: "0x947950BcC74888a40Ffa2593C5798F11Fc9124C4",
  BAL:   "0xba100000625a3754423978a60c9317c58a424e3D",
  SOL:   "9PLBhxczwH8ExKJjTSg1GmPpP2aUu9nZ85VxQjJZpkin", // TOS on Solana
  GXQ:   "D4JvG7eGEvyGY9jx2SF4HCBztLxdYihRzGqu3jNTpkin",
  MON:   "DnChYycmX16s9oTPsFs8LE3qnFTMvb4aqHrRWwU3jups",
  XAI:   "79dn63RCD3xCduFAcdt5GuM5nQm7ftwcoa4fDf2tpump"
};

export const FeePresets = {
  ETH: {
    deployContract: 0.00022,
    launchToken: 0.00004,
    dashboardInit: 0.001,
    adjustable: true,
    adminPanelControlled: true,
  },
  USDC: { fee: 0.0001 },
  USDT: { fee: 0.0001 },
  DAI: { fee: 0.0001 },
  BTC: { fee: 0.0002 },
  SOL: { fee: 0.00001 }, // masked under monads.solana
};
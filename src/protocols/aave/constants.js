const AAVE_CONTRACTS = [
  {
    chainId: 1,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  {
    chainId: 137,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  {
    chainId: 42161,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
];

const query = `
  query MarketData($request: MarketsRequest!) {
    markets(request: $request) {
      reserves {
        underlyingToken {
          address
          name
          symbol
        }
        supplyInfo {
          apy {
            formatted
          }
        }
      }
    }
  }
`;

const endpoint = 'https://api.v3.aave.com/graphql';

module.exports = {
  AAVE_CONTRACTS,
  query,
  endpoint
};
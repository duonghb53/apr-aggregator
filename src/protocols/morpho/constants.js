/**
 * @description Constants for Morpho protocol
 */


// GraphQL queries for fetching market data
const endpoint = 'https://api.morpho.org/graphql';
const query = `query($orderBy: VaultOrderBy, $orderDirection: OrderDirection, $where: VaultFilters, $first: Int){
  vaults(orderBy: $orderBy, orderDirection: $orderDirection, where: $where, first: $first) {
    items {
      name
      state {
        apy
        rewards {
          yearlySupplyTokens
          supplyApr
          amountPerSuppliedToken
          asset {
            address
            name
          }
        }
      }
      symbol
      address
      chain {
        id
      }
    }
  }
}`;


// Market configuration
const STABLE_ASSETS = [
    { chainID: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }, // USDC
    { chainID: 1, address: '0xA0d69E286B938e21CBf7E51D71F6A4c8918f482F' }, // eUSD
    { chainID: 8453, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' }, // USDC
];

// Constants for APR calculation
const SECONDS_PER_YEAR = 31536000;
const RAY = 10n ** 27n;

module.exports = {
    endpoint,
    query,
    STABLE_ASSETS,
    SECONDS_PER_YEAR,
    RAY
};

/**
 * @description List of Seamless contracts
 * @type {Object[]}
 */
const SEAMLESS_CONTRACTS = [
    {
        chainId: 8453,  // Base
        address: '0x616a4e1db48e22028f6bbf20444cd3b8e3273738',
    },
    {
        chainId: 8453,  
        address: '0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7',
    },
    {
        chainId: 8453,  
        address: '0x27D8c7273fd3fcC6956a0B370cE5Fd4A7fc65c18',
    }
];

const query = `query FullVaultInfo($address: String!, $chainId: Int!) {
  vaultByAddress(address: $address, chainId: $chainId) {
    address
    name
    asset {
      name
      decimals
      symbol
      address
    }
    state {
      netApy
    }
  }
}`

const endpoint = 'https://blue-api.morpho.org/graphql';

module.exports = {
    SEAMLESS_CONTRACTS,
    query,
    endpoint
};

const { createPublicClient, http } = require('viem');
const { mainnet, arbitrum, optimism, base, polygon } = require('viem/chains');

// Map of chain IDs to viem chain objects
const CHAIN_MAP = {
    1: {
        chain: mainnet,
        rpcUrl: 'https://eth.api.onfinality.io/public',
    },
    10: {
        chain: optimism,
        rpcUrl: 'https://optimism.api.onfinality.io/public',
    },
    137: {
        chain: polygon,
        rpcUrl: 'https://polygon.api.onfinality.io/public',
    },
    42161: {
        chain: arbitrum,
        rpcUrl: 'https://arbitrum.api.onfinality.io/public',
    },
    8453: {
        chain: base,
        rpcUrl: 'https://base.api.onfinality.io/public',
    },
};

/**
 * Get the viem chain object for a given chain ID
 * @param {number} chainId - The chain ID to get the chain object for
 * @returns The viem chain object for the given chain ID
 * @throws {Error} If the chain ID is not supported
 */
function getChain(chainId) {
    const chain = CHAIN_MAP[chainId];
    if (!chain) {
        throw new Error(`Chain ID ${chainId} is not supported`);
    }
    return chain;
}

/**
 * Create a viem public client for a given chain ID
 * @param {number} chainId - The chain ID to create a client for
 * @param {string} [rpcUrl] - Optional RPC URL to use. If not provided, uses default RPC URL
 * @returns {import('viem').PublicClient} A viem public client
 */
function createChainClient(chainId, rpcUrl) {
    const chain = getChain(chainId);
    return createPublicClient({
        chain: chain.chain,
        transport: http(rpcUrl || chain.rpcUrl),
    });
}

module.exports = {
    getChain,
    createChainClient,
    CHAIN_MAP,
};

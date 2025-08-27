const Protocol = require('../../interfaces/Protocol');
const { ProtocolType } = require('../../constants/ProtocolType');
const {
    endpoint,
    query,
    STABLE_ASSETS,
} = require('./constants');

/**
 * @class MorphoProtocol
 * @extends Protocol
 * @description Implementation of Morpho protocol APR calculation using GraphQL
 */
class MorphoProtocol extends Protocol {
    constructor() {
        super();
        this.name = 'Morpho';
        this.supportedMarkets = new Map();
    }

    /**
     * Get the type of protocol
     * @returns {string} Protocol type
     */
    getType() {
        return ProtocolType.MORPHO;
    }

    /**
     * Initialize the protocol with necessary configuration
     * @param {Object} config - Protocol specific configuration
     * @returns {Promise<void>}
     */
    async init(config) {
        this.config = config;
    }

    /**
     * Get APR for a specific asset in the protocol
     * @param {string} asset - Asset address
     * @returns {Promise<number>} APR as a percentage
     */
    async getAPR(chainId, address) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        orderBy: "TotalAssetsUsd",
                        orderDirection: "Desc",
                        where: {
                            assetAddress_in: [address.toLowerCase()],
                            chainId_in: [chainId],
                            whitelisted: true
                        },
                        first: 10
                    }
                })
            });

            const data = await response.json();
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            const vault = data.data?.vaults?.items?.[0];
            if (!vault) {
                return 0;
            }

            // Get supply APR from state
            const supplyApr = parseFloat(vault.state?.apy || 0);

            // Add any additional reward APRs
            const rewardApr = vault.state?.rewards?.reduce((total, reward) => {
                return total + parseFloat(reward.supplyApr || 0);
            }, 0) || 0;

            // Format to 2 decimal places as per project preference
            return parseFloat((supplyApr + rewardApr).toFixed(2));
        } catch (error) {
            throw new Error(`Failed to fetch APR for asset ${address}: ${error.message}`);
        }
    }

    /**
     * Get all APRs for supported assets
     * @returns {Promise<Array<{asset: string, apr: number}>>}
     */
    async getAllAPRs() {
        try {
            const addresses = STABLE_ASSETS.map(asset => asset.address.toLowerCase());
            const chainIds = STABLE_ASSETS.map(asset => asset.chainID);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        orderBy: "TotalAssetsUsd",
                        orderDirection: "Desc",
                        where: {
                            assetAddress_in: addresses,
                            chainId_in: chainIds,
                            whitelisted: true
                        },
                        first: 10
                    }
                })
            });

            const data = await response.json();
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            const vaults = data.data?.vaults?.items || [];

            // Map vaults to APR data
            const results = vaults.map(vault => {
                const supplyApr = parseFloat(vault.state?.apy || 0);
                const rewardApr = vault.state?.rewards?.reduce((total, reward) => {
                    return total + parseFloat(reward.supplyApr || 0);
                }, 0) || 0;

                const apy = ((supplyApr + rewardApr) * 100).toFixed(2);

                return {
                    asset: vault.address,
                    name: vault.name,
                    symbol: vault.symbol,
                    chainID: vault.chain.id,
                    apr: apy
                };
            });

            // Sort by APR descending
            return results.sort((a, b) => b.apr - a.apr);
        } catch (error) {
            throw new Error(`Failed to fetch all APRs: ${error.message}`);
        }
    }
}

module.exports = MorphoProtocol;

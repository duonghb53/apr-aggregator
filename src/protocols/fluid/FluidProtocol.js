const Protocol = require('../../interfaces/Protocol');
const { ProtocolType } = require('../../constants/ProtocolType');
const { createChainClient } = require('../../utils/chains');
const {
    LENDING_RESOLVER,
    SECONDS_PER_YEAR,
    SCALE
} = require('./constants');
const fluidAbi = require('./abis/fluid');

/**
 * @class FluidProtocol
 * @extends Protocol
 * @description Implementation of Fluid protocol APR calculation using contract data
 */
class FluidProtocol extends Protocol {
    constructor() {
        super();
        this.name = 'Fluid';
    }

    /**
     * Get the type of protocol
     * @returns {string} Protocol type
     */
    getType() {
        return ProtocolType.FLUID;
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
     * @param {number} chainId - Chain ID
     * @param {string} address - Asset address
     * @returns {Promise<number>} APR as a percentage
     */
    async getAPR(chainId, address) {
        try {
            const client = createChainClient(chainId);
            const result = await client.readContract({
                address: address,
                abi: fluidAbi,
                functionName: 'getFTokensEntireData'
            });

            // The result is an array of FTokenDetails structs
            const tokens = result.map(token => ({
                name: token.name,
                symbol: token.symbol,
                supplyRate: token.supplyRate,
                rewardsRate: token.rewardsRate
            }));

            // Calculate total APR including rewards for each token
            const aprs = tokens.map(token => {
                const baseAPR = (Number(token.supplyRate) / 100);
                const rewardAPR = (Number(token.rewardsRate) / 100);
                const totalAPR = baseAPR + rewardAPR;

                return {
                    name: token.name,
                    symbol: token.symbol,
                    baseAPR: parseFloat(baseAPR.toFixed(2)),
                    rewardAPR: parseFloat(rewardAPR.toFixed(2)),
                    totalAPR: parseFloat(totalAPR.toFixed(2))
                };
            });

            // Return the highest total APR
            const highestAPR = aprs.reduce((max, current) =>
                current.totalAPR > max.totalAPR ? current : max
                , aprs[0]);

            return highestAPR.totalAPR;
        } catch (error) {
            throw new Error(`Failed to fetch APR for asset ${address}: ${error.message}`);
        }
    }

    /**
     * Get all APRs for supported assets
     * @returns {Promise<Array<{asset: string, chainID: number, apr: number}>>}
     */
    async getAllAPRs() {
        try {
            const allTokenAprs = [];

            // Process each lending resolver
            for (const item of LENDING_RESOLVER) {
                try {
                    const client = createChainClient(item.chainID);
                    const result = await client.readContract({
                        address: item.address,
                        abi: fluidAbi,
                        functionName: 'getFTokensEntireData'
                    });

                    // Process each token in the result
                    const tokenAprs = result.map(token => {
                        const baseAPR = (Number(token.supplyRate) / 100);
                        const rewardAPR = (Number(token.rewardsRate) / 100);
                        const totalAPR = baseAPR + rewardAPR;

                        return {
                            asset: token.tokenAddress,
                            chainID: item.chainID,
                            name: token.name,
                            symbol: token.symbol,
                            baseAPR: parseFloat(baseAPR.toFixed(2)),
                            rewardAPR: parseFloat(rewardAPR.toFixed(2)),
                            apr: parseFloat(totalAPR.toFixed(2))
                        };
                    });

                    allTokenAprs.push(...tokenAprs);
                } catch (error) {
                    console.warn(`Failed to fetch APRs for resolver ${item.address} on chain ${item.chainID}: ${error.message}`);
                }
            }

            // Sort by APR descending
            return allTokenAprs.sort((a, b) => b.apr - a.apr);
        } catch (error) {
            throw new Error(`Failed to fetch all APRs: ${error.message}`);
        }
    }

    /**
     * Check if this protocol supports a given asset
     * @param {string} asset - Asset address
     * @returns {Promise<boolean>}
     */
    async supportsAsset(asset) {
        return this.supportedMarkets.has(asset.toLowerCase());
    }
}

module.exports = FluidProtocol;

const Protocol = require('../../interfaces/Protocol');
const { ProtocolType } = require('../../constants/ProtocolType');
const { EULER_CONTRACTS } = require('./constants');
const { createChainClient } = require('../../utils/chains');
const eulerAbi = require('./abis/euler');

/**
 * @class EulerProtocol
 * @extends Protocol
 * @description Implementation of the Euler protocol for APR calculation
 */
class EulerProtocol extends Protocol {
    constructor() {
        super();
        this.config = null;
    }

    getType() {
        return ProtocolType.EULER;
    }

    async init(config) {
        this.config = config;
        // Initialize Euler specific configuration
        // TODO: Add initialization logic
    }

    async getAPR(chainId, address) {
        if (!this.config) {
            throw new Error('Protocol not initialized');
        }

        const client = createChainClient(chainId);

        try {
            // Get supply rate per timestamp
            const supplyRate = await client.readContract({
                address: address,
                abi: eulerAbi,
                functionName: 'interestRate',
                args: []
            });

            const totalAssets = await client.readContract({
                address: address,
                abi: eulerAbi,
                functionName: 'totalAssets',
                args: []
            });

            const totalBorrows = await client.readContract({
                address: address,
                abi: eulerAbi,
                functionName: 'totalBorrows',
                args: []
            });

            const name = await client.readContract({
                address: address,
                abi: eulerAbi,
                functionName: 'name',
                args: []
            });

            const utilization = Number(totalBorrows) / Number(totalAssets);
            console.log(`[${this.getType()}] Utilization for ${address}: ${utilization}`);

            // Convert BigInt to number and handle the calculation
            const secondsPerYear = 60 * 60 * 24 * 365;
            const supplyRatePerYear = Number(supplyRate) / 1e27 * secondsPerYear * utilization * 100;
            const formattedAPR = parseFloat(supplyRatePerYear.toFixed(2)); // Format to 2 decimal places

            console.log(`[${this.getType()}] Supply APR for ${address}: ${formattedAPR}%`);

            return {
                chainId: chainId,
                address: address,
                name: name,
                apr: formattedAPR
            };
        } catch (error) {
            console.error(`Error getting APR for chainId ${chainId}:`, error);
            return {
                chainId: chainId,
                address: address,
                name: "",
                apr: 0
            };
        }
    }

    async getAllAPRs() {
        const results = [];

        for (const contract of EULER_CONTRACTS) {
            const apr = await this.getAPR(contract.chainId, contract.address);
            results.push(apr);
        }

        return results;
    }
}

module.exports = EulerProtocol;

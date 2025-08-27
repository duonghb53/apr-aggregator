const Protocol = require('../../interfaces/Protocol');
const { ProtocolType } = require('../../constants/ProtocolType');
const { MOONWELL_CONTRACTS } = require('./constants');
const { mTokenAbi } = require('./abis/mtoken');
const { createChainClient } = require('../../utils/chains');

class MoonwellProtocol extends Protocol {
    constructor() {
        super();
        this.config = null;
    }

    getType() {
        return ProtocolType.MOONWELL;
    }

    async init(config) {
        this.config = config;
    }

    async getAPR(chainId, address) {
        const client = createChainClient(chainId);

        try {
            // Get supply rate per timestamp
            const supplyRate = await client.readContract({
                address: address,
                abi: mTokenAbi,
                functionName: 'supplyRatePerTimestamp'
            });

            const name = await client.readContract({
                address: address,
                abi: mTokenAbi,
                functionName: 'name'
            });

            // Calculate base APR (supply rate)
            const secondsPerYear = 60 * 60 * 24 * 365;
            const apr = Number(supplyRate) * secondsPerYear / 1e18 * 100;
            const formattedAPR = parseFloat(apr.toFixed(2)); // Format to 2 decimal places

            console.log(`[${this.getType()}] Supply APR for ${address}: ${formattedAPR}%`);

            return {
                chainId: chainId,
                address: address,
                name: name,
                apr: formattedAPR
            };
        } catch (error) {
            console.error(`Error getting APR for address ${address}:`, error.message);
            return {
                chainId: chainId,
                address: address,
                name: "",
                apr: 0.0,
                error: error.message
            };
        }
    }

    async getAllAPRs() {
        const results = [];
        for (const contract of MOONWELL_CONTRACTS) {
            try {
                const apr = await this.getAPR(contract.chainId, contract.address);
                results.push(apr);
            } catch (error) {
                console.error(`Error getting APRs for chain ${contract.chainId}:`, error.message);
                results.push({
                    chainId: contract.chainId,
                    markets: [],
                    error: error.message
                });
            }
        }
        return results;
    }
}

module.exports = MoonwellProtocol;

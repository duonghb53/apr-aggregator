const Protocol = require('../../interfaces/Protocol');
const { ProtocolType } = require('../../constants/ProtocolType');
const { COMPOUND_CONTRACTS } = require('./constants');
const { cometAbi } = require('./abis/comet');
const { createChainClient } = require('../../utils/chains');

class CompoundProtocol extends Protocol {
    constructor() {
        super();
        this.config = null;
    }

    getType() {
        return ProtocolType.COMPOUND;
    }

    async init(config) {
        this.config = config;
    }

    async getAPR(chainId, address) {
        const client = createChainClient(chainId);
        const secondsPerYear = 60 * 60 * 24 * 365;

        // Get utilization and supply rate
        const utilization = await client.readContract({
            address: address,
            abi: cometAbi,
            functionName: 'getUtilization'
        });

        const supplyRate = await client.readContract({
            address: address,
            abi: cometAbi,
            functionName: 'getSupplyRate',
            args: [utilization]
        });

        const supplyApr = Number(supplyRate) / 1e18 * secondsPerYear * 100;
        const formattedAPR = parseFloat(supplyApr.toFixed(2)); // Format to 2 decimal places
        console.log(`[${this.getType()}] Supply APR for ${address}: ${formattedAPR}%`);

        return {
            chainId: chainId,
            address: address,
            name: "",
            apr: formattedAPR
        };
    }

    async getAllAPRs() {
        const results = [];
        for (const contract of COMPOUND_CONTRACTS) {
            try {
                const apr = await this.getAPR(contract.chainId, contract.address);
                results.push(apr);
            } catch (error) {
                console.error(`Error getting APR for chainId ${contract.chainId}:`, error.message);
                results.push(apr);
            }
        }
        return results;
    }
}

module.exports = CompoundProtocol;

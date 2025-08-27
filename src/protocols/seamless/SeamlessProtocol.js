const Protocol = require('../../interfaces/Protocol');
const { ProtocolType } = require('../../constants/ProtocolType');
const { SEAMLESS_CONTRACTS, query, endpoint } = require('./constants');

/**
 * @class SeamlessProtocol
 * @extends Protocol
 * @description Implementation of the Seamless protocol for APR calculation
 */
class SeamlessProtocol extends Protocol {
    constructor() {
        super();
        this.config = null;
    }

    getType() {
        return ProtocolType.SEAMLESS;
    }

    async init(config) {
        this.config = config;
    }

    async getAPR(chainId, address) {
        try {
            // Fetch data from GraphQL API
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        address: address.toLowerCase(),
                        chainId: chainId
                    }
                })
            });

            const data = await response.json();

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            const vault = data.data.vaultByAddress;
            if (!vault) {
                throw new Error(`Vault not found for address ${address}`);
            }

            console.log(`[${this.getType()}] Vault data for ${address}:`, JSON.stringify(vault.state, null, 2));

            // Calculate total APR from vault state
            const netApy = vault.state?.netApy || 0;
            const netAPR = netApy * 100;

            const name = vault.name;

            // Format to 2 decimal places
            const formattedAPR = parseFloat(netAPR.toFixed(2));

            console.log(`[${this.getType()}] Supply APR for ${address}: ${formattedAPR}%`);

            return {
                chainId: chainId,
                address: address,
                name: name,
                apr: formattedAPR
            };
        } catch (error) {
            console.error(`Error getting APR for address ${address}:`, error);
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

        for (const contract of SEAMLESS_CONTRACTS) {
            try {
                const apr = await this.getAPR(contract.chainId, contract.address);
                results.push(apr);
            } catch (error) {
                console.error(`Error getting APR for contract ${contract.address}:`, error);
                results.push({
                    chainId: contract.chainId,
                    address: contract.address,
                    apr: 0,
                    error: error.message
                });
            }
        }

        return results;
    }
}

module.exports = SeamlessProtocol;

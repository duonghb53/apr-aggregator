const Protocol = require('../../interfaces/Protocol');
const { ProtocolType } = require('../../constants/ProtocolType');
const { AAVE_CONTRACTS, query, endpoint } = require('./constants');

/**
 * @class AaveProtocol
 * @extends Protocol
 * @description Implementation of the Aave protocol for APR calculation using GraphQL
 */
class AaveProtocol extends Protocol {
  constructor() {
    super();
    this.config = null;
  }

  getType() {
    return ProtocolType.AAVE;
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
            request: {
              chainIds: chainId
            }
          }
        })
      });

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      const markets = data.data.markets;
      if (!markets || !markets.markets === 0) {
        throw new Error(`No market data found for token ${address}`);
      }

      console.log(`[${this.getType()}] Markets length:`, markets.length);

      // Get the first reserve (should only be one since we filtered by token)
      let apy = 0;
      markets.forEach(m => {
        const reserve = m.reserves.find(r => r.underlyingToken.address.toLowerCase() === address.toLowerCase());
        if (reserve) {
          console.log(`[${this.getType()}] Reserve data for ${address}:`, JSON.stringify(reserve, null, 2));
          apy = reserve.supplyInfo.apy.formatted;
        }
      });


      console.log(`[${this.getType()}] Supply APR for ${address}: ${apy}%`);

      return {
        chainId: chainId,
        address: address,
        name: "",
        apr: apy
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

    for (const contract of AAVE_CONTRACTS) {
      try {
        const apr = await this.getAPR(contract.chainId, contract.address);
        results.push(apr);
      } catch (error) {
        console.error(`Error getting APR for contract ${contract.address}:`, error);
        results.push({
          chainId: contract.chainId,
          address: contract.address,
          name: "",
          apr: 0.0,
          error: error.message
        });
      }
    }

    return results;
  }
}

module.exports = AaveProtocol;
/**
 * @interface Protocol
 * @description Interface for DeFi protocol APR calculation
 */
class Protocol {
  constructor() {
    if (this.constructor === Protocol) {
      throw new Error('Protocol is an abstract class and cannot be instantiated directly');
    }
  }

  /**
   * Get the type of protocol
   * @returns {string} Protocol type from ProtocolType enum
   */
  getType() {
    throw new Error('Method not implemented');
  }

  /**
   * Initialize the protocol with necessary configuration
   * @param {Object} config - Protocol specific configuration
   * @returns {Promise<void>}
   */
  async init(config) {
    throw new Error('Method not implemented');
  }

  /**
   * Get APR for a specific asset in the protocol
   * @param {string} asset - Asset address or identifier
   * @returns {Promise<number>} APR as a percentage
   */
  async getAPR(asset) {
    throw new Error('Method not implemented');
  }

  /**
   * Check if this protocol supports a given asset
   * @param {string} asset - Asset address or identifier
   * @returns {Promise<boolean>}
   */
  async supportsAsset(asset) {
    throw new Error('Method not implemented');
  }
}

module.exports = Protocol;
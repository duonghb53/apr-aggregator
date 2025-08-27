/**
 * @enum {string}
 * @description Enumeration of supported DeFi protocols
 */
const ProtocolType = {
  COMPOUND: 'COMPOUND',
  AAVE: 'AAVE',
  MORPHO: 'MORPHO',
  MOONWELL: 'MOONWELL',
  EULER: 'EULER',
  FLUID: 'FLUID',
  SEAMLESS: 'SEAMLESS'
};

/**
 * @description Check if a protocol type is valid
 * @param {string} type - Protocol type to validate
 * @returns {boolean}
 */
const isValidProtocolType = (type) => {
  return Object.values(ProtocolType).includes(type.toUpperCase());
};

module.exports = {
  ProtocolType,
  isValidProtocolType
};

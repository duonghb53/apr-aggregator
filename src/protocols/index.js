const CompoundProtocol = require('./compound');
const AaveProtocol = require('./aave');
const { ProtocolType } = require('../constants/ProtocolType');

// Protocol registry
const protocols = new Map([
    [ProtocolType.COMPOUND, new CompoundProtocol()],
    //   [ProtocolType.AAVE, new AaveProtocol()],
    // Other protocols will be added here as they are implemented
]);



module.exports = protocols;

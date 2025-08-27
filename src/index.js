const express = require('express');
const CompoundProtocol = require('./protocols/compound/CompoundProtocol');
const MoonwellProtocol = require('./protocols/moonwell/MoonwellProtocol');
const EulerProtocol = require('./protocols/euler/EulerProtocol');
const SeamlessProtocol = require('./protocols/seamless/SeamlessProtocol');
const AaveProtocol = require('./protocols/aave/AaveProtocol');
const MorphoProtocol = require('./protocols/morpho/MorphoProtocol');
const FluidProtocol = require('./protocols/fluid/FluidProtocol');
const { isValidProtocolType, ProtocolType } = require('./constants/ProtocolType');
const app = express();
const port = process.env.PORT || 3000;

// Protocol registry
const protocols = new Map();

// Initialize protocols
const compound = new CompoundProtocol();
const moonwell = new MoonwellProtocol();
const euler = new EulerProtocol();
const seamless = new SeamlessProtocol();
const aave = new AaveProtocol();
const morpho = new MorphoProtocol();
const fluid = new FluidProtocol();

protocols.set(ProtocolType.COMPOUND, compound);
protocols.set(ProtocolType.MOONWELL, moonwell);
protocols.set(ProtocolType.EULER, euler);
protocols.set(ProtocolType.SEAMLESS, seamless);
protocols.set(ProtocolType.AAVE, aave);
protocols.set(ProtocolType.MORPHO, morpho);
protocols.set(ProtocolType.FLUID, fluid);

// Initialize all protocols when server starts
async function initializeProtocols() {
  for (const protocol of protocols.values()) {
    await protocol.init({
      // Add protocol specific configuration
    });
  }
}

app.get('/protocols', (req, res) => {
  res.json({
    supported_protocols: Object.values(ProtocolType)
  });
});


// Get all APRs for a specific protocol
app.get('/aprs/:protocol', async (req, res) => {
  const { protocol } = req.params;

  try {
    // Validate protocol type
    if (!isValidProtocolType(protocol)) {
      return res.status(400).json({
        error: 'Unsupported protocol',
        supported_protocols: Object.values(ProtocolType)
      });
    }

    const protocolInstance = protocols.get(protocol.toUpperCase());
    if (!protocolInstance) {
      return res.status(501).json({
        error: 'Protocol not implemented yet',
        protocol: protocol.toUpperCase()
      });
    }

    const aprs = await protocolInstance.getAllAPRs();
    res.json({
      protocol: protocol.toUpperCase(),
      aprs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get APRs from all protocols
app.get('/aprs', async (req, res) => {
  try {
    // Create an array of promises for parallel execution
    const promises = Array.from(protocols.entries()).map(async ([protocolType, protocol]) => {
      try {
        const aprs = await protocol.getAllAPRs();
        return aprs.map(apr => ({
          protocol: protocolType,
          ...apr,
          apr: parseFloat(apr.apr) // Ensure APR is a number
        }));
      } catch (error) {
        console.warn(`Failed to fetch APRs from ${protocolType}: ${error.message}`);
        return [];
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Flatten the results and sort by APR descending
    const flattenedResults = results
      .flat()
      .sort((a, b) => b.apr - a.apr);

    res.json({
      total: flattenedResults.length,
      aprs: flattenedResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initializeProtocols().then(() => {
  app.listen(port, () => {
    console.log(`APR Aggregator service listening at http://localhost:${port}`);
  });
}).catch(console.error);
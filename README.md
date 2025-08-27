# APR Aggregator Service

A service that aggregates APR (Annual Percentage Rate) information from various DeFi protocols including Compound, AAVE, Morpho, Moonwell, Euler, and Fluid.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the service:
```bash
npm start
```

The service will start on port 3000 by default. You can change this by setting the PORT environment variable.

## API Usage

Get APR for a specific asset in a protocol:
```
GET /apr/:protocol/:asset
```

Example:
```
GET /apr/compound/0x123...  // Get APR for a specific asset in Compound
```

Response:
```json
{
  "apr": 5.2  // APR as a percentage
}
```

## Supported Protocols

- Compound (implemented)
- AAVE (coming soon)
- Morpho (coming soon)
- Moonwell (coming soon)
- Euler (coming soon)
- Fluid (coming soon)

## Architecture

The service uses a Protocol interface that defines the standard methods each protocol implementation must provide:

- `init(config)`: Initialize the protocol with necessary configuration
- `getAPR(asset)`: Get the current APR for a specific asset

Each protocol implements this interface with its specific logic for fetching and calculating APRs.

# APR Aggregator Service

A service that aggregates APR (Annual Percentage Rate) information from various DeFi lending protocols. This service provides a unified interface to fetch APR data across different protocols, making it easier to compare rates and integrate with DeFi applications.

## Features

- **Protocol Abstraction**: Unified interface for interacting with different DeFi protocols
- **Real-time APR Data**: Get current APR rates for supported assets
- **Asset Validation**: Built-in validation to check if assets are supported by protocols
- **Extensible Architecture**: Easy to add new protocols through standardized interface
- **Type Safety**: Protocol types are enforced through enums
- **Multi-Protocol Support**: Currently supports:
  - Compound Protocol
  - AAVE Protocol
  - Morpho Protocol
  - Moonwell Protocol
  - Euler Protocol
  - Fluid Protocol
  - Seamless Protocol

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Start the service:
```bash
yarn start
```

The service will start on port 3000 by default. You can change this by setting the PORT environment variable.

## API Usage

The service provides several endpoints to fetch APR information across different protocols.

### List Supported Protocols

```http
GET /protocols
```

Returns a list of all supported protocol types.

Response:
```json
{
  "supported_protocols": [
    "COMPOUND",
    "AAVE",
    "MORPHO",
    "MOONWELL",
    "EULER",
    "FLUID",
    "SEAMLESS"
  ]
}
```

### Get All APRs Across All Protocols

```http
GET /aprs
```

Returns APR information from all implemented protocols, sorted by APR in descending order.

Response:
```json
{
  "total": 42,
  "aprs": [
    {
      "protocol": "COMPOUND",
      "chainId": 1,
      "address": "0x123...",
      "name": "USD Coin",
      "apr": 5.2
    },
    {
      "protocol": "AAVE",
      "chainId": 1,
      "address": "0x456...",
      "name": "DAI Stablecoin",
      "apr": 4.8,
      "error": "Optional error message if APR fetch failed"
    }
    // ... more APRs
  ]
}
```

Field descriptions:
- `protocol`: The protocol identifier (e.g., "COMPOUND", "AAVE")
- `chainId`: The blockchain network ID (e.g., 1 for Ethereum mainnet)
- `address`: The token/market contract address
- `name`: The name of the token/market (may be empty for some protocols)
- `apr`: The NET annual percentage rate as a number (e.g., 5.2 for 5.2%). This represents only the base lending rate without additional rewards.
- `error`: Optional field present only if there was an error fetching the APR

Note: The `apr` field currently only includes the NET APY (base lending rate) and does not include additional reward rates (e.g., COMP, AAVE tokens). For total returns, users should also consider protocol reward rates from the respective protocol's documentation or UI.

### Get All APRs for a Specific Protocol

```http
GET /aprs/:protocol
```

Returns all APR information for a specific protocol.

Example:
```http
GET /aprs/compound
```

Response:
```json
{
  "protocol": "COMPOUND",
  "aprs": [
    {
      "chainId": 1,
      "address": "0x123...",
      "name": "USD Coin",
      "apr": 5.2
    },
    {
      "chainId": 1,
      "address": "0x456...",
      "name": "DAI Stablecoin",
      "apr": 4.1
    }
    // ... more APRs
  ]
}
```

The response fields follow the same structure as the all-protocols endpoint, but without the `protocol` field since it's already specified in the top level of the response.

### Error Handling

The API returns appropriate HTTP status codes:

- `400 Bad Request`: Invalid protocol type
  ```json
  {
    "error": "Unsupported protocol",
    "supported_protocols": ["COMPOUND", "AAVE", ...]
  }
  ```
- `501 Not Implemented`: Protocol not yet implemented
  ```json
  {
    "error": "Protocol not implemented yet",
    "protocol": "PROTOCOL_NAME"
  }
  ```
- `500 Internal Server Error`: Server-side errors
  ```json
  {
    "error": "Error message details"
  }
  ```

## Protocol Interface

Each protocol implementation extends the base `Protocol` class and must implement the following methods:

### Required Methods

- `getType()`: Returns the protocol type identifier from `ProtocolType` enum
- `init(config)`: Initialize the protocol with necessary configuration
- `getAPR(chainId, address)`: Get the current APR for a specific asset
  - Parameters:
    - `chainId`: The blockchain network ID (e.g., 1 for Ethereum)
    - `address`: The token/market contract address
  - Returns: Promise<{
    chainId: number,
    address: string,
    name: string,
    apr: number,
    error?: string
  }>
- `getAllAPRs()`: Get APRs for all supported assets
  - Returns: Promise<Array<APRData>>

### Implementation Types

Protocols can be implemented in two ways:

1. **On-Chain Implementation**
   ```javascript
   async getAPR(chainId, address) {
     const client = createChainClient(chainId);
     // Make contract calls to fetch data
     const rate = await client.readContract({
       address,
       abi,
       functionName: 'getRate'
     });
     // Calculate and return APR
   }
   ```

2. **API/GraphQL Implementation**
   ```javascript
   async getAPR(chainId, address) {
     // Make API/GraphQL calls
     const response = await fetch(endpoint, {
       method: 'POST',
       body: JSON.stringify({
         query,
         variables: { chainId, address }
       })
     });
     // Parse and return APR data
   }
   ```

## Architecture

The service follows a modular architecture:

- **Protocol Interface**: Defines standard methods each protocol must implement
- **Protocol Registry**: Central registry of supported protocols
- **Protocol-Specific Implementations**: Each protocol has its own implementation with:
  - Custom ABI definitions
  - Protocol-specific constants
  - APR calculation logic
  - Asset validation

## Protocol Implementations

Each protocol's APR data is fetched using protocol-specific methods:

### On-Chain Protocols (Smart Contract Calls)

- **Compound Protocol** ✅
  - Uses direct smart contract calls to fetch data
  - Calls `getUtilization()` and `getSupplyRate()` on Comet contracts
  - Supports multiple chains (Ethereum, Polygon)
  - Real-time APR calculation based on utilization

- **Moonwell Protocol** ✅
  - Direct contract interactions
  - Uses MToken contracts for APR calculation
  - Supports Base and other chains

- **Euler Protocol** ✅
  - On-chain APR calculation
  - Direct contract calls for market data
  - Supports Ethereum mainnet

- **Fluid Protocol** ✅
  - Smart contract based APR calculation
  - Real-time rate updates
  - Multi-chain support

### API/GraphQL Based Protocols

- **AAVE Protocol** ✅
  - Uses AAVE's official GraphQL API
  - Endpoint: `https://api.v3.aave.com/graphql`
  - Fetches APY data for all markets in a single query
  - Supports multiple chains (Ethereum, Polygon, Arbitrum)

- **Morpho Protocol** ✅
  - API-based APR fetching
  - Aggregates data from multiple sources
  - Real-time rate updates

- **Seamless Protocol** ✅
  - GraphQL based implementation
  - Similar to AAVE's architecture
  - Multi-chain support

## Current Limitations and Future Improvements

### APR/APY Types

Currently, the service only provides NET APY for lending protocols. Here's what's supported and what's planned:

#### Currently Supported
- ✅ NET APY (Base lending/borrowing rate)
  - Basic interest rate from lending/supplying assets
  - Example: Lending USDC on Compound gives 3% base APY

#### Not Yet Implemented
- ❌ Reward APY/APR
  - Additional rewards in protocol tokens (e.g., COMP, AAVE)
  - Liquidity mining rewards
  - Example: Extra 2% APR in COMP tokens on top of base rate
- ❌ Total APY (NET APY + Reward APY)
  - Combined return from both base rate and rewards
  - Example: 3% base APY + 2% reward APR = 5% total return

### Implementation Notes

For accurate total returns, users should consider:
1. Base lending APY from this service
2. Additional reward rates from protocol UIs or documentation
3. Token prices for reward calculations


## Development Status

All protocols have been implemented with the following features:
- ✅ Multi-chain support where applicable
- ✅ Error handling and fallbacks
- ✅ Rate normalization across protocols
- ✅ Real-time data fetching
- ✅ Extensible architecture for adding new chains/markets
- ⚠️ Limited to NET APY (base rates only)

## Chain and Address Configuration

### Supported Chains

The service currently supports the following blockchain networks:

| Chain ID | Network Name | Default RPC URL |
|----------|-------------|-----------------|
| 1 | Ethereum Mainnet | https://eth.api.onfinality.io/public |
| 10 | Optimism | https://optimism.api.onfinality.io/public |
| 137 | Polygon | https://polygon.api.onfinality.io/public |
| 42161 | Arbitrum | https://arbitrum.api.onfinality.io/public |
| 8453 | Base | https://base.api.onfinality.io/public |

### Adding New Chains

To add support for a new blockchain network:

1. Update `src/utils/chains.js`:
```javascript
const CHAIN_MAP = {
  // ... existing chains ...
  NEW_CHAIN_ID: {
    chain: newChainObject, // Import from viem/chains
    rpcUrl: 'https://your-rpc-url.com',
  },
};
```

2. Add contract addresses for the new chain in the protocol's constants file:
```javascript
// src/protocols/[protocol]/constants.js
const PROTOCOL_CONTRACTS = [
  // ... existing contracts ...
  {
    chainId: NEW_CHAIN_ID,
    address: '0xnew_contract_address',
  },
];
```

### Adding New Market Addresses

To fetch APRs for additional markets/tokens:

1. **For On-Chain Protocols (e.g., Compound)**:
   ```javascript
   // src/protocols/compound/constants.js
   const COMPOUND_CONTRACTS = [
     {
       chainId: 1,
       address: '0xexisting_address',
     },
     // Add new market
     {
       chainId: 1,
       address: '0xnew_market_address',
     }
   ];
   ```

2. **For API/GraphQL Protocols (e.g., AAVE)**:
   ```javascript
   // src/protocols/aave/constants.js
   const AAVE_CONTRACTS = [
     {
       chainId: 1,
       address: '0xexisting_address',
     },
     // Add new market
     {
       chainId: 137, // Polygon market
       address: '0xnew_market_address',
     }
   ];
   ```

### Custom RPC Configuration

You can override default RPC URLs when creating chain clients:

```javascript
const client = createChainClient(chainId, 'https://your-custom-rpc.com');
```

## Contributing

To add a new protocol:
1. Create a new directory under `src/protocols/`
2. Implement the Protocol interface
3. Add necessary ABIs and constants
4. Register the protocol in `src/protocols/index.js`
5. Add chain and market configurations as described above

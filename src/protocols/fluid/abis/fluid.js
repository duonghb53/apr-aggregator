const fluidAbi = [
    {
        "inputs": [],
        "name": "getFTokensEntireData",
        "outputs": [{
            "components": [{
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
            }, {
                "internalType": "bool",
                "name": "eip2612Deposits",
                "type": "bool"
            }, {
                "internalType": "bool",
                "name": "isNativeUnderlying",
                "type": "bool"
            }, {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }, {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            }, {
                "internalType": "uint256",
                "name": "decimals",
                "type": "uint256"
            }, {
                "internalType": "address",
                "name": "asset",
                "type": "address"
            }, {
                "internalType": "uint256",
                "name": "totalAssets",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "totalSupply",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "convertToShares",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "convertToAssets",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "rewardsRate",
                "type": "uint256"
            }, {
                "internalType": "uint256",
                "name": "supplyRate",
                "type": "uint256"
            }, {
                "internalType": "int256",
                "name": "rebalanceDifference",
                "type": "int256"
            }, {
                "components": [{
                    "internalType": "bool",
                    "name": "modeWithInterest",
                    "type": "bool"
                }, {
                    "internalType": "uint256",
                    "name": "supply",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "withdrawalLimit",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "lastUpdateTimestamp",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "expandPercent",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "expandDuration",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "baseWithdrawalLimit",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "withdrawableUntilLimit",
                    "type": "uint256"
                }, {
                    "internalType": "uint256",
                    "name": "withdrawable",
                    "type": "uint256"
                }],
                "internalType": "struct Structs.UserSupplyData",
                "name": "liquidityUserSupplyData",
                "type": "tuple"
            }],
            "internalType": "struct Structs.FTokenDetails[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    }
];

module.exports = fluidAbi;
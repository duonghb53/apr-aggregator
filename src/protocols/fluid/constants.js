/**
 * @description Constants for Fluid protocol
 */

// Fluid protocol addresses
const LENDING_RESOLVER = [
    { chainID: 1, address: '0xC215485C572365AE87f908ad35233EC2572A3BEC' },
    { chainID: 42161, address: '0xdF4d3272FfAE8036d9a2E1626Df2Db5863b4b302' },
    { chainID: 8453, address: '0x3aF6FBEc4a2FE517F56E402C65e3f4c3e18C1D86' },
    { chainID: 137, address: '0x8e72291D5e6f4AAB552cc827fB857a931Fc5CAC1' },
];

// Constants for APR calculation
const SECONDS_PER_YEAR = 31536000;
const SCALE = 1e18;

module.exports = {
    LENDING_RESOLVER,
    SECONDS_PER_YEAR,
    SCALE
};

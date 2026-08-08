/**
 * Minimal interfaces only.
 *
 * `mintAbi` describes the contract you are going to deploy. Keep the deployed
 * contract's signatures identical to these, or update this file to match it.
 * Never point the app at an address whose ABI you have not verified.
 */
export const erc20Abi = [
  {
    type: "function", name: "balanceOf", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "allowance", stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "approve", stateMutability: "nonpayable",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function", name: "decimals", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint8" }],
  },
] as const;

export const mintAbi = [
  {
    type: "function", name: "totalSupply", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "maxSupply", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "pricePerToken", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "maxPerWallet", stateMutability: "view",
    inputs: [], outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "mintedBy", stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function", name: "saleActive", stateMutability: "view",
    inputs: [], outputs: [{ type: "bool" }],
  },
  {
    type: "function", name: "mint", stateMutability: "nonpayable",
    inputs: [{ name: "quantity", type: "uint256" }],
    outputs: [],
  },
] as const;

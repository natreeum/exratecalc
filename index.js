const { ethers } = require("ethers");

const tokenMinimalABI = [
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
const v2MinimalABI = [
  {
    constant: true,
    inputs: [{ name: "lp", type: "address" }],
    name: "getPoolData",
    outputs: [
      { name: "miningRate", type: "uint" },
      { name: "rateDecimals", type: "uint" },
      { name: "tokenA", type: "address" },
      { name: "reserveA", type: "uint" },
      { name: "tokenB", type: "address" },
      { name: "reserveB", type: "uint" },
      { name: "airdropCount", type: "uint" },
      { name: "airdropTokens", type: "address[]" },
      { name: "airdropSettigs", type: "uint[]" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
const v3MinimalABI = [
  "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
];

module.exports = class priceFinder {
  constructor(rpcURL) {
    this.provider = new ethers.JsonRpcProvider(rpcURL);
  }

  // V2
  async v2(v2LPContract, tokenSymbol) {
    const v2Address = "0x7a74b3be679e194e1d6a0c29a343ef8d2a5ac876";
    const v2Contract = new ethers.Contract(
      v2Address,
      v2MinimalABI,
      this.provider
    );

    const poolData = await v2Contract.getPoolData(v2LPContract);
    const { tokenA, tokenB, reserveA, reserveB } = poolData;

    const tokenAContract = new ethers.Contract(
      tokenA,
      tokenMinimalABI,
      this.provider
    );
    const tokenBContract = new ethers.Contract(
      tokenB,
      tokenMinimalABI,
      this.provider
    );

    const tokenADecimals = Number(await tokenAContract.decimals());
    const tokenASymbol = await tokenAContract.symbol();
    const tokenBDecimals = Number(await tokenBContract.decimals());

    const tokenAAmount = Number(reserveA) / 10 ** tokenADecimals;
    const tokenBAmount = Number(reserveB) / 10 ** tokenBDecimals;

    let x, y;
    if (tokenSymbol.toLowerCase() == tokenASymbol.toLowerCase()) {
      x = tokenAAmount;
      y = tokenBAmount;
    } else {
      x = tokenBAmount;
      y = tokenAAmount;
    }
    const price = y / (x + 1);
    return price;
  }

  // V3
  async v3(v3ContractAddress, tokenSymbol) {
    const v3Contract = new ethers.Contract(
      v3ContractAddress,
      v3MinimalABI,
      this.provider
    );

    const sqrtPriceX96 = (await v3Contract.slot0()).sqrtPriceX96;
    const token0 = await v3Contract.token0();
    const token1 = await v3Contract.token1();

    const token0Contract = new ethers.Contract(
      token0,
      tokenMinimalABI,
      this.provider
    );
    const token1Contract = new ethers.Contract(
      token1,
      tokenMinimalABI,
      this.provider
    );

    const token0Decimals = await token0Contract.decimals();
    const token0Symbol = await token0Contract.symbol();
    const token1Decimals = await token1Contract.decimals();

    const price =
      (Number(sqrtPriceX96) / 2 ** 96) ** 2 /
      (10 ** Number(token1Decimals) / 10 ** Number(token0Decimals));

    return tokenSymbol.toLowerCase() == token0Symbol.toLowerCase()
      ? price
      : 1 / price;
  }
};

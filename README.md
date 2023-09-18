# exratecalc

Get token exchange rate from V2 or V3 LP Contract which is using uniswap interface

# Install

```tsx
npm i exratecalc
```

# Usage

```jsx
const exratecalc = require("exratecalc");
const calculator = new exratecalc("RPC Endpoint");
```

# Method descriptions

**.v2(v2_LP_Contract_Address, token_symbol){}**

> returns amount of token per a token with given symbol

**.v3(v3_LP_Contract_Address, token_Symbol){}**

> returns amount of token per a token with given symbol

# Example

```jsx
const exratecalc = require("exratecalc");
const calculator = new exratecalc("RPC Endpoint");

// amount of oUSDT per 1KSP
calculator
  .v2("0xe75a6a3a800a2c5123e67e3bde911ba761fe0705", "ksp")
  .then(console.log); // 0.4710626833673169

// amount of oUSDT per 1KSP
calculator
  .v3("0x21ecdfb99772b10fb913a6f4658a9f97185c82be", "ksp")
  .then(console.log); // 0.4706124510348447
```

# Contributors
[![Contributors](https://img.shields.io/github/contributors/natreeum/exratecalc)](https://github.com/natreeum/exratecalc/graphs/contributors)
- [natreeum](https://github.com/natreeum)


--- 

[![CREDER](https://github.com/natreeum/exratecalc/assets/100063828/7ab52868-9718-4a36-a944-f94edc5b6e77)](https://www.creder.biz)


export class AppError extends Error {
  constructor(message, code = "APP_ERROR") {
    super(`${code}: ${message}`)
    this.code = code
  }
}

export class EmptyAppElementError extends AppError {
  constructor() {
    super('The app requires a HTML element with a id equals to "app"', "EMPTY_APP_ELEMENT")
    this.code = "EMPTY_APP_ELEMENT"
  }
}

export class CoinMarketCapError extends AppError {
  constructor(message) {
    super(message, "COIN_MARKET_CAP")
  }
}
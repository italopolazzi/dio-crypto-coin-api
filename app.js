import { CMC_API_KEY } from './api.js'

import { EmptyAppElementError, CoinMarketCapError } from './errors.js'

var app = null

const getAppElement = () => {
  app = document.querySelector('#app')
  if (!app) throw new EmptyAppElementError
}

const displayErrorMessage = (message, timeout = 5000) => {
  const toast = document.createElement('div')
  toast.classList.add('toast')
  toast.classList.add('error')
  toast.setAttribute('role', 'alert')
  toast.appendChild(document.createTextNode(message))
  document.body.appendChild(toast)

  const t = setTimeout(() => {
    document.body.removeChild(toast)
    clearTimeout(t)
  }, timeout);
}

const loadCMCApiData = async (API_KEY = CMC_API_KEY) => {
  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=${API_KEY}`
    const data = await fetch(url)
  } catch (error) {
    throw new CoinMarketCapError(error.message)
  }

}

const initApp = async () => {
  try {
    getAppElement()
    await loadCMCApiData()
  } catch (error) {
    switch (error.code) {
      case 'EMPTY_APP_ELEMENT':
        displayErrorMessage(error.message)

        break;
      case 'COIN_MARKET_CAP':
        displayErrorMessage(error.message)

        break;
      default:
        displayErrorMessage(error.code)
    }
  }
}

initApp()
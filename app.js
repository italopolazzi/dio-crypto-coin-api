import { CMC_API_KEY } from './api.js'

import { EmptyAppElementError, CoinMarketCapError } from './errors.js'

var app = null

const getAppElement = () => {
  app = document.querySelector('#app')
  if (!app) throw new EmptyAppElementError
}

const renderCMCApiData = (data, quantity = 10, start = 0) => {

  const template = ({ name = "Bitcoin", symbol = "BIT", rank = 30, date = "2000-07-25T21:39:00.000Z" }) => {

    const data = {
      name,
      symbol,
      rank,
      year: new Date(date).getFullYear()
    }

    return `
      <article class="overflow-hidden relative flex items-center rounded-lg shadow-xl hover:shadow-xs">
          <div class="ml-4 flex-shrink-0 overflow-hidden rounded-full">
              <img class="h-20 w-20 object-cover" src="/img/coin.jpg" alt="">
          </div>
          <div class="p-4 w-full">
              <header class="mb-8">
                  <h1 class="text-4xl font-bold">${data.name}</h1>
                  <h2>${data.symbol}</h2>
              </header>

              <footer class="flex justify-between">
                  <div class="ranking">
                      <div class="text-lg font-bold">Ranking</div>
                      <div class="text-lg">${data.rank}</div>
                  </div>
                  <div class="year">
                      <div class="text-lg font-bold">Year</div>
                      <time datetime="${data.date}">${data.year}</time>
                  </div>

              </footer>
          </div>
      </article>
      `
  }

  const items = data.slice(start, quantity).forEach(item => {
    const { name, first_historical_data: date, rank, symbol } = item

    document.querySelector("#coins div").innerHTML += template({
      name, date, rank, symbol
    })
  })


}

const displayMessage = (message, {
  type = 'alert',
  timeout = 5000
} = {}) => {

  const toasts = document.querySelector("#toasts")
  const toast = document.createElement('div')
  toast.classList.add('toast')
  toast.classList.add(type)
  toast.setAttribute('role', 'alert')
  toast.appendChild(document.createTextNode(message))
  toasts.appendChild(toast)

  const t = setTimeout(() => {
    console.log("CALLLED");

    toasts.removeChild(toast)
    clearTimeout(t)
  }, timeout);

}

const displayErrorMessage = (message) => {
  displayMessage(message, { type: 'error' })
}

const displaySuccessMessage = (message) => {
  displayMessage(message, { type: 'success' })
}

const loadCMCApiData = async (API_KEY = CMC_API_KEY) => {
  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=${API_KEY}`
    const response = await fetch(url)
    const json = await response.json()
    return json.data
  } catch (error) {
    throw new CoinMarketCapError(error.message)
  }

}

const initApp = async () => {

  window.addEventListener("offline", () => {
    displayErrorMessage("You are offline!")
  });
  window.addEventListener("online", () => {
    displaySuccessMessage("You are online!")
  });

  try {
    getAppElement()
    const data = await loadCMCApiData()
    renderCMCApiData(data, 10)



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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', {
    scope: '.'
  }).then(reg => {
    console.log(`Registration succeeded. Scope is ${reg.scope}`);
  }).catch(error => {
    console.log(`Registration failed with ${error}`);
  })
}
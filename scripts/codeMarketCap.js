import { CMC_API_KEY } from '/api.js'

import { CoinMarketCapError } from '/errors.js'


const headers = {
  method: 'get',
  mode: 'cors',
  cache: 'default'
}

export const renderCMCApiData = (data, quantity = 10, start = 0) => {

  const template = ({ name = "Bitcoin", symbol = "BIT", rank = 30, date = "2000-07-25T21:39:00.000Z" }) => {

    const data = {
      name,
      symbol,
      rank,
      year: new Date(date).getFullYear()
    }

    return `
      <article class="select-none overflow-hidden relative flex items-center rounded-lg shadow-xl hover:shadow-xs transition  duration-300">
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

export const loadCMCApiData = async (API_KEY = CMC_API_KEY) => {
  try {
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?CMC_PRO_API_KEY=${API_KEY}`
    const response = await fetch(url, headers)
    const json = await response.json()
    return json.data
  } catch (error) {
    throw new CoinMarketCapError(error.message)
  }
}
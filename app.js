import { EmptyAppElementError } from '/errors.js'
import { displayErrorMessage, displaySuccessMessage } from './scripts/ui.js'
import { loadCMCApiData, renderCMCApiData } from './scripts/codeMarketCap.js'
import { registerServiceWorker } from './scripts/serviceWorker.js'

var app = null

const getAppElement = () => {
  app = document.querySelector('#app')
  if (!app) throw new EmptyAppElementError
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

registerServiceWorker()
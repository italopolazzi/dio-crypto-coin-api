
export const displayMessage = (message, {
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
    toasts.removeChild(toast)
    clearTimeout(t)
  }, timeout);

}

export const displayErrorMessage = (message) => {
  displayMessage(message, { type: 'error' })
}

export const displaySuccessMessage = (message) => {
  displayMessage(message, { type: 'success' })
}
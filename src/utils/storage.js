const storage = window.sessionStorage

export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  storage.setItem(key, value)
}

export const getItem = (key) => {
  const data = storage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (e) {
    return data
  }
}

export const removeItem = (key) => {
  storage.removeItem(key)
}

export const clear = () => {
  storage.clear()
}

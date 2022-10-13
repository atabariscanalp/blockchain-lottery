export const setCache = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const getCache = (key: string) => {
  return localStorage.getItem(key)
}

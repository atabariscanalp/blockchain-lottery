import axios from 'axios'
import { GamesCountRes, GamesRes, RoomsRes, TokensWonRes } from './response-types'

const url = () => {
  const url = 'http://localhost:8080'

  return url
}

export const apiClient = axios.create({
  baseURL: url(),
  timeout: 1000 * 30
})

const User = {
  getGameCount: async (data: { userId: string }) => await apiClient
    .get(`/games/get-count/${data.userId}`)
    .then(res => res.data as GamesCountRes),
  getWonTokens: async (data: { userId: string }) => await apiClient
    .get(`/games/get-won-tokens/${data.userId}`)
    .then(res => res.data as TokensWonRes),
  getLostTokens: async (data: { userId: string }) => await apiClient
    .get(`/games/get-lost-tokens/${data.userId}`)
    .then(res => res.data as TokensWonRes),
  getGames: async (data: { userId: string, timestamp: string }) => await apiClient
    .get(`/games/get/${data.userId}/${data.timestamp}`)
    .then(res => {
      if (data.timestamp === 'now') {
        return res.data.length ? res.data[0] as GamesRes : []
      }
      return res.data as GamesRes
    }),
  getRooms: async () => await apiClient
    .get('/rooms/get')
    .then(res => res.data as RoomsRes)
}

const sdk = {
  User
}

export default sdk

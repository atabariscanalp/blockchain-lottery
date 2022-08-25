import axios from "axios";
import { GamesCountRes, GamesRes, TokensWonRes } from "./response-types";

const url = () => {
  const url = "http://localhost:8080"

  return url
}

export const apiClient = axios.create({
  baseURL: url(),
  timeout: 1000 * 30,
})

const User = {
  getGameCount: (data: { userId: string }) => apiClient
    .get(`/games/get-count/${data.userId}`)
    .then(res => res.data as GamesCountRes),
  getWonTokens: (data: { userId: string }) => apiClient
    .get(`/games/get-won-tokens/${data.userId}`)
    .then(res => res.data as TokensWonRes),
  getLostTokens: (data: { userId: string }) => apiClient
    .get(`/games/get-lost-tokens/${data.userId}`)
    .then(res => res.data as TokensWonRes),
  getGames: (data: { userId: string, timestamp: string }) => apiClient
    .get(`/games/get/${data.userId}/${data.timestamp}`)
    .then(res => {
      if (data.timestamp === "now") {
        return res.data.length ? res.data[0] as GamesRes : []
      }
      return res.data as GamesRes
    })
}

const sdk = {
  User,
}

export default sdk


export type GamesCountRes = {
  loseCount: number
  winCount: number
}

export type TokensWonRes = {
  [key: string]: number
} | null

export type Game = {
  id: string
  user1: string
  user2: string
  betAmount: number
  timestamp: string
  result: number
  tokenType: string
}

export type GamesRes = Game[]

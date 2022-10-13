import { Room, Game } from '../types/api'

export interface GamesCountRes {
  loseCount: number
  winCount: number
}

export type TokensWonRes = {
  [key: string]: number
} | null

export type GamesRes = Game[]

export interface RoomsRes {
  updatedAt: Date
  data: Record<string, Room>
}

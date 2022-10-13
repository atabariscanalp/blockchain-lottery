export enum Tokens {
  MATIC = 'MATIC'
}

export enum RoomStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled'
}

export interface Room {
  id: string // TODO
  user1: string
  user2: string
  betAmount: number
  timestamp: Date
  result: number
  tokenType: Tokens
  status: RoomStatus
  user1HasDeposited: boolean
  user2HasDeposited: boolean
}

export interface Game {
  id: string
  user1: string
  user2: string
  betAmount: number
  timestamp: string
  result: number
  tokenType: string
}

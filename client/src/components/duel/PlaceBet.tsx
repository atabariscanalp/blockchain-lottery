import React, { useState } from 'react'
import { Button } from '../Button'
import { useWeb3React } from '@web3-react/core'
import { BetInput } from './place-bet/Bet.Input'
import { RoomStatus, Tokens } from '../../types/api'
import { v4 } from 'uuid'
import config from '../../utils/config'
import { useWebSocket } from '../../hooks/useWebSocket'

interface Props {
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
}

export const PlaceBet: React.FC<Props> = ({ amount, setAmount }) => {
  const { account } = useWeb3React()
  const amountInt = Number(amount || 0)

  const [waiting, setWaiting] = useState(false)

  const ws = useWebSocket(`ws://${config.API_HOST}/rooms/create`, {})

  const onBet = () => {
    const data = JSON.stringify({
      id: v4(),
      user1: account,
      timestamp: new Date(),
      betAmount: amountInt,
      tokenType: Tokens.MATIC,
      status: RoomStatus.ACTIVE
    })
    ws?.send(data)
    setWaiting(true)
  }

  const onCancel = () => {
    setWaiting(false)
    ws?.send('cancel')
    // TODO:
  }

  return (
    <div className="px-9 py-9 flex flex-col w-full h-full">
      <div className="w-full h-full flex flex-col items-center justify-between">
        {waiting
          ? (
          <>
            <div>
              <p className="font-semibold text-honeydew text-lg">Waiting for a challenger</p>
            </div>
            <Button
              classNameOverride="w-4/6 self-center"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </>
            )
          : (
          <>
            <BetInput
              amount={amount}
              setAmount={setAmount}
              amountInt={amountInt}
            />
            <Button
              classNameOverride="w-4/6 self-center"
              disabled={!account}
              onClick={onBet}
            >
              Place Bet
            </Button>
          </>
            )}
      </div>
    </div>
  )
}

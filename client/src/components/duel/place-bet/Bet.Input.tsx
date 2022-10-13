import React, { useState } from 'react'
import { MaticIcon } from '../../../icons/Icons.svg'
import { useWebSocket } from '../../../hooks/useWebSocket'
import config from '../../../utils/config'

interface Props {
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
  amountInt: number
}

export const BetInput: React.FC<Props> = ({ amount, setAmount, amountInt }) => {
  const [maticToUsdt, setMaticToUsdt] = useState(0)
  const onMessage = (e: MessageEvent) => {
    const json = JSON.parse(e.data) as {price: string, symbol: string}

    const conversionRate = Number(json.price)
    setMaticToUsdt(conversionRate)
  }

  useWebSocket(`ws://${config.API_HOST}/crypto/get-conversion`, { onMessage })

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-row justify-between items-center w-full mb-4">
            <span className="text-honeydew text-lg font-semibold">
              Bet amount
            </span>
        <span className="text-white opacity-20 text-lg font-semibold">
              ${(amountInt * maticToUsdt).toFixed(2)}
            </span>
      </div>
      <form className="bg-grey-fade rounded-lg flex flex-row items-center py-4 px-4 mb-4 w-full">
        <MaticIcon width={40} height={40} style={{ marginRight: 16 }} />
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          type={'text'}
          style={{ background: 'none' }}
          className="h-full w-full outline-none font-medium text-xl text-honeydew"
        />
      </form>
      <div className="w-full flex justify-between">
        <button
          className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
          onClick={() => setAmount((amountInt / 10).toString())}
        >
          1/10
        </button>
        <button
          className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
          onClick={() => setAmount((amountInt / 2).toString())}
        >
          1/2
        </button>
        <button
          className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
          onClick={() => setAmount((amountInt * 2).toString())}
        >
          2x
        </button>
        <button
          className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
          onClick={() => setAmount((amountInt * 5).toString())}
        >
          5x
        </button>
        <button
          className="w-1/6 bg-grey-fade rounded-lg flex items-center justify-center h-12 font-semibold text-honeydew"
          onClick={() => setAmount((amountInt * 10).toString())}
        >
          10x
        </button>
      </div>
    </div>
  )
}

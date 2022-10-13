import React, { useState } from 'react'
import { MemoizedFindGames as FindGames } from './FindGames'
import { PlaceBet } from './PlaceBet'

interface Props {
  index: 0 | 1
}

export const DuelComponent: React.FC<Props> = ({ index }) => {
  const [amount, setAmount] = useState<string>('')

  const innerView = {
    0: <PlaceBet amount={amount} setAmount={setAmount} />,
    1: <FindGames />
  }

  return (
    <div className="bg-blue-fade grow overflow-y-scroll flex rounded-lg">
      {innerView[index]}
    </div>
  )
}

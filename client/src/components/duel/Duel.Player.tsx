import React, { memo } from 'react'
import { MemoizedLocked as Locked } from '../Locked'

const DuelPlayer = () => {
  return (
    <Locked
      className={'w-62 h-full rounded-lg self-end flex items-center justify-center'}
      message="You need to connect your wallet to play"
    >
    </Locked>
  )
}

export const MemoizedDuelPlayer = memo(DuelPlayer)

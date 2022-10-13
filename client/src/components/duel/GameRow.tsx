import React from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Room } from '../../types/api'
import { walletAddressParser } from '../../utils/web3/web3.util'
import { MaticIcon } from '../../icons/Icons.svg'
import { Button } from '../Button'

interface Props {
  room: Room
  account: string | undefined
}

const GameRow: React.FC<Props> = ({ room, account }) => {
  return (
        <div className="flex flex-row items-center w-full mt-4 px-3" key={room.id}>
          <div className="w-1/3 flex items-center">
            <Jazzicon
              diameter={16}
              seed={jsNumberForAddress(room.user1)}
              paperStyles={{ marginRight: 10 }}
            />
            <span className="text-honeydew font-semibold text-opacity-70">
              {walletAddressParser(room.user1)}
            </span>
          </div>
          <div className="w-1/3 flex items-center justify-start pl-10">
            <MaticIcon width={24} height={24} className="mr-2" />
            <span className="text-honeydew text-opacity-70 font-semibold">
              {room.betAmount}
            </span>
          </div>
          <div className="w-1/3 flex items-center justify-center">
            <Button color={'outline'} size={'small'} disabled={!account}>
              Challenge
            </Button>
          </div>
        </div>
  )
}

export const MemoizedGameRow = React.memo(GameRow)

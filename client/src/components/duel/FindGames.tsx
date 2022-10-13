import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../Button'
import { useWeb3React } from '@web3-react/core'
import { useWebSocket } from '../../hooks/useWebSocket'
import config from '../../utils/config'
import { sdk } from '../../api'
import moment from 'moment-mini'
import { MemoizedGameRow as GameRow } from './GameRow'
import { RoomsRes } from '../../api/response-types'

const FindGames = () => {
  const { account } = useWeb3React()
  const [data, setData] = useState<RoomsRes>()
  const [updatedAt, setUpdatedAt] = useState<Date>()

  const [showRefresh, setShowRefresh] = useState(false)

  useEffect(() => {
    sdk.User.getRooms().then(r => setData(r))
  }, [])

  useEffect(() => {
    if (data) {
      const date = new Date(data.updatedAt)
      setUpdatedAt(date)
    }
  }, [data])

  const onMessage = useCallback((e: MessageEvent) => {
    const date = e.data.slice(1, -1)

    const serverTime = moment(date)
    const localTime = moment(updatedAt)

    console.log('sv time', serverTime.toISOString())
    console.log('lc time', localTime.toISOString())

    if (serverTime > localTime) {
      setShowRefresh(true)
    }
  }, [updatedAt])

  useWebSocket(`ws://${config.API_HOST}/rooms/get-updated`, {
    onMessage
  })

  const onRefresh = async () => {
    const data = await sdk.User.getRooms()
    setData(data)
    setShowRefresh(false)
  }

  return (
    <div className="w-full h-full flex flex-col pt-9">
      {showRefresh && (
        <Button
          color={'secondary'}
          size={'medium'}
          classNameOverride='w-24 self-center absolute font-medium drop-shadow-xl'
          onClick={onRefresh}
        >
          Refresh
        </Button>
      )}
      <div className="w-full flex flex-row items-center">
        <div className="w-1/3 flex items-center justify-center">
          <span className="text-white text-opacity-20 font-semibold text-lg">
            Rival
          </span>
        </div>
        <div className="w-1/3 items-center flex justify-end">
          <span className="text-white text-opacity-20 font-semibold text-lg self-end">
            Bet Amount
          </span>
        </div>
        <div className="w-1/3"></div>
      </div>
      {data?.data && Object.entries(data.data).map(([_, room]) => (
        <GameRow room={room} key={room.id} account={account} />
      ))}
    </div>
  )
}

export const MemoizedFindGames = React.memo(FindGames)

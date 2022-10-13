import React, { useState } from 'react'
import { useWebSocket } from '../../hooks/useWebSocket'
import config from '../../utils/config'

export const OnlineUserComponent = () => {
  const onOpen = () => {
    ws?.send('get')
  }
  const onMessage = (e: MessageEvent) => {
    setUserCount(Number(e.data))
  }

  const [userCount, setUserCount] = useState(0)
  const ws = useWebSocket(`ws://${config.API_HOST}/users/get-active`, {
    onOpen,
    onMessage
  })

  return (
    <p className="text-white text-opacity-60 font-semibold mt-4">
      🟢 {userCount} <span className="text-white text-opacity-20">Online</span>
    </p>
  )
}

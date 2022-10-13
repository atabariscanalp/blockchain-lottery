import { useEffect, useRef } from 'react'

interface Props {
  onOpen?: (e: Event) => any
  onMessage?: (e: MessageEvent) => any
}

export const useWebSocket = (url: string, { onOpen, onMessage }: Props) => {
  const wsRef = useRef<WebSocket>()

  const defaultOnOpen = () => {
    console.log('connected to ws successfully')
  }

  useEffect(() => {
    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = onOpen ?? defaultOnOpen
    ws.onmessage = onMessage ?? null

    return () => ws.close()
  }, [])

  useEffect(() => {
    if (onMessage && wsRef?.current) {
      wsRef.current.onmessage = onMessage
    }
  }, [onMessage])

  return wsRef.current
}

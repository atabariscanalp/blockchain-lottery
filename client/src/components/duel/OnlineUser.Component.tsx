import React, { useEffect, useState } from "react";

export const OnlineUserComponent = () => {

  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/users/get-active")
    ws.onopen = () => {
      console.log("connected to websocket successfully")
      ws.send("get")
    }
    ws.onmessage = (e) => {
      console.log("msg get", e.data)
      setUserCount(Number(e.data))
    }

    return () => ws.close()
  }, [])

  return (
    <p className="text-white text-opacity-60 font-semibold mt-4">
      🟢 {userCount} <span className="text-white text-opacity-20">Online</span>
    </p>
  );
};

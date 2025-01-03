'use client'
import { useEffect } from "react"
import {io} from "socket.io-client"

export default function Chat() {
  // const socket = io("http://localhost:5000")
  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("czat odpalony");
  //     socket.emit("hejka")
      
  //   })
  //   return () => {
  //     socket.disconnect()
  //   }
  // })
  return <div id="chat" className="right-dropdown">
    <h2>Czaty</h2>
    <input placeholder="Szukaj"/>
  </div>
}
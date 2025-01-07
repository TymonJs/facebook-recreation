'use client'
import { useEffect,useRef } from "react"
import {io} from "socket.io-client"

export default function Chat({loggedLogin}) {
  const input = useRef()
  const socket = io("http://localhost:5000")
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("start")
    })
    socket.on("response", (msg) => {
      console.log(msg);
      
    })
  },[])

  const sendEvent = () => {
    
    socket.emit("myevent",input.current.value)
  }

  return <div id="chat" className="right-dropdown">
    <h2>Czaty</h2>
    <input ref={input} placeholder="Szukaj"/>
    <button onClick={sendEvent}>Temp</button>
  </div>
}
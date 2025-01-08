'use client'
import { useEffect,useRef, useState } from "react"
import {io} from "socket.io-client"
import { getResponse,pfpOrDefault } from "@/public/consts"
import ChatSearch from "./ChatSearch"
import { useParams } from "next/navigation"

export default function Chat({loggedLogin,chatSearch}) {
  // const socket = io("http://localhost:5000")
  const [chats,setChats] = useState(null)
  
  useEffect(() => {
    const search = chatSearch?`?to=${chatSearch}`:""
    fetch(`${window.location.origin}/api/chat/${loggedLogin}${search}`,{method:"GET"}).then(res => {
      getResponse(res).then(r => {
        if (!r || r?.length===0) return () => {}
        const toStore = []
        Promise.all(r.chats.map((c,i) => {
          const friendLogin = c.users.find(e => e!==loggedLogin)
          return new Promise((res) => {
            fetch(`${window.location.origin}/api/users?login=${friendLogin}`).then(res2 => {
              getResponse(res2).then(r2 => {
                const {name,lastname, pfp=null} = r2.users[0]    
                const image =  pfpOrDefault(pfp)           
                toStore.push({name,lastname,image,login:friendLogin})
                res(<div key={i} className="chat">
                  <img className="pfp-mini" src={image}></img>
                  {`${name} ${lastname}`}
              </div>)
              })
              
            })    
          })
        }))
        .then(d => {
          // localStorage.setItem("chat",JSON.stringify({chat: toStore}))  
          setChats(d)
        })
        
        
      })
    })
  },[chatSearch])


  // useEffect(() => {
  //   socket.on("connect", () => {
  //     socket.emit("start")
  //   })
  //   socket.on("response", (msg) => {
  //     console.log(msg);
      
  //   })
  // },[])

  const sendEvent = () => {
    
    // socket.emit("myevent",input.current.value)
  }

  return <>
    <h2>Czaty</h2>
    <ChatSearch chatSearch={chatSearch} loggedLogin={loggedLogin}></ChatSearch>
    <div id="chat-dropdown">
      {chats}
    </div>
    {/* <button onClick={sendEvent}>Temp</button> */}
  </>
}
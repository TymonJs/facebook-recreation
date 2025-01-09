'use client'
import { useEffect,useRef, useState } from "react"
import {io} from "socket.io-client"
import { getResponse,pfpOrDefault } from "@/public/consts"
import ChatSearch from "./ChatSearch"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function Chat({loggedLogin,chatSearch,active,messenger,chattingWith}) {
  // const socket = io("http://localhost:5000")
  const [chats,setChats] = useState(null)
  
  const openMessenger = (data) => {
    if (!messenger.current.classList.contains("active")) messenger.current.classList.add("active")
    chattingWith.current = data
  }

  useEffect(() => {
    const search = chatSearch?`?to=${chatSearch}`:""

    fetch(`${window.location.origin}/api/chat/${loggedLogin}${search}`,{method:"GET"}).then(res => {
      getResponse(res).then(r => {
        
        if (!r || r.chats?.length===0 ){
          return () => {}
        }
        Promise.all(r.chats.map((c,i) => {

          const friendLogin = c.users.find(e => e!==loggedLogin)

          return new Promise((res) => {
            fetch(`${window.location.origin}/api/users?login=${friendLogin}`).then(res2 => {
              getResponse(res2).then(r2 => {

                const {name,lastname, pfp=null} = r2.users[0]    
                const image =  pfpOrDefault(pfp)           
                const message = c.messages[0]
                const text = message
                  ?`${message.by==loggedLogin?"Ty":`${friendLogin}`}: ${message.text}`
                  :"Powiedz coś od siebie"
                res(<div key={i} className="chat" onClick={() => openMessenger({name,lastname,image,login: friendLogin})}>
                  <img className="pfp-mini" src={image}></img>
                  <div className="text">
                    <h3>{`${friendLogin}`}</h3>
                    <p>{text}</p>
                  </div>
                </div>)
              })
              
            })    
          })
        }))
        .then(d => {
          setChats(d)
        })
        
        
      })
    })
  },[chatSearch,active])


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
'use client'
import { useEffect,useRef, useState } from "react"
import { getResponse,pfpOrDefault } from "@/public/consts"
import ChatSearch from "./ChatSearch"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function Chat({loggedLogin,chatSearch,active,messenger,setChattingWith}) {
  const [chats,setChats] = useState(null)
  
  const openMessenger = (data) => {
    if (!messenger.current.classList.contains("active")) messenger.current.classList.add("active")
      setChattingWith(data)
  }

  useEffect(() => {
    const search = chatSearch?`?to=${chatSearch}`:""
    fetch(`${window.location.origin}/api/chat-friends/${loggedLogin}${search}`).then(res => {
      getResponse(res).then(r => {
        if (!r || r.chats?.length===0) return () => {}
        const out = r.chats.map((c,i) => {
          const {name,lastname, pfp=null,login} = c.user
          const image =  pfpOrDefault(pfp)           
          const message = c.chat.messages[0]
          const text = message
            ?`${message.by==loggedLogin?"Ty":`${login}`}: ${message.text}`
            :"Powiedz coś od siebie"
          return <div key={i} className="chat" onClick={() => openMessenger({user: {name,lastname,image,login},messages: c.chat.messages})}>
            <img className="pfp-mini" src={image}></img>
            <div className="text">
              <h3>{`${login}`}</h3>
              <p>{text}</p>
            </div>
          </div>

        })
        setChats(out)
      })
    })



    // fetch(`${window.location.origin}/api/chat/${loggedLogin}${search}`,{method:"GET"}).then(res => {
    //   getResponse(res).then(r => {
        
    //     if (!r || r.chats?.length===0 ){
    //       return () => {}
    //     }
    //     Promise.all(r.chats.map((c,i) => {

    //       const friendLogin = c.users.find(e => e!==loggedLogin)

    //       return new Promise((res) => {
    //         fetch(`${window.location.origin}/api/user?login=${friendLogin}`).then(res2 => {
    //           getResponse(res2).then(r2 => {
    //             const {name,lastname, pfp=null} = r2.users[0]    
    //             const image =  pfpOrDefault(pfp)           
    //             const message = c.messages[0]
    //             const text = message
    //               ?`${message.by==loggedLogin?"Ty":`${friendLogin}`}: ${message.text}`
    //               :"Powiedz coś od siebie"
    //             res(<div key={i} className="chat" onClick={() => openMessenger({name,lastname,image,login: friendLogin})}>
    //               <img className="pfp-mini" src={image}></img>
    //               <div className="text">
    //                 <h3>{`${friendLogin}`}</h3>
    //                 <p>{text}</p>
    //               </div>
    //             </div>)
    //           })
              
    //         })    
    //       })
    //     }))
    //     .then(d => {
    //       setChats(d.reverse())
    //     })
        
        
    //   })
    // })
  },[chatSearch,active])


  return <>
    <h2>Czaty</h2>
    <ChatSearch chatSearch={chatSearch} loggedLogin={loggedLogin}></ChatSearch>
    <div id="chat-dropdown">
      {chats}
    </div>
  </>
}
'use client'
import { useState } from "react"
import Chat from "./Chat"
import Settings from "./Settings"

export default function Right({loggedId,pfp, name}){
    const [chat, setChat] = useState()
    const [settings, setSettings] = useState()

    const toggleChat = (e) => {
        if (chat) setChat()
        
            else {
                setChat(<Chat/>)
                setSettings()
            }
        
        e.target.classList.toggle("active")
        if (!pfp) document.querySelector("i.fa-user").classList.remove("active")
    }

    const toggleSettings = (e) => {

        if (settings) setSettings()
        
        else {
            setSettings(<Settings id={loggedId} name={name} pfp={pfp}/>)
            setChat()
        }
        
        
        e.target.classList.toggle("active")
        document.querySelector("i.fa-facebook-messenger").classList.remove("active")
    }
    
    const image = pfp?
        <img src={`pfps/${loggedId}.png`} alt='pfp' onClick={toggleSettings}></img>:
        <i className="fa-solid fa-user" onClick={toggleSettings}></i>
    
    
    return <>
    <div id="right">
        <i className="fa-solid fa-bars"></i>
        <i className="fa-brands fa-facebook-messenger" onClick={toggleChat}></i>
        <i className="fa-solid fa-bell"></i>
        {image}

        {chat}
        {settings}
    </div>
    </>
}
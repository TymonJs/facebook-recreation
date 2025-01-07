'use client'
import { useEffect, useMemo, useState } from "react"
import Chat from "./Chat"
import Settings from "./Settings"
import { getResponse, pfpOrDefault } from "@/public/consts"

export default function Right({loggedLogin}){
    const [chat, setChat] = useState()
    const [settings, setSettings] = useState()
    const [name,setName] = useState(null)
    const [pfp, setPfp] = useState(`/pfps/${loggedLogin}.png`)

    useEffect(() => {
        const fn = localStorage.getItem("fullname")
        if (fn) setName(fn)
        const p = localStorage.getItem("pfp")
        if (p) setPfp(p)
    },[])

    useEffect(() => {
        if (!localStorage.getItem("pfp") || !localStorage.getItem("fullname")) fetch(`http://localhost:3000/api/users?login=${loggedLogin}`,{method:"GET"})
        .then(res => {
            if (res.ok){
                getResponse(res)
                .then(r => {
                    const {name, lastname, pfp =""} = r.users[0]
                    const n = `${name} ${lastname}`
                    setName(n)
                    localStorage.setItem("fullname",n)
                    const p = pfpOrDefault(pfp)
                    setPfp(p)
                    localStorage.setItem("pfp",p)
                })
            }
        })
    },[loggedLogin])
    

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
            setSettings(<Settings login={loggedLogin} name={name} pfp={pfp}/>)
            setChat()
        }
        
        
        e.target.classList.toggle("active")
        document.querySelector("i.fa-facebook-messenger").classList.remove("active")
    }
    
    const image = pfp?<img src={pfp} alt='pfp' onClick={toggleSettings}></img>:null
        // <i className="fa-solid fa-user" onClick={toggleSettings}></i>
    
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
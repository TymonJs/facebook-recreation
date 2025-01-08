'use client'
import { useEffect, useMemo, useState, useRef} from "react"
import Chat from "./Chat"
import Settings from "./Settings"
import { getResponse, pfpOrDefault } from "@/public/consts"

export default function Right({loggedLogin,chatSearch}){
    const [name,setName] = useState(null)
    const [pfp, setPfp] = useState(`/pfps/${loggedLogin}.png`)
    const [active,setActive] = useState(chatSearch?"chat":null)
    
    const closeActive = (e) => {
        if (active && !document.getElementById("right").contains(e.target)) setActive("")
    }

    useEffect(() => {
        const fn = localStorage.getItem("fullname")
        if (fn) setName(fn)
        const p = localStorage.getItem("pfp")
        if (p) setPfp(p)

        fetch(`http://localhost:3000/api/users?login=${loggedLogin}`,{method:"GET"})
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
        
    },[])

    useEffect(() => {
        if (active) {
          document.addEventListener("mousedown",closeActive);
        } else {
          document.removeEventListener("mousedown", closeActive);
        }
        return () => {
          document.removeEventListener("mousedown", closeActive);
        };
    },[active]);
    

    const toggleChat = (e) => {
        
        if (active=="chat"){
            setActive("")
        }
        else setActive("chat")

        e.target.classList.toggle("active")
    }

    const toggleSettings = (e) => {
        if (active=="settings") setActive("")
        else setActive("settings")
    }
    
    const image = <img src={pfp} alt='pfp' onClick={toggleSettings}></img>
    
    return <>
    <div id="right">
        <i className="fa-solid fa-bars"></i>
        <i className={`fa-brands fa-facebook-messenger${active=="chat"?" active":""}`} onClick={toggleChat}></i>
        <i className="fa-solid fa-bell"></i>
        {image}
        <div id="chat" className={`right-dropdown${active=="chat"?" active":""}`}>
            <Chat loggedLogin={loggedLogin} chatSearch={chatSearch}/>
        </div>
        <div className={`right-dropdown${active=="settings"?" active":""}`} id="settings">
            <Settings login={loggedLogin} name={name} pfp={pfp}/>
        </div>
    </div>
    </>
}
'use client'
import { useState } from "react"
import Chat from "./Chat"
export default function Right(){
    const [chat, setChat] = useState()

    const handleClick = (e) => {
        chat?setChat():setChat(<Chat/>)
        e.target.classList.toggle("active")
    }
    return <>
    <div id="right">
        <i className="fa-solid fa-bars"></i>
        <i className="fa-brands fa-facebook-messenger" onClick={handleClick}></i>
        <i className="fa-solid fa-bell"></i>
        <i className="fa-solid fa-user"></i>
        {chat}
    </div>
    </>
}
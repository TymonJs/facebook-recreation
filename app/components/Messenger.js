'use client'
import { useEffect, useState } from "react"
import { getResponse } from "@/public/consts"
import { pfpOrDefault } from "@/public/consts"
import Link from "next/link"

export default function Messenger({friendLogin = "kangur",loggedLogin = "asd",selfRef}){
    
    const [friend,setFriend] = useState(null)
    
    useEffect(() => {
        fetch(`/api/users/${friendLogin.current}`,{method:"GET"}).then(r =>{
            new Response(r.body).json().then(u => {
                setFriend(u.user)
            })
        })
    },[friendLogin.current])

    if (!friend) return <div id="messenger"></div>
    
    const closeMessenger = () => {
        selfRef.current.classList.remove("active")
    }

    return <>
        <div className="head">
            <div className="data">
                <Link href={`/${friendLogin.current}`}><img src={pfpOrDefault(friend.pfp)}></img></Link>
                <div className="text">
                    <h3>{`${friend.name} ${friend.lastname}`}</h3>
                    <p>{friend.login}</p>
                </div>
            </div>
            <i className="fa-solid fa-x" onClick={closeMessenger}></i>
        </div>
        <div className="body">
            <p className="message me">dół</p>
            <p className="message me">msg1</p>
            <p className="message you">msg1</p>
            <p className="message me">msg1</p>
            <p className="message you">msg1</p>
            <p className="message me">msg1</p>
            <p className="message me">msg1</p>
            <p className="message you">msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1</p>
            <p className="message me">msg1</p>
            <p className="message you">góra</p>
            
        </div>
        <div className="send">
            <input placeholder="Aa"></input>
            <i className="fa-solid fa-paper-plane"></i>
        </div>
    </>
}
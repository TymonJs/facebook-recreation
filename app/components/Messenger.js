'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRef } from "react"
import {io} from "socket.io-client"

export default function Messenger({friend = "",loggedLogin = "",selfRef}){
    const socket = useRef()
    const body = useRef()
    const [messages,setMessages] = useState()
    const input = useRef()
    const {name = "",lastname = "",image = "",login = ""} = friend.user?friend.user:friend
    const [data,setData] = useState()

    const messagesToDivs = (messages) => {
        let prev;
        return messages.map((el,i) => {
            const by = el.by==login?"you":"me"
            if (prev && prev!==by){
                prev=by
                return <div className={`message ${by} spaced`} key={i}>{el.text}</div>
            }
            prev=by
            return <div className={`message ${by}`} key={i}>{el.text}</div>
        })
    }

    useEffect(() => {
        if (login){
            setMessages(<p className="loading">Loading...</p>)
            if (friend.messages){
                setMessages(messagesToDivs(friend.messages))
            }
            if (!selfRef.current.classList.contains("active")) selfRef.current.classList.add("active")
            fetch(`${window.location.origin}/api/message/${login}/${loggedLogin}`).then(r => {
            if (r.ok){
                new Response(r.body).json().then(res => {
                    
                    setMessages(messagesToDivs(res.messages))
                })

            }
            })
        }
    },[login])

    useEffect(() => {        
        if (!socket.current){     
            socket.current = io("http://localhost:5000")
            // console.log('socket connect');
        }

        socket.current.on("message",obj => {
            setData(obj) 
        })


        return () => {
            console.log("socket disconnect");
            socket.current.disconnect()
            socket.current = ""
        }
    },[])

    useEffect(() => {
        if (!data) return
        const {from,to,text} = data
        const by = from==loggedLogin?"me":"you"
        
        if (!messages || messages.length===0) {
            
            setMessages([<div className={`message ${by}`} key={0}>{text}</div>])
        }
        else{
            const i = messages.length-1
            const spaced =messages[i].props.className.includes("me")
                    ?""
                    :" spaced"
            
            const message = <div className={`message ${by}${spaced}`} key={i+1}>{text}</div>
            setMessages([message,...messages])
        }
    },[data])

    useEffect(() => {
        if (socket.current && login){
            socket.current.emit("connected",[loggedLogin,login])
        }
    },[login])

    if (!login) return <div id="messenger"></div>

    const closeMessenger = () => {
        selfRef.current.classList.remove("active")
    }

    const sendMessage = (input) => {
        const text = input.current.value
        if (!text) return
        socket.current.emit("message",({from: loggedLogin,to: login,text}))
        fetch(`http://localhost:3000/api/message/${loggedLogin}/${login}`,{
            method: "POST",
            body: JSON.stringify({
                by: loggedLogin,
                text: text
            })
        })
        input.current.value=""

    }

    const handleKeyPress = (e) => {
        if (e.key==="Enter") sendMessage(input)
    }

    const handleFocus = () => input.current.addEventListener('keypress',(e) => handleKeyPress(e))

    const handleBlur = () => input.current.addEventListener('keypress',(e) => handleKeyPress(e))
    


    return <>
        <div className="head">
            <div className="data">
                <Link href={`/${login}`}><img src={image}></img></Link>
                <div className="text">
                    <h3>{`${name} ${lastname}`}</h3>
                    <p>{login}</p>
                </div>
            </div>
            <i className="fa-solid fa-x" onClick={closeMessenger}></i>
        </div>
        <div className="body" ref={body}>      
            {messages}
        </div>
        <div className="send">
            <input ref={input} placeholder="Aa"onFocus={handleFocus} onBlur={handleBlur}></input>
            <i className="fa-solid fa-paper-plane"onClick={() => sendMessage(input)}></i>
        </div>
    </>
}
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
    const [r,sr] = useState(false)
    const {name = "",lastname = "",image = "",login = ""} = friend.user?friend.user:friend

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
            setMessages()
            if (friend.messages){
                setMessages(messagesToDivs(friend.messages))
            }
            if (!selfRef.current.classList.contains("active")) selfRef.current.classList.add("active")
            console.log(`${window.location.origin}/api/message/${login}/${loggedLogin}`);
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
            console.log('socket connect');
        }

        return () => {
            console.log("socket disconnect");
            socket.current.disconnect()
            socket.current = ""
        }
    },[])

    useEffect(() => {
        if (socket.current && login){
            socket.current.emit("connected",[loggedLogin,login])
        }
    },[login])

    useEffect(() => {
        if (!socket.current) return
        socket.current.on("message",obj => {
            
            const {from,to,text} = obj
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

            
        }) 
    })


    if (!login) return <div id="messenger"></div>

    const closeMessenger = () => {
        selfRef.current.classListNaNpxove("active")
    }
    //to fix
    const sendMessage = (input) => {
        const text = input.current.value
        if (!text) return
        // fetch(`/api/message/${loggedLogin}/${login}`,{
        //     method: "POST",
        //     body: JSON.stringify({
        //         by: loggedLogin,
        //         text: input.current.value
        //     })
        // })
        // sr(!r)
        socket.current.emit("message",({from: loggedLogin,to: login,text}))
        input.current.value=""

    }


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
            <input ref={input} placeholder="Aa"></input>
            <i className="fa-solid fa-paper-plane" onClick={() => sendMessage(input)}></i>
        </div>
    </>
}
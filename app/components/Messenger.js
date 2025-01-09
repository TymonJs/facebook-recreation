'use client'
import { useEffect, useState } from "react"
import { getResponse } from "@/public/consts"
import { pfpOrDefault } from "@/public/consts"
import Link from "next/link"
import { useRef } from "react"
import { Suspense } from 'react';

export default function Messenger({friend = "",loggedLogin = "",selfRef}){

    const body = useRef()
    const [messages,setMessages] = useState()
    const input = useRef()

    const {name = "",lastname = "",image = "",login = ""} = friend?.current

    useEffect(() => {
        if (login){
            setMessages()
            if (!selfRef.current.classList.contains("active")) selfRef.current.classList.add("active")

            fetch(`/api/message/${login}/${loggedLogin}`).then(r => {
            if (r.ok){
                new Response(r.body).json().then(res => {
                    let prev;
                    const msgs = res.messages.map((el,i) => {
                        const by = el.by==login?"you":"me"
                        if (prev && prev!==by){
                            prev=by
                            return <div className={`message ${by} spaced`} key={i}>{el.text}</div>
                        }
                        prev=by
                        return <div className={`message ${by}`} key={i}>{el.text}</div>
                    })
                    setMessages(msgs)
                })

            }
            })
        }
    },[login])

    if (!login) return <div id="messenger"></div>

    const closeMessenger = () => {
        selfRef.current.classList.remove("active")
    }
    const sendMessage = (input) => {
        const text = input.current.value
        // if (!text) return
        // fetch(`/api/message/${loggedLogin}/${login}`,{
        //     method: "POST",
        //     body: JSON.stringify({
        //         by: loggedLogin,
        //         text
        //     })
        // })
        input.current.value=""

        
        const i = messages.length-1
        const spaced = i+1>0?
            messages[i].props.className.includes("me")
                ?""
                :" spaced"
            :""
        const message = <div className={`message me${spaced}`} key={i+1}>{text}</div>

        setMessages([message,...messages])


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
            
            {/* <div className="message me">dół</div>
            <div className="message me">msg1</div>
            <div className="message you">msg1</div>
            <div className="message me">msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1</div>
            <div className="message you">msg1</div>
            <div className="message me">msg1</div>
            <div className="message me">msg1</div>
            <div className="message you">msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1msg1</div>
            <div className="message you">msg1</div>
            <div className="message me">msg1</div>
            <div className="message you">góra</div> */}
            
        </div>
        <div className="send">
            <input ref={input} placeholder="Aa"></input>
            <i className="fa-solid fa-paper-plane" onClick={() => sendMessage(input)}></i>
        </div>
    </>
}
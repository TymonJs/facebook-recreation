'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRef } from "react"
import {io} from "socket.io-client"
import { getResponse } from "@/public/consts"

export default function Messenger({friend = "",loggedLogin = "",selfRef}){
    const socket = useRef()
    const [messages,setMessages] = useState()
    const input = useRef()
    const editMsgId = useRef()
    const {name = "",lastname = "",image = "",login = ""} = friend.user?friend.user:friend
    const [data,setData] = useState()
    const [deleteMessage,setDeleteMessage] = useState()
    const [cancelEditButton,setCancelEditButton] = useState()
    const [loading,setLoading] = useState()
    const [editText,setEditText] = useState()

    const cancelEdit = () => {
        input.current.value = ""
        setCancelEditButton()
    }
    const cancelIcon = <i className="fa-solid fa-ban" onClick={() => cancelEdit()}></i>


    const removeMsg = (i) => {
        fetch(`${window.location.origin}/api/message/${loggedLogin}/${login}`, {
            method: "DELETE",
            body: JSON.stringify({
                id:i
            })
        })
        .then(r => {
            if (r.ok){
                getResponse(r).then(res => {
                    socket.current.emit("deleteMessage",{loggedLogin,login,msgs:res.messages})
                })
            }
        })
        
    }

    const editMsg = (i) => {
        setCancelEditButton(cancelIcon)
        input.current.value = messages[i].text
        editMsgId.current = i
    }


    const messagesToDivs = (messages,key="") => {
        let prev;
        return messages.map((el,i) => {
            const by = el.by==login?"you":"me"
            const msg =<div className={`message ${by}`}>
                <p>{el.text}</p>
            </div> 
            
            const spaced = prev&&prev!==by?" spaced":""
            prev=by
            const icons = by==="me"
                ?<>
                    <div className="icons">
                        <i className="fa-solid fa-trash" onClick={() => removeMsg(key?key:i)}></i>
                        <i className="fa-solid fa-pen" onClick={() => editMsg(key?key:i)}></i>
                    </div>
                    
                 </>
                :null
            return <div className={`message-row ${by}${spaced}`} key={key?key:i}>
                {icons}
                {msg}
            </div>
        })
    }

    useEffect(() => {
        if (login){
            setLoading(<p className="loading">Loading...</p>)
            setMessages()
            if (friend.messages){
                setLoading()
                setMessages(friend.messages)
            }
            if (!selfRef.current.classList.contains("active")) selfRef.current.classList.add("active")
            fetch(`${window.location.origin}/api/message/${login}/${loggedLogin}`).then(r => {
            if (r.ok){
                new Response(r.body).json().then(res => {
                    setLoading()
                    setMessages(res.messages)
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
        socket.current.on("deleteMessage", msgs => {
            setDeleteMessage(msgs)
        })
        socket.current.on("editMessage", obj => {
            setEditText(obj)
        })
        return () => {
            console.log("socket disconnect");
            socket.current.disconnect()
            socket.current = ""
        }
    },[])

    useEffect(() => {
        if (!editText) return
        const {text,id} = editText
        const newMsgs = messages.reduce((acc,c,i) => {
            if (i==id) c.text=text
            return [...acc,c]
        },[])
        setMessages(newMsgs)
    },[editText])

    useEffect(() => {
        if (!deleteMessage) return
        setMessages(deleteMessage)
    },[deleteMessage])

    useEffect(() => {
        if (!data) return
        const {from,to,text} = data
        const by = from==loggedLogin?loggedLogin:login
        setMessages([{by,text},...messages])
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

    const sendMessage = () => {
        const text = input.current.value
        if (!text) return
        if (cancelEditButton){
            socket.current.emit("editMessage",({loggedLogin,login,text,id: editMsgId.current}))
            fetch(`http://localhost:3000/api/message/${loggedLogin}/${login}`,{
                method: "PATCH",
                body: JSON.stringify({
                    id: editMsgId.current,
                    text
                })
            })
        }
        else{
            socket.current.emit("message",({from: loggedLogin,to: login,text}))
            fetch(`http://localhost:3000/api/message/${loggedLogin}/${login}`,{
                method: "POST",
                body: JSON.stringify({
                    by: loggedLogin,
                    text: text
                })
            })
        }
        input.current.value=""
        setCancelEditButton()

    }

    // const handleKeyPress = (e) => {
    //     if (e.key==="Enter"){
    //         sendMessage(input)
    //     }
    // }

    // const handleFocus = () => input.current.addEventListener('keypress',(e) => handleKeyPress(e))

    // const handleBlur = () => input.current.addEventListener('keypress',(e) => handleKeyPress(e))
    

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
        <div className="body">      
            {loading}
            {messages?messagesToDivs(messages):null}
        </div>
        <div className="send">
            <input ref={input} placeholder="Aa"
            // onFocus={handleFocus} onBlur={handleBlur}
            ></input>
            {cancelEditButton}
            <i className="fa-solid fa-paper-plane"onClick={() => sendMessage(input)}></i>
            
        </div>
    </>
}
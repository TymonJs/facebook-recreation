'use client'
import Link from "next/link"
import { getResponse, pfpOrDefault } from "@/public/consts"
import { useRef, useState } from "react"
import Posts from "./Posts"

export default function PersonalPage({user,loggedLogin}){

    const [posts,setPosts] = useState(user?.posts)
    const input = useRef("")
    if (!user) return <p className="loading">Loading...</p>
    
    if (!user.posts && user.login!==loggedLogin) return <h2 className="text-center">Użytkownik jeszcze nie ma żadnych postów</h2>
    const image = pfpOrDefault(user.pfp)

    const sendPost = (ref) => {
        const text = ref.current.value
        if (text==="") return 
        ref.current.value=""
        fetch(`${window.location.origin}/api/posts/${user.login}`, {
            method: "POST",
            body: JSON.stringify({body:text})
        })
        .then(r => {
            if (r.ok){
                getResponse(r).then(res => {
                    setPosts(res.posts)

                })
            }
        })
        
    }
    
    return <>
        {user.login===loggedLogin
            ?<div className="send-post post">
                <Link href={`/${user.login}`}><img src={image}></img></Link>
                <textarea ref={input} placeholder="Co słychać?">
                </textarea>
                <i className="fa-solid fa-paper-plane" onClick={() => sendPost(input)}></i>
            </div>
            :null
        }
        <Posts user={user} loggedLogin={loggedLogin} posts={posts} setPosts={setPosts}></Posts>
    </>
}
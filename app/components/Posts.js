'use client'
import { getResponse, pfpOrDefault } from "@/public/consts"
import Link from "next/link"
import { useState } from "react"

export default function Posts({user,loggedLogin,posts,setPosts}){
    if (!posts) return 
    const image = pfpOrDefault(user.pfp)
    const deletePost = (i) => {
        fetch(`${window.location.origin}/api/posts/${user.login}/${i}`,{method: "DELETE"}).then(r => {
            getResponse(r).then(res => {
                setPosts(res.posts)
            })
        })
        
    }
    const editPost = (i) => {
        // deletePost(i)
    }
    return <>
        {posts.map((post,i) => {
            return <div className="post" key={i}>

                <div className="header">
                    <div className="info">
                        <Link href={`/${user.login}`}><img src={image}></img></Link>
                        <div className="text">
                            <h4>{user.name} {user.lastname}</h4>
                            <p>{post.date.join(".")}</p>
                        </div>
                    </div>
                    {loggedLogin===user.login
                        ?<>
                            <div className="icons">
                                <i className="fa-solid fa-pen" onClick={() => editPost(i)}></i>
                                <i className="fa-solid fa-trash" onClick={() => deletePost(i)}></i>
                            </div>
                        </>
                        :null
                    }
                </div>

                <div className="body">
                    <p>{post.body}</p>
                </div>
            </div>
        })}
    </>
}
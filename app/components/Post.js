'use client'
import { getResponse, pfpOrDefault } from "@/public/consts"
import Link from "next/link"
import { useState, useRef } from "react"

export default function Post({user,loggedLogin,ps,i, k}){
    const edit = useRef()
    const textarea = useRef()
    const comments = useRef()
    const [commentBox,setCommentBox] = useState()
    const postCommentsId = useRef()
    const commentRef = useRef()
    const [post,setPost]  = useState(ps)

    if (!post) return 
    const image = pfpOrDefault(user.pfp)

    const updateLikes = (id) => {
        fetch(`${window.location.origin}/api/likes/${user.login}/${id}`,{
            method: "PATCH",
            body: JSON.stringify({likeLogin: loggedLogin})
        })
        .then(r => {
            if (r.ok){
                getResponse(r).then(res => {
                    setPost(res.posts[id])
                })
            }
        })
        
    }

    const cancelEdit = () => {
        edit.current.classList.remove("enabled")
    }

    const displayComments = (c,post,i) => {
        setCommentBox(post.comments)
        postCommentsId.current = i
        if (!c.current.classList.contains("enabled")) c.current.classList.add("enabled")
        cancelEdit()
    }

    const closeComments = () => {
        if (comments.current.classList.contains("enabled")) comments.current.classList.remove("enabled")
    }

    const sendComment = () => {
        fetch(`${window.location.origin}/api/comments/${user.login}/${postCommentsId.current}`,{
            method: "POST",
            body: JSON.stringify({
                by: loggedLogin,
                text: commentRef.current.value
            })
        })
        .then(r => {
            if (r.ok){
                getResponse(r).then(res => {             
                    setPost(res.posts[postCommentsId.current])
                    setCommentBox(res.posts[postCommentsId.current].comments)
                })
            }
            else{
                new Response(r.body).json().then(res => 
                    console.log(res)
                )
            }
        })
        commentRef.current.value = ""
    }


    return <>
        <div className="content">

            <div className="header">
                <div className="info">
                    <Link href={`/${user.login}`}><img src={image}></img></Link>
                    <div className="text">
                        <h4>{user.name} {user.lastname} <span>@{user.login}</span></h4>
                        
                        <p>{post.date.join(".")}</p>
                    </div>
                </div>
            </div>

            <div className="body">
                {post.body.split(" ")
                    .map((el,i) => {
                        if (el.startsWith("@")) return <span key={i}> <Link href={`/${el.substring(1)}`}>{el}</Link></span>
                        return <span key={i}> {el}</span>
                    })
                }
                    
            </div>
            <div className="interactives">
                <p onClick={() => updateLikes(i)}><i className="fa-solid fa-thumbs-up"></i> {post.likes?post.likes.length:0}</p>
                <p onClick={() => displayComments(comments,post,i)}>{post.comments?post.comments.length:0} Komentarzy</p>
            </div>
        </div>
    
        <div id="comments" ref={comments}>
            <div className="header">
                <h2>Komentarze</h2>
                <i className="fa-solid fa-x" onClick={closeComments}></i>
            </div>
            <div className="body">
                {commentBox
                    ?commentBox.map((comment,i) => {
                        return <div className="comment" key={i}>
                            <h3>@{comment.by}</h3>
                            <p>{comment.text}</p>
                        </div>
                    })
                    :null
                }
            </div>
            <div className="footer">
                <input ref={commentRef} placeholder="Napisz komentarz..."></input>
                <i className="fa-solid fa-paper-plane" onClick={sendComment}></i>
            </div>
        </div>
        <div ref={edit} id="edit-post">
            <textarea ref={textarea}></textarea>
            <div>
                <button onClick={cancelEdit}>Anuluj</button>
                <button onClick={() => sendEdit(textarea)}>Wyślij</button>
            </div>
        </div>
    </>
}
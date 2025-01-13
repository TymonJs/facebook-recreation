'use client'
import { getResponse, pfpOrDefault } from "@/public/consts"
import Link from "next/link"
import { useState, useRef } from "react"

export default function Posts({user,loggedLogin,posts,setPosts}){
    const edit = useRef()
    const textarea = useRef()
    const postEditId = useRef()
    const comments = useRef()
    const [commentBox,setCommentBox] = useState()
    const postCommentsId = useRef()
    const commentRef = useRef()

    if (!posts) return 
    const image = pfpOrDefault(user.pfp)
    const deletePost = (i) => {
        fetch(`${window.location.origin}/api/posts/${user.login}/${i}`,{method: "DELETE"}).then(r => {
            getResponse(r).then(res => {
                setPosts(res.posts)
            })
        })
        
    }

    const editForm = (i) => {
        postEditId.current = i
        if (!edit.current.classList.contains("enabled")) edit.current.classList.add("enabled")
        textarea.current.value=posts[i].body
        closeComments()

    }
    const cancelEdit = () => {
        edit.current.classList.remove("enabled")
    }

    const sendEdit = (text) => {
        console.log(text.current.value);
        
        fetch(`${window.location.origin}/api/posts/${user.login}/${postEditId.current}`,{
            method: "PATCH",
            body: JSON.stringify({body: text.current.value})
        })
        .then(r => {
            if (r.ok){
                getResponse(r).then(res => {
                    setPosts(res.posts)
                    if (edit.current.classList.contains("enabled")) edit.current.classList.remove("enabled")
                })
            }
            
        })
    }

    const updateLikes = (id) => {
        fetch(`${window.location.origin}/api/likes/${user.login}/${id}`,{
            method: "PATCH",
            body: JSON.stringify({likeLogin: loggedLogin})
        })
        .then(r => {
            if (r.ok){
                getResponse(r).then(res => {
                    setPosts(res.posts)
                })
            }
        })
        
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
                    setPosts(res.posts)
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
        {posts.map((post,i) => {
            return <div className="post" key={i}>

                <div className="header">
                    <div className="info">
                        <Link href={`/${user.login}`}><img src={image}></img></Link>
                        <div className="text">
                            <h4>{user.name} {user.lastname} <span>@{user.login}</span></h4>
                            
                            <p>{post.date.join(".")}</p>
                        </div>
                    </div>
                    {loggedLogin===user.login
                        ?<>
                            <div className="icons">
                                <i className="fa-solid fa-pen" onClick={() => editForm(i)}></i>
                                <i className="fa-solid fa-trash" onClick={() => deletePost(i)}></i>
                            </div>
                        </>
                        :null
                    }
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
        })}
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
                {/* {commentBox} */}
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
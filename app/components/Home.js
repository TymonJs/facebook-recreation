'use client'
import { pfpOrDefault } from "@/public/consts";
import Post from "./Post"
import { useRef, useState } from "react"
import Link from "next/link";

export default function Home({loggedLogin, users}){
    const input = useRef()

    let logged;

    const posts = users
    .reduce((acc,el) => {
      if (el.login===loggedLogin) logged=el
      if (!el.posts) return acc
      return [...acc,...el.posts.map((c,i) => ({user: el, post:c,curr:i}))]
    },[])
    .sort((a, b) => {
        const A = a.post.date
        const B = b.post.date
        const dateA = new Date(`${A[2]}-${A[1]}-${A[0]}`);
        const dateB = new Date(`${B[2]}-${B[1]}-${B[0]}`);
        return dateB - dateA;
    })
    .map((el,i) => {
      return <div className="post" key={i}>
        <Post loggedLogin={loggedLogin} user={el.user} ps={el.post} i={el.curr}></Post>
      </div>
    })

    // const postsRef = useRef(temp)

    // const [posts,setPosts] = useState(temp)

    // const image = pfpOrDefault(logged.pfp)

    // const sendPost = (ref) => {
    //   const text = ref.current.value
    //   if (text==="") return 
    //   ref.current.value=""
    //   fetch(`${window.location.origin}/api/posts/${loggedLogin}`, {
    //       method: "POST",
    //       body: JSON.stringify({body:text})
    //   })

    //   const today = new Date();
    //   const day = String(today.getDate()).padStart(2, '0');
    //   const month = String(today.getMonth() + 1).padStart(2, '0');
    //   const year = today.getFullYear().toString();
    
    //   const date = [day,month,year]

    //   const newPost = <div className="post" key={postsRef.current.length}>
    //     <Post loggedLogin={loggedLogin} user={logged} ps={({by: loggedLogin,text,date})}></Post>
    //   </div>
    //   postsRef.current = [newPost,...postsRef.current]
    //   setPosts(newPost,...postsRef.current)
    // }

    return <div id="home">
           
    {posts}

  </div>
}
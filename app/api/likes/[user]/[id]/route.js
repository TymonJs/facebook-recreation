import db from "@/data/database.json"
import { NextResponse } from "next/server";

export async function PATCH(req){
    const temp = req.nextUrl.pathname.split("/")
    const [login,id] = temp.slice(temp.length-2).map(e => decodeURIComponent(e))
    const {likeLogin = ""} = await new Response(req.body).json()

    let user;
    const rest = db.users.reduce((acc,c) => {
        if (c.login===login){
            user = c
            return acc
        }
        return [...acc,c]
    },[])

    if (!user) return NextResponse.json({msg: "User not found"},{status:400})

    const likes = user.posts[id]?.likes
    if (likes){
        const found = likes.find(l => l===likeLogin)
        if (found){
            user.posts[id].likes = likes.reduce((acc,c) => {
                if (c===likeLogin) return acc
                return [...acc,c]
            },[])
        }
        else{
            user.posts[id].likes.push(likeLogin)
        }
    }
    else{
        user.posts[id].likes = [likeLogin]
    }

    const fs = require("fs")

    fs.writeFileSync("data/database.json",JSON.stringify({users: [...rest,user]}),err => err?console.log(err):null)

    return NextResponse.json({msg: "Like updated",posts: user.posts})
}
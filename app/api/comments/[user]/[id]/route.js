import db from "@/data/database.json"
import { NextResponse } from "next/server";

export async function POST(req){
    const temp = req.nextUrl.pathname.split("/")
    const [login,id] = temp.slice(temp.length-2).map(e => decodeURIComponent(e))
    const {by = "", text = ""} = await new Response(req.body).json()
    
    if (!(by && text)) return NextResponse.json({msg: "Wrong params"},{status:400})

    let user;
    const rest = db.users.reduce((acc,c) => {
        if (c.login===login){
            user = c
            return acc
        }
        return [...acc,c]
    },[])

    if (!user) return NextResponse.json({msg: "User not found"},{status:400})
    
    const post = user.posts[id]
    if (post?.comments){
        user.posts[id].comments = post.comments.reduce((acc,c) => {
            return [...acc,c]
        },[{by,text}])
    }
    else{
        user.posts[id].comments = [{by,text}]
    }

    const fs = require("fs")

    fs.writeFileSync("data/database.json",JSON.stringify({users: [...rest,user]}),err => err?console.log(err):null)

    return NextResponse.json({msg: "Comment posted successfully",posts: user.posts})

    
}
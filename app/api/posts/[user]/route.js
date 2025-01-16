import { NextResponse } from "next/server"
import db from "@/data/database.json"

export function GET(req){
    const temp = req.nextUrl.pathname.split("/")
    const login = temp[temp.length-1]
    if (!login) return NextResponse.json({msg:"Wrong params"},{status:400})

    const posts = db.users.find(u => u.login === login)?.posts
    
    if (!posts) return NextResponse.json({posts: []})

    return NextResponse.json({posts})
}

export async function POST(req){
    const temp = req.nextUrl.pathname.split("/")
    const login = decodeURIComponent(temp[temp.length-1])
    const post = await new Response(req.body).json()
    if (!(login && post)) return NextResponse.json({msg:"Wrong params"},{status:400})
        
    let user;
    const rest = db.users.reduce((acc,c) => {
        if (c.login===login){
            user = c
            return acc
        }
        return [...acc,c]
    },[])

    if (!user) return NextResponse.json({msg: "User not found"},{status:400})

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear().toString();
    
    post["date"] = [day,month,year]

    if (!user.posts){
        user.posts = [post]
    }
    else{
        user.posts = user.posts.reduce((acc,c) => [...acc,c],[post])
    }
    rest.push(user)

    const fs = require("fs")
    fs.writeFileSync("data/database.json",JSON.stringify({users: rest}),err => err?console.log(error):null)

    return NextResponse.json({msg:"Post created",posts: user.posts})

}
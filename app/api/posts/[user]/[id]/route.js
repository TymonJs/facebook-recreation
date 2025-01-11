import { NextResponse } from "next/server"
import db from "@/data/database.json"

export async function DELETE(req){
    const temp = req.nextUrl.pathname.split("/")
    const [login,id] = temp.slice(temp.length-2).map(e => decodeURIComponent(e))
    
    if (!(login && !isNaN(id) && id>=0)) return NextResponse.json({msg:"Wrong params"},{status:400})

    let user;
    const rest = db.users.reduce((acc,c) => {
        if (c.login===login){
            user = c
            return acc
        }
        return [...acc,c]
    },[])

    if (!user) return NextResponse.json({msg: "User not found"},{status:400})
    if (!user.posts) return NextResponse.json({msg: "User doesn't have any posts"},{status:400})

    user.posts = user.posts.filter((el,i) => i!=id)

    const fs = require('fs')

    fs.writeFileSync("data/database.json",JSON.stringify({users:[...rest,user]}),err => err?console.log(err):null)
    

    return NextResponse.json({posts:user.posts})
}
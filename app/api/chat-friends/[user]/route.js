import chats from "@/data/chats.json"
import db from "@/data/database.json"
import { getResponse } from "@/public/consts"
import { NextResponse } from "next/server"

export async function GET(req,{params}){
    const user = decodeURIComponent((await params).user)
    const to = new URL(req.url).searchParams.get("to")

    if (!user) return NextResponse.json({msg: "User not given"})

    const openedChats = (await getResponse(await fetch(`${req.nextUrl.origin}/api/chat/${user}${to?`?to=${to}`:""}`))).chats.reduce((acc,c) => {
        const [u1,u2] = c.users

        if (u1==user){
            if (!acc.includes(u2)) acc.push({user: u2, messages: c.messages})
        }
        else if (u2==user){
            if (!acc.includes(u1)) acc.push({user: u1, messages: c.messages})
        }
        return acc
    },[])

    const output = db.users.reduce((acc,c) => {
        const found = openedChats.find(l => l.user==c.login)
        
        if (found) return [...acc,{chat:found,user:c}]
        return acc
    },[])
    
    return NextResponse.json({chats:output})
}
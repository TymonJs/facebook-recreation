import { NextResponse, NextRequest } from "next/server";
import { getResponse } from "@/public/consts";
import chats from "@/data/chats.json"
// GET - zwraca wiadomość
// POST - zapisuje wiadomość
// DELETE - usuwa wiadomość
// PATCH - edytuje wiadomość

export async function GET(req){
    const url = new URL(req.url)
    
    const searchParams = url.searchParams
    const origin = url.origin

    const u1 = searchParams.get("user1")
    const u2 = searchParams.get("user2")

    const chat = await getResponse(await fetch(`${origin}/api/chat?user1=${u1}&user2=${u2}`,{method:"GET"}))
    if (!chat) return NextResponse.json({msg:"Chat not found"},{status:400})
    
    const by = searchParams.get("by")
    const text = searchParams.get("text")

    if (!(by && text)) return NextResponse.json({msg:"Text or by param not given"},{status:400})
    
    const found = chat.messages.find(m => m.by==by&&m.text==text)

    if (!found) return NextResponse.json({msg: "Message not found"},{status:400}) 

    return NextResponse.json({...found})

}

export async function POST(req){
    const json = await new Response(req.body).json()

    const {user1="", user2="", by ="",text=""} = json

    if (!(user1 && user2 && by && text)) return NextResponse.json({msg:"Wrong params"},{status:400})

    let chat;
    const rest = chats.chats.reduce((acc,c) => {
        
        if ((user1==c.users[0]&&user2==c.users[1])||(user1==c.users[1]&&user2==c.users[0])){
            chat = c
            return acc
        }
        return [...acc,c]
    },[])

    if (!chat) return NextResponse.json({msg:"Chat not found"},{status:400})
    if (!chat.users.includes(by)) return NextResponse.json({msg:"Message by not in users"},{status:400})
    
    const messages = chat.messages.reduce((acc,c) => [...acc,c],[{by,text}])

    chat.messages = messages 
    rest.push(chat)

    const fs = require("fs")

    fs.writeFileSync("data/chats.json",JSON.stringify({chats:rest}),err => err?console.log(err):null)

    return NextResponse.json({msg:"Message sent"})

}
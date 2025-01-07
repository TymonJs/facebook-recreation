import { NextResponse } from "next/server";
import chats from "@/data/chats.json"
// GET - zwraca mój czat
// POST - stworzenie czatu
// DELETE - usunięcie czatu
// ?PATCH - zmiana danych np. nazwa czatu, nicki na czacie

export function GET(req){
    const searchParams = new URL(req.url).searchParams
    const u1 = searchParams.get("user1")
    const u2 = searchParams.get("user2")

    if (!(u1&&u2)) return NextResponse.json({msg:"Incorrect request"},{status:400})
    
    const found = chats.chats.find(c => (u1==c.users[0]&&u2==c.users[1])||(u1==c.users[1]&&u2==c.users[0]))

    if (!found) return NextResponse.json({msg:"Chat not found"},{status:400})    
    
    return NextResponse.json({...found})
}

export async function POST(req){
    const json = await new Response(req.body).json()
    const {user1="", user2=""} = json

    if (!(user1 && user2)) return NextResponse.json({msg: "Incorrect request"},{status:400})
    
    let found;

    const newChats = chats.chats.reduce((acc,c) => {
    
        if ((user1==c.users[0]&&user2==c.users[1])||(user1==c.users[1]&&user2==c.users[0])){
            found = true
            return acc
        }
        return [...acc,c]
    },[{users: [user1,user2],messages: []}])
    
    if (found) return NextResponse.json({msg: "Chat already exists"},{status:400})

    const fs = require("fs")

    fs.writeFileSync("data/chats.json",JSON.stringify({chats:newChats}),err => err?console.log(err):null)
    
    return NextResponse.json({msg: "Chat created"})
}

export async function DELETE(req){
    const json = await new Response(req.body).json()
    const {user1="", user2=""} = json

    if (!(user1 && user2)) return NextResponse.json({msg: "Incorrect request"},{status:400})
    
    let found;
    const rest = chats.chats.reduce((acc,c) => {
        
        if ((user1==c.users[0]&&user2==c.users[1])||(user1==c.users[1]&&user2==c.users[0])){
            found = true
            return acc
        }
        return [...acc,c]
    },[])

    if (!found) return NextResponse.json({msg:"Chat not found"},{status:400})    

    const fs = require("fs")

    fs.writeFileSync("data/chats.json",JSON.stringify({chats:rest}), err => err?console.log(err):null)
    
    return NextResponse.json({msg: "Chat removed"})
}
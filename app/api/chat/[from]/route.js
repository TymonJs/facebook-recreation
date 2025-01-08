import { NextResponse } from "next/server";
import chats from "@/data/chats.json"

export async function GET(req,params){
    const {from = ""}= await (params.params)
    const to = new URL(req.url).searchParams.get("to")

    if ((!from)||(from==to)) return NextResponse.json({msg:"Incorrect request"},{status:400})

    let found;

    if (to){
        found = chats.chats.filter(c => {
            if (c.users[0]==from){
                return c.users[1].includes(to)
            }
            else if(c.users[1]==from){
                return c.users[0].includes(to)
            }
            return false
        })
    }
    else{
        found = chats.chats.filter(c => (from==c.users[0]||from==c.users[1]))

    }
    
    if (!found) return NextResponse.json({msg:"Chat not found"},{status:400})    
    
    return NextResponse.json({chats:found})
    
}
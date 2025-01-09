import { NextResponse } from "next/server"
import db from "@/data/database.json"

export async function GET(req){
    const temp = req.nextUrl.pathname.split("/")
    const from = temp[temp.length-1]

    const user = db.users.find(u => u.login==from)

    if (!user) return NextResponse.json({msg: "User not found"},{status:400})

    const friends = db.users.filter(u => user.friends.includes(u.login) )
    
    return NextResponse.json({friends})
}
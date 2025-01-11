import db from "@/data/database.json"
import { NextResponse } from "next/server";

export async function GET(req){
    const temp = req.nextUrl.pathname.split("/")
    const u = decodeURIComponent(temp[temp.length-1])
    const user = db.users.find(c => c.login===u)

    if (!user) return NextResponse.json({msg: "User not found"},{status:404})

    const out = db.users.filter(u => user.requests.includes(u.login))
    return NextResponse.json({users: out})
    
}
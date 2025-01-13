import { NextResponse } from "next/server";
import database from "@/data/database.json"

export async function GET(req){
    const pathname = req.nextUrl.pathname.split("/")
    const login = decodeURIComponent(pathname[pathname.length-1])

    if (!login) return NextResponse.json({msg: "Request failed"},{status:500})

    const found = database.users.find(u => u.login==login)

    if (!found) return NextResponse.json({msg: "User not found"},{status:404})
    
    return NextResponse.json({user: found})
}

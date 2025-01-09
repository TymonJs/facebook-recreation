import { NextResponse } from "next/server"
import db from "@/data/database.json"

export async function GET(req){
    const temp = req.nextUrl.pathname.split("/")
    const [u1,u2] = temp.slice(temp.length-2).map(el => decodeURIComponent(el))

    const {info1,info2} = db.users.reduce((acc,c) => {
        if (c.login==u1) acc.info1=c
        else if (c.login==u2) acc.info2=c
        return acc
    },{})

    if (!(info1&&info2)) return NextResponse.json({msg: "Users not found"},{status:400})


    const mutualLogins = info2.friends.filter(u => info1.friends.includes(u))
    
    const friends = db.users.filter(c => mutualLogins.includes(c.login))
    
    return NextResponse.json({friends})
}
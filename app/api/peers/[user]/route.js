import { NextResponse } from "next/server";
import db from "@/data/database.json"

export function GET(req){
    const temp = req.nextUrl.pathname.split("/")
    const u = decodeURIComponent(temp[temp.length-1])
    const user = db.users.find(c => c.login===u)

    if (!user) return NextResponse.json({msg: "User not found"},{status:400})

    const friends = db.users.filter(u => user.friends.includes(u.login))

    const friendsLogins = friends.map(f => f.login)

    const peersLogins = friends.reduce((acc,friend) => {
    
        const filteredList = friend.friends.reduce((acc2,f) => {
            if (user.login===f || friendsLogins.includes(f) || acc.includes(f)) return [...acc2]
            return [...acc2,f]
        },[])

        return [...acc,...filteredList]
    },[])

    const peers = db.users.filter(u=> peersLogins.includes(u.login))

    return NextResponse.json({friends:peers})
}
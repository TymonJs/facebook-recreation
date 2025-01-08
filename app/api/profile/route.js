import { NextResponse } from "next/server";
import db from "@/data/database.json"

// GET - return user
// POST - register
// PATCH - edit profile
// DELETE - rm account

export async function PATCH(req){
    
    const json = await new Response(req.body).json()
    const {privacy, login, pfp, desc} = json

    if (!login) return NextResponse.json({msg: "Provide user login"},{status:400})
    if (!(privacy || pfp || desc)) return NextResponse.json({msg: "Provide changes to update the profile"},{status:400})

    let user;
    const rest = db.users.reduce((acc,c) => {
        if (c.login == login) {
            user=c
            return acc
        }
        return [...acc,c]
    },[])

    if (!user) return NextResponse.json({msg: "Login not found"},{status:400})
    
    const fs = require('fs')

    if (privacy) user.friendPrivacy = privacy
    if (desc) user.desc = desc

    if (pfp){
        const base = pfp.split(',')[1]
        const buffer = Buffer.from(base, 'base64');
        fs.writeFileSync(`public/pfps/${login}.png`,buffer,err => err?console.log(err):null)
        if (!user.pfp) user.pfp=`/pfps/${user.login}.png`
    }

    fs.writeFileSync("data/database.json",JSON.stringify({
        users: [
            ...rest,
            user
        ]
    }),err=>err?console.log(err):null)
    
    return NextResponse.json({msg: "Profile has been updated"})
}
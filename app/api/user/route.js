import { NextResponse } from "next/server";
import database from "@/data/database.json"
import srp from 'secure-remote-password/client'

export async function GET(req){
    const searchParams = new URL(req.url).searchParams
    const keys = Array.from(searchParams.keys()).map(k => decodeURIComponent(k))
    
    if (keys.length !== new Set(keys).size) return NextResponse.json({msg:"Can't resolve 2 identical queries"},{status:400})
    
    const users = database.users.reduce((acc,u) => {
        if (keys.every(key => {
            if (["birthday","birthmonth","birthyear"].includes(key)) return u.birthdate[key.replace("birth","")]==searchParams.get(key)
            else if (["friends","requests"].includes(key)) return u[key].includes(searchParams.get(key))
            else if (key === "search") return `${u.name} ${u.lastname}`.toLowerCase().includes(searchParams.get(key))
            return u[key]?.toLowerCase()===searchParams.get(key)

        })) return [...acc,u]
        return acc
    },[])
    
    return NextResponse.json({users})
}

export async function POST(request){
    const data = request.body
    
    try{
        const json = await new Response(data).json()
        
        if (database.users.some(user => user.login===json.login)) return NextResponse.json({msg: "This login is already taken"},{status:400})
    
        const {password, ...rest} = json
    
        const salt = srp.generateSalt()
        const privateKey = srp.derivePrivateKey(salt, json.login, password)
        const verifier = srp.deriveVerifier(privateKey)
    
        const toSend = {
            ...rest,
            salt,
            verifier, 
            friends : [],
            requests : []
        }
        
        const fs = require('fs')
        
        if (database.users){
            database.users.push(toSend)
            fs.writeFileSync("data/database.json",JSON.stringify(database),err => err?console.log(err):null)
        }

        else{
            const temp = {
                users: [toSend]
            }
            fs.writeFileSync("data/database.json",JSON.stringify(temp),err => err?console.log(err):null)
        }
        
    
        return NextResponse.json({msg: "Użytkownik został zarejestrowany"})
    }
    catch(e) {
        console.log(e)
        return NextResponse.json({msg: "Dane są nieprawidłowe"},{status:400})
    }   
}

export async function PATCH(req){
    const json = await new Response(req.body).json()
    const {privacy, login, pfp, desc} = json

    if (!login) return NextResponse.json({msg: "Provide user login"},{status:400})
    if (!(privacy || pfp || desc)) return NextResponse.json({msg: "Provide changes to update the profile"},{status:400})

    let user;
    const rest = database.users.reduce((acc,c) => {
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

export async function DELETE(req){
    const {user} = await new Response(req.body).json()

    if (!user) return NextResponse.json({msg: "Wrong params"},{status:400})

    const rest = database.users.reduce((acc,c) => {
        if (c.login===user) return acc
        return [...acc,c]
    },[])

    if (database.users.length===rest.length) return NextResponse.json({msg: "User not found"},{status:400})
    
    const fs =require('fs')

    fs.writeFileSync("data/database.json",JSON.stringify({users: rest}),err => err?console.log(err):null)

    return NextResponse.json({msg: "User removed successfully"})
}
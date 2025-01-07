import { NextResponse } from "next/server";
import database from "@/data/database.json"
export async function GET(req){
    const searchParams = new URL(req.url).searchParams
    const keys = Array.from(searchParams.keys()).map(k => decodeURIComponent(k))
    
    if (keys.length !== new Set(keys).size) return NextResponse.json({msg:"Can't resolve 2 identical queries"},{status:400})
    
    const users = database.users.reduce((acc,u) => {
        if (keys.every(key => {
            if (u.login=="kamil") console.log("kamil")
            if (["birthday","birthmonth","birthyear"].includes(key)) return u.birthdate[key.replace("birth","")]==searchParams.get(key)
            else if (["friends","requests"].includes(key)) return u[key].includes(searchParams.get(key))
            else if (key === "search") return `${u.name} ${u.lastname}`.toLowerCase().includes(searchParams.get(key))
            return u[key]?.toLowerCase()===searchParams.get(key)

        })) return [...acc,u]
        return acc
    },[])
    console.log()
    
    return NextResponse.json({users})
}
import { NextResponse } from "next/server";
import database from "@/data/database.json"
import Login from "@/app/login/page";
//POST - wysyłanie i akceptowanie zaproszenia
//DELETE - usunięcie znajomego
//UPDATE?
export async function POST(req){
    const json = await new Response(req.body).json()
    const fromId = json.from
    const toId = json.to

    if (fromId == toId) return NextResponse.json({msg: "Nie można wysyłać zaproszenia do samego siebie"},{status: 406})

    const users = database.users

    const fUsers = users.reduce((acc,c) => {
        if (c.id==fromId) return {...acc, from:c}
        else if (c.id==toId) return {...acc,to:c}
        
        return acc
    },{})

    const {from,to} = fUsers
    
    
    if (!(from && to)) return NextResponse.json({msg: "Któryś z użytkowników nie istnieje"},{status: 406})

    const fs = require("fs")
    // nadawca zaproszenia już został zaproszony
    if (from.requests.includes(to.id)){
        const newFromRequests = from.requests.reduce((acc,c)=> {
            if (c.id==to.id) return [...acc]
            return [...acc,c]
        },[])
        console.log();
        
        
    }
    const fromIndex = database.users.indexOf(from)    
    database.users[fromIndex] 
    
    // database.users[0] = {"coś":"coś"}
    // console.log(database.users[0]);
    
    return NextResponse.json({msg: "ok"})
}
// export default function DELETE({req}){
    
// }
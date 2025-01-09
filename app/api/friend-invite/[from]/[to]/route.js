import { NextResponse } from "next/server";
import database from "@/data/database.json"

export async function POST(req){
    const temp = req.nextUrl.pathname.split("/")
    const [fromLogin,toLogin] = temp.slice(temp.length-2).map(el => decodeURIComponent(el))
    
    if (fromLogin == toLogin) return NextResponse.json({msg: "Nie można wysyłać zaproszenia do samego siebie"},{status: 400})

    const users = database.users

    const fUsers = users.reduce((acc,c) => {
        if (c.login==fromLogin) return {...acc, from:c}
        else if (c.login==toLogin) return {...acc,to:c}
        
        return acc
    },{})

    const {from,to} = fUsers
    
    if (from.friends.includes(to.login)) return NextResponse.json({msg: "Odbiorca zaproszenia już jest dodany w znajomych"},{status: 400})
    
    if (!(from && to)) return NextResponse.json({msg: "Adresat i odbiorca zaproszenia muszą być zarejestrowani"},{status: 400})

    const fs = require("fs")
    if (from.requests.includes(to.login)){
        const newFromRequests = from.requests.reduce((acc,c)=> {   
            if (c==to.login) return [...acc]
            return [...acc,c]
        },[])

        from.requests = newFromRequests
        from.friends.push(to.login)
        to.friends.push(from.login)
        
        const toSend = {
            users: [
                ...database.users.filter(u => u.login!=to.login && u.login!=from.login),
                to,
                from

            ]
        }
        
        fs.writeFileSync("data/database.json",JSON.stringify(toSend),err => err?console.log(err):null)
        return NextResponse.json({msg: "Friend added"},{status: 201})
    }
    else{    
        if (to.requests.includes(from.login)) return NextResponse.json({msg: "Użytkownik został już  zaproszony"},{status:406})
        
        to.requests.push(from.login)
        const toSend = {
            users: [
                ...database.users.filter(u => u.login!=to.login),
                to
            ]
        }
        
        fs.writeFileSync("data/database.json",JSON.stringify(toSend),err => err?console.log(err):null)
        return NextResponse.json({msg: "Invited"},{status: 202})
        
    }
    
}
export async function DELETE(req){
    const temp = req.nextUrl.pathname.split("/")
    const [fromLogin,toLogin] = temp.slice(temp.length-2).map(el => decodeURIComponent(el))

    if (fromLogin == toLogin) return NextResponse.json({msg: "Nie można usunąć ze znajomych samego siebie"},{status: 400})

    let from;
    let to;

    const rest = database.users.reduce((acc,c) => {
        if (c.login==fromLogin){
            from=c
            return [...acc]
        }
        else if (c.login==toLogin){
            to=c
            return [...acc]
        }
        
        return [...acc,c]
    },[])

    if (!(from && to)) return NextResponse.json({msg: "Adresat i odbiorca muszą być zarejestrowani"},{status: 400})
    
    if (!(from.friends.includes(to.login))) return NextResponse.json({msg: "Adresat i odbiorca muszą być w znajomych"},{status: 406})

    const newFromFriends = from.friends.reduce((acc,c) => {
        if (c==to.login) return [...acc]
        return [...acc,c]
    },[])

    const newToFriends = to.friends.reduce((acc,c) => {
        if (c==from.login) return [...acc]
        return [...acc,c]
    },[])

    from.friends = newFromFriends
    to.friends = newToFriends
    
    const fs = require("fs")
    const toSend = {
        users: [
            ...rest,
            to,
            from
        ]
    }
    fs.writeFileSync("data/database.json",JSON.stringify(toSend), err => err?console.log("error"):null)

    return NextResponse.json({msg:"Friend removed"},{status:200})
    
}

export async function PATCH(req){
    const temp = req.nextUrl.pathname.split("/")
    const [fromLogin,toLogin] = temp.slice(temp.length-2).map(el => decodeURIComponent(el))

    let from;
    let to;

    const rest = database.users.reduce((acc,c) => {
        if (c.login==fromLogin){
            from=c
            return [...acc]
        }
        else if (c.login==toLogin){
            to=c
            return [...acc]
        }
        
        return [...acc,c]
    },[])
    
    if (!(from && to)) return NextResponse.json({msg: "Adresat i odbiorca muszą być zarejestrowani"},{status: 400})
    
    if (!(to.requests.includes(from.login))) return NextResponse.json({msg: "Adresat nie zaprosił jeszcze odbiorcy"},{status: 406})

    
    const newReqs = to.requests.reduce((acc,c) => {
        if (c==fromLogin) return [...acc]
        return [...acc,c]
    },[])
    to.requests = newReqs
    
    const toSend = {
        users: [
            ...rest,
            to,
            from
        ]
        
    }

    const fs = require("fs")
    fs.writeFileSync("data/database.json",JSON.stringify(toSend),err => err?console.log(err):null)
    
    return NextResponse.json({msg:"User uninvited"})
}
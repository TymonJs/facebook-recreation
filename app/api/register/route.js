import { NextResponse } from "next/server";
import prev from "@/data/database.json"
import srp from 'secure-remote-password/client'

export async function POST(request){
    const data = request.body
    
    try{
        const json = await new Response(data).json()

        if (prev.users.some(user => user.email===json.email)) return NextResponse.json({success:false,msg: "This email is already taken"})
    
            const {password, ...rest} = json
        
            const salt = srp.generateSalt()
            const privateKey = srp.derivePrivateKey(salt, json.email, password)
            const verifier = srp.deriveVerifier(privateKey)
        
            const toSend = {
                ...rest,
                salt,verifier, 
                friends : [],
                id: prev.users?.length>0?prev.users[prev.users.length-1].id+1:1
            }
            
            const fs = require('fs')
            
            if (prev.users){
                prev.users.push(toSend)
                await fs.writeFileSync("data/database.json",JSON.stringify(prev),err => err?console.log(err):null)
            }
            else{
                const temp = {
                    users: [toSend]
                }
                await fs.writeFileSync("data/database.json",JSON.stringify(temp),err => err?console.log(err):null)
            }
            
        
            return NextResponse.json({success: true, msg: "User has been registered"})
    }
    catch {
        return NextResponse.json({success:false, msg: "Provide a valid json with your information"})
    }
    
    
   
}
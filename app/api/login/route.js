import { NextResponse } from "next/server";
import prev from "@/data/database.json"
import srp from "secure-remote-password/server"
import secrets from "@/data/secrets.json"
import tokens from "@/data/tokens.json"

export async function POST(request){
    const data = request.body
    try{
        const json = await new Response(data).json()

        if (json.proof) {

            const {proof, email, clientEphemeralPublic, token} = json
            const user = prev.users.find(u => u.email===email)

            const {salt,verifier,id} = user
            const df = secrets.secrets.find(u => u.email===email)
            
            try{
                const serverSession = srp.deriveSession(df.secret, clientEphemeralPublic, salt, email, verifier, proof)                

                const fs = require("fs")

                const newSecrets = {secrets: secrets.secrets.filter(c => c.email!==email)}
                fs.writeFileSync("data/secrets.json",JSON.stringify(newSecrets),err => err?console.log(err):null)
                
                const newTokens = {tokens: [...tokens.tokens.filter(t => t.id!=id),{token,id}]}
                fs.writeFileSync("data/tokens.json",JSON.stringify(newTokens),err => err?console.log(err):null)

                return NextResponse.json({success:true, serverSessionProof: serverSession.proof})
            }
            catch{
                return NextResponse.json({success:false,msg:"Wrong password"})
            }
            
            
            
        }
        
        
        
        const {email,clientEphemeralPublic} = json
        const user = prev.users.find(u => u.email===email)
        
        if (!user) return NextResponse.json({success:false,msg:"This email isn't registered"})

        const {salt,verifier} = user
        const serverEphemeral = srp.generateEphemeral(verifier)
        const serverEphemeralPublic = serverEphemeral.public

        let newJson;
        if (secrets.secrets){
            newJson = {
                secrets: 
                secrets.secrets.reduce((acc,c) => {
                    if (c.email===email) return [...acc]
                    return [...acc,c]
                },[{email,secret:serverEphemeral.secret}])
    
            }
        }
        else{
            newJson = {
                secrets: [{
                    email,
                    secret:serverEphemeral.secret
                }]
            }
        }
        

        const fs = require('fs')
        await fs.writeFileSync("data/secrets.json",JSON.stringify(newJson), err => err?console.log(err):null)
        
        return NextResponse.json({success: true, serverEphemeralPublic,salt})

        
    }
    catch (e){
        console.log(e);
        
        return NextResponse.json({success: false ,msg: "Provide a valid json with your email and password"})
    }
    
}
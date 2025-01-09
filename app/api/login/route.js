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

            const {proof, login, clientEphemeralPublic, token} = json
            const user = prev.users.find(u => u.login===login)

            const {salt,verifier} = user
            const df = secrets.secrets.find(u => u.login===login)
            
            try{
                const serverSession = srp.deriveSession(df.secret, clientEphemeralPublic, salt, login, verifier, proof)                

                const fs = require("fs")

                const newSecrets = {secrets: secrets.secrets.filter(c => c.login!==login)}
                fs.writeFileSync("data/secrets.json",JSON.stringify(newSecrets),err => err?console.log(err):null)
                
                const newTokens = {tokens: [...tokens.tokens.filter(t => t.login!=login),{token,login}]}
                fs.writeFileSync("data/tokens.json",JSON.stringify(newTokens),err => err?console.log(err):null)

                return NextResponse.json({success:true, serverSessionProof: serverSession.proof})
            }
            catch{
                return NextResponse.json({success:false,msg:"Hasło jest niepoprawne"})
            }
            
            
            
        }
        
        
        
        const {login,clientEphemeralPublic} = json
        const user = prev.users.find(u => u.login===login)
        
        if (!user) return NextResponse.json({success:false,msg:"Ten login jest niezarejestrowany"})

        const {salt,verifier} = user
        const serverEphemeral = srp.generateEphemeral(verifier)
        const serverEphemeralPublic = serverEphemeral.public

        let newJson;
        if (secrets.secrets){
            newJson = {
                secrets: 
                secrets.secrets.reduce((acc,c) => {
                    if (c.login===login) return [...acc]
                    return [...acc,c]
                },[{login,secret:serverEphemeral.secret}])
    
            }
        }
        else{
            newJson = {
                secrets: [{
                    login,
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
        
        return NextResponse.json({success: false ,msg: "Dane są nieprawidłowe"})
    }
    
}
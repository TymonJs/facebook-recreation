'use client'
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import srp from "secure-remote-password/client"

export const apiLogin = (login,password) => {
    return new Promise((resolve,reject) => {
        const clientEphemeral = srp.generateEphemeral()
        
        fetch("api/login",{
            method: "POST",
            body: JSON.stringify({login,clientEphemeralPublic: clientEphemeral.public})
        })
        .then(res => {
            new Response(res.body).json()
            .then(serv => {
                
                if (!serv.success) reject("Ten login nie jest zarejestrowany")
                    else{
                        const {salt, serverEphemeralPublic} = serv
                        
                        const privateKey = srp.derivePrivateKey(salt, login, password)
                        const clientSession = srp.deriveSession(clientEphemeral.secret, serverEphemeralPublic, salt, login, privateKey)
                        
                        fetch("api/login",{
                            method:"POST",
                            body: JSON.stringify({proof: clientSession.proof,login,clientEphemeralPublic: clientEphemeral.public,salt, token: clientSession.key})
                        })
                        .then(res => {
                            
                            new Response(res.body).json().then(auth => {
                                if (!auth.success) reject("Złe hasło")
                                else{    
                                    srp.verifySession(clientEphemeral.public, clientSession, auth.serverSessionProof)
                                    resolve(clientSession.key)
                                                        
                                }

                            }).catch(e => {
                                console.log(e);
                                
                            })
                        })
                    }
            }).catch(e => {
                console.log(e);
                
            })      
                
            
        })
    })
    
}

export default function LoginForm(){
    const [warning,setWarning] = useState()
    const {replace} = useRouter()
    

    const handleClick = () => {
        const login = document.getElementsByName("login")[0].value
        const password = document.getElementsByName("password")[0].value

            
        apiLogin(login,password)
        .then(token => {
            const date = new Date()

            date.setDate(date.getDate() + 1) // ciasteczko ważne 1 dzień

            document.cookie = `token=${token};expire=${date.toUTCString()}`                                       
            
            replace("/")

        })
        .catch(e => {
            console.log(e);
            
            setWarning(e)   
        })
             
        
    }
    return <div id="form_container">
        <div>
            <h1>facebook</h1>
        </div>
        <div className="container">
            <p>Zaloguj się do Facebooka</p>
            {warning?<h4 id="warning">{warning}</h4>:null}
            <div id="interactives">
                <input name="login" placeholder="Login"></input>
                <input type="password" name="password" placeholder="Hasło"></input>
                <button id="login_button" onClick={handleClick}>Zaloguj się</button>
            </div>
            
            <Link id="register" href="/register">Utwórz nowe konto</Link>
        </div>
    </div>
}
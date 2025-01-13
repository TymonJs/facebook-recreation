'use client'
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Settings({login,name,pfp}){
    const {replace} = useRouter()

    const logout = () => {
        document.cookie="token="
        replace("/login")
    }

    const removeAccount = () => {
        fetch(`${window.location.origin}/api/user`,{
            method: "DELETE",
            body: JSON.stringify({
                user: login
            })
        })
        .then(r => {
            if (r.ok){
                document.cookie="token="
                replace("/register")
            }
        })
    }
    
    return <>
        <Link href={`/${login}`}>
            <button>
                <img src={pfp} alt="pfp"></img>
                <span>{name}</span>
            </button>
        </Link>
        {/* <button>
            <i className="fa-solid fa-gear"></i>
            <span>Ustawienia i prywatność</span>
        </button> */}
        <button onClick={logout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Wyloguj się</span>
        </button>
        <button id="remove-account" onClick={removeAccount}>
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>Usuń konto</span>
        </button>
    </>
}
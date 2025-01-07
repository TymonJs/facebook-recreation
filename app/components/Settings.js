'use client'
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Settings({login,name,pfp}){
    const {replace} = useRouter()

    const logout = () => {
        document.cookie="token="
        replace("/login")
    }
    
    return <div className="right-dropdown" id="settings">
        <Link href={`/${login}`}><button>
            <img src={pfp} alt="pfp"></img>
            <span>{name}</span>
        </button></Link>
        <button>
            <i className="fa-solid fa-gear"></i>
            <span>Ustawienia i prywatność</span>
        </button>
        <button onClick={logout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Wyloguj się</span>
        </button>
    </div>
}
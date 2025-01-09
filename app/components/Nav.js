'use client'
import Right from "./Right"
import Link from "next/link"
import SearchBar from "./SearchBar"
import {getResponse, pfpOrDefault} from "@/public/consts"
import { useState } from "react"

export default function Nav({active="", search="", chatSearch="", loggedLogin=null,chattingWith,setChattingWith}){    
    const links = ["",`friends`,"groups"]
    const mid_menu_icons = ["house","user-group","users"].map((el,i) => {    
        const temp = active===el?`fa-${el} active`:`fa-${el}`
        
        const icon = <Link href={`/${links[i]}`} key={i}><i className={`fa-solid ${temp}`}></i></Link>
        return icon
    })

    const [chtt,setChtt] = useState("")
    
    return (<nav>
        <div id="left">
            <Link href="/"><img src="/facebook.png" alt="Facebook" id="facebook"></img></Link>
            <SearchBar search={search} loggedLogin={loggedLogin}/>
        </div>

        <div id="mid">
            {mid_menu_icons}
        </div>
            

        <Right loggedLogin={loggedLogin} chatSearch={chatSearch} 
        chattingWith={chattingWith?chattingWith:chtt} 
        setChattingWith={setChattingWith?setChattingWith:setChtt}/>
        
    </nav>)
}
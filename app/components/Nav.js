import Right from "./Right"
import Link from "next/link"
import SearchBar from "./SearchBar"
// import db from "@/data/database.json"

export default async function Nav({active="", search="", loggedLogin=null}){
    
    const res = await fetch("http://localhost:3000/api/data",{
        method: "GET"
    })
    const db = (await new Response(res.body).json()).database

    const links = ["",`friends`,"groups"]
    const mid_menu_icons = ["house","user-group","users"].map((el,i) => {    
        const temp = active===el?`fa-${el} active`:`fa-${el}`
        
        const icon = <Link href={`/${links[i]}`} key={i}><i className={`fa-solid ${temp}`}></i></Link>
        return icon
    })
    

    const fs = require("fs")
    const peopleFound = search?
    db.users.filter(u => {     
        return (`${u.name} ${u.lastname}`
            .toLowerCase()
            .includes(search.toLowerCase())
            && u.login!=loggedLogin
        )})
    .slice(0,8)
    .map(u => {
        const pfp = fs.existsSync(`public/pfps/${u.login}.png`)?`/pfps/${u.login}.png`:"/blank-pfp.png"
        return ({name:`${u.name} ${u.lastname}`, login:u.login, pfp})
    }):null
    const pfpExists = fs.existsSync(`public/pfps/${loggedLogin}.png`)
    
    const {name, lastname} = db.users.find(u => u.login == loggedLogin)


    return (<nav>
        <div id="left">
            <Link href="/"><img src="/facebook.png" alt="Facebook" id="facebook"></img></Link>
            <SearchBar peopleFound={peopleFound}/>
        </div>

        <div id="mid">
            {mid_menu_icons}
        </div>
            

        <Right loggedLogin={loggedLogin} pfp={pfpExists} name={`${name} ${lastname}`}/>
        
    </nav>)
}
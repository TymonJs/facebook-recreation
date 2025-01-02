import Right from "./Right"
import Link from "next/link"
import SearchBar from "./SearchBar"


export default async function Nav({active="", search=""}){
    const links = ["","friends","groups"]
    const mid_menu_icons = ["house","user-group","users"].map((el,i) => {    
        const temp = active===el?`fa-${el} active`:`fa-${el}`
        
        const icon = <Link href={`/${links[i]}`} key={i}><i className={`fa-solid ${temp}`}></i></Link>
        return icon
    })
    const database = await import ("@/data/database.json")
    
    const fs = require("fs")

    const peopleFound = search?database.users
    .filter(u => `${u.name} ${u.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase()))
    .slice(0,8)
    .map(u => {
        const pfp = fs.existsSync(`public/${u.id}.png`)?`${u.id}.png`:"blank-pfp.png"
        return ({name:`${u.name} ${u.lastname}`, id:u.id, pfp})
    })
    :null
    
    return (<nav>
        <div id="left">
            <Link href="/"><img src="/facebook.png" alt="Facebook" id="facebook"></img></Link>
            <SearchBar peopleFound={peopleFound}/>
        </div>

        <div id="mid">
            {mid_menu_icons}
        </div>
            

        <Right/>
        
    </nav>)
}
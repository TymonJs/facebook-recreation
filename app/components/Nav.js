import Right from "./Right"
import Link from "next/link"
import SearchBar from "./SearchBar"
import database from "@/data/database.json"

export default function Nav({active="house", search=""}){
    const links = ["","friends","groups"]
    const mid_menu_icons = ["house","user-group","users"].map((el,i) => {    
        const temp = active===el?`fa-${el} active`:`fa-${el}`
        
        const icon = <Link href={`/${links[i]}`} key={i}><i className={`fa-solid ${temp}`}></i></Link>
        return icon
    })
    const peopleFound = search?database.users.filter(u => `${u.name} ${u.lastname}`.includes(search)):null
    
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
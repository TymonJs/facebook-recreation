import Nav from "./Nav"
import database from "@/data/database.json"
import PersonalPage from "./PersonalPage"
import Link from "next/link"
import {headers} from "next/headers"
import MiniPage from "./MiniPage"
import PageButtons from "./PageButtons"
import PageEditButton from "./PageEditButton"

export default async function PersonalPageHeader({search,id,loggedId}){

    const user = database.users.find(u => u.id==id)
    if (!user) return <div id="not-found-box">
            <h1>Nie znaleziono tego użytkownika</h1>
            <Link href="/"><button>Wróć do strony głównej</button></Link>
        </div>

  
    const fs = require("fs")
    const pfp = fs.existsSync(`public/pfps/${id}.png`)?`/pfps/${id}.png`:"/blank-pfp.png"
    
    const {name, lastname, birthdate, friends} = user

    const birthDateFormatted = Object.keys(birthdate)
        .map(el => birthdate[el].toString().length>1?birthdate[el]:`0${birthdate[el]}`)
        .join(".")
    
    const loggedIdInfo = database.users.find(u => u.id==loggedId)

    const limit = 6
    
    const temp = loggedId==id
    ?database.users.filter(u => loggedIdInfo.friends.includes(u.id))
    :database.users.filter(c => friends.filter(u => loggedIdInfo.friends.includes(u)).includes(c.id))

    const friendsInfo = temp
    .slice(0,limit)
    .map((u,i) => {
        
        return <div className="friend-div" key={i}>
            <Link href={`/${u.id}`} >
                <img className="friend-pfp"  src={fs.existsSync(`public/pfps/${u.id}.png`)?`/pfps/${u.id}.png`:`/blank-pfp.png`}>
                </img>
            </Link>
            <MiniPage loggedInfo={({loggedId,loggedFriends:loggedIdInfo.friends})} 
                hoverInfo={({name:u.name,lastname:u.lastname,id:u.id,friends:u.friends})}>
            </MiniPage>
        </div>
        
    })

    

    
    
    
    
    return <> <Nav search={search} loggedId={loggedId}/>
    <div id="personal-page">
        <div id="info-header">
            <div className="info">
                <img src={`${pfp}`} id="pfp"></img>
                <div className="text">
                    <h1>{`${name} ${lastname}`}</h1>
                    <p>Data urodzenia: {birthDateFormatted}</p>
                    <p className="friend-count"><span>{friends?friends.length:"Brak"} znajomych</span>
                        {loggedId!=id
                        ?<><i className="fa-solid fa-circle"></i>
                        <span>{`${friends.filter(u => loggedIdInfo.friends.includes(u)).length} Wspólnych  znajomych`}</span></>
                        :null}
                    </p>
                    <div className="friend-pfps-container">{friendsInfo}</div>
                </div>
            </div>
            
            {id==loggedIdInfo.id
            ?<PageEditButton></PageEditButton>
            :<PageButtons id={id} loggedIdInfo={({friends:loggedIdInfo.friends,id:loggedId})}></PageButtons>}
            
            
        </div>
    </div>
    </>
  
}
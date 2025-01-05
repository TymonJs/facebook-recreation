import Nav from "./Nav"
import database from "@/data/database.json"
import Link from "next/link"
import MiniPage from "./MiniPage"
import PageButtons from "./PageButtons"
import PageEditButton from "./PageEditButton"
import EditForm from "./EditForm"

export default async function PersonalPageHeader({search,login,loggedLogin}){
    
    const user = database.users.find(u => u.login==login)
    if (!user) return <div id="not-found-box">
            <h1>Nie znaleziono tego użytkownika</h1>
            <Link href="/"><button>Wróć do strony głównej</button></Link>
        </div>

  
    const fs = require("fs")
    const pfp = fs.existsSync(`public/pfps/${login}.png`)?`/pfps/${login}.png`:"/blank-pfp.png"
    
    const {name, lastname, birthdate, friends, requests, friendPrivacy} = user

    const birthDateFormatted = Object.keys(birthdate)
        .map(el => birthdate[el].toString().length>1?birthdate[el]:`0${birthdate[el]}`)
        .join(".")
    
    const loggedLoginInfo = database.users.find(u => u.login==loggedLogin)

    const limit = 6
    
    

    const loggedPfp = fs.existsSync(`public/pfps/${loggedLogin}.png`)?`/pfps/${loggedLogin}.png`:"/blank-pfp.png"
    
    const getFriendsContainer = () => {
        
        if (login!==loggedLogin && (friendPrivacy==="private"||(friendPrivacy=="friends" && !friends.includes(loggedLogin)))) return null

        const temp = loggedLogin==login
        ?database.users.filter(u => loggedLoginInfo.friends.includes(u.login))
        :database.users.filter(c => friends.filter(u => loggedLoginInfo.friends.includes(u)).includes(c.login))

        
        const friendsInfo = temp
        .slice(0,limit)
        .map((u,i) => {  
            return <div className="friend-div" key={i}>
                <Link href={`/${u.login}`} >
                    <img className="friend-pfp"  src={fs.existsSync(`public/pfps/${u.login}.png`)?`/pfps/${u.login}.png`:`/blank-pfp.png`}>
                    </img>
                </Link>
                <MiniPage loggedInfo={({loggedLogin,loggedFriends:loggedLoginInfo.friends,loggedRequests: loggedLogin.requests})} 
                    hoverInfo={({name:u.name,lastname:u.lastname,login:u.login,friends:u.friends,requests:u.requests})}>
                </MiniPage>
            </div>
            
        })

        return <>
            <Link href={`/friends/${login}`}>
                <p className="friend-count"><span>{friends?friends.length:"Brak"} znajomych</span>
                    {loggedLogin!=login
                    ?<><i className="fa-solid fa-circle"></i>
                    <span>{`${friends.filter(u => loggedLoginInfo.friends.includes(u)).length} Wspólnych  znajomych`}</span></>
                    :null}
                </p>
            </Link>
            <div className="friend-pfps-container">{friendsInfo}</div>
        </>

    }

        
        
    return <> <Nav search={search} loggedLogin={loggedLogin}/>
    <div id="personal-page">
        <div id="info-header">
            <div className="info">
                <img src={`${pfp}`} id="pfp"></img>
                <div className="text">
                    <h1>{`${name} ${lastname}`}</h1>
                    <p>Data urodzenia: {birthDateFormatted}</p>
                    {getFriendsContainer()}
                    {/* {friendsElem}
                    <div className="friend-pfps-container">{friendsInfo}</div> */}
                </div>
            </div>
            
            {login==loggedLoginInfo.login
            ?<PageEditButton></PageEditButton>
            :<div className="buttons">
                <PageButtons 
                user={({friends,requests,login})}
                loggedLoginInfo={({friends:loggedLoginInfo.friends,login:loggedLogin,requests:loggedLogin.requests})}>
                </PageButtons>
            </div>}
            
            
        </div>
    </div>
    <EditForm pfp={loggedPfp} userPrivacy={loggedLoginInfo.privacy} login={loggedLoginInfo.login}></EditForm>
    </>
  
}
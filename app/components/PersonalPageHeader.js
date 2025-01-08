import Nav from "./Nav"
import database from "@/data/database.json"
import Link from "next/link"
import MiniPage from "./MiniPage"
import PageButtons from "./PageButtons"
import PageEditButton from "./PageEditButton"
import EditForm from "./EditForm"
import { getResponse, pfpOrDefault } from "@/public/consts"

export default async function PersonalPageHeader({search,login,loggedLogin,chatSearch=""}){
    
    const user = (await getResponse(
            await fetch(`http://localhost:3000/api/users?login=${login}`)
        )
    ).users[0]

    if (!user) return <div id="not-found-box">
            <h1>Nie znaleziono tego użytkownika</h1>
            <Link href="/"><button>Wróć do strony głównej</button></Link>
        </div>

    const {name, lastname, birthdate, friends, requests, friendPrivacy, desc = ""} = user
    const pfp = pfpOrDefault(user.pfp)
    

    const birthDateFormatted = Object.keys(birthdate)
        .map(el => birthdate[el].toString().length>1?birthdate[el]:`0${birthdate[el]}`)
        .join(".")
    
    const loggedLoginInfo = (await getResponse(await fetch(`http://localhost:3000/api/users?login=${loggedLogin}`))).users[0]

    const limit = 6
    
    const loggedPfp = pfpOrDefault(loggedLoginInfo.pfp)
    
    const getFriendsContainer = () => {
        
        if (login!==loggedLogin && (friendPrivacy==="private"||(friendPrivacy=="friends" && !friends.includes(loggedLogin)))) return null

        const temp = loggedLogin==login
        ?database.users.filter(u => loggedLoginInfo.friends.includes(u.login))
        :database.users.filter(c => friends.filter(u => loggedLoginInfo.friends.includes(u)).includes(c.login))

        
        const friendsInfo = temp.slice(0,limit)
        .map((u,i) => {  
            return <div className="friend-div" key={i}>
                <Link href={`/${u.login}`} >
                    <img className="friend-pfp"  src={pfpOrDefault(u.pfp)}>
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
            
        
    return <> <Nav search={search} loggedLogin={loggedLogin} chatSearch={chatSearch}/>
    <div id="personal-page">
        <div id="info-header">
            <div className="info">
                <img src={`${pfp}`} id="pfp"></img>
                <div className="text">
                    <h1>{`${name} ${lastname}`}</h1>
                    <p>#{login}</p>
                    <p>Data urodzenia: {birthDateFormatted}</p>
                    {desc?<p>"{desc}"</p>:null}
                    {getFriendsContainer()}
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
    <EditForm pfp={loggedPfp} userPrivacy={loggedLoginInfo.friendPrivacy} login={loggedLoginInfo.login}></EditForm>
    </>
  
}
'use client'
import Nav from "./Nav"
import Link from "next/link"
import MiniPage from "./MiniPage"
import PageButtons from "./PageButtons"
import PageEditButton from "./PageEditButton"
import EditForm from "./EditForm"
import PersonalPage from "./PersonalPageBody"
import { getResponse, pfpOrDefault } from "@/public/consts"
import { useState, useEffect, useRef } from "react"

export default function PersonalPageHeader({search,login,loggedLogin,chatSearch=""}){
    const [user,setUser] = useState(null)
    const [loggedLoginInfo,setLoggedLoginInfo] = useState()
    const [friendContainer,setFriendContainer] = useState()
    const [chattingWith,setChattingWith] = useState("")

    useEffect(() => {
        fetch(`${window.location.origin}/api/user/${login}`).then(r => {
            getResponse(r).then(res => {
                setUser(res?.user)
            })
        })
    },[])

    useEffect(() => {
        fetch(`${window.location.origin}/api/user/${loggedLogin}`).then(r => {
            getResponse(r).then(res => {
                setLoggedLoginInfo(res?.user)
            })
        })
    },[])

    useEffect(() => {
        
        if ((!user || !loggedLoginInfo) ||(login!==loggedLogin && (friendPrivacy==="private"||(friendPrivacy=="friends" && !friends.includes(loggedLogin))))) return
        
        const fetchMutual = loggedLogin===login?"":`/${loggedLogin}`
        fetch(`${window.location.origin}/api/friend/${login}${fetchMutual}`).then(r => {
            getResponse(r).then(temp => {                
                const friendsInfo = temp.friends
                .slice(0,limit)
                .map((u,i) => {  
                    return <div className="friend-div" key={i}>
                        <Link href={`/${u.login}`} >
                            <img className="friend-pfp"  src={pfpOrDefault(u.pfp)}>
                            </img>
                        </Link>
                        <MiniPage loggedInfo={({loggedLogin,loggedFriends:loggedLoginInfo.friends,loggedRequests: loggedLogin.requests})} 
                            hoverInfo={({name:u.name,lastname:u.lastname,pfp:u.pfp,login:u.login,friends:u.friends,requests:u.requests})}
                            setChattingWith={setChattingWith}>
                        </MiniPage>
                    </div>
                    
                })

                
                const out = <><Link href={`/friends/${login}`}>
                        <p className="friend-count"><span>{friends?friends.length:"Brak"} znajomych</span>
                            {loggedLogin!=login
                            ?<><i className="fa-solid fa-circle"></i>
                            <span>{`${friends.filter(u => loggedLoginInfo.friends.includes(u)).length} Wspólnych  znajomych`}</span></>
                            :null}
                        </p>
                    </Link>
                    <div className="friend-pfps-container">{friendsInfo}</div>
                </>
                
                setFriendContainer(out)
            })
         })
    },[user,loggedLoginInfo])

    if (user===undefined) return <div id="not-found-box">
            <h1>Nie znaleziono tego użytkownika</h1>
            <Link href="/"><button>Wróć do strony głównej</button></Link>
        </div>

    if (user===null) return

    const {name, lastname, birthdate, friends, requests, friendPrivacy, desc = ""} = user
    const pfp = pfpOrDefault(user.pfp)
    

    const birthDateFormatted = Object.keys(birthdate)
        .map(el => birthdate[el].toString().length>1?birthdate[el]:`0${birthdate[el]}`)
        .join(".")

    

    if (!loggedLoginInfo) return

    const limit = 6
    
    const loggedPfp = pfpOrDefault(loggedLoginInfo.pfp) 
        
    return <> 
    <Nav search={search} loggedLogin={loggedLogin} chatSearch={chatSearch} chattingWith={chattingWith} setChattingWith={setChattingWith}/>
    <div id="personal-page-header">
        <div id="info-header">
            <div className="info">
                <img src={`${pfp}`} id="pfp"></img>
                <div className="text">
                    <h1>{`${name} ${lastname}`}</h1>
                    <p>@{login}</p>
                    <p>Data urodzenia: {birthDateFormatted}</p>
                    {desc?<p>"{desc}"</p>:null}
                    {friendContainer}
                </div>
            </div>
            
            {login==loggedLoginInfo.login
            ?<PageEditButton></PageEditButton>
            :<div className="buttons">
                <PageButtons 
                user={({friends,requests,login,image:pfpOrDefault(user.pfp),name,lastname})}
                loggedLoginInfo={({friends:loggedLoginInfo.friends,login:loggedLogin,requests:loggedLogin.requests})}
                setChattingWith={setChattingWith}>
            
                </PageButtons>
            </div>}
            
            
        </div>
    </div>
    {login===loggedLogin
        ?<EditForm pfp={loggedPfp} userPrivacy={loggedLoginInfo.friendPrivacy} login={loggedLoginInfo.login}></EditForm>
        :null
    }
    <div id="personal-page">
        <PersonalPage user={user} loggedLogin={loggedLogin}></PersonalPage>
    </div>

    </> 
}
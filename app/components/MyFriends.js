'use client'
import Link from "next/link"
import PageButtons from "./PageButtons"
import { useState, useEffect } from "react"
import { getResponse, pfpOrDefault } from "@/public/consts"
import Nav from "./Nav"
export default function MyFriends({loggedLogin,invites=false,login,activeBar, search, chatSearch}){

    const [loggedUser,setLoggedUser] = useState()
    const [friends,setFriends] = useState()
    const [chattingWith,setChattingWith] = useState()

    useEffect(() => {
        fetch(`${window.location.origin}/api/user/${loggedLogin}`).then(r => {
            getResponse(r).then(res => {
                setLoggedUser(res.user)
            })
        })
    },[])
    
    useEffect(() => {
        if (invites){
            fetch(`${window.location.origin}/api/friend-invite/${loggedLogin}`).then(r => {
                getResponse(r).then(res => {
                    setFriends(res.users)
                })
            })
        }
        else if (login){
            fetch(`${window.location.origin}/api/friend/${login}`).then(r => {
                getResponse(r).then(res => {
                    setFriends(res.friends)
                })
            })
        }
        else{
            
            fetch(`${window.location.origin}/api/peers/${loggedLogin}`).then(r => {
                getResponse(r).then(res => {
                    setFriends(res.friends.sort((a,b) => a.name.localeCompare(b.name)))
                })
            })
        }
    },[])
    
    const getFriendDivs = (friends) => {
        if (!friends || !loggedUser) return <p className="loading">Loading...</p>
        return friends.map((el,i) => {
            const pfp = pfpOrDefault(el.pfp)
            
            const logged = {friends:loggedUser.friends,login:loggedUser.login,requests:loggedUser.requests}
            const curr = {friends:el.friends,name:el.name,lastname:el.lastname,requests:el.requests,login:el.login,image:pfpOrDefault(el.pfp)}
            
            return <div className="friend-card" key={i}>
                <Link href={`/${el.login}`}>
                    <img src={pfp}></img>
                </Link>
                <div className="friend-info">
                    <h3>{el.name} {el.lastname}</h3>
                    <div className="buttons">
                        <PageButtons user={curr}
                        loggedLoginInfo={logged} req={invites}
                        setChattingWith={setChattingWith}>
                        </PageButtons>
                    </div>
                </div>
        </div>
        })
    }
    
    const friendDivs = friends?.length>0 || friends==null
        ?<div>{getFriendDivs(friends)}</div>
        :<h1 id="no-reqs">Kiedy otrzymasz zaproszenia do grona znajomych lub propozycje znajomych, zobaczysz je tutaj.</h1>
    
    return <>
    <Nav active="user-group" search={search} loggedLogin={loggedLogin} chatSearch={chatSearch} chattingWith={chattingWith} setChattingWith={setChattingWith}></Nav>
    <div id="my-friends-page">
        {!login || login===loggedLogin
            ?<div className="choice-bar">
                <h1>Znajomi</h1>
                <div className="bar-buttons">
                    {activeBar==""
                        ?<button className="active"><i className="fa-solid fa-user-group"></i><span>Strona główna</span></button>
                        :<Link href="/friends"><button><i className="fa-solid fa-user-group"></i><span>Strona główna</span></button></Link>
                    }
                    {activeBar=="list"
                        ?<button className="active"><i className="fa-solid fa-list-ul"></i><span>Wszyscy znajomi</span></button>
                        :<Link href={`/friends/list/${loggedLogin}`}><button><i className="fa-solid fa-list-ul"></i><span>Wszyscy znajomi</span></button></Link>
                    }
                    {activeBar=="requests"
                        ?<button className="active"><i className="fa-solid fa-envelope-circle-check"></i><span>Zaproszenia do grona znajomych</span></button>
                        :<Link href="/friends/requests"><button><i className="fa-solid fa-envelope-circle-check"></i><span>Zaproszenia do grona znajomych</span></button></Link>
                    }
                </div>  
            </div>
            :null
        }
        
        <div className="friends">
            <h1>{invites
                    ?"Zaproszenia do znajomych"
                    :login
                        ?"Znajomi"
                        :"Osoby, które możesz znać"
                }
            </h1>    
            {friendDivs}
    
        </div>
    </div>
    </>
}
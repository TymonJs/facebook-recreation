import database from "@/data/database.json"
import Link from "next/link"
import PageButtons from "./PageButtons"

export default function MyFriends({loggedLogin,invites=false,active}){
    const loggedUser = database.users.find(u => u.login===loggedLogin)
    
    const getFriendsFriendsInfo = (friends) => {
        const friendsLogins = friends.map(f => f.login)

        const friendsFriends = friends.reduce((acc,friend) => {
        
            const filteredList = friend.friends.reduce((acc2,f) => {
                if (loggedLogin===f || friendsLogins.includes(f) || acc.includes(f)) return [...acc2]
                return [...acc2,f]
            },[])

            return [...acc,...filteredList]
        },[])

         return database.users.filter(u=> friendsFriends.includes(u.login))
    }
    
    const friends = invites
        ?database.users.filter(u => loggedUser.requests.includes(u.login))
        :getFriendsFriendsInfo(database.users.filter(u => loggedUser.friends.includes(u.login))).sort((a,b) => a.name.localeCompare(b.name))
    
    
    const getFriendDivs = (friends) => {
        const fs = require('fs')
        return friends.map((el,i) => {
            const pfp = fs.existsSync(`public/pfps/${el.login}.png`)?`/pfps/${el.login}.png`:"/blank-pfp.png"
            
            return <div className="friend-card" key={i}>
                <Link href={`/${el.login}`}>
                    <img src={pfp}></img>
                </Link>
                <div className="friend-info">
                    <h3>{el.name} {el.lastname}</h3>
                    <div className="buttons">
                        <PageButtons user={({friends:el.friends,requests:el.requests,login:el.login})}
                        loggedLoginInfo={({friends:loggedUser.friends,login:loggedUser.login,requests:loggedUser.requests})} req={invites}>
                        </PageButtons>
                    </div>
                </div>
                        

        </div>
        })
    }

    
    const friendDivs = friends?.length>0
        ?<div>{getFriendDivs([...friends])}</div>
        :<h1 id="no-reqs">Kiedy otrzymasz zaproszenia do grona znajomych lub propozycje znajomych, zobaczysz je tutaj.</h1>

    

    return <div id="my-friends-page">
        <div className="choice-bar">
            <h1>Znajomi</h1>
            <div className="bar-buttons">
                {active==""
                    ?<button className="active"><i className="fa-solid fa-user-group"></i><span>Strona główna</span></button>
                    :<Link href="/friends"><button><i className="fa-solid fa-user-group"></i><span>Strona główna</span></button></Link>
                }

                <Link href={`${loggedLogin}/friends`}><button><i className="fa-solid fa-list-ul"></i><span>Wszyscy znajomi</span></button></Link>
                {active=="requests"
                    ?<button className="active"><i className="fa-solid fa-envelope-circle-check"></i><span>Zaproszenia do grona znajomych</span></button>
                    :<Link href="friends/requests"><button><i className="fa-solid fa-envelope-circle-check"></i><span>Zaproszenia do grona znajomych</span></button></Link>
                }
                
                <button><i className="fa-solid fa-cake-candles"></i><span>Urodziny</span></button>
            </div>
            
        </div>
        <div className="friends">
            <h1>{invites?"Zaproszenia do znajomych":"Osoby, które możesz znać"}</h1>    
            {friendDivs}
    
        </div>
    </div>
}
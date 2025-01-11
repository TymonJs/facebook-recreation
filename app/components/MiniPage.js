'use client'
import PageButtons from "./PageButtons"
import { pfpOrDefault } from "@/public/consts"

export default function MiniPage({loggedInfo,hoverInfo,setChattingWith}){
    const {name, lastname, friends, login,requests,pfp=""} = hoverInfo
    const {loggedFriends, loggedLogin,loggedRequests} = loggedInfo
    const image = pfpOrDefault(pfp)
    
    const mutualFriends = loggedFriends.filter(u => friends.includes(u))
    
    return <>
        <div className="mini-page">
            <div className="mini-body">
                <img src={image}></img>
                <div className="mini-info">
                    <h1>{`${name} ${lastname}`}</h1>
                    <p>Wspólni znajomi: {mutualFriends.length}</p>
                </div>
            </div>
            
            <div className="buttons">
                    <PageButtons user={({friends,requests,login,image,name,lastname})}
                    loggedLoginInfo={({friends:loggedFriends,requests:loggedRequests,login:loggedLogin})}
                    setChattingWith={setChattingWith}>
                    </PageButtons>
            </div>
        </div>
    </>
}
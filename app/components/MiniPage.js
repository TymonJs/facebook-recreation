import PageButtons from "./PageButtons"

export default function MiniPage({loggedInfo,hoverInfo}){
    const {name, lastname, friends, login,requests} = hoverInfo
    const fs = require("fs")
    const {loggedFriends, loggedLogin,loggedRequests} = loggedInfo
    const pfp = fs.existsSync(`public/pfps/${login}.png`)?`/pfps/${login}.png`:"/blank-pfp.png"
    
    const mutualFriends = loggedFriends.filter(u => friends.includes(u))
    
    return <>
        <div className="mini-page">
            <div className="mini-body">
                <img src={pfp}></img>
                <div className="mini-info">
                    <h1>{`${name} ${lastname}`}</h1>
                    <p>Wspólni znajomi: {mutualFriends.length}</p>
                </div>
            </div>
            
            <div className="buttons">
                    <PageButtons user={({friends,requests,login})}
                    loggedLoginInfo={({friends:loggedFriends,requests:loggedRequests,login:loggedLogin})}>
                    </PageButtons>
            </div>
        </div>
    </>
}
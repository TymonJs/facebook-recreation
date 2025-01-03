import database from "@/data/database"

export default function MiniPage({loggedInfo,hoverInfo}){
    const {name, lastname, friends, id} = hoverInfo
    const fs = require("fs")
    const {loggedFriends, loggedId} = loggedInfo
    const pfp = fs.existsSync(`public/pfps/${id}.png`)?`/pfps/${id}.png`:"/blank-pfp.png"
    
    const mutualFriends = loggedFriends.filter(u => friends.includes(u))
    
    const firstButton = friends.some(f => f==loggedId)
        ?<button>
            <i className="fa-solid fa-check"></i>
            <p>Znajomi</p>
         </button>
        :<button>
            <i className="fa-solid fa-user-group"></i>
            <p>Dodaj do znajomych</p>
         </button>

    
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
                    {firstButton}
                    <button>
                        <i className="fa-brands fa-facebook-messenger"></i>
                        <p>Wyślij wiadomość</p>
                    </button>
                </div>
        </div>
    </>
}
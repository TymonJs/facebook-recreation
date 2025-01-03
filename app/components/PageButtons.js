'use client'
export default function PageButtons({id, loggedIdInfo}){
    const unFriend = (e) => {
        console.log("usuwam ze znajomych");
        
    }
    
    const addFriend = (e) => {
        fetch("api/friend",{
            method:"POST",
            body:JSON.stringify({
                from: loggedIdInfo.id,
                to: id
            })
        })
        .then(res => console.log("nie ma err"))
        .catch(e => console.log("err"))
    }

    return <div className="buttons">
        {loggedIdInfo.friends.some(friend => friend==id)
            ?<button onClick={unFriend}><i className="fa-solid fa-check"></i><span> Znajomi</span></button>
            :<button onClick={addFriend}><i className="fa-solid fa-user-group"></i> Dodaj do znajomych</button>}
        <button><i className="fa-brands fa-facebook-messenger"></i> Wyślij wiadomość</button>
    
    </div>
}
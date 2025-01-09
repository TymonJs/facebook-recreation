'use client'

import { useState} from "react";

export default function PageButtons({user, loggedLoginInfo,req=false,setChattingWith}){
    const {login,requests} = user
    
    const friendsButton = () => <button onClick={unFriend}><i className="fa-solid fa-check"></i><span> Znajomi</span></button>
    const invSentButton = () => <button onClick={updateFriend}><i className="fa-solid fa-paper-plane"></i><span> Zaproszenie Wysłane</span></button>
    const addFriendButton = () => <button onClick={addFriend}><i className="fa-solid fa-check"></i><span> Dodaj do znajomych</span></button>
    
    const getInviteButton = () => {
        if (loggedLoginInfo.friends.some(friend => friend==login)) return friendsButton()
        else{   
            if (requests.includes(loggedLoginInfo.login)) return invSentButton()
            else return addFriendButton()
        }
    }

    const unFriend = (e) => {
        fetch(`/api/friend-invite/${loggedLoginInfo.login}/${login}`,{
            method:"DELETE"
        })
        .then(res => {
            if (res.ok && res.status==200 && !req){
                setInviteButton(addFriendButton())
            }
        })
        .catch(e => console.log("unFriend error: ",e.message))
    }
    
    const addFriend = (e) => {
        fetch(`/api/friend-invite/${loggedLoginInfo.login}/${login}`,{
            method:"POST"
        })
        .then(res => {
            if (res.ok && !req){
                if (res.status==201){
                    setInviteButton(friendsButton())
                }
                else if (res.status == 202){
                    setInviteButton(invSentButton())
                }
            } else{
                new Response(res.body).json().then(r => console.log(r))
            }
        })
        .catch(e => console.log("addFriend error: ",e.message))
    }

    const updateFriend = () => {
        fetch(`/api/friend-invite/${loggedLoginInfo.login}/${login}`,{
            method: "PATCH"
        })
        .then(res => {
            if (res.ok && res.status==200 && !req) setInviteButton(addFriendButton())
        })
        .catch(err => console.log("updateFriend error:",err))
    }

    
    const [inviteButton,setInviteButton] = useState(getInviteButton())
   
    const startChat = () => {
        fetch(`${window.location.origin}/api/chat/${loggedLoginInfo.login}/${login}`,{method: "POST"}).then(r =>{
            console.log(setChattingWith);
            
            setChattingWith(user)

            
        })     
    }
    
    return <>
        {inviteButton}
        <button onClick={startChat}><i className="fa-brands fa-facebook-messenger" ></i> Rozpocznij czat</button>
    
    </>
}
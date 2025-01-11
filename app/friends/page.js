import Nav from "../components/Nav"
import { headers } from "next/headers"
import MyFriends from "../components/MyFriends"

export default async function loggedFriends({searchParams}){
    const temp = await searchParams
    const {search = "", chat = ""} = temp
    const head = await headers()
    const loggedLogin = head.get("loggedLogin")
    
    return (<>
        <MyFriends loggedLogin={loggedLogin} activeBar={""} active="user-group" search={search} chatSearch={chat}></MyFriends>
        </>)
}
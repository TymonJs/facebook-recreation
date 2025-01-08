import Nav from "@/app/components/Nav"
import { headers } from "next/headers"
import MyFriends from "@/app/components/MyFriends"

export default async function Requests({searchParams}){
    const temp = await searchParams
    const {search = "", chat = ""} = temp
    const head = await headers()
    const loggedLogin = head.get("loggedLogin")
    
    //dobra opcja na lazy loading
    return (<>
        <Nav active="user-group" search={search} loggedLogin={loggedLogin} chatSearch={chat}/>
        <MyFriends loggedLogin={loggedLogin} invites={true} active="requests"></MyFriends>
    </>)
}
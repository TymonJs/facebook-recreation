import Nav from "@/app/components/Nav"
import { headers } from "next/headers"
import MyFriends from "@/app/components/MyFriends"

export default async function Requests({searchParams}){
    const temp = await searchParams
    const {search = "", chat = ""} = temp
    const head = await headers()
    const loggedLogin = head.get("loggedLogin")
    
    return (<>
        <MyFriends loggedLogin={loggedLogin} invites={true} activeBar="requests" search={search} chatSearch={chat}></MyFriends>
    </>)
}
import MyFriends from "@/app/components/MyFriends"
import { headers } from "next/headers"

export default async function List({params,searchParams}){
    const temp = await searchParams
    const {search = "", chat = ""} = temp
    const {login} = await params
    const head = await headers()
    const loggedLogin = head.get("loggedLogin")
    return <>
        <MyFriends loggedLogin={loggedLogin} login={login} activeBar="list" search={search} chatSearch={chat}></MyFriends>
    </>
}
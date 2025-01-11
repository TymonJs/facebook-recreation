import {headers} from "next/headers"
import PersonalPageHeader from "../../components/PersonalPage"
// import Friends from "@/app/components/Friends"

export default async function FriendsPage({params,searchParams}){
    const {search = ""} = await searchParams
    const {login} = await params
    const head = await headers()
    const loggedLogin = head.get("loggedLogin")
    
    return <>
    <PersonalPageHeader search={search} login={decodeURIComponent(login)} loggedLogin={loggedLogin} chatSearch={chat}></PersonalPageHeader>
    {/* <Friends></Friends> */}
    </>
}
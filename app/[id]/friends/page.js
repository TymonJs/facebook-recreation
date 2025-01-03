import {headers} from "next/headers"
import PersonalPageHeader from "../../components/PersonalPageHeader"
import Friends from "@/app/components/Friends"

export default async function FriendsPage({params,searchParams}){
    const {search = ""} = await searchParams
    const {id} = await params
    const head = await headers()
    const loggedId = head.get("loggedId")

    return <>
    <PersonalPageHeader search={search} id={id} loggedId={loggedId}></PersonalPageHeader>
    <Friends></Friends>
    </>
}
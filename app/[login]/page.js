import Nav from "../components/Nav"
import database from "@/data/database.json"
import PersonalPage from "../components/PersonalPage"
import {headers} from "next/headers"
import PersonalPageHeader from "../components/PersonalPageHeader"

export default async function User({params,searchParams}){
  const {search = "", chat = ""} = await searchParams
  const {login} = await params
  const head = await headers()
  
  const loggedLogin = head.get("loggedLogin")
  return <>
    <PersonalPageHeader search={search} login={decodeURIComponent(login)} loggedLogin={loggedLogin} chatSearch={chat}></PersonalPageHeader>
    <PersonalPage></PersonalPage>
  </>
}
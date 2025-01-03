import Nav from "../components/Nav"
import database from "@/data/database.json"
import PersonalPage from "../components/PersonalPage"
import {headers} from "next/headers"
import PersonalPageHeader from "../components/PersonalPageHeader"

export default async function User({params,searchParams}){
  const {search = ""} = await searchParams
  const {id} = await params
  const head = await headers()
  
  const loggedId = head.get("loggedId")

  return <>
    <PersonalPageHeader search={search} id={id} loggedId={loggedId}></PersonalPageHeader>
    <PersonalPage></PersonalPage>
  </>
}
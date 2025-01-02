import Nav from "../components/Nav"
import database from "@/data/database.json"
import PersonalPage from "../components/PersonalPage"
import {headers} from "next/headers"

export default async function User({params,searchParams}){

  const {search = ""} = await searchParams
  const {id} = await params
  const head = await headers()
  
  const loggedId = head.get("loggedId")

  const user = database.users.find(u => u.id==id)
  
  let userPublicData;
  if (user){
    const fs = require("fs")
    const pfp = fs.existsSync(`public/${id}.png`)?`${id}.png`:"blank-pfp.png"
    userPublicData = {
      name: user.name,
      lastname: user.lastname,
      birthdate: user.birthdate,
      id: user.id,
      pfp
    }
  }
  
  
  return (<>
    <Nav search={search} />
    <PersonalPage data={userPublicData}/>
    </>)
}
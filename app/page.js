import Nav from "./components/Nav"
import { headers } from "next/headers"
import Post from "./components/Post"
import { getResponse } from "@/public/consts"
import Home from "./components/Home"
import "./globals.css";

export default async function Homepage({searchParams}){
  const temp = await searchParams
  const {search = "", chat=""} = temp
  const head = await headers()
  const loggedLogin = head.get("loggedLogin")
  const users = (await getResponse(await fetch(`http://localhost:3000/api/user`))).users
  
  return <>
    <Nav active="house" search={search} chatSearch={chat} loggedLogin={loggedLogin}/>
    <Home loggedLogin={loggedLogin} users={users}></Home>
  </>
}
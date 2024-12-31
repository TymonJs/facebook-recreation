import Nav from "./components/Nav"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export default async function Home({searchParams}){
  const temp = await searchParams
  const {search = ""} = temp
  
  return (<div id="home">
    <Nav search={search}/>
    <div>
      <h1>Socket.io</h1>
    </div>

    </div>)
}
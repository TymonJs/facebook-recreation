import Nav from "./components/Nav"
import { headers } from "next/headers"


export default async function Home({searchParams}){
  const temp = await searchParams
  const {search = ""} = temp
  const head = await headers()
  const loggedLogin = head.get("loggedLogin")
  
  return (<div id="home">
    <Nav active="house" search={search} loggedLogin={loggedLogin}/>
    <div>
      <h1>Socket.io</h1>
    </div>

    </div>)
}
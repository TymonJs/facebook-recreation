import Nav from "./components/Nav"
import { headers } from "next/headers"

export default async function Home({searchParams}){
  const temp = await searchParams
  const {search = ""} = temp
  const head = await headers()
  const loggedId = head.get("loggedId")
  
  return (<div id="home">
    <Nav active="house" search={search} loggedId={loggedId}/>
    <div>
      <h1>Socket.io</h1>
    </div>

    </div>)
}
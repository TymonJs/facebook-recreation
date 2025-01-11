import Nav from "../components/Nav"
import database from "@/data/database.json"
import PersonalPage from "../components/PersonalPageBody"
import {headers} from "next/headers"

export default async function RootLayout({children}){
    
    return <>{children}</>
}
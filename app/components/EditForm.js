'use client'
import Link from "next/link"

export default function EditForm({pfp}){
    const handleClick = () => {
        document.querySelector("nav").classList.remove("disabled")
        document.getElementById("personal-page").classList.remove("disabled")
        document.getElementById("edit-form").classList.remove("enabled")
    }
    return <div id="edit-form">
        <div id="title">
            <p></p>
            <h1>Edytuj profil</h1>
            <i className="fa-solid fa-x" onClick={handleClick}></i>
        </div>

        <div className="edits">
            <div className="head">
                <h2>Opis profilu</h2>
                <p>Edytuj</p>
            </div>
            <div className="body">
                <img src={pfp} id="pfp"></img>
            </div>
        </div>
        
    </div>
}
'use client'
export default function PageEditButton(){ 
    const handleClick = () => {
        const page = document.getElementById("personal-page")
        page.classList.add("disabled")
        const nav = document.querySelector("nav")
        nav.classList.add("disabled")
        const form = document.getElementById("edit-form")
        form.classList.add("enabled")    
    }
    return <div className="buttons">
        
        <button onClick={handleClick}><i className="fa-solid fa-pen"></i> Edytuj profil</button>
        
    </div>
}
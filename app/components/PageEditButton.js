'use client'
export default function PageEditButton(){ 
    const handleClick = () => {
        document.getElementById("personal-page").classList.add("disabled")
        document.querySelector("nav").classList.add("disabled")
        document.getElementById("edit-form").classList.add("enabled")    
        document.getElementById("wrapper").classList.add("enabled")    
    }
    return <div className="buttons">
        
        <button onClick={handleClick}><i className="fa-solid fa-pen"></i> Edytuj profil</button>
        
    </div>
}
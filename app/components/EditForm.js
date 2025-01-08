'use client'
import { useRef, useState } from "react"

export default function EditForm({pfp,userPrivacy,login}){
    const wrapper = useRef()
    const editForm = useRef()
    const form = useRef()
    const desc = useRef()
    
    const acceptedFileTypes = ["image/png", "image/jpg", "image/jpeg"]

    const [privacy,setPrivacy] = useState(userPrivacy)
    const [imageWarning,setImageWarning] = useState()
    const [chosenPfp,setChosenPfp] = useState(pfp)

    const handleClick = (e) => {
        const id = e.target.id
        const x = e.target.className
        
        if (id !== "body" && id !== "wrapper" && !x?.includes("fa-x")) return
        
        document.querySelector("nav").classList.remove("disabled")
        document.getElementById("personal-page").classList.remove("disabled")
        editForm.current.classList.remove("enabled")
        wrapper.current.classList.remove("enabled")
        form.current.reset()
        setPrivacy(userPrivacy)
        setImageWarning()
        setChosenPfp(pfp)
    }

    const handlePrivacy = (e,value) => {
        setPrivacy(value)   
    }

    const handlePfpChange = (event) => {
        const cfile = event.target.files[0]

            if (cfile) {
                
                if (acceptedFileTypes.includes(cfile.type)) {
                    const reader = new FileReader()
        
                    reader.onload = (e) => {
                        setImageWarning()
                        setChosenPfp(e.target.result)
                    };

                    reader.readAsDataURL(cfile)
                } else {
                    setImageWarning('Wybierz obraz .png/.jpg/.jpeg')
                }
            }
            
        
    }

    const getButtons = (active="public") => [["public","Publiczne","fa-earth-americas"],["friends","Tylko znajomi","fa-user-group"],["private","Prywatne","fa-lock"]]
        .map((el,i) => {
            return <button type="button" key={i} onClick={(e) => handlePrivacy(e,el[0])} className={active===el[0]?"active":""}>
                <i className={`fa-solid ${el[2]}`}></i> {el[1]}
            </button>
    })
    
    const buttons = getButtons(privacy?privacy:"public")

    const handleSubmit = () => {
        const descSend = desc.current.value?desc.current.value:null
        const pfpSend = chosenPfp&&chosenPfp!="/blank-pfp.png"&&!chosenPfp.startsWith("/pfps/")?chosenPfp:null
        const privacySend = privacy!==userPrivacy?privacy:null

        if ((descSend || pfpSend || privacySend)){
            fetch("/api/profile",{
                method: "PATCH",
                body: JSON.stringify({
                    login,
                    desc: descSend,
                    pfp: pfpSend,
                    privacy: privacySend
                })
            }).then(res => window.location.reload())
        }
        else{
            window.location.reload()
        }
        
    }

    
    return <div id="wrapper" ref={wrapper} onClick={handleClick}>
        <div id="edit-form" ref={editForm}>
            <div id="title">
                <h1>Edytuj profil</h1>
                <i className="fa-solid fa-x" onClick={handleClick}></i>
            </div>
            <form className="edits" ref={form}>
                
                <div className="edit">
                    <div className="head">
                        <h2>Zdjęcie profilowe</h2>
                        <input type="file" id="file" onChange={handlePfpChange} accept={acceptedFileTypes.join(", ")}></input>
                        <div className="edit-reset">
                            <label htmlFor="file">Edytuj</label>
                        </div>
                    </div>
                    {imageWarning?<p className="warning">{imageWarning}</p>:null}
                    <div className="body body-center">
                        <label htmlFor="file"><img src={chosenPfp} id="pfp"></img></label>
                    </div>
                </div>
                <div className="edit">
                    <div className="head">
                        <h2>Opis profilu</h2>
                    </div>
                    <div className="body">
                        <input ref={desc} placeholder="Napisz coś o sobie..."></input>
                    </div>
                </div>
                <div className="edit">
                    <div className="head">
                        <h2>Prywatność listy znajomych</h2>
                        
                    </div>
                    <div className="body body-space-around">
                        
                        {buttons}
                    </div>
                </div>
            </form>
                <div className="btn">
                    <button className="submit" onClick={handleSubmit}>Zatwierdź zmiany</button>
                </div>
            

            
        </div>
    </div>
    
}
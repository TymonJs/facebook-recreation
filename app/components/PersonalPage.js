import Post from "./Post"
import Link from "next/link"
export default function PersonalPage({data = null}){
    if (!data) return <div id="not-found-box">
        <h1>Nie znaleziono tego użytkownika</h1>
        <Link href="/"><button>Wróć do strony głównej</button></Link>
    </div>

    const {name, lastname, birthdate, id} = data
    const birthDateFormatted = Object.keys(birthdate)
        .map(el => birthdate[el].toString().length>1?birthdate[el]:`0${birthdate[el]}`)
        .join(".")
    
    
    return <div id="personal-page">
        <div id="info-header">
            <div className="info">
                <img src={`${data.pfp}`} id="pfp"></img>
                <div className="text">
                    <h1>{`${name} ${lastname}`}</h1>
                    <p>Data urodzenia: {birthDateFormatted}</p>
                </div>
            </div>
            <div className="buttons">
                <button>Dodaj do znajomych</button>
                <button>Wyślij wiadomość</button>
            </div>
            
        </div>
    </div>
}
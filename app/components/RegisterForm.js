'use client'

import { useEffect, useState, useRef} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiLogin } from "./LoginForm"

export default function Form(){
    const {replace} = useRouter()

    const [gender,setGender] = useState("kobieta")

    const months = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"]
    const years = []
    const currYear = new Date().getFullYear()
    for (let i=currYear;i>=currYear-120;i--){
        years.push(<option key={i}>{i}</option>)
    }

    const [warning,setWarning] = useState()

    const isDateValid = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && 
               date.getMonth() === month - 1 && 
               date.getDate() === day &&
               date<=new Date();
    };

    const handleClick = () => {

        const name = document.getElementById("name")
        const lastname = document.getElementById("lastname")
        const login = document.getElementById("login-input")
        const password = document.getElementById("password-input")

        const birthdate = Array.from(document.querySelectorAll("select")).map(el => isNaN(el.value)? el.value: parseInt(el.value))
        birthdate[1] = months.indexOf(birthdate[1]) + 1
        
        
        const data = [name,lastname,login,password]

        const daySelect = document.querySelector("select")
        const birthdateValid = isDateValid(...birthdate)

        let valid = true
        // const isEmailAlreadyUsed = users.some(user => user.email===email.value)
        
        if (!birthdateValid){
            if (!daySelect.classList.contains("wrong-data")) daySelect.classList.add("wrong-data")
            valid = false
        }
        else{
            if (daySelect.classList.contains("wrong-data")) daySelect.classList.remove("wrong-data")
        }


        if (login.value.includes("|")){
            if (!login.classList.contains("wrong-data")) login.classList.add("wrong-data")
        }
        else{
            if (login.classList.contains("wrong-data")) login.classList.remove("wrong-data")
        }

        data.forEach(el => {
        
            if (!el.value){
                if (!el.classList.contains("wrong-data")) el.classList.add("wrong-data")
                valid = false
            }
            else{
                if (el.classList.contains("wrong-data")) el.classList.remove("wrong-data")
            }
        })

        if (!valid){
            setWarning("Invalid data")
            return
        }

        if (warning) setWarning()

        data.forEach(el => {
            if (el.classList.contains("wrong-data")) el.classList.remove("wrong-data")
        })
        if (daySelect.classList.contains("wrong-data")) daySelect.classList.remove("wrong-data")

        const json = {
            name: name.value,
            lastname: lastname.value,
            gender,
            birthdate: {
                day: birthdate[0],
                month: birthdate[1],
                year: birthdate[2]
            },
            login: login.value,
            password: password.value
        }
        const response = fetch("api/user",{
            method:"POST",
            body:JSON.stringify(json)
        })
        .then(res => {
            if (!res.ok) setWarning(res.msg)
            else{
                new Response(res.body).json()
                .then(res => {
                    apiLogin(login.value,password.value)
                    .then(token => {
                        const date = new Date()
                        date.setDate(date.getDate() + 1)
                        document.cookie = `token=${token};expire=${date}`
                        replace("/")
                    })
                    .catch(err => {
                        console.log(err);
                        replace("/login")
                    })
                    
                    
                })
            }
        })
        

        
          
        
    }

    return <div id="form">
            <div className="header">
                <h2>Utwórz nowe konto</h2>
                <p>To szybkie i proste.</p>
            </div>
            <></>
            <div className="body">
                {warning?<p id="warning">{warning}</p>:null}
                <div className="info-input">
                    <input id="name" placeholder="Imię"></input>
                    <input id="lastname" placeholder="Nazwisko"></input>
                </div>
                <legend>Data urodzenia</legend>
                <div className="info-input">
                    <select>
                        {[...Array(31).keys()].map(el => <option key={el+1}>{el+1}</option>)}
                    </select>
                    <select>
                        {months.map((el,i) =><option key={i}>{el}</option>)}
                    </select>
                    <select>
                        {years}
                    </select>
                </div>
                <legend>Płeć</legend>
                <div className="info-input">
                    <label htmlFor="ko">
                        Kobieta
                        <input type="radio" id="ko" value="Kobieta" name="name" defaultChecked onClick={() => {setGender("kobieta")}}></input>    
                    </label>
                    <label htmlFor="me">
                        Mężczyzna
                        <input type="radio" id="me" value="Mężczyzna" name="name" onClick={() => {setGender("mężczyzna")}}></input>
                    </label>
                </div>
                <input id="login-input" placeholder="Login"></input>
                <input type="password" id="password-input" placeholder="Hasło"></input>
                <button onClick={handleClick}>Zarejestruj się</button>
                <Link href="/login">Masz już konto?</Link>
            </div>
            
        </div>  
}
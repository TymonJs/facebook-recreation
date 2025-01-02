'use client'
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function SearchBar({peopleFound = null}){
    const searchParams = useSearchParams()
    const urlPath = usePathname()
    const {replace} = useRouter()


    const handleClick = (name,id) => {
        const lastSearched = localStorage.getItem("lastSearched")
        const obj = `${name}|${id}`
        if (!lastSearched) localStorage.setItem("lastSearched",obj)
        else{
            const arr = lastSearched.split(",")
            const i = arr.map(el => el.split("|")[0]).indexOf(name)
            
            if (i > -1) arr.splice(i,1)
            
      
            arr.push(obj)
            localStorage.setItem("lastSearched",arr.slice(arr.length>8?1:0,9))

        }
        
    }
    const lastOrCurrSearch = (peopleFound) => {
        const lastSearched = localStorage.getItem("lastSearched")
        const res = (peopleFound || (!lastSearched))?
            peopleToDivs(peopleFound):

            peopleToDivs(lastSearched
            .split(',')
            .map(u => {
                const parts = u.split("|")
                return ({name: parts[0], id: parts[1],pfp:`${parts[1]}.png`})
            })
            .reduce((acc,c) => [c,...acc],[])
            ,true
        )
        setPeopleDivs(res)
        return res
    }


    const peopleToDivs = (peopleFound,lastSearched=false) => {
        
        return peopleFound?.length>0?
            <div id="peopleFound">
                <h3>{lastSearched?"Ostatnie wyszukiwania":"Wyniki wyszukiwania"}</h3>
                {peopleFound.map((person,key) => {

                const img = lastSearched
                    ?<i className="fa-solid fa-magnifying-glass"></i>
                    :<img className="pfp-mini" src={person.pfp} onError={(e) => e.target.src = "blank-pfp.png"}></img>

                return <Link key={key} href={`/${person.id}`} onClick={() => handleClick(person.name,person.id)}>
                    <div>
                        {img}{person.name}
                    </div>
                </Link>
    })}
            </div>:null
    }
    const divs = peopleToDivs(peopleFound)

    const [peopleDivs,setPeopleDivs] = useState(divs)
    useEffect(() => {
        document.getElementById("searchUserInput") === document.activeElement?lastOrCurrSearch(peopleFound):setPeopleDivs(null)
    },[peopleFound])
    
    
    const handleInput = (searchTerm) => {
        const params = new URLSearchParams(searchParams)
        if (searchTerm) params.set("search",searchTerm)
        else params.delete("search")
        replace(`${urlPath}?${params.toString()}`)
    }

    const handleFocus = (divs) => {        
        lastOrCurrSearch(peopleFound)
        
    }

    const handleBlur = () => {
        setTimeout(() => {
            setPeopleDivs(null)
        }, 100);
    }
    
    return <>
        <input type="text" 
            onInput={(e) => handleInput(e.target.value,peopleFound)}
            placeholder="Szukaj na Facebooku"
            onFocus={() => handleFocus(divs)}
            onBlur={() => handleBlur()}
            // defaultValue={searchParams.get("search")?.toString()}
            id="searchUserInput"
            autoComplete="off"
            >
        </input> 
        {peopleDivs}
        
    </>
    
}
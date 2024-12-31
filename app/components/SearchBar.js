'use client'
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchBar({peopleFound = null}){
    const searchParams = useSearchParams()
    const urlPath = usePathname()
    const {replace} = useRouter()

    const peopleToDivs = (peopleFound) => {
        return peopleFound?.length>0?<div id="peopleFound">
                {peopleFound.map((person,key) => <div key={key}>{`${person.name} ${person.lastname}`}</div>)}
            </div>:null
    }
    const divs = peopleToDivs(peopleFound)

    const [peopleDivs,setPeopleDivs] = useState(divs)
    useEffect(() => {
        setPeopleDivs(peopleToDivs(peopleFound))
    },[peopleFound])
    
    
    const handleInput = (searchTerm) => {
        const params = new URLSearchParams(searchParams)
        if (searchTerm) params.set("search",searchTerm)
        else params.delete("search")
        replace(`${urlPath}?${params.toString()}`)
    }

    const handleFocus = (divs) => {
        peopleDivs?setPeopleDivs(null):setPeopleDivs(divs)
        
    }

    const handleBlur = () => {
        setPeopleDivs(null)
    }
    
    
    return <>
        <input type="text" 
            onInput={(e) => handleInput(e.target.value,peopleFound)}
            placeholder="Szukaj na Facebooku"
            onFocus={() => handleFocus(divs)}
            onBlur={() => handleBlur()}
            defaultValue={searchParams.get("search")?.toString()}>
        </input> 
        {peopleDivs}
        
    </>
    
}
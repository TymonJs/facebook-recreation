'use client'
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import {getResponse, pfpOrDefault} from "@/public/consts"
import debounce from "lodash/debounce"

export default function SearchBar({search="", loggedLogin}){
    const searchParams = useSearchParams()
    const urlPath = usePathname()
    const {replace} = useRouter()

    const input = useRef()
    const [peopleFound,setPeopleFound] = useState(null)

    useEffect(() => {
        if (search) {
            fetch(`http://localhost:3000/api/user?search=${search}`,{
                method: "GET"
            })
            .then(res => {
                if (res.ok) getResponse(res).then(ppl => {
                    setPeopleFound(ppl.users
                        .filter(u => u.login!=loggedLogin)
                        .slice(0,8)
                        .map(u => {
                            const pfp = pfpOrDefault(u.pfp)
                            return ({name:`${u.name} ${u.lastname}`, login:u.login, pfp})
                        })
                    )
                })
            })
        }
        else setPeopleFound(null)

     },[search])
    

    const setStorage = (name,login) => {
        const lastSearched = localStorage.getItem("lastSearched")
        const obj = `${name}|${login}`
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
        const res = (peopleFound || (!lastSearched))
            ?peopleToDivs(peopleFound)
            :peopleToDivs(lastSearched
                .split(',')
                .map(u => {
                    const parts = u.split("|")
                    return ({name: parts[0], login: parts[1],pfp:`/pfps/${parts[1]}.png`})
                })
                .reduce((acc,c) => [c,...acc],[])
                ,true)

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
                        :<img className="pfp-mini" src={person.pfp} alt="pfp" onError={(e) => e.target.src = "/blank-pfp.png"}></img>
                    
                    return <Link key={key} href={`/${person.login}`} onClick={() => setStorage(person.name,person.login)}>
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
        input.current === document.activeElement?lastOrCurrSearch(peopleFound):setPeopleDivs(null)
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
            setPeopleDivs([])
        }, 100);
    }
    
    const debouncedHandler = useCallback(
        debounce((val) => handleInput(val),150),[]
    )
    return <>
        <input type="text" 
            onInput={(e) => debouncedHandler(e.target.value)}
            placeholder="Szukaj na Facebooku"
            onFocus={() => handleFocus(divs)}
            onBlur={() => handleBlur()}
            id="searchUserInput"
            defaultValue={search}
            ref={input}
            autoComplete="off"
            >
        </input> 
        {peopleDivs}
        
    </>
    
}
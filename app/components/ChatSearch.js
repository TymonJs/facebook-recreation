'use client'
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import {getResponse, pfpOrDefault} from "@/public/consts"
import debounce from "lodash/debounce"

export default function ChatSearch({chatSearch = "",loggedLogin}){

    const searchParams = useSearchParams()
    const urlPath = usePathname()
    const {replace} = useRouter()

    const handleInput = (searchTerm) => {
        const params = new URLSearchParams(searchParams)
        if (searchTerm) params.set("chat",searchTerm)
        else params.delete("chat")
        replace(`${urlPath}?${params.toString()}`)
    }
    const debouncedHandler = useCallback(
        debounce((val) => handleInput(val),150),[]
    )
    return <input placeholder="Szukaj" defaultValue={chatSearch} onInput={(e) => debouncedHandler(e.target.value)}/>
}
import { NextResponse } from 'next/server'
import { cookies } from "next/headers"
   
export async function middleware(req) {
    
    
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    const { pathname } = req.nextUrl;
    
    // GDY USER SAM SIE WYLOGUJE TO USUŃ TOKEN 
    if ((pathname==="/register" || pathname==="/login")){
        if (!token) return NextResponse.next()
            
        
        try{
            req.nextUrl.pathname = "/"
            const tokens = await import('@/data/tokens.json');
            if (tokens.tokens.some(el => el===token.value)) return NextResponse.redirect(new URL(req.nextUrl.href))
            else return NextResponse.next()
        }
        catch(e){
            console.log(e);
            return NextResponse.redirect(new URL(req.nextUrl.href))
            
        }

        
    }

    // tutaj sprawdzić wszystkie endpointy
    if (pathname==="/"){
        
        if (!token) return NextResponse.redirect(new URL("/login",req.url))
        
        try{
            const tokens = await import('@/data/tokens.json');
        
            if (tokens.tokens.some(el => el===token.value)) return NextResponse.next()
            else return NextResponse.redirect(new URL("/login",req.url))
        }
        catch(e){
            console.log(e);
            return NextResponse.redirect(new URL("/login",req.url))
            
        }
        
    }
    
    return NextResponse.next()
}
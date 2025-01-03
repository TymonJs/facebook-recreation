import { NextResponse } from 'next/server'
import tokens from '@/data/tokens.json'

export async function middleware(req) {
    
    const { pathname } = req.nextUrl;
    const cookieStore = req.cookies
    const token = cookieStore.get("token")

    
    if ((pathname==="/register" || pathname==="/login")){
        
        
        if (!token) return NextResponse.next()
            
        
        try{
            req.nextUrl.pathname = "/"
            if (tokens.tokens.some(el => el.token===token.value)) return NextResponse.redirect(new URL(req.nextUrl.href))
            else return NextResponse.next()
        }
        catch(e){
            console.log("error");
            
            return NextResponse.redirect(new URL(req.nextUrl.href))
            
        }

        
    }

    else{   
        
        if (!token) return NextResponse.redirect(new URL("/login",req.url))
 
        try{
            
            if (!tokens) return NextResponse.redirect(new URL("/login",req.url))
            
            const found = tokens.tokens.find(el => el.token==token.value)
            
            if (found){
   
                const newHeaders = new Headers(req.headers)

                newHeaders.set("loggedId",found.id)
                return NextResponse.next({
                    request: {
                        headers: newHeaders
                    }
                })
            }
            else{
                // console.log("wtf");
                // console.log(token);
                
                // console.log(tokens.tokens.find(e => e.id==22), token);
                
                
                return NextResponse.redirect(new URL(req.url))
            }
        }
        catch(e){
            console.log(e);
            
            return NextResponse.redirect(new URL("/login",req.url))
            
        }
        
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\.png|.*\.json|.*\\.).*)']
  }
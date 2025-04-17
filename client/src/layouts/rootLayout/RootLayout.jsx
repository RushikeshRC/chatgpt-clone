import { Link, Outlet } from 'react-router-dom'
import './rootLayout.css'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const RootLayout = () =>{
    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <div className='rootLayout'>
            <header>
                <Link to="/" className='logo'>
                    <img src='/logo.png' alt='' />
                    <span>AI</span>
                </Link>
                <div className='user'>             
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <main>
                <Outlet/>   {/* its a raect router dom component where every other comp is inside it means its a Root comp in main .jsx*/}
            </main>
        </div>
        </ClerkProvider>
    )
}

export default RootLayout
import './rootLayout.scss'
import { Link, Outlet } from 'react-router-dom'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


console.log('import.meta.env', import.meta.env);
// import env variable
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
console.log('PUBLISHABLE_KEY', PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const queryClient = new QueryClient()

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className='rootLayout'>
          <header>
            <Link to="/" className='logo'>
              <img src="/logo.png" alt="" />
              <span>LAMA AI</span>
            </Link>
            <div className='user'>
              {/* <SignedOut>
                <SignInButton />
              </SignedOut> */}
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main>
            <Outlet/>
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout

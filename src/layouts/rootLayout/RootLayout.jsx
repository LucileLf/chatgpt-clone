import './rootLayout.scss'
import { Link, Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className='rootLayout'>
      <header>
        <Link to="/" className='logo'>
          <img src="/logo.png" alt="" />
          <span>LAMA AI</span>
        </Link>
        <Link to="/dashboard" className='user'>
          <span>User</span>
          {/* <div className="user">User</div> */}
        </Link>
      </header>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}

export default RootLayout

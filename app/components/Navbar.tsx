import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Link to="/">
            <p className='text-2xl font-bold text-gradient'>RESUMIND</p>
        </Link>
        <div className="flex gap-2">
          <Link to="/hr-review" className='secondary-button w-fit'>
              <p>HR Quick Review</p>
          </Link>
          <Link to="upload" className='primary-button w-fit'>
              <p>Upload Resume</p>
          </Link>
        </div>
    </nav>
  )
}

export default Navbar
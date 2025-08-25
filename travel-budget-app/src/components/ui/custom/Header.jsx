import React from 'react'
import { Button } from '../button'

function Header() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img className='w-15 h-15' src="/logo.svg"/>
      {/* <h2>TravelMate</h2> */}
      <div>
        <Button>Sign In</Button>
      </div>
    </div>
  )
}

export default Header
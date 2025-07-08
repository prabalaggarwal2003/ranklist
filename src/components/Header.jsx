import React from 'react'

function Header() {
  return (
    <div className='flex flex-row justify-between'>
        <div className='w-28 ml-8 mt-4'>
            <img src="/bpitlogo.png" alt="bpitlogo"/>
        </div>
        <div>
            <h2 className='text-3xl mr-8 mt-8'>
                Student Leaderboard
            </h2>
        </div>
    </div>
  )
}

export default Header
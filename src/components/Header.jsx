import React from 'react'

function Header() {
  return (
    <div className='flex flex-row justify-between rounded-2xl border border-white/10 bg-white/10
    shadow-lg backdrop-filter backdrop-blur-md m-8'>
        <div className='w-28 ml-8 '>
            <img src="/bpit.png" alt="bpitlogo"/>
        </div>
        <div>
            <h2 className='text-2xl mr-8 mt-3.5 text-white'>
                Student Leaderboard
            </h2>
        </div>
    </div>
  )
}

export default Header
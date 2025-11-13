// import React from 'react'
// import {Link} from 'react-router-dom'

// function Header() {
//   return (
//     <div className='flex flex-row justify-between rounded-2xl border border-white/10 bg-white/10
//     shadow-lg backdrop-filter backdrop-blur-md m-8'>
//         <div className='w-28 ml-8 '>
//             <img src="/bpit.png" alt="bpitlogo"/>
//         </div>
//         <div>
//             <h2 className='text-2xl ml-13 ml-8 mt-3.5 mb-3.5 text-white'>
//             <Link to='/'>Student Leaderboard</Link> 
//             </h2>
//         </div>
//     </div>
//   )
// }

// export default Header
import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <div
      className='flex flex-row items-center justify-between 
      rounded-2xl border border-white/10 bg-white/10 shadow-lg 
      backdrop-filter backdrop-blur-md m-4 sm:m-8 p-3 sm:p-0'
    >
      {/* Logo Section */}
      <div className='w-20 sm:w-28 sm:ml-8 flex justify-center sm:justify-start'>
        <img
          src="/bpit.png"
          alt="bpitlogo"
          className='max-w-full h-auto'
        />
      </div>

      {/* Title Section */}
      <div className='text-center sm:text-left'>
        <h2
          className='text-xl sm:text-2xl text-white mt-1 sm:mt-3.5 mb-2 sm:mb-3.5 
          hover:text-blue-200 transition-colors duration-200'
        >
          <Link to='/'>Student Leaderboard</Link>
        </h2>
      </div>
    </div>
  )
}

export default Header




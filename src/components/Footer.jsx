// import React from 'react'

// function Footer() {
//   return (
//     <div className='flex flex-row justify-center rounded-xl border border-white/10 bg-white/10
//     shadow-lg backdrop-filter backdrop-blur-md m-8 h-12'>
//         <div>
//             <h2 className='text-md text-white mt-3'>
//                 All rights reserved.
//             </h2>
//         </div>
//     </div>
//   )
// }

// export default Footer
import React from 'react'

function Footer() {
  return (
    <div
      className='flex flex-col sm:flex-row justify-center items-center text-center 
      rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md 
      m-4 sm:m-8 px-4 sm:px-6 py-3 sm:py-0 h-auto sm:h-12'
    >
      <div>
        <h2 className='text-sm sm:text-md text-white'>
          All rights reserved.
        </h2>
      </div>
    </div>
  )
}

export default Footer

// import React from 'react'
// import {Link} from 'react-router-dom'
// import Marquee from '../components/Marquee'

// function Home() {
//   return (
//     <>
//     <div className='flex flex-row justify-center -mt-4 gap-8 mb-28'>
//       <div className='rounded-md border border-white/10 bg-white/10
//     shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white'>
//         <h2>
//           <Link to='/dsa'>DSA Leaderboard</Link>
//         </h2>
//       </div>
//       <div className='rounded-md border border-white/10 bg-white/10
//     shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white'>
//         <h2>
//           <Link to='/dev'>Dev Leaderboard</Link> 
//         </h2>
//       </div>
//       <div className='rounded-md border border-white/10 bg-white/10
//     shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white'>
//         <h2>
//           <Link to='/opensource'>Open Source Leaderboard</Link> 
//         </h2>
//       </div>
//     </div>

//     <div className='mb-8'>
//       <div>
//         <h1 className='text-8xl text-white text-center transition-transform hover:scale-110'>
//           MOMENTUM
//         </h1>
//       </div>
//       <div>
//         <p className='text-4xl text-white text-center mt-3'>
//           Track. Rise. Repeat.
//         </p>
//       </div>
//     </div>

//     <div className='flex flex-row justify-center'>
//       <div className='rounded-md border border-white/10 bg-white/10
//       shadow-lg backdrop-filter backdrop-blur-md text-justify p-6 text-white w-213'>
//         <p className='text-md'>
//         Welcome to the official BPIT Student Leaderboard — a dynamic platform showcasing 
//         the achievements of our students across multiple domains. Designed to foster 
//         healthy competition and continuous growth, this leaderboard ranks students based
//         on their performance in various fields, offering a clear view of their progress 
//         and accomplishments. Whether you're aiming to reach the top or simply track your
//           development, the BPIT Leaderboard serves as a powerful motivator and a celebration
//         of academic and extracurricular excellence.
//         </p>
//       </div>
//     </div>

//     <div className='container mx-auto w-full flex justify-center items-center overflow-hidden mt-20'>
//       <Marquee/>
//     </div>

//     <div className='flex flex-row justify-center mt-20 gap-20'>
//       <div className='rounded-md border border-white/10 bg-white/10
//       shadow-lg backdrop-filter backdrop-blur-md text-center h-70 w-60 p-6 text-white'>
//         <h2 className='text-5xl mb-4'>
//           📊
//         </h2>
//         <h2 className='text-xl'>
//           Domains Tracked: 3
//         </h2>
//         <p className='text-sm mt-2'>
//         Explore diverse skill areas — 
//         from coding to creative innovation — 
//         with leaderboards tailored to each domain.
//         </p>
//       </div>
//       <div className='rounded-md border border-white/10 bg-white/10
//       shadow-lg backdrop-filter backdrop-blur-md text-center p-6 w-60 text-white'>
//         <h2 className='text-5xl mb-4'>
//           🧑🏻‍🎓
//         </h2>
//         <h2 className='text-xl'>
//           Total Students: 150+
//         </h2>
//         <p className='text-sm mt-2'>
//         Join a growing community of motivated
//          students competing, learning, and 
//          leveling up together.
//         </p>
//       </div>
//       <div className='rounded-md border border-white/10 bg-white/10
//       shadow-lg backdrop-filter backdrop-blur-md text-center p-6 w-60 text-white'>
//         <h2 className='text-5xl mb-4'>
//           💯
//         </h2>
//         <h2 className='text-xl'>
//           Highest Score: 2300
//         </h2>
//         <p className='text-sm mt-2'>
//         See what’s possible — our top 
//         achievers set the benchmark for 
//         excellence and consistency.
//         </p>
//       </div>
//     </div>

//     </>
//   )
// }

// export default Home
/////////

import React from 'react'
import { Link } from 'react-router-dom'
import Marquee from '../components/Marquee'


function Home() {
  return (
    <>
      {/* Leaderboard Buttons */}
      <div className='flex flex-row justify-center items-center mt-4 sm:mt-8 gap-2 sm:gap-8 mb-16 sm:mb-28 px-2'>
        <div className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-28 sm:w-60 text-center p-2 text-white text-xs sm:text-base'>
          <h2>
            <Link to='/dsa'>DSA Leaderboard</Link>
          </h2>
        </div>
        <div className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-28 sm:w-60 text-center p-2 text-white text-xs sm:text-base'>
          <h2>
            <Link to='/dev'>Dev Leaderboard</Link>
          </h2>
        </div>
        <div className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-28 sm:w-60 text-center p-2 text-white text-xs sm:text-base'>
          <h2>
            <Link to='/opensource'>Open Source Leaderboard</Link>
          </h2>
        </div>
      </div>


      {/* Title Section */}
      <div className='mb-10 sm:mb-8 px-4'>
        <div>
          <h1 className='text-5xl sm:text-8xl text-white text-center transition-transform hover:scale-110'>
            MOMENTUM
          </h1>
        </div>
        <div>
          <p className='text-2xl sm:text-4xl text-white text-center mt-3'>
            Track. Rise. Repeat.
          </p>
        </div>
      </div>


      {/* Description Section */}
      <div className='flex justify-center px-4'>
        <div className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-justify p-4 sm:p-6 text-white w-full sm:w-4/5 lg:w-2/3'>
          <p className='text-sm sm:text-md leading-relaxed'>
            Welcome to the official BPIT Student Leaderboard — a dynamic platform showcasing 
            the achievements of our students across multiple domains. Designed to foster 
            healthy competition and continuous growth, this leaderboard ranks students based
            on their performance in various fields, offering a clear view of their progress 
            and accomplishments. Whether you're aiming to reach the top or simply track your
            development, the BPIT Leaderboard serves as a powerful motivator and a celebration
            of academic and extracurricular excellence.
          </p>
        </div>
      </div>


      {/* Marquee Section */}
      <div className='container mx-auto w-full flex justify-center items-center overflow-hidden mt-16 sm:mt-20 px-4'>
        <Marquee />
      </div>


      {/* Stats Section */}
      <div className='flex flex-row justify-center items-stretch mt-16 sm:mt-20 gap-3 sm:gap-20 px-2'>
        <div className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-3 sm:p-6 w-1/3 sm:w-60 text-white'>
          <h2 className='text-2xl sm:text-5xl mb-2 sm:mb-4'>
            📊
          </h2>
          <h2 className='text-xs sm:text-xl mb-1 sm:mb-0'>
            Domains Tracked: 3
          </h2>
          <p className='text-[0.65rem] sm:text-sm mt-1 sm:mt-2 leading-relaxed  sm:block'>
            Explore diverse skill areas — 
            from coding to creative innovation — 
            with leaderboards tailored to each domain.
          </p>
        </div>


        <div className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-3 sm:p-6 w-1/3 sm:w-60 text-white'>
          <h2 className='text-2xl sm:text-5xl mb-2 sm:mb-4'>
            🧑🏻‍🎓
          </h2>
          <h2 className='text-xs sm:text-xl mb-1 sm:mb-0'>
            Total Students: 150+
          </h2>
          <p className='text-[0.65rem] sm:text-sm mt-1 sm:mt-2 leading-relaxed  sm:block'>
            Join a growing community of motivated
            students competing, learning, and 
            leveling up together.
          </p>
        </div>


        <div className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-3 sm:p-6 w-1/3 sm:w-60 text-white'>
          <h2 className='text-2xl sm:text-5xl mb-2 sm:mb-4'>
            💯
          </h2>
          <h2 className='text-xs sm:text-xl mb-1 sm:mb-0'>
            Highest Score: 2300
          </h2>
          <p className='text-[0.65rem] sm:text-sm mt-1 sm:mt-2 leading-relaxed  sm:block'>
            See what's possible — our top 
            achievers set the benchmark for 
            excellence and consistency.
          </p>
        </div>
      </div>
    </>
  )
}


export default Home




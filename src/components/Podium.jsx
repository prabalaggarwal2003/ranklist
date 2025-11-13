// import React from "react";

// const Podium = ({ profiles }) => {
//   if (!profiles || profiles.length === 0) return null;

//   // Sort descending by totalScore
//   const top3 = [...profiles].sort((a, b) => b.totalScore - a.totalScore).slice(0, 3);

//   // Fallback in case less than 3 profiles
//   const first = top3[0] || { name: "N/A", totalScore: 0 };
//   const second = top3[1] || { name: "N/A", totalScore: 0 };
//   const third = top3[2] || { name: "N/A", totalScore: 0 };

//   return (
//     <div className="w-full flex flex-col items-center mb-16">
//       <h2 className="text-3xl font-bold mb-12 text-white">🏆 Top Performers</h2>

//       <div className="flex items-end justify-center gap-8">
//         {/* 2nd Place */}
//         <div className="flex flex-col items-center text-center text-white">
//           <div className="mb-4 text-lg font-semibold drop-shadow-md">{second.name}</div>

//           <div
//             className="relative w-40 h-44 mt-12 px-4 py-3 bg-gradient-to-b from-[#17191d] to-[#101115]
//             border border-transparent text-white flex flex-col justify-end items-center"
//           >
//             <div
//               className="absolute w-full h-5 bg-gradient-to-t from-[#17191d] to-[#101115] -top-[21px] left-0"
//               style={{
//                 transform: "perspective(30px) rotateX(20deg)",
//                 transformOrigin: "bottom center",
//               }}
//             />
//             <div className="z-10">
//               <div className="text-base">#2</div>
//               <div className="text-sm text-white/80">Score: {second.totalScore.toFixed(2)}</div>
//             </div>
//           </div>
//         </div>

//         {/* 1st Place */}
//         <div className="flex flex-col items-center text-center text-white">
//           <div className="mb-6 text-lg font-semibold drop-shadow-md">{first.name}</div>

//           <div
//             className="relative w-48 h-60 mt-0 px-4 py-3 bg-gradient-to-b from-[#17191d] to-[#101115]
//             border border-transparent text-white flex flex-col justify-end items-center"
//           >
//             <div
//               className="absolute w-full h-5 bg-gradient-to-t from-[#17191d] to-[#101115] -top-[21px] left-0"
//               style={{
//                 transform: "perspective(30px) rotateX(20deg)",
//                 transformOrigin: "bottom center",
//               }}
//             />
//             <div className="z-10">
//               <div className="text-base">#1</div>
//               <div className="text-sm text-white/80">Score: {first.totalScore.toFixed(2)}</div>
//             </div>
//           </div>
//         </div>

//         {/* 3rd Place */}
//         <div className="flex flex-col items-center text-center text-white">
//           <div className="mb-4 text-lg font-semibold drop-shadow-md">{third.name}</div>

//           <div
//             className="relative w-36 h-36 mt-20 px-4 py-3 bg-gradient-to-b from-[#17191d] to-[#101115]
//             border border-transparent text-white flex flex-col justify-end items-center"
//           >
//             <div
//               className="absolute w-full h-5 bg-gradient-to-t from-[#17191d] to-[#101115] -top-[21px] left-0"
//               style={{
//                 transform: "perspective(30px) rotateX(20deg)",
//                 transformOrigin: "bottom center",
//               }}
//             />
//             <div className="z-10">
//               <div className="text-base">#3</div>
//               <div className="text-sm text-white/80">Score: {third.totalScore.toFixed(2)}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Podium;

import React from "react";

const Podium = ({ profiles }) => {
  if (!profiles || profiles.length === 0) return null;

  // Sort descending by totalScore
  const top3 = [...profiles].sort((a, b) => b.totalScore - a.totalScore).slice(0, 3);

  // Fallback in case less than 3 profiles
  const first = top3[0] || { name: "N/A", totalScore: 0 };
  const second = top3[1] || { name: "N/A", totalScore: 0 };
  const third = top3[2] || { name: "N/A", totalScore: 0 };

  return (
    <div className="w-full flex flex-col items-center mb-8 sm:mb-16 px-2">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white">🏆 Top Performers</h2>

      <div className="flex items-end justify-center gap-3 sm:gap-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center text-center text-white">
          <div className="mb-2 sm:mb-4 text-xs sm:text-lg font-semibold drop-shadow-md">
            {second.name}
          </div>

          <div
            className="relative w-24 h-28 sm:w-40 sm:h-44 mt-8 sm:mt-12 px-2 sm:px-4 py-2 sm:py-3 
            bg-gradient-to-b from-[#17191d] to-[#101115]
            border border-transparent text-white flex flex-col justify-end items-center"
          >
            <div
              className="absolute w-full h-3 sm:h-5 bg-gradient-to-t from-[#17191d] to-[#101115] 
              -top-[13px] sm:-top-[21px] left-0"
              style={{
                transform: "perspective(30px) rotateX(20deg)",
                transformOrigin: "bottom center",
              }}
            />
            <div className="z-10">
              <div className="text-sm sm:text-base">#2</div>
              <div className="text-[0.65rem] sm:text-sm text-white/80">
                Score: {second.totalScore.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center text-center text-white">
          <div className="mb-3 sm:mb-6 text-xs sm:text-lg font-semibold drop-shadow-md">
            {first.name}
          </div>

          <div
            className="relative w-28 h-36 sm:w-48 sm:h-60 mt-0 px-2 sm:px-4 py-2 sm:py-3 
            bg-gradient-to-b from-[#17191d] to-[#101115]
            border border-transparent text-white flex flex-col justify-end items-center"
          >
            <div
              className="absolute w-full h-3 sm:h-5 bg-gradient-to-t from-[#17191d] to-[#101115] 
              -top-[13px] sm:-top-[21px] left-0"
              style={{
                transform: "perspective(30px) rotateX(20deg)",
                transformOrigin: "bottom center",
              }}
            />
            <div className="z-10">
              <div className="text-sm sm:text-base">#1</div>
              <div className="text-[0.65rem] sm:text-sm text-white/80">
                Score: {first.totalScore.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center text-center text-white">
          <div className="mb-2 sm:mb-4 text-xs sm:text-lg font-semibold drop-shadow-md">
            {third.name}
          </div>

          <div
            className="relative w-24 h-24 sm:w-36 sm:h-36 mt-12 sm:mt-20 px-2 sm:px-4 py-2 sm:py-3 
            bg-gradient-to-b from-[#17191d] to-[#101115]
            border border-transparent text-white flex flex-col justify-end items-center"
          >
            <div
              className="absolute w-full h-3 sm:h-5 bg-gradient-to-t from-[#17191d] to-[#101115] 
              -top-[13px] sm:-top-[21px] left-0"
              style={{
                transform: "perspective(30px) rotateX(20deg)",
                transformOrigin: "bottom center",
              }}
            />
            <div className="z-10">
              <div className="text-sm sm:text-base">#3</div>
              <div className="text-[0.65rem] sm:text-sm text-white/80">
                Score: {third.totalScore.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podium;

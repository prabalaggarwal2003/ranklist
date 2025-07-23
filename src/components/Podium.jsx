import React from 'react';

const Podium = ({ top3 }) => {
  const second = top3[1];
  const first = top3[0];
  const third = top3[2];

  return (
    <div className="w-full flex flex-col items-center mb-16">
      <h2 className="text-3xl font-bold mb-12 text-white">🏆 Top Performers</h2>

      <div className="flex items-end justify-center gap-8">
        {/* 2nd Place */}
        <div className="flex flex-col items-center text-center text-white">
          <div className="mb-4 text-lg font-semibold drop-shadow-md">{second.name}</div>

          <div className="relative w-40 h-44 mt-12 px-4 py-3 bg-gradient-to-b from-[#17191d] to-[#101115]
            border border-transparent text-white flex flex-col justify-end items-center">
            {/* Top Face */}
            <div
              className="absolute w-full h-5 bg-gradient-to-t from-[#17191d] to-[#101115] -top-[21px] left-0"
              style={{
                transform: 'perspective(30px) rotateX(20deg)',
                transformOrigin: 'bottom center',
              }}
            />
            <div className="z-10">
              <div className="text-base">#2</div>
              <div className="text-sm text-white/80">Score: {second.totalScore}</div>
            </div>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center text-center text-white">
          <div className="mb-6 text-lg font-semibold drop-shadow-md">{first.name}</div>

          <div className="relative w-48 h-60 mt-0 px-4 py-3 bg-gradient-to-b from-[#17191d] to-[#101115]
            border border-transparent text-white flex flex-col justify-end items-center">
            {/* Top Face */}
            <div
              className="absolute w-full h-5 bg-gradient-to-t from-[#17191d] to-[#101115] -top-[21px] left-0"
              style={{
                transform: 'perspective(30px) rotateX(20deg)',
                transformOrigin: 'bottom center',
              }}
            />
            
            
            <div className="z-10">
              <div className="text-base">#1</div>
              <div className="text-sm text-white/80">Score: {first.totalScore}</div>
            </div>
            
          </div>
          
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center text-center text-white">
          <div className="mb-4 text-lg font-semibold drop-shadow-md">{third.name}</div>

          <div className="relative w-36 h-36 mt-20 px-4 py-3 bg-gradient-to-b from-[#17191d] to-[#101115]
            border border-transparent text-white flex flex-col justify-end items-center">
            {/* Top Face */}
            <div
              className="absolute w-full h-5 bg-gradient-to-t from-[#17191d] to-[#101115] -top-[21px] left-0"
              style={{
                transform: 'perspective(30px) rotateX(20deg)',
                transformOrigin: 'bottom center',
              }}
            />
            
            <div className="z-10">
              <div className="text-base">#3</div>
              <div className="text-sm text-white/80">Score: {third.totalScore}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podium;

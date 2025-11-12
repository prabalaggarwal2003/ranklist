import React, { useState } from 'react';
import LeetCodeProfile from '../components/LeetCodeProfile.jsx';
import CodeforcesProfile from '../components/CodeforcesProfile.jsx';
import Combined from '../components/Combined.jsx';

const DSA = () => {
  const [selected, setSelected] = useState('combined');

  return (
    <div className="p-6 text-white mt-14">
     
      <div className="flex justify-center gap-4 mb-6 mt-8">
        <button
          className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer"
          onClick={() => setSelected('leetcode')}
        >
          LeetCode Leaderboard
        </button>
        <button
          className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer"
          onClick={() => setSelected('codeforces')}
        >
          Codeforces Leaderboard
        </button>
        <button
          className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer"
          onClick={() => setSelected('combined')}
        >
          Combined Leaderboard
        </button>
      </div>

      {/* Leaderboard content */}
      <div>
        {selected === 'leetcode' && <LeetCodeProfile />}
        {selected === 'codeforces' && <CodeforcesProfile />}
        {selected === 'combined' && <Combined />}
      </div>
    </div>
  );
};



export default DSA;

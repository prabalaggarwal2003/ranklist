import React, { useState } from 'react';
import LeetCodeProfile from '../components/LeetCodeProfile.jsx';
import CodeforcesProfile from '../components/CodeforcesProfile.jsx';
import Combined from '../components/Combined.jsx';

const Home = () => {
  const [selected, setSelected] = useState('leetcode');

  return (
    <div className="p-6 min-h-screen text-white">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded 
            ${selected === 'leetcode' ? 'bg-blue-600' : 'bg-gray-600 hover:bg-blue-700'}`}
          onClick={() => setSelected('leetcode')}
        >
          LeetCode Leaderboard
        </button>
        <button
          className={`px-4 py-2 rounded 
            ${selected === 'codeforces' ? 'bg-red-600' : 'bg-gray-600 hover:bg-red-700'}`}
          onClick={() => setSelected('codeforces')}
        >
          Codeforces Leaderboard
        </button>
        <button
          className={`px-4 py-2 rounded 
            ${selected === 'combined' ? 'bg-green-600' : 'bg-gray-600 hover:bg-green-700'}`}
          onClick={() => setSelected('combined')}
        >
          Combined Leaderboard
        </button>
      </div>

      {selected === 'leetcode' && <LeetCodeProfile />}
      {selected === 'codeforces' && <CodeforcesProfile />}
      {selected === 'combined' && <Combined />}
    </div>
  );
};

export default Home;

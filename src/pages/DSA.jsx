// import React, { useState } from 'react';
// import LeetCodeProfile from '../components/LeetCodeProfile.jsx';
// import CodeforcesProfile from '../components/CodeforcesProfile.jsx';
// import Combined from '../components/Combined.jsx';

// const DSA = () => {
//   const [selected, setSelected] = useState('combined');

//   return (
//     <div className="p-6 text-white mt-14">
//       <div className="flex justify-center gap-4 mb-6">
//         <button
//           className='rounded-md border border-white/10 bg-white/10
//           shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer'
//           onClick={() => setSelected('leetcode')}
//         >
//           LeetCode Leaderboard
//         </button>
//         <button
//           className='rounded-md border border-white/10 bg-white/10
//     shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer'
//           onClick={() => setSelected('codeforces')}
//         >
//           Codeforces Leaderboard
//         </button>
//         <button
//           className='rounded-md border border-white/10 bg-white/10
//     shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer'
//           onClick={() => setSelected('combined')}
//         >
//           Combined Leaderboard
//         </button>
//       </div>

// <div>
//       {selected === 'leetcode' && <LeetCodeProfile />}
//       {selected === 'codeforces' && <CodeforcesProfile />}
//       {selected === 'combined' && <Combined />}
// </div>
      
//     </div>
//   );
// };

// export default DSA;
import React, { useState, useEffect } from 'react';
import LeetCodeProfile from '../components/LeetCodeProfile.jsx';
import CodeforcesProfile from '../components/CodeforcesProfile.jsx';
import Combined from '../components/Combined.jsx';
import Podium from '../components/Podium.jsx';

const DSA = () => {
  const [selected, setSelected] = useState('combined');
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch and compute combined scores
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const res = await fetch('/students.json');
        const students = await res.json();

        const lcPromises = students.map(async student => {
          try {
            const lcRes = await fetch(`/api/leetcode?usernames=${student.username}`);
            const lcData = await lcRes.json();
            const profile = lcData[0];
            const stats = profile.submitStatsGlobal?.acSubmissionNum.reduce((acc, cur) => {
              acc[cur.difficulty] = cur.count;
              return acc;
            }, {}) || {};
            const lcScore = (stats.Easy || 0) * 1 + (stats.Medium || 0) * 3 + (stats.Hard || 0) * 7;
            return { ...student, lcScore };
          } catch {
            return { ...student, lcScore: 0 };
          }
        });

        const cfPromises = students.map(async student => {
          try {
            const cfRes = await fetch(`/api/codeforces?handles=${student.codeforces}`);
            const cfData = await cfRes.json();
            const profile = cfData[0];
            const solved = profile.solvedCount || 0;
            const rating = profile.userInfo?.rating || 0;
            const cfScore = (solved * 4) + (rating * 0.6);
            return { handle: student.codeforces, cfScore };
          } catch {
            return { handle: student.codeforces, cfScore: 0 };
          }
        });

        const lcResults = await Promise.all(lcPromises);
        const cfResults = await Promise.all(cfPromises);

        const combined = lcResults.map(student => {
          const cf = cfResults.find(c => c.handle === student.codeforces);
          const cfScore = cf?.cfScore || 0;
          const totalScore = (student.lcScore * 0.6) + (cfScore * 0.4); // Adjust weights here
          return { ...student, cfScore, totalScore };
        });

        // Sort and take top 3 for podium
        const sorted = [...combined].sort((a, b) => b.totalScore - a.totalScore);
        setProfiles(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="p-6 text-white mt-14">
      {/* Podium always at top */}
      {!loading && <Podium top3={profiles.slice(0, 3)} />}

      {/* Leaderboard switch buttons */}
      <div className="flex justify-center gap-4 mb-6 mt-8">
        <button
          className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer'
          onClick={() => setSelected('leetcode')}
        >
          LeetCode Leaderboard
        </button>
        <button
          className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer'
          onClick={() => setSelected('codeforces')}
        >
          Codeforces Leaderboard
        </button>
        <button
          className='rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md w-60 text-center p-2 text-white cursor-pointer'
          onClick={() => setSelected('combined')}
        >
          Combined Leaderboard
        </button>
      </div>

      {/* Leaderboard content */}
      <div>
        {selected === 'leetcode' && <LeetCodeProfile />}
        {selected === 'codeforces' && <CodeforcesProfile />}
        {selected === 'combined' && <Combined profiles={profiles} />}
      </div>
    </div>
  );
};

export default DSA;

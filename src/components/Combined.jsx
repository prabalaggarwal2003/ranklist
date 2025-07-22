import React, { useEffect, useState } from 'react';

const Combined = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

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
          return { ...student, cfScore: cf?.cfScore || 0 };
        });

        setProfiles(combined);
      } catch (err) {
        console.error("Failed to load combined profiles:", err);
        setError("Failed to load data");
      }
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const filteredProfiles = profiles.filter(profile => {
    const branchMatch = selectedBranch === 'All' || profile.branch === selectedBranch;
    const yearMatch = selectedYear === 'All' || profile.year === selectedYear;
    return branchMatch && yearMatch;
  });

  return (
    <div className="p-6 mt-12">

<div className='flex flex-row justify-between'>
<div>
      <h1 className="text-2xl text-white font-bold mb-4">Combined Leaderboard</h1>
      </div>
      

      <div className="flex gap-4 mb-4">
        <select className="rounded-md border border-white/10 bg-white/10
          shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="All">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="IT">IT</option>
          <option value="AIDS">AIDS</option>
          <option value="CS-DS">CS-DS</option>
        </select>
        <select className="rounded-md border border-white/10 bg-white/10
          shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="All">All Years</option>
          <option value="1st year">1st year</option>
          <option value="2nd year">2nd year</option>
          <option value="3rd year">3rd year</option>
          <option value="4th year">4th year</option>
        </select>
      </div>
</div>
      

      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 shadow-md rounded-lg text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">S. No.</th>
              <th className="px-4 py-2 text-left">Name (Username)</th>
              <th className="px-4 py-2 text-left">Branch</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Enrolment No.</th>
              <th className="px-4 py-2 text-left">LeetCode Score</th>
              <th className="px-4 py-2 text-left">Codeforces Score</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && filteredProfiles.map((student, idx) => (
              <tr key={student.username} className="border-t border-slate-700">
                <td className="px-4 py-2 font-semibold">{idx + 1}</td>
                <td className="px-4 py-2 font-semibold">
                  {student.name} <span className="text-sm text-gray-500">({student.username})</span>
                </td>
                <td className="px-4 py-2">{student.branch}</td>
                <td className="px-4 py-2">{student.year}</td>
                <td className="px-4 py-2">{student.enrollment}</td>
                <td className="px-4 py-2">{student.lcScore}</td>
                <td className="px-4 py-2">{student.cfScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Combined;

import React, { useEffect, useState } from 'react';

const LeetCodeProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/students.json');
        const users = await res.json();
        const usernames = users.map(u => u.username);

        const apiRes = await fetch(`/api/leetcode?usernames=${usernames.join(",")}`);
        const data = await apiRes.json();

        const mergedProfiles = data.map(profile => {
          const match = users.find(u => u.username === profile.username);
          return {
            ...profile,
            name: match?.name || profile.username,
            branch: match?.branch || '',
            year: match?.year || '',
            enrollment: match?.enrollment || ''
          };
        });

        mergedProfiles.forEach(profile => {
          const stats = profile.submitStatsGlobal.acSubmissionNum.reduce((acc, cur) => {
            acc[cur.difficulty] = cur.count;
            return acc;
          }, {});
          profile.totalWeighted = (stats.Easy || 0) * 1 + (stats.Medium || 0) * 3 + (stats.Hard || 0) * 7;
          profile.totalQuestions = stats.All || 0;
          profile.breakdown = stats;
        });

        mergedProfiles.sort((a, b) => b.totalWeighted - a.totalWeighted);
        setProfiles(mergedProfiles);
      } catch (err) {
        console.error("Failed to load profiles:", err);
        setError("Failed to load profiles");
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(profile => {
    const branchMatch = selectedBranch === 'All' || profile.branch === selectedBranch;
    const yearMatch = selectedYear === 'All' || profile.year === selectedYear;
    return branchMatch && yearMatch;
  });

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Leetcode Leaderboard</h1>

      <div className="flex gap-4 mb-4">
        <select className="p-2 border rounded text-black" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
          <option value="All">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="IT">IT</option>
          <option value="AIDS">AIDS</option>
          <option value="CS-DS">CS-DS</option>
        </select>
        <select className="p-2 border rounded text-black" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="All">All Years</option>
          <option value="1st year">1st year</option>
          <option value="2nd year">2nd year</option>
          <option value="3rd year">3rd year</option>
          <option value="4th year">4th year</option>
        </select>
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full bg-slate-800 text-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">S. No.</th>
            <th className="py-2 px-4 text-left">Name (Username)</th>
            <th className="py-2 px-4 text-left">Branch</th>
            <th className="py-2 px-4 text-left">Year</th>
            <th className="py-2 px-4 text-left">Enrolment No.</th>
            <th className="py-2 px-4 text-left">Questions Solved</th>
            <th className="py-2 px-4 text-left">Score</th>
            <th className="py-2 px-4 text-left">Rank</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfiles.map((profile, idx) => {
            const stats = profile.breakdown || {};
            return (
              <tr key={profile.username} className="border-t border-slate-700">
                <td className="py-2 px-4 font-semibold">{idx + 1}</td>
                <td className="py-2 px-4 font-semibold">
                  {profile.name} <span className="text-sm text-gray-500">({profile.username})</span>
                </td>
                <td className="py-2 px-4">{profile.branch}</td>
                <td className="py-2 px-4">{profile.year}</td>
                <td className="py-2 px-4">{profile.enrollment}</td>
                <td className="py-2 px-4">
                  <div>Total: {profile.totalQuestions}</div>
                  <div className="text-xs text-gray-400">
                    (Easy: {stats.Easy || 0} | Medium: {stats.Medium || 0} | Hard: {stats.Hard || 0})
                  </div>
                </td>
                <td className="py-2 px-4">{profile.totalWeighted}</td>
                <td className="py-2 px-4 font-bold">#{idx + 1}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default LeetCodeProfile;

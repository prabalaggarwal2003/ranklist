import React, { useEffect, useState } from 'react';

const LeetCodeProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Fetch JSON with names + branch etc.
        const res = await fetch('/4th_year.json');
        const users = await res.json(); 
        const usernames = users.map(u => u.username);

        // Fetch from your serverless API
        const apiRes = await fetch(`/api/leetcode?usernames=${usernames.join(",")}`);
        const data = await apiRes.json();

        // Merge names, branch, year, enrollment into profiles
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

        // Compute weighted score
        mergedProfiles.forEach(profile => {
          const stats = profile.submitStatsGlobal.acSubmissionNum.reduce((acc, cur) => {
            acc[cur.difficulty] = cur.count;
            return acc;
          }, {});
          profile.totalWeighted = (stats.Easy || 0) * 1 + (stats.Medium || 0) * 3 + (stats.Hard || 0) * 7;
          profile.totalQuestions = stats.All || 0;
          profile.breakdown = stats;
        });

        // Sort descending by weighted score
        mergedProfiles.sort((a, b) => b.totalWeighted - a.totalWeighted);

        setProfiles(mergedProfiles);
      } catch (err) {
        console.error("Failed to load profiles:", err);
        setError("Failed to load profiles");
      }
    };

    fetchProfiles();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leetcode Leaderboard</h1>
      <table className="min-w-full bg-slate-800 text-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">S. No.</th>
            <th className="py-2 px-4 text-left">Name (Username)</th>
            <th className="py-2 px-4 text-left">Branch</th>
            <th className="py-2 px-4 text-left">Year</th>
            <th className="py-2 px-4 text-left">Enrollment No.</th>
            <th className="py-2 px-4 text-left">Questions Solved</th>
            <th className="py-2 px-4 text-left">Score</th>
            <th className="py-2 px-4 text-left">Rank</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile, idx) => {
            const stats = profile.breakdown || {};
            return (
              <tr key={profile.username} className="border-b border-slate-700">
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4 font-semibold">
                  {profile.name} <span className="text-sm text-gray-400">({profile.username})</span>
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
  );
};

export default LeetCodeProfile;

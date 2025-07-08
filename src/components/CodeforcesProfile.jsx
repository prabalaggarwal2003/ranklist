import React, { useEffect, useState } from 'react';

const CodeforcesProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Fetch your JSON file from public
        const res = await fetch('/4th_year.json');
        const students = await res.json();

        // Get the codeforces handles
        const handles = students.map(s => s.codeforces);

        // Fetch from your serverless API
        const apiRes = await fetch(`/api/codeforces?handles=${handles.join(",")}`);
        const data = await apiRes.json();

        // Merge student data into the api data
        const enriched = data.map(profile => {
          const student = students.find(s => s.codeforces === profile.handle) || {};
          return {
            ...profile,
            ...student,
            score: calculateScore(profile)
          };
        });

        // Sort by calculated score descending
        enriched.sort((a, b) => b.score - a.score);

        setProfiles(enriched);
      } catch (err) {
        console.error("Failed to load Codeforces profiles:", err);
        setError("Failed to load profiles");
      }
    };

    fetchProfiles();
  }, []);

  const calculateScore = (profile) => {
    const solved = profile.solvedCount || 0;
    const rating = profile.userInfo?.rating || 0;
    return (solved * 4) + (rating * 0.6);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Codeforces Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-slate-800 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">S. No.</th>
              <th className="px-4 py-2 text-left">Name (Username)</th>
              <th className="px-4 py-2 text-left">Branch</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Enrollment</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Problems Solved</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Rank</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, idx) => (
              <tr key={profile.handle} className="border-t border-slate-700">
                <td className="px-4 py-2 font-semibold">{idx + 1}</td>
                <td className="py-2 px-4 font-semibold">
                  {profile.name} <span className="text-sm text-gray-500">({profile.codeforces})</span>
                </td>
                <td className="px-4 py-2">{profile.branch ?? '-'}</td>
                <td className="px-4 py-2">{profile.year ?? '-'}</td>
                <td className="px-4 py-2">{profile.enrollment ?? '-'}</td>
                <td className="px-4 py-2">{profile.userInfo?.rating ?? '-'}</td>
                <td className="px-4 py-2">{profile.solvedCount ?? '-'}</td>
                <td className="px-4 py-2">{profile.score.toFixed(2)}</td>
                <td className="px-4 py-2 font-bold">{idx + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CodeforcesProfile;

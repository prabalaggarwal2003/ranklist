import React, { useEffect, useState } from 'react';

const Combined = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Load your JSON file from public folder
        const res = await fetch('/4th_year.json');
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
            const cfScore = (solved * 4) + (rating * 0.7); // your adjusted formula
            return { handle: student.codeforces, cfScore };
          } catch {
            return { handle: student.codeforces, cfScore: 0 };
          }
        });

        const lcResults = await Promise.all(lcPromises);
        const cfResults = await Promise.all(cfPromises);

        // Merge data
        const combined = lcResults.map(student => {
          const cf = cfResults.find(c => c.handle === student.codeforces);
          return {
            ...student,
            cfScore: cf?.cfScore || 0
          };
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Combined Leaderboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">S. No.</th>
              <th className="px-4 py-2">Name (Username)</th>
              <th className="px-4 py-2">Branch</th>
              <th className="px-4 py-2">Year</th>
              <th className="px-4 py-2">Enrollment</th>
              <th className="px-4 py-2">LeetCode Score</th>
              <th className="px-4 py-2">Codeforces Score</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((student, idx) => (
              <tr key={student.username} className="border-t">
                <td className="px-4 py-2 font-semibold">{idx + 1}</td>
                <td className="px-4 py-2">
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

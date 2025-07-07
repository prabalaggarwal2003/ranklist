import React, { useEffect, useState } from 'react';

const LeetCodeProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Fetch usernames.json
        const res = await fetch('/usernames.json');
        const usernames = await res.json();

        // Fetch from your serverless API
        const apiRes = await fetch(`/api/leetcode?usernames=${usernames.join(",")}`);
        const data = await apiRes.json();
        setProfiles(data);
      } catch (err) {
        console.error("Failed to load profiles:", err);
        setError("Failed to load profiles");
      }
    };

    fetchProfiles();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      {profiles.map((profile, idx) => {
        if (!profile || profile.error) {
          return <div key={idx} className="text-red-500">Error loading user.</div>;
        }

        const stats = profile.submitStatsGlobal.acSubmissionNum.reduce((acc, cur) => {
          acc[cur.difficulty] = cur.count;
          return acc;
        }, {});

        return (
          <div key={profile.username} className="border p-4 rounded mb-4 shadow">
            <h2 className="text-xl font-bold mb-2">{profile.username}</h2>
            <p>✅ Easy: {stats.Easy || 0}</p>
            <p>🟠 Medium: {stats.Medium || 0}</p>
            <p>🔴 Hard: {stats.Hard || 0}</p>
            <p>🏆 Total: {stats.All || 0}</p>
            {profile.contestRanking && (
              <div className="mt-2">
                <p>🎯 Contest Rating: {profile.contestRanking.rating?.toFixed(2)}</p>
                <p>🌍 Global Contest Rank: #{profile.contestRanking.globalRanking}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LeetCodeProfile;

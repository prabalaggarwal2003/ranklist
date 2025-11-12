import React, { useEffect, useState } from "react";

const CACHE_KEY = "leetcode_profiles_cache";
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

const LeetCodeProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        // Check localStorage first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
            setProfiles(parsed.data);
            console.log("Loaded profiles from cache");
          }
        }

        // Fetch fresh data in the background
        const SHEET_ID = "1Y3PPJw5e5H4ketIfnR6LBl0nUxD9-ZGXVrFusnZ2qQQ";
        const SHEET_NAME = "Leetcode";
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
        const range = `${SHEET_NAME}!A2:E200`;

        const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
        const sheetRes = await fetch(sheetUrl);
        if (!sheetRes.ok) throw new Error("Failed to fetch Google Sheet");
        const sheetData = await sheetRes.json();

        const rows = sheetData.values || [];
        const students = rows.map((row) => ({
          name: row[0] || "",
          username: row[1] || "",
          branch: row[2] || "",
          year: row[3] || "",
          enrollment: row[4] || "",
        }));

        const validUsers = students.filter(
          (s) => s.username && s.username !== "NA" && s.username !== "Not have any leet code ID"
        );

        if (validUsers.length === 0) {
          setError("No valid LeetCode usernames found");
          return;
        }

        const usernames = validUsers.map((s) => s.username);
        const apiRes = await fetch(`/api/leetcode?usernames=${usernames.join(",")}`);
        if (!apiRes.ok) throw new Error("LeetCode API request failed");
        const apiData = await apiRes.json();

        const enriched = apiData.map((profile) => {
          const student = validUsers.find((s) => s.username === profile.username) || {};
          return {
            ...student,
            easySolved: profile.easySolved || 0,
            mediumSolved: profile.mediumSolved || 0,
            hardSolved: profile.hardSolved || 0,
            totalScore:
              profile.totalScore ??
              profile.easySolved + profile.mediumSolved * 2 + profile.hardSolved * 3,
          };
        });

        enriched.sort((a, b) => b.totalScore - a.totalScore);
        setProfiles(enriched);

        // Save to cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: enriched })
        );
      } catch (err) {
        console.error("Failed to load LeetCode profiles:", err);
        setError("Failed to load profiles");
      }
    };

    loadProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    const branchMatch = selectedBranch === "All" || profile.branch === selectedBranch;
    const yearMatch = selectedYear === "All" || profile.year === selectedYear;
    return branchMatch && yearMatch;
  });

  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 mt-12">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold mb-4 text-white">LeetCode Leaderboard</h1>

        <div className="flex gap-4 mb-4">
          <select
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="All">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="IT">IT</option>
            <option value="AIDS">AIDS</option>
            <option value="CS-DS">CS-DS</option>
          </select>

          <select
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All Batches</option>
            <option value="2025-2029">2025-2029</option>
            <option value="2024-2028">2024-2028</option>
            <option value="2023-2027">2023-2027</option>
            <option value="2022-2026">2022-2026</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-justify p-2 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Name (Username)</th>
              <th className="py-2 px-4 text-left">Branch</th>
              <th className="py-2 px-4 text-left">Batch</th>
              <th className="py-2 px-4 text-left">Enrollment No.</th>
              <th className="py-2 px-4 text-left">Easy</th>
              <th className="py-2 px-4 text-left">Medium</th>
              <th className="py-2 px-4 text-left">Hard</th>
              <th className="py-2 px-4 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((profile, idx) => (
              <tr key={profile.username} className="border-t border-slate-700">
                <td className="py-2 px-4 font-bold">#{idx + 1}</td>
                <td className="py-2 px-4 font-semibold">
                  {profile.name}{" "}
                  <span className="text-sm text-gray-400">({profile.username})</span>
                </td>
                <td className="py-2 px-4">{profile.branch}</td>
                <td className="py-2 px-4">{profile.year}</td>
                <td className="py-2 px-4">{profile.enrollment}</td>
                <td className="py-2 px-4">{profile.easySolved}</td>
                <td className="py-2 px-4">{profile.mediumSolved}</td>
                <td className="py-2 px-4">{profile.hardSolved}</td>
                <td className="py-2 px-4 font-bold">{profile.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeetCodeProfile;


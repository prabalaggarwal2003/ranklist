// import React, { useEffect, useState } from "react";

// const CACHE_KEY = "leetcode_profiles_cache";
// const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

// const LeetCodeProfile = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [error, setError] = useState("");
//   const [selectedBranch, setSelectedBranch] = useState("All");
//   const [selectedYear, setSelectedYear] = useState("All");

//   useEffect(() => {
//     const loadProfiles = async () => {
//       try {
//         // Check localStorage first
//         const cached = localStorage.getItem(CACHE_KEY);
//         if (cached) {
//           const parsed = JSON.parse(cached);
//           if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
//             setProfiles(parsed.data);
//             console.log("Loaded profiles from cache");
//           }
//         }

//         // Fetch fresh data in the background
//         const SHEET_ID = "1Y3PPJw5e5H4ketIfnR6LBl0nUxD9-ZGXVrFusnZ2qQQ";
//         const SHEET_NAME = "Leetcode";
//         const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
//         const range = `${SHEET_NAME}!A2:E200`;

//         const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
//         const sheetRes = await fetch(sheetUrl);
//         if (!sheetRes.ok) throw new Error("Failed to fetch Google Sheet");
//         const sheetData = await sheetRes.json();

//         const rows = sheetData.values || [];
//         const students = rows.map((row) => ({
//           name: row[0] || "",
//           username: row[1] || "",
//           branch: row[2] || "",
//           year: row[3] || "",
//           enrollment: row[4] || "",
//         }));

//         const validUsers = students.filter(
//           (s) => s.username && s.username !== "NA" && s.username !== "Not have any leet code ID"
//         );

//         if (validUsers.length === 0) {
//           setError("No valid LeetCode usernames found");
//           return;
//         }

//         const usernames = validUsers.map((s) => s.username);
//         const apiRes = await fetch(`/api/leetcode?usernames=${usernames.join(",")}`);
//         if (!apiRes.ok) throw new Error("LeetCode API request failed");
//         const apiData = await apiRes.json();

//         const enriched = apiData.map((profile) => {
//           const student = validUsers.find((s) => s.username === profile.username) || {};
//           return {
//             ...student,
//             easySolved: profile.easySolved || 0,
//             mediumSolved: profile.mediumSolved || 0,
//             hardSolved: profile.hardSolved || 0,
//             totalScore:
//               profile.totalScore ??
//               profile.easySolved + profile.mediumSolved * 2 + profile.hardSolved * 3,
//           };
//         });

//         enriched.sort((a, b) => b.totalScore - a.totalScore);
//         setProfiles(enriched);

//         // Save to cache
//         localStorage.setItem(
//           CACHE_KEY,
//           JSON.stringify({ timestamp: Date.now(), data: enriched })
//         );
//       } catch (err) {
//         console.error("Failed to load LeetCode profiles:", err);
//         setError("Failed to load profiles");
//       }
//     };

//     loadProfiles();
//   }, []);

//   const filteredProfiles = profiles.filter((profile) => {
//     const branchMatch = selectedBranch === "All" || profile.branch === selectedBranch;
//     const yearMatch = selectedYear === "All" || profile.year === selectedYear;
//     return branchMatch && yearMatch;
//   });

//   if (error) return <div>{error}</div>;

//   return (
//     <div className="p-6 mt-12">
//       <div className="flex flex-row justify-between">
//         <h1 className="text-2xl font-bold mb-4 text-white">LeetCode Leaderboard</h1>

//         <div className="flex gap-4 mb-4">
//           <select
//             className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer"
//             value={selectedBranch}
//             onChange={(e) => setSelectedBranch(e.target.value)}
//           >
//             <option value="All">All Branches</option>
//             <option value="CSE">CSE</option>
//             <option value="ECE">ECE</option>
//             <option value="EEE">EEE</option>
//             <option value="IT">IT</option>
//             <option value="AIDS">AIDS</option>
//             <option value="CS-DS">CS-DS</option>
//           </select>

//           <select
//             className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer"
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(e.target.value)}
//           >
//             <option value="All">All Batches</option>
//             <option value="2025-2029">2025-2029</option>
//             <option value="2024-2028">2024-2028</option>
//             <option value="2023-2027">2023-2027</option>
//             <option value="2022-2026">2022-2026</option>
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-justify p-2 text-white">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 text-left">Rank</th>
//               <th className="py-2 px-4 text-left">Name (Username)</th>
//               <th className="py-2 px-4 text-left">Branch</th>
//               <th className="py-2 px-4 text-left">Batch</th>
//               <th className="py-2 px-4 text-left">Enrollment No.</th>
//               <th className="py-2 px-4 text-left">Easy</th>
//               <th className="py-2 px-4 text-left">Medium</th>
//               <th className="py-2 px-4 text-left">Hard</th>
//               <th className="py-2 px-4 text-left">Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProfiles.map((profile, idx) => (
//               <tr key={profile.username} className="border-t border-slate-700">
//                 <td className="py-2 px-4 font-bold">#{idx + 1}</td>
//                 <td className="py-2 px-4 font-semibold">
//                   {profile.name}{" "}
//                   <span className="text-sm text-gray-400">({profile.username})</span>
//                 </td>
//                 <td className="py-2 px-4">{profile.branch}</td>
//                 <td className="py-2 px-4">{profile.year}</td>
//                 <td className="py-2 px-4">{profile.enrollment}</td>
//                 <td className="py-2 px-4">{profile.easySolved}</td>
//                 <td className="py-2 px-4">{profile.mediumSolved}</td>
//                 <td className="py-2 px-4">{profile.hardSolved}</td>
//                 <td className="py-2 px-4 font-bold">{profile.totalScore}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default LeetCodeProfile;

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

  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4 sm:p-6 mt-4 sm:mt-12">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">LeetCode Leaderboard</h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <select
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center px-3 sm:px-4 py-2 text-white text-sm sm:text-base cursor-pointer w-full sm:w-auto"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            <option value="All" className="bg-gray-700 text-white">All Branches</option>
            <option value="CSE" className="bg-gray-700 text-white">CSE</option>
            <option value="ECE" className="bg-gray-700 text-white">ECE</option>
            <option value="EEE" className="bg-gray-700 text-white">EEE</option>
            <option value="IT" className="bg-gray-700 text-white">IT</option>
            <option value="AIDS" className="bg-gray-700 text-white">AIDS</option>
            <option value="CS-DS" className="bg-gray-700 text-white">CS-DS</option>
          </select>

          <select
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center px-3 sm:px-4 py-2 text-white text-sm sm:text-base cursor-pointer w-full sm:w-auto"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All" className="bg-gray-700 text-white">All Batches</option>
            <option value="2025-2029" className="bg-gray-700 text-white">2025-2029</option>
            <option value="2024-2028" className="bg-gray-700 text-white">2024-2028</option>
            <option value="2023-2027" className="bg-gray-700 text-white">2023-2027</option>
            <option value="2022-2026" className="bg-gray-700 text-white">2022-2026</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-white">
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

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProfiles.map((profile, idx) => (
          <div
            key={profile.username}
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md p-4 text-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-lg">{profile.name}</div>
                <div className="text-sm text-gray-400">@{profile.username}</div>
              </div>
              <div className="text-xl font-bold text-yellow-400">#{idx + 1}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <span className="text-gray-400">Branch:</span> {profile.branch}
              </div>
              <div>
                <span className="text-gray-400">Batch:</span> {profile.year}
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Enrollment:</span> {profile.enrollment}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="text-xs text-gray-400 mb-2">Problem Statistics</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-green-500/20 rounded-md p-2">
                  <div className="text-xs text-gray-400">Easy</div>
                  <div className="text-lg font-bold text-green-400">{profile.easySolved}</div>
                </div>
                <div className="bg-yellow-500/20 rounded-md p-2">
                  <div className="text-xs text-gray-400">Medium</div>
                  <div className="text-lg font-bold text-yellow-400">{profile.mediumSolved}</div>
                </div>
                <div className="bg-red-500/20 rounded-md p-2">
                  <div className="text-xs text-gray-400">Hard</div>
                  <div className="text-lg font-bold text-red-400">{profile.hardSolved}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <div className="text-sm text-gray-400">Total Score</div>
              <div className="text-2xl font-bold text-blue-400">{profile.totalScore}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeetCodeProfile;

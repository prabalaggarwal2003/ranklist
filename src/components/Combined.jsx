// import React, { useEffect, useState } from "react";
// import Podium from "./Podium";

// // Inside Combined component JSX



// const CACHE_KEY = "combinedLeaderboardCache";
// const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// const Combined = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [error, setError] = useState("");
//   const [selectedBranch, setSelectedBranch] = useState("All");
//   const [selectedYear, setSelectedYear] = useState("All");

//   const SHEET_ID = import.meta.env.VITE_SHEET_ID;
//   const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

//   useEffect(() => {
//     const fetchCombinedData = async () => {
//       try {
//         // Load cache
//         const cached = localStorage.getItem(CACHE_KEY);
//         if (cached) {
//           const parsed = JSON.parse(cached);
//           if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.data?.length > 0) {
//             setProfiles(parsed.data);
//             return;
//           }
//         }

//         // Fetch LeetCode sheet
//         const lcRes = await fetch(
//           `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Leetcode!A2:F200?key=${API_KEY}`
//         );
//         if (!lcRes.ok) throw new Error("Failed to fetch LeetCode sheet");
//         const lcSheet = await lcRes.json();
//         const lcRows = lcSheet.values || [];

//         const leetcodeUsers = lcRows.map((row) => ({
//           name: row[0] || "",
//           username: row[1] || "",
//           branch: row[2] || "",
//           year: row[3] || "",
//           enrollment: row[4] || "",
//           codeforces: row[5] || "", // column F for CF handle
//         }));

//         const validLcUsers = leetcodeUsers.filter(
//           (u) => u.username && u.username !== "NA" && u.username !== "Not have any leet code ID"
//         );

//         const lcUsernames = validLcUsers.map((u) => u.username);
//         const cfHandles = validLcUsers.map((u) => u.codeforces).filter((h) => h && h !== "NA");

//         // Fetch APIs
//         const [lcApiRaw, cfApiRaw] = await Promise.allSettled([
//           lcUsernames.length > 0
//             ? fetch(`/api/leetcode?usernames=${lcUsernames.join(",")}`).then((res) => res.json())
//             : Promise.resolve([]),
//           cfHandles.length > 0
//             ? fetch(`/api/codeforces?handles=${cfHandles.join(",")}`).then((res) => res.json())
//             : Promise.resolve([]),
//         ]);

//         const lcApi = Array.isArray(lcApiRaw.value) ? lcApiRaw.value : [];
//         const cfApi = Array.isArray(cfApiRaw.value) ? cfApiRaw.value : [];

//         // Merge profiles
//         const combinedProfiles = validLcUsers.map((user) => {
//           const lcProfile = lcApi.find(
//             (p) => (p.username || p.userName)?.trim().toLowerCase() === user.username.trim().toLowerCase()
//           );
//           const cfProfile = cfApi.find(
//             (p) => (p.handle || p.username)?.trim().toLowerCase() === user.codeforces.trim().toLowerCase()
//           );

//           const lcScore =
//             (lcProfile?.easySolved || 0) +
//             (lcProfile?.mediumSolved || 0) * 2 +
//             (lcProfile?.hardSolved || 0) * 3;

//           const cfScore = (cfProfile?.solvedCount || 0) * 4 + (cfProfile?.userInfo?.rating || 0) * 0.6;

//           const totalScore = (lcScore ? lcScore * 0.6 : 0) + (cfScore ? cfScore * 0.4 : 0);

//           return {
//             name: user.name || "Unknown",
//             username: user.username,
//             branch: user.branch,
//             year: user.year,
//             enrollment: user.enrollment,
//             lcScore: lcScore || 0,
//             cfScore: cfScore || 0,
//             totalScore,
//           };
//         });

//         const cleanProfiles = combinedProfiles.filter(
//           (p) => p.username && (p.lcScore > 0 || p.cfScore > 0)
//         );

//         cleanProfiles.sort((a, b) => b.totalScore - a.totalScore);

//         setProfiles(cleanProfiles);
//         localStorage.setItem(
//           CACHE_KEY,
//           JSON.stringify({ timestamp: Date.now(), data: cleanProfiles })
//         );
//       } catch (err) {
//         console.error("❌ Error fetching combined leaderboard:", err);
//         setError("Failed to load leaderboard data");
//       }
//     };

//     fetchCombinedData();
//   }, []);

//   const filteredProfiles = profiles.filter((profile) => {
//     const branchMatch = selectedBranch === "All" || profile.branch === selectedBranch;
//     const yearMatch = selectedYear === "All" || profile.year === selectedYear;
//     return branchMatch && yearMatch;
//   });

//   if (error) return <div className="text-red-400">{error}</div>;

//   return (
  
//     <div className="p-6 mt-12">
//       <Podium profiles={profiles} />
//       <div className="flex flex-row justify-between">
//         <h1 className="text-2xl text-white font-bold mb-4">Combined Leaderboard</h1>
//         <div className="flex gap-4 mb-4">
//             <select
//               className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer"
//               value={selectedBranch}
//               onChange={(e) => setSelectedBranch(e.target.value)}
//             >
//               <option value="All">All Branches</option>
//               <option value="CSE">CSE</option>
//               <option value="ECE">ECE</option>
//               <option value="EEE">EEE</option>
//               <option value="IT">IT</option>
//               <option value="AIDS">AIDS</option>
//               <option value="CS-DS">CS-DS</option>
//             </select>

//             <select
//               className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//             >
//               <option value="All">All Batches</option>
//               <option value="2025-2029">2025-2029</option>
//               <option value="2024-2028">2024-2028</option>
//               <option value="2023-2027">2023-2027</option>
//               <option value="2022-2026">2022-2026</option>
//             </select>
//           </div>
        
//       </div>

        

//       <div className="overflow-x-auto">
//         <table className="min-w-full rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-white">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 text-left">S. No.</th>
//               <th className="px-4 py-2 text-left">Name (Username)</th>
//               <th className="px-4 py-2 text-left">Branch</th>
//               <th className="px-4 py-2 text-left">Batch</th>
//               <th className="px-4 py-2 text-left">Enrollment No.</th>
//               <th className="px-4 py-2 text-left">LeetCode Score</th>
//               <th className="px-4 py-2 text-left">Codeforces Score</th>
//               <th className="px-4 py-2 text-left">Combined Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProfiles.map((student, idx) => (
//               <tr key={student.username + idx} className="border-t border-slate-700">
//                 <td className="px-4 py-2 font-semibold">{idx + 1}</td>
//                 <td className="px-4 py-2 font-semibold">
//                   {student.name} <span className="text-sm text-gray-500">({student.username})</span>
//                 </td>
//                 <td className="px-4 py-2">{student.branch}</td>
//                 <td className="px-4 py-2">{student.year}</td>
//                 <td className="px-4 py-2">{student.enrollment}</td>
//                 <td className="px-4 py-2">{student.lcScore}</td>
//                 <td className="px-4 py-2">{student.cfScore.toFixed(2)}</td>
//                 <td className="px-4 py-2 font-bold">{student.totalScore.toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Combined;
import React, { useEffect, useState } from "react";
import Podium from "./Podium";

const CACHE_KEY = "combinedLeaderboardCache";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const Combined = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const SHEET_ID = import.meta.env.VITE_SHEET_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  useEffect(() => {
    const fetchCombinedData = async () => {
      try {
        // Load cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.data?.length > 0) {
            setProfiles(parsed.data);
            return;
          }
        }

        // Fetch LeetCode sheet
        const lcRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Leetcode!A2:F200?key=${API_KEY}`
        );
        if (!lcRes.ok) throw new Error("Failed to fetch LeetCode sheet");
        const lcSheet = await lcRes.json();
        const lcRows = lcSheet.values || [];

        const leetcodeUsers = lcRows.map((row) => ({
          name: row[0] || "",
          username: row[1] || "",
          branch: row[2] || "",
          year: row[3] || "",
          enrollment: row[4] || "",
          codeforces: row[5] || "", // column F for CF handle
        }));

        const validLcUsers = leetcodeUsers.filter(
          (u) => u.username && u.username !== "NA" && u.username !== "Not have any leet code ID"
        );

        const lcUsernames = validLcUsers.map((u) => u.username);
        const cfHandles = validLcUsers.map((u) => u.codeforces).filter((h) => h && h !== "NA");

        // Fetch APIs
        const [lcApiRaw, cfApiRaw] = await Promise.allSettled([
          lcUsernames.length > 0
            ? fetch(`/api/leetcode?usernames=${lcUsernames.join(",")}`).then((res) => res.json())
            : Promise.resolve([]),
          cfHandles.length > 0
            ? fetch(`/api/codeforces?handles=${cfHandles.join(",")}`).then((res) => res.json())
            : Promise.resolve([]),
        ]);

        const lcApi = Array.isArray(lcApiRaw.value) ? lcApiRaw.value : [];
        const cfApi = Array.isArray(cfApiRaw.value) ? cfApiRaw.value : [];

        // Merge profiles
        const combinedProfiles = validLcUsers.map((user) => {
          const lcProfile = lcApi.find(
            (p) => (p.username || p.userName)?.trim().toLowerCase() === user.username.trim().toLowerCase()
          );
          const cfProfile = cfApi.find(
            (p) => (p.handle || p.username)?.trim().toLowerCase() === user.codeforces.trim().toLowerCase()
          );

          const lcScore =
            (lcProfile?.easySolved || 0) +
            (lcProfile?.mediumSolved || 0) * 2 +
            (lcProfile?.hardSolved || 0) * 3;

          const cfScore = (cfProfile?.solvedCount || 0) * 4 + (cfProfile?.userInfo?.rating || 0) * 0.6;

          const totalScore = (lcScore ? lcScore * 0.6 : 0) + (cfScore ? cfScore * 0.4 : 0);

          return {
            name: user.name || "Unknown",
            username: user.username,
            branch: user.branch,
            year: user.year,
            enrollment: user.enrollment,
            lcScore: lcScore || 0,
            cfScore: cfScore || 0,
            totalScore,
          };
        });

        const cleanProfiles = combinedProfiles.filter(
          (p) => p.username && (p.lcScore > 0 || p.cfScore > 0)
        );

        cleanProfiles.sort((a, b) => b.totalScore - a.totalScore);

        setProfiles(cleanProfiles);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: cleanProfiles })
        );
      } catch (err) {
        console.error("❌ Error fetching combined leaderboard:", err);
        setError("Failed to load leaderboard data");
      }
    };

    fetchCombinedData();
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    const branchMatch = selectedBranch === "All" || profile.branch === selectedBranch;
    const yearMatch = selectedYear === "All" || profile.year === selectedYear;
    return branchMatch && yearMatch;
  });

  if (error) return <div className="text-red-400 p-4">{error}</div>;

  return (
    <div className="p-4 sm:p-6 mt-4 sm:mt-12">
      {/* Podium Component */}
      <Podium profiles={profiles} />

      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 mt-8">
        <h1 className="text-xl sm:text-2xl text-white font-bold">Combined Leaderboard</h1>
        
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
              <th className="px-4 py-2 text-left">S. No.</th>
              <th className="px-4 py-2 text-left">Name (Username)</th>
              <th className="px-4 py-2 text-left">Branch</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">Enrollment No.</th>
              <th className="px-4 py-2 text-left">LeetCode Score</th>
              <th className="px-4 py-2 text-left">Codeforces Score</th>
              <th className="px-4 py-2 text-left">Combined Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((student, idx) => (
              <tr key={student.username + idx} className="border-t border-slate-700">
                <td className="px-4 py-2 font-semibold">{idx + 1}</td>
                <td className="px-4 py-2 font-semibold">
                  {student.name} <span className="text-sm text-gray-500">({student.username})</span>
                </td>
                <td className="px-4 py-2">{student.branch}</td>
                <td className="px-4 py-2">{student.year}</td>
                <td className="px-4 py-2">{student.enrollment}</td>
                <td className="px-4 py-2">{student.lcScore}</td>
                <td className="px-4 py-2">{student.cfScore.toFixed(2)}</td>
                <td className="px-4 py-2 font-bold">{student.totalScore.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {filteredProfiles.map((student, idx) => (
          <div
            key={student.username + idx}
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md p-4 text-white"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-bold text-lg">{student.name}</div>
                <div className="text-sm text-gray-400">@{student.username}</div>
              </div>
              <div className="text-xl font-bold text-purple-400">#{idx + 1}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <span className="text-gray-400">Branch:</span> {student.branch}
              </div>
              <div>
                <span className="text-gray-400">Batch:</span> {student.year}
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Enrollment:</span> {student.enrollment}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="text-xs text-gray-400 mb-2">Platform Scores</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-yellow-500/20 rounded-md p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">LeetCode</div>
                  <div className="text-lg font-bold text-white-400">{student.lcScore}</div>
                </div>
                <div className="bg-blue-500/20 rounded-md p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Codeforces</div>
                  <div className="text-lg font-bold text-white-400">{student.cfScore.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 text-center">
              <div className="text-sm text-gray-400">Combined Score</div>
              <div className="text-2xl font-bold text-white-400">{student.totalScore.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Combined;

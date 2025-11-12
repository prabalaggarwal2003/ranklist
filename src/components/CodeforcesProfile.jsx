// import React, { useEffect, useState } from 'react';

// const CodeforcesProfile = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [error, setError] = useState('');
//   const [selectedBranch, setSelectedBranch] = useState('All');
//   const [selectedYear, setSelectedYear] = useState('All');

//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         const res = await fetch('/students.json');
//         const students = await res.json();
//         const handles = students.map(s => s.codeforces);

//         const apiRes = await fetch(`/api/codeforces?handles=${handles.join(",")}`);
//         const data = await apiRes.json();

//         const enriched = data.map(profile => {
//           const student = students.find(s => s.codeforces === profile.handle) || {};
//           return {
//             ...profile,
//             ...student,
//             score: calculateScore(profile)
//           };
//         });

//         enriched.sort((a, b) => b.score - a.score);
//         setProfiles(enriched);
//       } catch (err) {
//         console.error("Failed to load Codeforces profiles:", err);
//         setError("Failed to load profiles");
//       }
//     };

//     fetchProfiles();
//   }, []);

//   const calculateScore = (profile) => {
//     const solved = profile.solvedCount || 0;
//     const rating = profile.userInfo?.rating || 0;
//     return (solved * 4) + (rating * 0.6);
//   };

//   const filteredProfiles = profiles.filter(profile => {
//     const branchMatch = selectedBranch === 'All' || profile.branch === selectedBranch;
//     const yearMatch = selectedYear === 'All' || profile.year === selectedYear;
//     return branchMatch && yearMatch;
//   });

//   if (error) return <div>{error}</div>;

//   return (
//     <div className="p-6 mt-12">

//       <div className='flex flex-row justify-between'>
//       <div>
//       <h1 className="text-2xl font-bold mb-4 text-white">Codeforces Leaderboard</h1>
//       </div>

//       <div className="flex gap-4 mb-4">
//         <select className="rounded-md border border-white/10 bg-white/10
//           shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
//           <option value="All">All Branches</option>
//           <option value="CSE">CSE</option>
//           <option value="ECE">ECE</option>
//           <option value="EEE">EEE</option>
//           <option value="IT">IT</option>
//           <option value="AIDS">AIDS</option>
//           <option value="CS-DS">CS-DS</option>
//         </select>
//         <select className="rounded-md border border-white/10 bg-white/10
//           shadow-lg backdrop-filter backdrop-blur-md text-center p-2 text-white cursor-pointer" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
//           <option value="All">All Years</option>
//           <option value="1st year">1st year</option>
//           <option value="2nd year">2nd year</option>
//           <option value="3rd year">3rd year</option>
//           <option value="4th year">4th year</option>
//         </select>
//       </div>
//       </div>
      

//       <div className="overflow-x-auto">
//         <table className="min-w-full rounded-md border border-white/10 bg-white/10
//           shadow-lg backdrop-filter backdrop-blur-md text-justify p-2 text-white">
//           <thead>
//             <tr>
//               <th className="px-4 py-2 text-left">S. No.</th>
//               <th className="px-4 py-2 text-left">Name (Username)</th>
//               <th className="px-4 py-2 text-left">Branch</th>
//               <th className="px-4 py-2 text-left">Year</th>
//               <th className="px-4 py-2 text-left">Enrolment No.</th>
//               <th className="px-4 py-2 text-left">Contest Rating</th>
//               <th className="px-4 py-2 text-left">Problems Solved</th>
//               <th className="px-4 py-2 text-left">Score</th>
//               <th className="px-4 py-2 text-left">Rank</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProfiles.map((profile, idx) => (
//               <tr key={profile.handle} className="border-t border-slate-700">
//                 <td className="px-4 py-2 font-semibold">{idx + 1}</td>
//                 <td className="py-2 px-4 font-semibold">
//                   {profile.name} <span className="text-sm text-gray-500">({profile.codeforces})</span>
//                 </td>
//                 <td className="px-4 py-2">{profile.branch ?? '-'}</td>
//                 <td className="px-4 py-2">{profile.year ?? '-'}</td>
//                 <td className="px-4 py-2">{profile.enrollment ?? '-'}</td>
//                 <td className="px-4 py-2">{profile.userInfo?.rating ?? '-'}</td>
//                 <td className="px-4 py-2">{profile.solvedCount ?? '-'}</td>
//                 <td className="px-4 py-2">{profile.score.toFixed(2)}</td>
//                 <td className="px-4 py-2 font-bold">#{idx + 1}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CodeforcesProfile;

// import React, { useEffect, useState } from "react";

// const CodeforcesProfile = () => {
//   const [profiles, setProfiles] = useState([]);
//   const [error, setError] = useState("");
//   const [selectedBranch, setSelectedBranch] = useState("All");
//   const [selectedYear, setSelectedYear] = useState("All");

//   useEffect(() => {
//     const fetchProfiles = async () => {
//       try {
//         const SHEET_ID = "1Y3PPJw5e5H4ketIfnR6LBl0nUxD9-ZGXVrFusnZ2qQQ";
//         const SHEET_NAME = "Codeforces"; // sheet tab name
//         const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
//         const range = `${SHEET_NAME}!A2:E200`; // name, username, branch, batch, enrolment

//         const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
//         const sheetRes = await fetch(sheetUrl);
//         if (!sheetRes.ok) throw new Error("Failed to fetch Google Sheet");
//         const sheetData = await sheetRes.json();

//         const rows = sheetData.values || [];
//         console.log("Raw rows:", rows);

//         // map rows to structured data
//         const students = rows.map((row) => ({
//           name: row[0] || "",
//           handle: row[1] || "",
//           branch: row[2] || "",
//           year: row[3] || "",
//           enrollment: row[4] || "",
//         }));

//         const validUsers = students.filter(
//           (s) => s.handle && s.handle !== "NA" && s.handle !== "Not have any CF ID"
//         );

//         console.log("Valid Codeforces handles:", validUsers.map((u) => u.handle));

//         if (validUsers.length === 0) {
//           setError("No valid Codeforces handles found");
//           return;
//         }

//         const handles = validUsers.map((s) => s.handle);
//         const apiRes = await fetch(`/api/codeforces?handles=${handles.join(",")}`);
//         if (!apiRes.ok) throw new Error("Codeforces API request failed");

//         const apiData = await apiRes.json();
//         console.log("Fetched from Codeforces API:", apiData);

//         // combine both sources
//         const enriched = apiData.map((profile) => {
//           const student = validUsers.find((s) => s.handle === profile.handle) || {};
//           const rating = profile.userInfo?.rating || 0;
//           const solved = profile.solvedCount || 0;
//           const score = solved * 4 + rating * 0.6;

//           return {
//             ...student,
//             handle: profile.handle,
//             rating,
//             solvedCount: solved,
//             score,
//           };
//         });

//         enriched.sort((a, b) => b.score - a.score);
//         setProfiles(enriched);
//       } catch (err) {
//         console.error("Failed to load Codeforces profiles:", err);
//         setError("Failed to load profiles");
//       }
//     };

//     fetchProfiles();
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
//         <h1 className="text-2xl font-bold mb-4 text-white">Codeforces Leaderboard</h1>

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
//             <option value="All">All Years</option>
//             <option value="1st year">1st year</option>
//             <option value="2nd year">2nd year</option>
//             <option value="3rd year">3rd year</option>
//             <option value="4th year">4th year</option>
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-justify p-2 text-white">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 text-left">Rank</th>
//               <th className="py-2 px-4 text-left">Name (Handle)</th>
//               <th className="py-2 px-4 text-left">Branch</th>
//               <th className="py-2 px-4 text-left">Batch</th>
//               <th className="py-2 px-4 text-left">Enrollment No.</th>
//               <th className="py-2 px-4 text-left">Contest Rating</th>
//               <th className="py-2 px-4 text-left">Problems Solved</th>
//               <th className="py-2 px-4 text-left">Score</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProfiles.map((profile, idx) => (
//               <tr key={profile.handle} className="border-t border-slate-700">
//                 <td className="py-2 px-4 font-bold">#{idx + 1}</td>
//                 <td className="py-2 px-4 font-semibold">
//                   {profile.name || "Unknown"}{" "}
//                   <span className="text-sm text-gray-400">({profile.handle || "N/A"})</span>
//                 </td>
//                 <td className="py-2 px-4">{profile.branch}</td>
//                 <td className="py-2 px-4">{profile.year}</td>
//                 <td className="py-2 px-4">{profile.enrollment}</td>
//                 <td className="py-2 px-4">{profile.rating}</td>
//                 <td className="py-2 px-4">{profile.solvedCount}</td>
//                 <td className="py-2 px-4 font-bold">{profile.score.toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CodeforcesProfile;

import React, { useEffect, useState } from "react";

const CACHE_KEY = "codeforces_profiles_cache";
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

const CodeforcesProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        // Try loading from cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
            setProfiles(parsed.data);
            console.log("Loaded Codeforces profiles from cache");
          }
        }

        // Fetch fresh data in the background
        const SHEET_ID = "1Y3PPJw5e5H4ketIfnR6LBl0nUxD9-ZGXVrFusnZ2qQQ";
        const SHEET_NAME = "Codeforces";
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
        const range = `${SHEET_NAME}!A2:E200`;

        const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
        const sheetRes = await fetch(sheetUrl);
        if (!sheetRes.ok) throw new Error("Failed to fetch Google Sheet");
        const sheetData = await sheetRes.json();

        const rows = sheetData.values || [];
        const students = rows.map((row) => ({
          name: row[0] || "",
          handle: row[1] || "",
          branch: row[2] || "",
          year: row[3] || "",
          enrollment: row[4] || "",
        }));

        const validUsers = students.filter(
          (s) => s.handle && s.handle !== "NA" && s.handle !== "Not have any CF ID"
        );

        if (validUsers.length === 0) {
          setError("No valid Codeforces handles found");
          return;
        }

        const handles = validUsers.map((s) => s.handle);
        const apiRes = await fetch(`/api/codeforces?handles=${handles.join(",")}`);
        if (!apiRes.ok) throw new Error("Codeforces API request failed");

        const apiData = await apiRes.json();

        const enriched = apiData.map((profile) => {
          const student = validUsers.find((s) => s.handle === profile.handle) || {};
          const rating = profile.userInfo?.rating || 0;
          const solved = profile.solvedCount || 0;
          const score = solved * 4 + rating * 0.6;

          return {
            ...student,
            handle: profile.handle,
            rating,
            solvedCount: solved,
            score,
          };
        });

        enriched.sort((a, b) => b.score - a.score);
        setProfiles(enriched);

        // Save to cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: enriched })
        );
      } catch (err) {
        console.error("Failed to load Codeforces profiles:", err);
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
        <h1 className="text-2xl font-bold mb-4 text-white">Codeforces Leaderboard</h1>

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
              <th className="py-2 px-4 text-left">Name (Handle)</th>
              <th className="py-2 px-4 text-left">Branch</th>
              <th className="py-2 px-4 text-left">Batch</th>
              <th className="py-2 px-4 text-left">Enrollment No.</th>
              <th className="py-2 px-4 text-left">Contest Rating</th>
              <th className="py-2 px-4 text-left">Problems Solved</th>
              <th className="py-2 px-4 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.map((profile, idx) => (
              <tr key={profile.handle} className="border-t border-slate-700">
                <td className="py-2 px-4 font-bold">#{idx + 1}</td>
                <td className="py-2 px-4 font-semibold">
                  {profile.name || "Unknown"}{" "}
                  <span className="text-sm text-gray-400">({profile.handle || "N/A"})</span>
                </td>
                <td className="py-2 px-4">{profile.branch}</td>
                <td className="py-2 px-4">{profile.year}</td>
                <td className="py-2 px-4">{profile.enrollment}</td>
                <td className="py-2 px-4">{profile.rating}</td>
                <td className="py-2 px-4">{profile.solvedCount}</td>
                <td className="py-2 px-4 font-bold">{profile.score.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CodeforcesProfile;

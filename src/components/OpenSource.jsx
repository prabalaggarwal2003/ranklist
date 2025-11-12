import React, { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";

const CACHE_KEY = "github_profiles_cache";
const CACHE_EXPIRY = 1000*60*60 ; // 1 hour

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const client = new GraphQLClient(GITHUB_GRAPHQL_API, {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

const OpenSource = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");

  const query = gql`
    query ($login: String!) {
      user(login: $login) {
        starredRepositories {
          totalCount
        }
        repositories(privacy: PUBLIC) {
          totalCount
        }
        contributionsCollection {
          pullRequestContributions {
            totalCount
          }
          totalRepositoriesWithContributedCommits
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check localStorage cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
            setUserData(parsed.data);
            setLoading(false);
            console.log("Loaded GitHub data from cache");
            return;
          }
        }

        // Fetch students from Google Sheet
        const SHEET_ID = import.meta.env.VITE_SHEET_ID;
        const SHEET_NAME = "Github";
        const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
        const range = `${SHEET_NAME}!A2:F200`;

        const sheetRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`
        );
        if (!sheetRes.ok) throw new Error("Failed to fetch Google Sheet");
        const sheetData = await sheetRes.json();
        const rows = sheetData.values || [];

        const students = rows
          .map((row) => ({
            name: row[0] || "",
            github: row[1] || "", // Column F for GitHub username
            branch: row[2] || "",
            year: row[3] || "",
            enrollment: row[4] || "",
          }))
          .filter((s) => s.github);

        // Batch requests with Promise.all
        const batchSize = 10; // number of requests in parallel
        const allData = [];

        for (let i = 0; i < students.length; i += batchSize) {
          const batch = students.slice(i, i + batchSize);
          const promises = batch.map(async (student) => {
            try {
              const { user } = await client.request(query, { login: student.github });
              const days = user.contributionsCollection.contributionCalendar.weeks.flatMap(
                (week) => week.contributionDays
              );
              return {
                ...student,
                stars: user.starredRepositories.totalCount,
                publicRepos: user.repositories.totalCount,
                mergedPRs: user.contributionsCollection.pullRequestContributions.totalCount,
                reposContributed: user.contributionsCollection.totalRepositoriesWithContributedCommits,
                contributions: days,
              };
            } catch (err) {
              console.error("GitHub fetch failed for", student.github, err);
              return null;
            }
          });

          const results = await Promise.all(promises);
          allData.push(...results.filter(Boolean));
        }

        setUserData(allData);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: allData })
        );
      } catch (err) {
        console.error("Failed to fetch GitHub data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = userData.filter(
    (profile) =>
      (selectedBranch === "All" || profile.branch === selectedBranch) &&
      (selectedYear === "All" || profile.year === selectedYear)
  );

  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];

  const getFixedContributions = (contributions) => {
    const contributionsMap = new Map(contributions.map((d) => [d.date, d]));
    const fixed = [];
    for (let i = 279; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = formatDate(date);
      fixed.push(
        contributionsMap.get(dateStr) || { date: dateStr, contributionCount: 0, color: "#161b22" }
      );
    }
    return fixed;
  };

  return (
    <div className="p-12 mt-12">
      {/* Branch & Year Filters */}
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl text-white font-bold mb-4">Open Source Leaderboard</h1>
        <div className="flex gap-4 mb-4">
          <select
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center px-4 py-2 text-white cursor-pointer"
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
            className="rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-center px-4 py-2 text-white cursor-pointer"
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">S. No.</th>
              <th className="px-4 py-2 ">Name (GitHub)</th>
              <th className="px-4 py-2 ">Branch</th>
              <th className="px-4 py-2 ">Batch</th>
              <th className="px-4 py-2 ">Contributions</th>
              <th className="px-4 py-2 ">Stars</th>
              <th className="px-4 py-2 ">Public Repos</th>
              <th className="px-4 py-2 ">PRs Merged</th>
              <th className="px-4 py-2 ">Repos Contributed</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              filteredData.map((user, idx) => (
                <tr key={user.github} className="border-t border-slate-700">
                  <td className="px-4 py-2 font-semibold">{idx + 1}</td>
                  <td className="px-4 py-2 font-semibold">
                    {user.name}
                    <div className="text-sm text-gray-400">({user.github})</div>
                  </td>
                  <td className="px-4 py-2">{user.branch}</td>
                  <td className="px-4 py-2">{user.year}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-[1.5px] overflow-x-auto">
                      {(() => {
                        const fixed = getFixedContributions(user.contributions);
                        return Array.from({ length: 40 }).map((_, weekIndex) => {
                          const week = fixed.slice(weekIndex * 7, weekIndex * 7 + 7);
                          return (
                            <div key={weekIndex} className="flex flex-col gap-[1px]">
                              {week.map((day) => (
                                <div
                                  key={day.date}
                                  title={`${day.date}: ${day.contributionCount} contributions`}
                                  className="w-2 h-2 rounded-[2px]"
                                  style={{ backgroundColor: day.color, minWidth: "8px" }}
                                />
                              ))}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </td>
                  <td className="px-8 py-2">{user.stars}</td>
                  <td className="px-8 py-2">{user.publicRepos}</td>
                  <td className="px-8 py-2">{user.mergedPRs}</td>
                  <td className="px-16 py-2">{user.reposContributed}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenSource;

import React, { useEffect, useState } from "react";
import { GraphQLClient, gql } from "graphql-request";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const client = new GraphQLClient(GITHUB_GRAPHQL_API, {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

const OpenSource = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

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
        const res = await fetch("/students.json");
        const students = await res.json();

        const allData = [];

        for (const student of students) {
          try {
            const { user } = await client.request(query, {
              login: student.github,
            });

            const days = user.contributionsCollection.contributionCalendar.weeks.flatMap(
              (week) => week.contributionDays
            );

            allData.push({
              github: student.github,
              name: student.name,
              branch: student.branch,
              year: student.year,
              stars: user.starredRepositories.totalCount,
              publicRepos: user.repositories.totalCount,
              mergedPRs: user.contributionsCollection.pullRequestContributions.totalCount,
              reposContributed:
                user.contributionsCollection.totalRepositoriesWithContributedCommits,
              contributions: days,
            });
          } catch (err) {
            console.error("Failed for", student.github, err);
          }
        }

        setUserData(allData);
      } catch (err) {
        console.error("Failed to fetch students.json", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = userData.filter(profile => {
    const branchMatch = selectedBranch === 'All' || profile.branch === selectedBranch;
    const yearMatch = selectedYear === 'All' || profile.year === selectedYear;
    return branchMatch && yearMatch;
  });


  return (
    <div className="p-12 mt-12">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl text-white font-bold mb-4">Open Source Leaderboard</h1>

        <div className="flex gap-4 mb-4">
          <select
            className="rounded-md border border-white/10 bg-white/10
            shadow-lg backdrop-filter backdrop-blur-md text-center px-4 py-2 text-white cursor-pointer"
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
            className="rounded-md border border-white/10 bg-white/10
            shadow-lg backdrop-filter backdrop-blur-md text-center px-4 py-2 text-white cursor-pointer"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="All">All Years</option>
            <option value="1st year">1st year</option>
            <option value="2nd year">2nd year</option>
            <option value="3rd year">3rd year</option>
            <option value="4th year">4th year</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-md border border-white/10 bg-white/10 shadow-lg backdrop-filter backdrop-blur-md text-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">S. No.</th>
              <th className="px-4 py-2 ">Name (GitHub)</th>
              <th className="px-4 py-2 ">Branch</th>
              <th className="px-4 py-2 ">Year</th>
              <th className="px-4 py-2 ">Contributions</th>
              <th className="px-4 py-2 ">Stars</th>
              <th className="px-4 py-2 ">Public Repos</th>
              <th className="px-4 py-2 ">PRs Merged</th>
              <th className="px-4 py-2 ">Repos Contributed</th>
            </tr>
          </thead>
          <tbody>
            {!loading 
            && filteredData.map((user, idx) => (
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
                    {Array.from({
                      length: Math.ceil(user.contributions.length / 7),
                    }).map((_, weekIndex) => {
                      const week = user.contributions.slice(
                        weekIndex * 7,
                        weekIndex * 7 + 7
                      );
                      return (
                        <div key={weekIndex} className="flex flex-col gap-[1px]">
                          {week.map((day) => (
                            <div
                              key={day.date}
                              title={`${day.date}: ${day.contributionCount} contributions`}
                              className="w-2 h-2 rounded-[2px]"
                              style={{
                                backgroundColor: day.color,
                                minWidth: "8px",
                              }}
                            />
                          ))}
                        </div>
                      );
                    })}
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

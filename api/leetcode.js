// export default async function handler(req, res) {
//     let usernames = req.query.usernames;
  
//     if (!usernames) {
//       return res.status(400).json({ error: "Query parameter 'usernames' is required" });
//     }
  
//     usernames = usernames.split(",");
  
//     try {
//       const results = await Promise.all(usernames.map(async (username) => {
//         const query = `
//         {
//           matchedUser(username: "${username}") {
//             username
//             submitStatsGlobal {
//               acSubmissionNum {
//                 difficulty
//                 count
//               }
//             }
//           }
//         }`;
  
//         const response = await fetch("https://leetcode.com/graphql", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ query }),
//         });
  
//         const json = await response.json();
  
//         if (json.errors) {
//           console.error(`GraphQL error for ${username}:`, json.errors);
//           return { username, error: json.errors };
//         }
  
//         return json.data.matchedUser;
//       }));
  
//       return res.status(200).json(results);
//     } catch (err) {
//       console.error("Server error:", err);
//       return res.status(500).json({ error: "Failed to fetch profiles" });
//     }
//   }
// api/leetcode.js

// export default async function handler(req, res) {
//   let usernames = req.query.usernames;

//   if (!usernames) {
//     return res.status(400).json({ error: "Query parameter 'usernames' is required" });
//   }

//   usernames = usernames.split(",").map(u => u.trim()).filter(Boolean);

//   try {
//     const results = await Promise.all(
//       usernames.map(async (username) => {
//         const query = `
//         {
//           matchedUser(username: "${username}") {
//             username
//             submitStatsGlobal {
//               acSubmissionNum {
//                 difficulty
//                 count
//               }
//             }
//           }
//         }`;

//         const response = await fetch("https://leetcode.com/graphql", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ query }),
//         });

//         if (!response.ok) {
//           console.error("LeetCode request failed for:", username);
//           return { username, error: "Failed to fetch" };
//         }

//         const json = await response.json();
//         const user = json.data?.matchedUser;
//         if (!user) return { username, easySolved: 0, mediumSolved: 0, hardSolved: 0 };

//         const stats = user.submitStatsGlobal?.acSubmissionNum || [];
//         const easy = stats.find((s) => s.difficulty === "Easy")?.count || 0;
//         const medium = stats.find((s) => s.difficulty === "Medium")?.count || 0;
//         const hard = stats.find((s) => s.difficulty === "Hard")?.count || 0;

//         return {
//           username,
//           easySolved: easy,
//           mediumSolved: medium,
//           hardSolved: hard,
//           totalScore: easy + medium * 2 + hard * 3,
//         };
//       })
//     );

//     return res.status(200).json(results);
//   } catch (err) {
//     console.error("Server error:", err);
//     return res.status(500).json({ error: "Failed to fetch profiles" });
//   }
// }

let cache = {}; // { username: { data, lastFetched } }
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const BATCH_SIZE = 20; // batch API calls to prevent overload

export default async function handler(req, res) {
  let usernames = req.query.usernames;

  if (!usernames) {
    return res.status(400).json({ error: "Query parameter 'usernames' is required" });
  }

  usernames = usernames.split(",").map(u => u.trim()).filter(Boolean);

  try {
    const now = Date.now();
    const results = [];

    // Separate cached vs uncached
    const toFetch = [];
    for (const username of usernames) {
      const cached = cache[username];
      if (cached && now - cached.lastFetched < CACHE_DURATION) {
        results.push(cached.data);
      } else {
        toFetch.push(username);
      }
    }

    // Fetch uncached in batches
    for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
      const batch = toFetch.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (username) => {
          const query = `
          {
            matchedUser(username: "${username}") {
              username
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }`;

          const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          });

          if (!response.ok) {
            console.error("LeetCode request failed for:", username);
            return { username, error: "Failed to fetch" };
          }

          const json = await response.json();
          const user = json.data?.matchedUser;
          if (!user) return { username, easySolved: 0, mediumSolved: 0, hardSolved: 0, totalScore: 0 };

          const stats = user.submitStatsGlobal?.acSubmissionNum || [];
          const easy = stats.find((s) => s.difficulty === "Easy")?.count || 0;
          const medium = stats.find((s) => s.difficulty === "Medium")?.count || 0;
          const hard = stats.find((s) => s.difficulty === "Hard")?.count || 0;

          const result = {
            username,
            easySolved: easy,
            mediumSolved: medium,
            hardSolved: hard,
            totalScore: easy + medium * 2 + hard * 3,
          };

          cache[username] = { data: result, lastFetched: now }; // cache it
          return result;
        })
      );

      results.push(...batchResults);
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Failed to fetch profiles" });
  }
}

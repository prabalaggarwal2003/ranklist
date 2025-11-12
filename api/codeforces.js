// export default async function handler(req, res) {
//     const handles = (req.query.handles || "").split(",");
//     const results = [];
  
//     for (const handle of handles) {
//       try {
//         // Fetch user info (rating, rank etc)
//         const userInfoRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
//         const userInfoData = await userInfoRes.json();
//         const userInfo = userInfoData.status === "OK" ? userInfoData.result[0] : null;
  
//         // Fetch submissions to calculate unique problems solved
//         const solvedRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
//         const solvedData = await solvedRes.json();
//         const solvedCount = solvedData.status === "OK" ? 
//           new Set(
//             solvedData.result
//               .filter(sub => sub.verdict === "OK")
//               .map(sub => `${sub.problem.contestId}-${sub.problem.index}`)
//           ).size
//           : 0;
  
//         results.push({
//           handle,
//           userInfo,
//           solvedCount
//         });
  
//       } catch (err) {
//         console.error(`Error fetching data for ${handle}:`, err);
//         results.push({ handle, error: true });
//       }
//     }
  
//     res.status(200).json(results);
//   }

let cache = {}; // { handle: { data, lastFetched } }
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const BATCH_SIZE = 10; // smaller batch due to multiple CF calls

export default async function handler(req, res) {
  const handles = (req.query.handles || "").split(",").map(h => h.trim()).filter(Boolean);
  const results = [];
  const now = Date.now();

  const toFetch = [];

  for (const handle of handles) {
    const cached = cache[handle];
    if (cached && now - cached.lastFetched < CACHE_DURATION) {
      results.push(cached.data);
    } else {
      toFetch.push(handle);
    }
  }

  // Fetch uncached in batches
  for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
    const batch = toFetch.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (handle) => {
        try {
          // Fetch user info
          const userInfoRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
          const userInfoData = await userInfoRes.json();
          const userInfo = userInfoData.status === "OK" ? userInfoData.result[0] : null;

          // Fetch submissions
          const solvedRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
          const solvedData = await solvedRes.json();
          const solvedCount = solvedData.status === "OK"
            ? new Set(solvedData.result.filter(sub => sub.verdict === "OK")
                .map(sub => `${sub.problem.contestId}-${sub.problem.index}`)).size
            : 0;

          const result = { handle, userInfo, solvedCount };
          cache[handle] = { data: result, lastFetched: now }; // cache it
          return result;
        } catch (err) {
          console.error(`Error fetching data for ${handle}:`, err);
          return { handle, error: true };
        }
      })
    );

    results.push(...batchResults);
  }

  res.status(200).json(results);
}

export default async function handler(req, res) {
    const handles = (req.query.handles || "").split(",");
    const results = [];
  
    for (const handle of handles) {
      try {
        // Fetch user info (rating, rank etc)
        const userInfoRes = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const userInfoData = await userInfoRes.json();
        const userInfo = userInfoData.status === "OK" ? userInfoData.result[0] : null;
  
        // Fetch submissions to calculate unique problems solved
        const solvedRes = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const solvedData = await solvedRes.json();
        const solvedCount = solvedData.status === "OK" ? 
          new Set(
            solvedData.result
              .filter(sub => sub.verdict === "OK")
              .map(sub => `${sub.problem.contestId}-${sub.problem.index}`)
          ).size
          : 0;
  
        results.push({
          handle,
          userInfo,
          solvedCount
        });
  
      } catch (err) {
        console.error(`Error fetching data for ${handle}:`, err);
        results.push({ handle, error: true });
      }
    }
  
    res.status(200).json(results);
  }
  
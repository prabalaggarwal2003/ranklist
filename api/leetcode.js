export default async function handler(req, res) {
    let usernames = req.query.usernames;
  
    if (!usernames) {
      return res.status(400).json({ error: "Query parameter 'usernames' is required" });
    }
  
    usernames = usernames.split(",");
  
    try {
      const results = await Promise.all(usernames.map(async (username) => {
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
  
        const json = await response.json();
  
        if (json.errors) {
          console.error(`GraphQL error for ${username}:`, json.errors);
          return { username, error: json.errors };
        }
  
        return json.data.matchedUser;
      }));
  
      return res.status(200).json(results);
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ error: "Failed to fetch profiles" });
    }
  }
  
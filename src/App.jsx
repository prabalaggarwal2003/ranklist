import React from 'react'
import LeetCodeProfile from './components/LeetCodeProfile'

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>My LeetCode Stats</h1>
      <LeetCodeProfile/>
    </div>
  )
}

export default App

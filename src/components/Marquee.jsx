import React from "react";
import MarqueeSection from "./MarqueeSection";

const Marquee = () => {
  const upperMarquee = [
    "🎯 Over 5,000+ questions solved",
    "🔥 Riya Sharma holds top rank",
    "🚀 New domain: DevOps added",
    "🤝 Partnered with GDSC BPIT",
    "🎖️ Most Improved: Tanya Kapoor",
    " "
  ];

  const lowerMarquee = [
    "📈 Weekly stats reset on Aug 1",
    "💡 Track. Rise. Repeat.",
    "🏆 Top Score: 2300 pts",
    "👥 150+ active students",
    "🛠️ Maintained by BPIT Tech Team",
    " "
  ];

  return (
    <div className="container mx-auto overflow-hidden">
      <MarqueeSection items={upperMarquee} from={0} to={"-100%"} />
      <br />
      <MarqueeSection items={lowerMarquee} from={"-100%"} to={0} />
    </div>
  );
};

export default Marquee;

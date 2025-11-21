// SkillsCylinder.jsx
import React, { useEffect, useState } from "react";
import "../css/SkillsCylinder.css";

const skills = [
  "Team Management",
  "Team Leadership",
  "Communication",
  "Business Relationship Management",
  "Leadership",
  "Credit Recovery",
  "Collection Strategy",
  "Business Analysis",
  "Mergers & Acquisitions (M&A)"
];

export default function SkillsCylinder() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % skills.length);
    }, 2000); // change skill every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cylinder-container"> 
    <h2>I am a</h2>
      <div
        className="cylinder"
        style={{
          transform: `rotateX(${currentIndex * -40}deg)`
        }}
      >
        {skills.map((skill, i) => {
          const angle = (360 / skills.length) * i;
          return (
            <div
              key={i}
              className={`cylinder-face ${
                i === currentIndex ? "active" : ""
              }`}
              style={{
                transform: `rotateX(${angle}deg) translateZ(100px)`
              }}
            >
              {skill}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";

const skills = [
  "Team Management",
  "Team Leadership",
  "Communication",
  "Business Relationship Management",
  "Leadership",
  "Credit Recovery",
  "Collection Strategy",
  "Business Analysis",
  "Mergers & Acquisitions (M&A)",
];

// export default function () {
//   const [displayText, setDisplayText] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (currentIndex < text.length) {
//       const timeout = setTimeout(
//         () => {
//           setDisplayText((prev) => prev + text[currentIndex]);
//           setCurrentIndex((prev) => prev + 1);
//         },
//         currentIndex === 0 ? delay : speed
//       );

//       return () => clearTimeout(timeout);
//     }
//   }, [currentIndex, text, speed, delay]);

//   return (
//     <span className="font-mono">
//       {displayText}
//       <span className="animate-pulse">|</span>
//     </span>
//   );
// }

export default function ({ texts, speed = 80, pauseTime = 2000, deleteSpeed = 40 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing phase
        if (currentIndex < currentText.length) {
          setDisplayText(currentText.slice(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        } else {
          // Finished typing, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        // Deleting phase
        if (currentIndex > 0) {
          setDisplayText(currentText.slice(0, currentIndex - 1));
          setCurrentIndex(prev => prev - 1);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime]);


  return (
    <span className="font-mono text-3xl">
      {displayText}
      <span className="animate-pulse text-blue-400">|</span>
    </span>
  );
}

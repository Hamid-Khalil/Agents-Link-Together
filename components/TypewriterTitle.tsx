import React, { useState, useEffect } from 'react';

interface TypewriterTitleProps {
  lines: string[];
  className?: string;
  speed?: number;
}

const TypewriterTitle: React.FC<TypewriterTitleProps> = ({ lines, className, speed = 75 }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>(lines.map(() => ""));
  const [isCursorVisible, setIsCursorVisible] = useState(true);

  useEffect(() => {
    // Reset state on mount or when lines change
    setDisplayedLines(lines.map(() => ""));
    
    let lineIndex = 0;
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (lineIndex >= lines.length) {
        clearInterval(typeInterval);
        return;
      }

      const currentLineFullText = lines[lineIndex];

      if (charIndex <= currentLineFullText.length) {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          newLines[lineIndex] = currentLineFullText.slice(0, charIndex);
          return newLines;
        });
        charIndex++;
      } else {
        // Move to next line after a brief pause (simulated by extra ticks or just immediately next tick)
        lineIndex++;
        charIndex = 0;
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [lines, speed]);

  return (
    <h2 className={className}>
      {displayedLines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
      <span className="inline-block ml-2 text-cyan-400 animate-pulse font-mono">_</span>
    </h2>
  );
};

export default TypewriterTitle;
'use client';
import React, { useState, useEffect } from 'react';

interface Command {
  prompt: string;
  response: string;
}

interface Props {
  previousCommands: Command[];
  setPreviousCommands: React.Dispatch<React.SetStateAction<Command[]>>;
  currentPath: string;
  previousPaths: string[];
  inputRef: React.RefObject<HTMLInputElement>;
}

export default function CommandLineOutput({
  previousCommands,
  setPreviousCommands,
  currentPath,
  previousPaths,
  inputRef
} : Props) {
  const [displayedResponses, setDisplayedResponses] = useState<string[]>([]);

  useEffect(() => {
    const updateDisplayedResponses = () => {
      previousCommands.forEach((command, index) => {
        const characters = command.response.split('');
        let currentResponse = '';
        
        characters.forEach((char, charIndex) => {
          setTimeout(() => {
            currentResponse += char;
            setDisplayedResponses(prev => {
              const newResponses = [...prev];
              newResponses[index] = currentResponse;
              return newResponses;
            });
            if (index === previousCommands.length - 1 && charIndex === characters.length - 1) {
              inputRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
          }, charIndex * 3);
        });
      });
    };

    updateDisplayedResponses();
  }, [previousCommands]);

  return (
    <div className="flex flex-col">
      {previousCommands.map((command, index) => (
        <div key={index}>
          <div className="flex flex-row">
            <span className="text-green-500 glow">user@leomosley.com:</span>
            <span className="text-blue-400 glow">{previousPaths[index]}</span>
            <span className="text-teal-100 glow">$&nbsp;</span>
            <span className="text-teal-100 glow">{command.prompt}</span>
          </div>
          <pre className="glow text-purple transition duration-1000 ease-in">
            {index === (previousCommands.length-1)?
              displayedResponses[index] : command.response
            }
          </pre>
        </div>
      ))}
    </div>
  );
}

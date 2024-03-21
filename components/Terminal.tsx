'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Files } from '@/files';

import CommandLineInput from './CommandLineInput';
import CommandLineOutput from './CommandLineOutput';

interface Command {
  prompt: string;
  response: string;
}

interface Props {
  files: Files
}

const welcomeMessage = `~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

██▓    ▓█████  ▒█████      ███▄ ▄███▓ ▒█████    ██████  ██▓    ▓█████▓██   ██▓
▓██▒    ▓█   ▀ ▒██▒  ██▒   ▓██▒▀█▀ ██▒▒██▒  ██▒▒██    ▒ ▓██▒    ▓█   ▀ ▒██  ██▒
▒██░    ▒███   ▒██░  ██▒   ▓██    ▓██░▒██░  ██▒░ ▓██▄   ▒██░    ▒███    ▒██ ██░
▒██░    ▒▓█  ▄ ▒██   ██░   ▒██    ▒██ ▒██   ██░  ▒   ██▒▒██░    ▒▓█  ▄  ░ ▐██▓░
░██████▒░▒████▒░ ████▓▒░   ▒██▒   ░██▒░ ████▓▒░▒██████▒▒░██████▒░▒████▒ ░ ██▒▓░
░ ▒░▓  ░░░ ▒░ ░░ ▒░▒░▒░    ░ ▒░   ░  ░░ ▒░▒░▒░ ▒ ▒▓▒ ▒ ░░ ▒░▓  ░░░ ▒░ ░  ██▒▒▒ 
░ ░ ▒  ░ ░ ░  ░  ░ ▒ ▒░    ░  ░      ░  ░ ▒ ▒░ ░ ░▒  ░ ░░ ░ ▒  ░ ░ ░  ░▓██ ░▒░ 
  ░ ░      ░   ░ ░ ░ ▒     ░      ░   ░ ░ ░ ▒  ░  ░  ░    ░ ░      ░   ▒ ▒ ░░  
    ░  ░   ░  ░    ░ ░            ░       ░ ░        ░      ░  ░   ░  ░░ ░     
                                                                       ░ ░     
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Welcome to Leo Mosley's Interactive Terminal Portfolio.

Type 'portfolio' to be redirected to the portfolio web page.
For a list of available commands, type 'help'.`;

export default function Terminal({
  files
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [previousCommands, setPreviousCommands] = useState<Command[]>([
    {prompt: "welcome", response: welcomeMessage}
  ]);
  const [currentPath, setCurrentPath] = useState<string>('~');
  const [previousPaths, setPreviousPaths] = useState<string[]>([currentPath]);
  const [previousPath, setPreviousPath] = useState<string>('~');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreviousPath(previousPaths[previousPaths.length-1]);
  }, [previousPaths]);

  const handleDivClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    document.addEventListener("click", handleDivClick);
    return () => {
      document.removeEventListener("click", handleDivClick);
    };
  }, [containerRef]);

  return (
    <div ref={containerRef} className="bg-neutral-950 p-2 font-mono">
      <CommandLineOutput 
        previousCommands={previousCommands}
        setPreviousCommands={setPreviousCommands}
        currentPath={currentPath}
        previousPaths={previousPaths}
        inputRef={inputRef}
      />
      <CommandLineInput 
        files={files}
        loading={loading}
        setLoading={setLoading}
        previousCommands={previousCommands}
        setPreviousCommands={setPreviousCommands}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        previousPaths={previousPaths}
        setPreviousPaths={setPreviousPaths}
        previousPath={previousPath}
        setPreviousPath={setPreviousPath}
        inputRef={inputRef}
      />
    </div>
  );
}
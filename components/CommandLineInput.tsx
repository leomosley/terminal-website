"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Files } from "@/files";

interface Command {
  prompt: string;
  response: string;
}

interface Props {
  files: Files;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  previousCommands: Command[];
  setPreviousCommands: React.Dispatch<React.SetStateAction<Command[]>>;
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  previousPaths: string[];
  setPreviousPaths: React.Dispatch<React.SetStateAction<string[]>>;
  previousPath: string;
  setPreviousPath: React.Dispatch<React.SetStateAction<string>>;
  inputRef:  React.RefObject<HTMLInputElement>;
}

const paths: {[key: string]: string[]} = {
  "~": ["about", "projects", "contact"],
  "/about": [""],
  "/projects": [""],
  "/contact": [""],
};

export default function CommandLineInput({
  files,
  loading,
  setLoading,
  previousCommands,
  setPreviousCommands,
  currentPath,
  setCurrentPath,
  previousPaths,
  setPreviousPaths,
  previousPath,
  setPreviousPath,
  inputRef
} : Props) {
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>("");
  const [dir, setDir] = useState<string[]>(paths[currentPath]);
  const [caretPosition, setCaretPosition] = useState<number | null>(null);
  const [labelWidth, setLabelWidth] = useState<number | null>(null);
  const [promptIndex, setPromptIndex] = useState<number | null>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setDir(paths[currentPath]);
  }, [currentPath]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    let response = runCommand(inputValue);
    if (response !== "clear") {
      setPreviousCommands(prev => 
        [...prev, { prompt: inputValue, response: response }]
      );
    } 
    if (currentPath !== previousPath) {
      setPreviousPath(currentPath);
    }
    setPreviousPaths(prev => [...prev, currentPath]);
    setInputValue("");
    setCaretPosition(0);
    setLoading(false);
  }
  
  const createError = (name: string, message?: string) => {
    let error = new Error(message && message);
    error.name = name;
    return error;
  }
  
  const help = (arg: string): string => {
    if (!arg) {
      let output = "";
      let max = Math.max(...Object.keys(commands).map(command => command.length));
      for (let command of Object.keys(commands)) {
        let padding = ' '.repeat(max - command.length + 4);
        output += `${command}${padding}${commands[command].desc}\n`;
      }
      return output;
    } else {
      throw createError("BadArgument", "help doesnt take any arguments.")
    }
  }
  
  const ls = (arg: string): string => {
    if (!arg) {
      let output = dir.join("\n");
      output += output && "\n"
      output += files[currentPath].map(item => item.filename).join("\n");
      return output;
    } else {
      throw createError("BadArgument", "ls doesnt take any arguments.")
    }
  }
  
  const cd = (arg: string): string => {
    if (!arg) {
      throw createError("BadArgument", "Provide an argument.");
    }
  
    const navigateUp = (current: string, levels: number): string => {
      const segments = current.split("/").filter(Boolean);
      const remainingLevels = Math.max(0, segments.length - levels);
      const newPath = remainingLevels > 0 ? `/${segments.slice(0, remainingLevels).join("/")}` : "~";
      return newPath;
    };
  
    let newPath;
    if (arg.startsWith("..")) {
      newPath = navigateUp(currentPath, 1);
    } else {
      let potentialPath = currentPath !== "~" ? `${currentPath}/${arg}` : `/${arg}`;
  
      if (dir.includes(arg)) {
        newPath = potentialPath;
      } else {
        throw createError("BadArgument", "Cannot find the path specified.");
      }
    }
    setCurrentPath(newPath);
    return "";
  };
  
  const clear = (arg: string): string => {
    if (!arg) {
      setPreviousCommands([]);
      setPreviousPaths([]);
      setPreviousPath("~");
      return "clear";
    } else {
      throw createError("BadArgument", "clear doesnt take any arguments.")
    }
  }

  const echo = (arg: string): string => {
    if (arg) {
      return arg;
    } else {
      throw createError("BadArgument", "Provide a message to echo.");
    }
  }
  
  const open = (arg: string): string => {
    if (arg) {
      let filtered = files[currentPath].filter(f => f.filename === arg);
      if (filtered) {
        window.open(`https://www.leomosley.com/projects/${arg}`, '_blank')?.focus();
      } else {
        throw createError("BadArgument", "Cannot find specified file.");
      }
      return "Opening project..."; 
    } else {
      throw createError("BadArgument", "Provide a file to open.");
    }
  }

  const portfolio = (arg: string): string => {
    if (!arg) {
      router.push('/');
      return 'Redirecting to portfolio...';
    } else {
      throw createError("BadArgument", "portfolio doesnt take any arguments.")
    }
  }

  const github = (arg: string): string => {
    if (!arg) {
      router.replace("https://github.com/leomosley");
      return 'Opening github...';
    } else {
      throw createError("BadArgument", "github doesnt take any arguments.")
    }
  }

  const commands: {[key: string]: {cmd: (arg: string) => string, desc: string}} = {
    "help": {cmd: help, desc: "Lists all commands and what they do"},
    "ls": {cmd: ls, desc: "Lists all files and sub-sdirectories in current directory"},
    "cd": {cmd: cd, desc: "Use to change directory | cd <path> | cd .. to go up a level"},
    "clear": {cmd: clear, desc: "Clears terminal"},
    "echo": {cmd: echo, desc: "Displays messages | echo <message>"},
    "open": {cmd: open, desc: "Opens file in terminal | open <filename>"},
    "portfolio": {cmd: portfolio, desc: "Opens my portfolio page"},
    "github": {cmd: github, desc: "Opens my github profile"}
  };
  
  const runCommand = (prompt: string): string => {
    let response = "";
    let parsed = prompt.toLowerCase().trim().split(" ");
    let command;
    let argument;
    
    try {
      if (!parsed || !prompt) {
        throw createError("NoInput");
      }    

      command = parsed[0];
      argument = parsed.toSpliced(0, 1).join(" ") || "";

      if (!Object.keys(commands).includes(command)) {
        throw createError("NotRecognised");
      }
      
      response = commands[command].cmd(argument);

    } catch (error) {
      if (error instanceof Error) {
        switch (error.name) {
          case "NotRecognised":
            response = `"${command}" is not recongnised as command. Type "help" for a list of commands.`
            break;
          
          case "BadArgument":
            response = error.message
            break;
          
          case "NoInput":
            break;

          default:
            break;
        }
      }
    }
    return response;
  }

  const handleCaretMove = () => {
    if (inputRef.current) {
      const caretPos = inputRef.current.selectionStart;
      setCaretPosition(caretPos);
    }
  };

  const handleArrowKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      setTimeout(handleCaretMove, 0);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleCaretMove();
    setInputValue(e.target.value);
  };

  useEffect(() => {
    inputRef.current?.addEventListener('input', handleChange as any);
    inputRef.current?.addEventListener('keydown', handleArrowKey as any);

    return () => {
      inputRef.current?.removeEventListener('input', handleChange as any);
      inputRef.current?.removeEventListener('keydown', handleArrowKey as any);
    };
  }, [inputRef]);


  useEffect(() => {
    const label = labelRef.current;

    const observer = new MutationObserver((mutations) => {
      setLabelWidth(label?.getBoundingClientRect().width || null);
    });

    const config = { characterData: true, subtree: true };
    if (label) {
      observer.observe(label, config);
    }

    return () => {
      observer.disconnect();
    };
  }, [labelRef.current]);
  
  return (
    <form className="flex" onSubmit={submit}>
      <div ref={labelRef}>
        <span className="text-green-500 glow">user@leomosley.com:</span>
        <span className="text-blue-400 glow">{currentPath}</span>
        <span className="text-teal-100 glow">$&nbsp;</span>
      </div>
      <input
        ref={inputRef}
        className={clsx(
          "w-full",
          "bg-transparent outline-none",
          "square-caret",
          "caret-transparent",
          "text-teal-100",
          "glow"
        )}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={loading}
      ></input>
      <div className="caret bg-purple"
        style={{ left: `${(labelWidth? labelWidth : 193) + ((caretPosition ?? 0)+1) * 8.75}px` }}
      ></div>
    </form>
  );
}

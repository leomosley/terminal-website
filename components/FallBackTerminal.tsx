import React from 'react'

export default function FallBackTerminal() {
  return (
    <div className="bg-neutral-900 p-2 font-mono">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex flex-row">
            <span className="text-green-500 glow">user@terminal:</span>
          <span className="text-blue-400 glow">~</span>
            <span className="text-teal-100 glow">$&nbsp;</span>
          </div>
          <span 
            className="text-teal-100 glow"
          ></span>
          <div style={{ left: "193px" }} className="caret glow"></div>
        </div>
      </div>
    </div>
  )
}

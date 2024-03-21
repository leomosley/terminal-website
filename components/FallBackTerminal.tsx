import React from 'react'

export default function FallBackTerminal() {
  return (
    <div className="bg-neutral-900 p-2 font-mono">
      <div className="flex flex-col">
        <div className="flex flex-row">
          <span 
            className="text-green-500 glow"
          >user@leomosley.com:$&nbsp;</span>
          <span 
            className="text-teal-100 glow"
          ></span>
          <div style={{ left: "193px" }} className="caret glow"></div>
        </div>
      </div>
    </div>
  )
}

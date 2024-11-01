import React, { useState } from 'react';
import { Info, Shield, Key, FileText, ChevronDown, ChevronUp, Minimize2 } from 'lucide-react';

const InfoPanel = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="retro-window mb-8">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-900/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold retro-glow text-cyan-400">ABOUT EZ_XOR</h2>
        </div>
        <button className="retro-button p-2">
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <Minimize2 className="w-4 h-4" />
              <span>MINIMIZE</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              <span>EXPAND</span>
            </div>
          )}
        </button>
      </div>

      {/* Animated content container */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="retro-content p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Features Section */}
            <div className="retro-section">
              <h3 className="text-sm font-bold mb-3 retro-glow text-cyan-400 flex items-center gap-2">
                <Shield className="w-4 h-4" /> FEATURES
              </h3>
              <ul className="space-y-2 text-cyan-400">
                <li className="flex items-start gap-2">
                  • XOR encryption for secure message encoding
                </li>
                <li className="flex items-start gap-2">
                  • Generate random encryption keys
                </li>
                <li className="flex items-start gap-2">
                  • Download encrypted messages and keys
                </li>
                <li className="flex items-start gap-2">
                  • Copy/paste support for all fields
                </li>
                <li className="flex items-start gap-2">
                  • File upload for keys and messages
                </li>
              </ul>
            </div>

            {/* Quick Start Section */}
            <div className="retro-section">
              <h3 className="text-sm font-bold mb-3 retro-glow text-cyan-400 flex items-center gap-2">
                <Key className="w-4 h-4" /> QUICK START
              </h3>
              <div className="space-y-3 text-cyan-400">
                <p className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                  To encrypt: Enter key length, generate key, type message, click ENCRYPT. Save both key and encrypted message.
                </p>
                <p className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-1 flex-shrink-0" />
                  To decrypt: Paste or upload encrypted message and matching key, click DECRYPT to reveal the original message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
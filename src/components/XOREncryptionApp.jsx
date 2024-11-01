/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Download, Lock, Unlock, Copy, RefreshCw } from 'lucide-react';
import Background from './Background';

const XOREncryptionApp = () => {
  const [activeTab, setActiveTab] = useState('encrypt');
  const [keyLength, setKeyLength] = useState(32);
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [encodedMessage, setEncodedMessage] = useState('');
  const [messageToDecrypt, setMessageToDecrypt] = useState('');
  const [uploadedKey, setUploadedKey] = useState('');
  const [decodedMessage, setDecodedMessage] = useState('');
  const [keyFilename, setKeyFilename] = useState('encryption-key');
  const [messageFilename, setMessageFilename] = useState('encrypted-message');

  const generateKey = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleGenerateKey = () => {
    setKey(generateKey(keyLength));
  };

  const xorCrypt = (text, key) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };

  const handleEncrypt = () => {
    if (!message) return;
    if (!key) {
      handleGenerateKey();
      return;
    }
    const encoded = xorCrypt(message, key);
    setEncodedMessage(btoa(encoded));
  };

  const handleDecrypt = () => {
    if (!uploadedKey || !messageToDecrypt) return;
    try {
      const decodedText = atob(messageToDecrypt);
      const decoded = xorCrypt(decodedText, uploadedKey);
      setDecodedMessage(decoded);
    } catch (err) {
      setDecodedMessage('Error: Invalid input - please ensure you have copied the entire encrypted message');
    }
  };

  const downloadFile = (content, filename, extension = 'txt') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKeyUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedKey(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen font-mono relative">
      <Background />
      <div className="relative z-50">
        <div className="retro-window">
          <h1 className="text-2xl font-bold text-center mb-6 retro-glow text-cyan-400">QIKAYON&apos;S EZ_XOR</h1>
          
          <div className="retro-content">
            {/* Tab Headers */}
            <div className="flex border-b border-blue-900">
              <button
                className={`flex items-center gap-2 px-6 py-3 retro-tab text-cyan-400 ${
                  activeTab === 'encrypt' ? 'active retro-glow' : ''
                }`}
                onClick={() => setActiveTab('encrypt')}
              >
                <Lock className="w-4 h-4" /> ENCRYPT
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-3 retro-tab text-cyan-400 ${
                  activeTab === 'decrypt' ? 'active retro-glow' : ''
                }`}
                onClick={() => setActiveTab('decrypt')}
              >
                <Unlock className="w-4 h-4" /> DECRYPT
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 retro-inset">
              {activeTab === 'encrypt' ? (
                // Encryption Section
                <div className="space-y-4">
                  <div className="retro-section">
                    <label className="block text-sm mb-1 retro-glow text-cyan-400">KEY CONFIGURATION</label>
                    <div className="mb-4">
                      <input
                        type="number"
                        min="1"
                        value={keyLength}
                        onChange={(e) => setKeyLength(parseInt(e.target.value))}
                        className="w-full p-2 retro-input"
                      />
                    </div>

                    <div className="flex gap-2 items-end mb-4">
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={key}
                          readOnly
                          className="w-full p-2 retro-input"
                          placeholder="CLICK GENERATE TO PREVIEW KEY..."
                        />
                      </div>
                      <button
                        onClick={handleGenerateKey}
                        className="retro-button p-2"
                        title="Generate new key"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={keyFilename}
                        onChange={(e) => setKeyFilename(e.target.value)}
                        placeholder="KEY FILENAME"
                        className="flex-grow p-2 retro-input"
                      />
                      <button
                        onClick={() => copyToClipboard(key)}
                        className="retro-button p-2"
                        title="Copy key"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => downloadFile(key, keyFilename)}
                        className="retro-button p-2"
                        title="Download key"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="retro-section">
                    <label className="block text-sm mb-1 retro-glow text-cyan-400">MESSAGE INPUT</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2 h-24 retro-input mb-4"
                      placeholder="ENTER YOUR MESSAGE..."
                    />
                    <button
                      onClick={handleEncrypt}
                      className="w-full retro-button p-2"
                    >
                      ENCRYPT
                    </button>
                  </div>

                  {encodedMessage && (
                    <div className="retro-section">
                      <label className="block text-sm mb-1 retro-glow text-cyan-400">ENCRYPTED OUTPUT</label>
                      <textarea
                        value={encodedMessage}
                        readOnly
                        className="w-full p-2 h-24 retro-input mb-4"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={messageFilename}
                          onChange={(e) => setMessageFilename(e.target.value)}
                          placeholder="MESSAGE FILENAME"
                          className="flex-grow p-2 retro-input"
                        />
                        <button
                          onClick={() => copyToClipboard(encodedMessage)}
                          className="retro-button p-2"
                          title="Copy message"
                        >
                          <Copy className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => downloadFile(encodedMessage, messageFilename)}
                          className="retro-button p-2"
                          title="Download message"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Decryption Section
                <div className="space-y-4">
                  <div className="retro-section">
                    <label className="block text-sm mb-1 retro-glow text-cyan-400">ENCRYPTED MESSAGE</label>
                    <div className="space-y-2">
                      <textarea
                        value={messageToDecrypt}
                        onChange={(e) => setMessageToDecrypt(e.target.value)}
                        className="w-full p-2 h-24 retro-input"
                        placeholder="PASTE ENCRYPTED MESSAGE OR UPLOAD FILE..."
                      />
                      <div className="flex gap-2">
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => setMessageToDecrypt(e.target.result);
                              reader.readAsText(file);
                            }
                          }}
                          className="flex-grow p-2 retro-input"
                          accept=".txt"
                        />
                        <button
                          onClick={() => setMessageToDecrypt('')}
                          className="retro-button p-2"
                        >
                          CLEAR
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="retro-section">
                    <label className="block text-sm mb-1 retro-glow text-cyan-400">DECRYPTION KEY</label>
                    <div className="space-y-2">
                      <textarea
                        value={uploadedKey}
                        onChange={(e) => setUploadedKey(e.target.value)}
                        className="w-full p-2 h-24 retro-input"
                        placeholder="PASTE KEY OR UPLOAD KEY FILE..."
                      />
                      <div className="flex gap-2">
                        <input
                          type="file"
                          onChange={handleKeyUpload}
                          className="flex-grow p-2 retro-input"
                          accept=".txt"
                        />
                        <button
                          onClick={() => setUploadedKey('')}
                          className="retro-button p-2"
                        >
                          CLEAR
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleDecrypt}
                    className="w-full retro-button p-2 text-cyan-400"
                    disabled={!uploadedKey || !messageToDecrypt}
                  >
                    DECRYPT
                  </button>

                  {decodedMessage && (
                    <div className="retro-section">
                      <label className="block text-sm mb-1 retro-glow text-cyan-400">DECODED MESSAGE</label>
                      <textarea
                        value={decodedMessage}
                        readOnly
                        className="w-full p-2 h-24 retro-input mb-4"
                      />
                      <button
                        onClick={() => copyToClipboard(decodedMessage)}
                        className="w-full retro-button p-2"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Copy className="w-4 h-4" /> COPY DECODED MESSAGE
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XOREncryptionApp;
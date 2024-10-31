import React, { useState } from 'react';
import { Download, Lock, Unlock, Copy, RefreshCw } from 'lucide-react';

const XOREncryptionApp = () => {
  // State management
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

  // Generate random key of specified length
  const generateKey = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Generate new key without encrypting
  const handleGenerateKey = () => {
    setKey(generateKey(keyLength));
  };

  // XOR encrypt/decrypt function
  const xorCrypt = (text, key) => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  };

  // Handle encryption
  const handleEncrypt = () => {
    if (!message) return;
    if (!key) {
      handleGenerateKey();
      return;
    }
    const encoded = xorCrypt(message, key);
    setEncodedMessage(btoa(encoded)); // Convert to base64 for safe display
  };

  // Handle decryption
  const handleDecrypt = () => {
    if (!uploadedKey || !messageToDecrypt) return;
    try {
      const decodedText = atob(messageToDecrypt); // Convert from base64
      const decoded = xorCrypt(decodedText, uploadedKey);
      setDecodedMessage(decoded);
    } catch (err) {
      setDecodedMessage('Error: Invalid input - please ensure you have copied the entire encrypted message');
    }
  };

  // Handle file download
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

  // Copy to clipboard function
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle key upload
  const handleKeyUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedKey(e.target.result);
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Tab Headers */}
        <div className="flex border-b">
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'encrypt'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('encrypt')}
          >
            <Lock className="w-4 h-4" /> Encrypt
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium text-sm focus:outline-none ${
              activeTab === 'decrypt'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('decrypt')}
          >
            <Unlock className="w-4 h-4" /> Decrypt
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'encrypt' ? (
            // Encryption Section
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Key Length</label>
                <input
                  type="number"
                  min="1"
                  value={keyLength}
                  onChange={(e) => setKeyLength(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex gap-2 items-end">
                <div className="flex-grow">
                  <label className="block text-sm font-medium mb-1">Key Preview</label>
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="w-full p-2 border rounded bg-gray-50"
                    placeholder="Click generate to preview key..."
                  />
                </div>
                <button
                  onClick={handleGenerateKey}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300"
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
                  placeholder="Key filename"
                  className="flex-grow p-2 border rounded"
                />
                <button
                  onClick={() => copyToClipboard(key)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  title="Copy key"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => downloadFile(key, keyFilename)}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  title="Download key"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message to Encrypt</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded h-24"
                  placeholder="Enter your message..."
                />
              </div>

              <button
                onClick={handleEncrypt}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Encrypt
              </button>

              {encodedMessage && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Encoded Message</label>
                    <textarea
                      value={encodedMessage}
                      readOnly
                      className="w-full p-2 border rounded h-24 bg-gray-50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageFilename}
                      onChange={(e) => setMessageFilename(e.target.value)}
                      placeholder="Message filename"
                      className="flex-grow p-2 border rounded"
                    />
                    <button
                      onClick={() => copyToClipboard(encodedMessage)}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                      title="Copy message"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => downloadFile(encodedMessage, messageFilename)}
                      className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                      title="Download message"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Decryption Section
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Encrypted Message</label>
                <div className="space-y-2">
                  <textarea
                    value={messageToDecrypt}
                    onChange={(e) => setMessageToDecrypt(e.target.value)}
                    className="w-full p-2 border rounded h-24"
                    placeholder="Paste encrypted message or upload file..."
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
                      className="flex-grow p-2 border rounded"
                      accept=".txt"
                    />
                    <button
                      onClick={() => setMessageToDecrypt('')}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Decryption Key</label>
                <div className="space-y-2">
                  <textarea
                    value={uploadedKey}
                    onChange={(e) => setUploadedKey(e.target.value)}
                    className="w-full p-2 border rounded h-24"
                    placeholder="Paste key or upload key file..."
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      onChange={handleKeyUpload}
                      className="flex-grow p-2 border rounded"
                      accept=".txt"
                    />
                    <button
                      onClick={() => setUploadedKey('')}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDecrypt}
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 disabled:bg-gray-300"
                disabled={!uploadedKey || !messageToDecrypt}
              >
                Decrypt
              </button>

              {decodedMessage && (
                <div>
                  <label className="block text-sm font-medium mb-1">Decoded Message</label>
                  <textarea
                    value={decodedMessage}
                    readOnly
                    className="w-full p-2 border rounded h-24 bg-gray-50"
                  />
                  <button
                    onClick={() => copyToClipboard(decodedMessage)}
                    className="mt-2 flex items-center gap-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Copy className="w-4 h-4" /> Copy Decoded Message
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XOREncryptionApp;

import React, { useEffect, useRef } from 'react';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  logs: string[];
}

export const LogModal: React.FC<LogModalProps> = ({ isOpen, onClose, appName, logs }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="material-icons text-blue-600">terminal</span>
            <h2 className="text-xl font-bold text-gray-900">로그: {appName}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="p-4 bg-gray-900 flex-grow overflow-y-auto font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="whitespace-pre-wrap text-gray-300">
              <span className="text-gray-500 mr-4 select-none">{String(index + 1).padStart(4, ' ')}</span>
              {log}
            </div>
          ))}
          <div ref={endOfLogsRef} />
        </div>
      </div>
    </div>
  );
};
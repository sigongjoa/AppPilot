
import React from 'react';

interface HeaderProps {
  onAddNewApp: () => void;
  showAddNewAppButton: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onAddNewApp, showAddNewAppButton }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">앱 관리자</h1>
      {showAddNewAppButton && (
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300" onClick={onAddNewApp}>
          <span className="material-icons mr-2">add</span>
          새 앱 추가
        </button>
      )}
    </header>
  );
};
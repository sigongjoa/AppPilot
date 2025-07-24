import React from 'react';
import { App, AppStatus, DevStage } from '../types';

interface AppCardProps {
  app: App;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onViewLogs: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const statusKorean = {
  [AppStatus.RUNNING]: '실행 중',
  [AppStatus.STOPPED]: '중지됨',
};

const devStageKorean = {
  [DevStage.PLANNING]: '기획',
  [DevStage.DEVELOPMENT]: '개발',
  [DevStage.DEPLOYED]: '배포',
};

const statusColorMap = {
  [AppStatus.RUNNING]: 'bg-green-500 text-green-600',
  [AppStatus.STOPPED]: 'bg-red-500 text-red-600',
};

const devStageConfig = {
  [DevStage.PLANNING]: {
    tagClass: 'bg-purple-100 text-purple-800',
    icon: 'photo_camera',
  },
  [DevStage.DEVELOPMENT]: {
    tagClass: 'bg-blue-100 text-blue-800',
    icon: 'code',
  },
  [DevStage.DEPLOYED]: {
    tagClass: 'bg-green-100 text-green-800',
    icon: 'cloud_upload',
  },
};

export const AppCard: React.FC<AppCardProps> = ({ app, onStart, onStop, onViewLogs, onEdit, onDelete, onViewDetails }) => {
  const isRunning = app.status === AppStatus.RUNNING;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div onClick={() => onViewDetails(app.id)} className="cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${devStageConfig[app.devStage].tagClass}`}>
            <span className="material-icons text-sm mr-1">{devStageConfig[app.devStage].icon}</span>
            {devStageKorean[app.devStage]}
          </span>
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full ${statusColorMap[app.status].split(' ')[0]} mr-2`}></span>
            <span className={`text-sm font-medium ${statusColorMap[app.status].split(' ')[1]}`}>{statusKorean[app.status]}</span>
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2">{app.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{app.description}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          {app.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="bg-gray-200 text-gray-700 px-2 py-1 rounded">{tech}</span>
          ))}
          {app.techStack.length > 3 && (
            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded">+{app.techStack.length - 3} 더보기</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-3 text-gray-500">
          <span className="material-icons cursor-pointer hover:text-gray-800 transition-colors" onClick={() => onViewLogs(app.id)}>terminal</span>
          <span className="material-icons cursor-pointer hover:text-gray-800 transition-colors" onClick={() => onEdit(app.id)}>code_off</span>
        </div>
        <div className="flex space-x-3 text-gray-500">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => isRunning ? onStop(app.id) : onStart(app.id)}>
            <span className={`material-icons ${isRunning ? 'text-yellow-500' : 'text-green-500'}`}>{isRunning ? 'pause' : 'play_arrow'}</span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" onClick={() => onDelete(app.id)}>
            <span className="material-icons text-red-500">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
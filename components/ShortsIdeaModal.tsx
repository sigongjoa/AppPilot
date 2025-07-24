import React, { useState, useEffect } from 'react';
import { ShortIdea, ShortIdeaStatus } from '../types';

interface ShortsIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idea: ShortIdea | null;
  onUpdate: (id: string, updatedData: Partial<ShortIdea>) => void;
}

const statusOrder: ShortIdeaStatus[] = ['Idea', 'Planning', 'Scripting', 'Filming', 'Editing', 'Uploaded'];

const statusKorean = {
    Idea: '아이디어',
    Planning: '기획',
    Scripting: '대본 작성',
    Filming: '촬영',
    Editing: '편집',
    Uploaded: '업로드 완료',
};

export const ShortsIdeaModal: React.FC<ShortsIdeaModalProps> = ({ isOpen, onClose, idea, onUpdate }) => {
  const [localIdea, setLocalIdea] = useState<ShortIdea | null>(null);

  useEffect(() => {
    if (idea) {
      setLocalIdea(JSON.parse(JSON.stringify(idea))); // Deep copy to avoid direct mutation
    } else {
      setLocalIdea(null);
    }
  }, [idea]);

  const handleUpdate = <K extends keyof ShortIdea>(key: K, value: ShortIdea[K]) => {
    if (localIdea) {
      const updatedIdea = { ...localIdea, [key]: value };
      setLocalIdea(updatedIdea);
      onUpdate(localIdea.id, { [key]: value });
    }
  };

  const handleNoteChange = (status: ShortIdeaStatus, text: string) => {
    if (localIdea) {
        const newNotes = { ...(localIdea.statusNotes || {}), [status]: text };
        handleUpdate('statusNotes', newNotes);
    }
  };

  if (!isOpen || !localIdea) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-gray-200">
            <div>
                <input 
                    type="text"
                    value={localIdea.title}
                    onChange={(e) => handleUpdate('title', e.target.value)}
                    className="text-2xl font-bold text-gray-900 w-full border-none focus:ring-0 p-0"
                />
                <textarea
                    value={localIdea.description}
                    onChange={(e) => handleUpdate('description', e.target.value)}
                    rows={2}
                    className="text-gray-600 mt-1 w-full border-none focus:ring-0 p-0"
                />
            </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">진행 상태</label>
                <select 
                    value={localIdea.status}
                    onChange={(e) => handleUpdate('status', e.target.value as ShortIdeaStatus)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                >
                    {statusOrder.map(status => (
                        <option key={status} value={status}>{statusKorean[status]}</option>
                    ))}
                </select>
            </div>

            <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">상태별 메모</h4>
                <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{statusKorean[localIdea.status]}</label>
                            <textarea 
                                rows={5}
                                value={localIdea.statusNotes?.[localIdea.status] || ''}
                                onChange={(e) => handleNoteChange(localIdea.status, e.target.value)}
                                placeholder={`${statusKorean[localIdea.status]} 단계의 진행 상황, 아이디어, 필요한 자료 등을 기록하세요...`}
                                className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                </div>
            </div>
        </div>

        <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">닫기</button>
        </div>
      </div>
    </div>
  );
};
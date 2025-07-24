import React, { useState, useEffect, useCallback } from 'react';
import { ShortIdea } from '../types';
import { ShortsIdeaModal } from './ShortsIdeaModal';

const statusOrder = ['Idea', 'Planning', 'Scripting', 'Filming', 'Editing', 'Uploaded'];

const statusKorean = {
    Idea: '아이디어',
    Planning: '기획',
    Scripting: '대본 작성',
    Filming: '촬영',
    Editing: '편집',
    Uploaded: '업로드 완료',
};

const statusColors = {
    Idea: 'bg-gray-200 text-gray-800',
    Planning: 'bg-blue-200 text-blue-800',
    Scripting: 'bg-purple-200 text-purple-800',
    Filming: 'bg-yellow-200 text-yellow-800',
    Editing: 'bg-orange-200 text-orange-800',
    Uploaded: 'bg-green-200 text-green-800',
};

const initialIdeas: ShortIdea[] = [
  {
    id: 's-1',
    title: 'Gemini API로 자동 문서 요약 봇 만들기',
    description: 'React와 Gemini API를 사용해, 코드 레포지토리를 입력하면 README 초안을 생성해주는 웹앱 개발 과정을 쇼츠로 제작',
    status: 'Scripting',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 's-2',
    title: 'Vite vs Webpack: 2025년 빌드 속도 비교',
    description: '동일한 규모의 React 프로젝트를 Vite와 Webpack으로 각각 빌드하여 속도를 비교하고, 그 결과를 시각적으로 보여주는 쇼츠',
    status: 'Planning',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 's-3',
    title: 'TailwindCSS 실무에서 정말 편한가? 3가지 꿀팁',
    description: '실제 프로젝트에서 TailwindCSS를 사용하며 느낀 장점과, 생산성을 높여주는 유용한 팁 3가지를 소개',
    status: 'Idea',
    createdAt: Date.now(),
  },
];

export const ShortsIdeaManager: React.FC = () => {
  const [ideas, setIdeas] = useState<ShortIdea[]>(() => {
    const savedIdeas = localStorage.getItem('shortsIdeas');
    return savedIdeas ? JSON.parse(savedIdeas) : initialIdeas;
  });
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [selectedIdea, setSelectedIdea] = useState<ShortIdea | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('shortsIdeas', JSON.stringify(ideas));
  }, [ideas]);

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdeaTitle.trim() === '') return;

    const newIdea: ShortIdea = {
      id: `s-${Date.now()}`,
      title: newIdeaTitle.trim(),
      description: '',
      status: 'Idea',
      createdAt: Date.now(),
      statusNotes: {},
    };

    setIdeas([newIdea, ...ideas]);
    setNewIdeaTitle('');
  };

  const handleUpdateStatus = (id: string, status: ShortIdea['status']) => {
    setIdeas(ideas.map(idea => (idea.id === id ? { ...idea, status } : idea)));
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm('정말로 이 아이디어를 삭제하시겠습니까?')) {
      setIdeas(ideas.filter(idea => idea.id !== id));
    }
  };

  const handleOpenModal = (idea: ShortIdea) => {
    setSelectedIdea(idea);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedIdea(null);
    setIsModalOpen(false);
  };

  const handleUpdateIdea = (id: string, updatedData: Partial<ShortIdea>) => {
    setIdeas(prevIdeas =>
      prevIdeas.map(idea =>
        idea.id === id ? { ...idea, ...updatedData } : idea
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">쇼츠 아이디어 관리</h2>
      <form onSubmit={handleAddIdea} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newIdeaTitle}
          onChange={(e) => setNewIdeaTitle(e.target.value)}
          placeholder="새로운 쇼츠 아이디어 제목..."
          className="flex-grow bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">
          추가
        </button>
      </form>

      <div className="space-y-4">
        {ideas.map(idea => (
          <div key={idea.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleOpenModal(idea)}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{idea.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{idea.description || '설명이 없습니다.'}</p>
              </div>
              <div className="flex items-center gap-2">
                 <select
                    value={idea.status}
                    onChange={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(idea.id, e.target.value as ShortIdea['status']);
                    }}
                    className={`text-xs font-semibold py-1 px-2 rounded-full border-none appearance-none ${statusColors[idea.status]}`}
                >
                    {statusOrder.map(status => (
                        <option key={status} value={status}>{statusKorean[status]}</option>
                    ))}
                </select>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIdea(idea.id)
                    }} 
                    className="p-1 text-gray-400 hover:text-red-600 rounded-full transition-colors"
                >
                    <span className="material-icons text-lg">delete</span>
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">생성일: {new Date(idea.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <ShortsIdeaModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        idea={selectedIdea}
        onUpdate={handleUpdateIdea}
      />
    </div>
  );
};

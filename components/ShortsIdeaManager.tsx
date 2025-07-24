import React, { useState, useEffect } from 'react';
import { ShortIdea } from '../types';

export const ShortsIdeaManager: React.FC = () => {
  const [ideas, setIdeas] = useState<ShortIdea[]>(() => {
    const savedIdeas = localStorage.getItem('shortsIdeas');
    return savedIdeas ? JSON.parse(savedIdeas) : [];
  });
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDescription, setNewIdeaDescription] = useState('');
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [editingIdeaTitle, setEditingIdeaTitle] = useState('');
  const [editingIdeaDescription, setEditingIdeaDescription] = useState('');

  useEffect(() => {
    localStorage.setItem('shortsIdeas', JSON.stringify(ideas));
  }, [ideas]);

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIdeaTitle.trim() === '') return;

    const newIdea: ShortIdea = {
      id: `s-${Date.now()}`,
      title: newIdeaTitle.trim(),
      description: newIdeaDescription.trim(),
      status: 'Idea',
      createdAt: Date.now(),
    };
    setIdeas(prev => [newIdea, ...prev]);
    setNewIdeaTitle('');
    setNewIdeaDescription('');
  };

  const handleDeleteIdea = (id: string) => {
    if (window.confirm('정말로 이 쇼츠 아이디어를 삭제하시겠습니까?')) {
      setIdeas(prev => prev.filter(idea => idea.id !== id));
    }
  };

  const handleEditClick = (idea: ShortIdea) => {
    setEditingIdeaId(idea.id);
    setEditingIdeaTitle(idea.title);
    setEditingIdeaDescription(idea.description);
  };

  const handleSaveEdit = (id: string) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id
          ? { ...idea, title: editingIdeaTitle.trim(), description: editingIdeaDescription.trim() }
          : idea
      )
    );
    setEditingIdeaId(null);
    setEditingIdeaTitle('');
    setEditingIdeaDescription('');
  };

  const handleCancelEdit = () => {
    setEditingIdeaId(null);
    setEditingIdeaTitle('');
    setEditingIdeaDescription('');
  };

  const handleStatusChange = (id: string, newStatus: ShortIdea['status']) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, status: newStatus } : idea
      )
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <span className="material-icons text-purple-500 mr-2">lightbulb</span>
        쇼츠 아이디어
      </h2>
      <form onSubmit={handleAddIdea} className="mb-6">
        <div className="mb-4">
          <input
            type="text"
            value={newIdeaTitle}
            onChange={(e) => setNewIdeaTitle(e.target.value)}
            placeholder="새로운 쇼츠 아이디어 제목..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={newIdeaDescription}
            onChange={(e) => setNewIdeaDescription(e.target.value)}
            placeholder="아이디어 상세 설명..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>
        <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg w-full flex items-center justify-center transition duration-300">
          <span className="material-icons mr-2">add</span>
          아이디어 추가
        </button>
      </form>

      <ul className="space-y-4">
        {ideas.map(idea => (
          <li key={idea.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
            {editingIdeaId === idea.id ? (
              <div>
                <input
                  type="text"
                  value={editingIdeaTitle}
                  onChange={(e) => setEditingIdeaTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                />
                <textarea
                  value={editingIdeaDescription}
                  onChange={(e) => setEditingIdeaDescription(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                ></textarea>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => handleSaveEdit(idea.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                    저장
                  </button>
                  <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm">
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{idea.title}</h3>
                  <div className="flex space-x-2">
                    <select
                      value={idea.status}
                      onChange={(e) => handleStatusChange(idea.id, e.target.value as ShortIdea['status'])}
                      className="p-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="Idea">아이디어</option>
                      <option value="Planning">기획 중</option>
                      <option value="Scripting">스크립트 작성</option>
                      <option value="Filming">촬영 예정</option>
                      <option value="Editing">편집 중</option>
                      <option value="Uploaded">업로드 완료</option>
                    </select>
                    <button onClick={() => handleEditClick(idea)} className="text-blue-500 hover:text-blue-700 text-sm">
                      <span className="material-icons text-base">edit</span>
                    </button>
                    <button onClick={() => handleDeleteIdea(idea.id)} className="text-red-500 hover:text-red-700 text-sm">
                      <span className="material-icons text-base">delete</span>
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{idea.description}</p>
                <p className="text-gray-500 text-xs">생성일: {new Date(idea.createdAt).toLocaleDateString()}</p>
              </div>
            )}
          </li>
        ))}
        {ideas.length === 0 && <p className="text-center text-gray-500 py-4">아직 쇼츠 아이디어가 없습니다.</p>}
      </ul>
    </div>
  );
};

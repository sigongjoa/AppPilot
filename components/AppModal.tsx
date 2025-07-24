import React, { useState, useEffect, useCallback } from 'react';
import { App, DevStage, DeploymentInfo, TestInfo } from '../types';

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (app: App) => void;
  appToEdit?: App | null;
}

const emptyApp: Partial<App> = {
  name: '',
  description: '',
  path: '',
  command: '',
  github: '',
  techStack: [],
  devStage: DevStage.PLANNING,
  deploymentInfo: {
    version: 'v0.1.0',
    buildCommand: '',
    buildOutputPath: '',
    deploymentTarget: '',
  },
  testInfo: {
    testCommand: 'npm test',
  }
};

const devStageKorean = {
  [DevStage.PLANNING]: '기획',
  [DevStage.DEVELOPMENT]: '개발',
  [DevStage.DEPLOYED]: '배포',
};

export const AppModal: React.FC<AppModalProps> = ({ isOpen, onClose, onSave, appToEdit }) => {
  const [appData, setAppData] = useState<Partial<App>>(emptyApp);
  const [techStackInput, setTechStackInput] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (appToEdit) {
            setAppData(appToEdit);
            setTechStackInput(appToEdit.techStack.join(', '));
        } else {
            setAppData(emptyApp);
            setTechStackInput('');
        }
        setNameSuggestions([]);
    }
  }, [appToEdit, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppData({ ...appData, [name]: value });
  };

  const handleDeploymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppData(prev => ({
        ...prev,
        deploymentInfo: {
            ...(prev.deploymentInfo as DeploymentInfo),
            [name]: value,
        }
    }));
  };

  const handleTestInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAppData(prev => ({
        ...prev,
        testInfo: {
            ...(prev.testInfo as TestInfo),
            [name]: value,
        }
    }));
  };

  const handleTechStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTechStackInput(e.target.value);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTechStack = techStackInput.split(',').map(tech => tech.trim()).filter(Boolean);
    onSave({ ...appData, techStack: finalTechStack } as App);
  };

  // Gemini API 관련 코드 제거
  // const handleSuggestNames = useCallback(async () => {
  //   if (!appData.description) return;
  //   setIsSuggesting(true);
  //   const suggestions = await suggestAppNames(appData.description);
  //   setNameSuggestions(suggestions);
  //   setIsSuggesting(false);
  // }, [appData.description]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{appToEdit ? '앱 수정' : '새 앱 추가'}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
            <span className="material-icons">close</span>
          </button>
        </div>
        <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea
              id="description"
              name="description"
              value={appData.description}
              onChange={handleChange}
              rows={3}
              placeholder="앱이 어떤 작업을 하는지 설명해주세요 (AI 이름 제안에 사용됩니다)"
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">앱 이름</label>
                <div className="flex gap-2">
                <input
                    id="name"
                    name="name"
                    value={appData.name}
                    onChange={handleChange}
                    required
                    className="flex-grow bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                />
                {/* Gemini API 관련 버튼 제거 */}
                {/* <button
                    type="button"
                    onClick={handleSuggestNames}
                    disabled={!appData.description || isSuggesting}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    <span className="material-icons">auto_awesome</span>
                    {isSuggesting ? '...' : '제안'}
                </button> */}
                </div>
                {/* Gemini API 관련 제안 목록 제거 */}
                {/* {nameSuggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                        {nameSuggestions.map(name => (
                            <button
                                type="button"
                                key={name}
                                onClick={() => setAppData({...appData, name})}
                                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                )} */}
            </div>
            <div>
                <label htmlFor="devStage" className="block text-sm font-medium text-gray-700 mb-1">개발 단계</label>
                <select
                    id="devStage"
                    name="devStage"
                    value={appData.devStage}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                >
                    {Object.values(DevStage).map((stage) => (
                        <option key={stage} value={stage}>{devStageKorean[stage]}</option>
                    ))}
                </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700 mb-1">기술 스택</label>
            <input
              id="techStack"
              name="techStack"
              value={techStackInput}
              onChange={handleTechStackChange}
              placeholder="예: React, Node.js, Tailwind"
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">프로젝트 경로</label>
            <input
              id="path"
              name="path"
              value={appData.path}
              onChange={handleChange}
              placeholder="예: /Users/dev/projects/my-app"
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="command" className="block text-sm font-medium text-gray-700 mb-1">실행 명령어</label>
            <input
              id="command"
              name="command"
              value={appData.command}
              onChange={handleChange}
              placeholder="예: npm run dev"
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 font-mono text-sm"
            />
          </div>
          <div>
            <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">GitHub 주소</label>
            <input
              id="github"
              name="github"
              type="url"
              value={appData.github}
              onChange={handleChange}
              placeholder="https://github.com/user/repo"
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="aiStudioLink" className="block text-sm font-medium text-gray-700 mb-1">Google AI Studio 주소</label>
            <input
              id="aiStudioLink"
              name="aiStudioLink"
              type="url"
              value={appData.aiStudioLink || ''}
              onChange={handleChange}
              placeholder="https://aistudio.google.com/..."
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800"
            />
          </div>
          <div>
            <label htmlFor="chatGptLink" className="block text-sm font-medium text-gray-700 mb-1">ChatGPT 프로젝트 주소</label>
            <input
              id="chatGptLink"
              name="chatGptLink"
              type="url"
              value={appData.chatGptLink || ''}
              onChange={handleChange}
              placeholder="https://chat.openai.com/..."
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800"
            />
          </div>

          <details className="group pt-2">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 list-none flex items-center justify-between">
                  <span>배포 & 테스트 설정 (선택 사항)</span>
                  <span className="material-icons transition-transform duration-200 group-open:rotate-90">chevron_right</span>
              </summary>
              <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">버전</label>
                          <input id="version" name="version" value={appData.deploymentInfo?.version || ''} onChange={handleDeploymentChange} placeholder="v1.0.0" className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"/>
                      </div>
                      <div>
                          <label htmlFor="deploymentTarget" className="block text-sm font-medium text-gray-700 mb-1">배포 대상</label>
                          <input id="deploymentTarget" name="deploymentTarget" value={appData.deploymentInfo?.deploymentTarget || ''} onChange={handleDeploymentChange} placeholder="Vercel, Firebase, DockerHub" className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"/>
                      </div>
                  </div>
                  <div>
                      <label htmlFor="buildCommand" className="block text-sm font-medium text-gray-700 mb-1">빌드 명령어</label>
                      <input id="buildCommand" name="buildCommand" value={appData.deploymentInfo?.buildCommand || ''} onChange={handleDeploymentChange} placeholder="npm run build" className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 font-mono text-sm"/>
                  </div>
                   <div>
                      <label htmlFor="testCommand" className="block text-sm font-medium text-gray-700 mb-1">테스트 명령어</label>
                      <input id="testCommand" name="testCommand" value={appData.testInfo?.testCommand || ''} onChange={handleTestInfoChange} placeholder="npm test" className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 font-mono text-sm"/>
                  </div>
              </div>
          </details>

        </form>
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">취소</button>
            <button type="submit" onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">앱 저장</button>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useCallback, useEffect } from 'react';
import { App, AppStatus, DevStage, TodoItem, DeploymentInfo, BlockerItem, BugItem, TestInfo } from './types';
import { Header } from './components/Header';
import { AppCard } from './components/AppCard';
import { LogModal } from './components/LogModal';
import { AppModal } from './components/AppModal';
import { AppDetailsModal } from './components/AppDetailsModal';
import { MainTodoList } from './components/MainTodoList';
import { ShortsIdeaManager } from './components/ShortsIdeaManager';

const initialApps: App[] = [
  {
    id: '1',
    name: 'AI 문서 작성기',
    description: '소스 코드를 기반으로 README 파일을 자동으로 생성하는 Gemini 기반 React 앱입니다.',
    status: AppStatus.RUNNING,
    devStage: DevStage.DEVELOPMENT,
    path: '/apps/ai-doc-writer',
    command: 'npm run start',
    techStack: ['React', 'Gemini API', 'TypeScript', 'TailwindCSS', 'Vite'],
    logs: [
      '정보: 개발 서버 시작 중...',
      '성공: 성공적으로 컴파일되었습니다.',
      'API: Gemini API에 연결되었습니다.',
      '이벤트: 사용자가 새 문서를 생성했습니다.'
    ],
    links: [
      { label: 'GitHub 저장소', url: 'https://github.com/example/ai-doc-writer', icon: 'github' },
      { label: 'AI Studio 링크', url: 'https://aistudio.google.com/apps/drive/1ESaIByI9MwRmg4U7NpKNkrrVkis93yFD', icon: 'auto_awesome' },
      { label: 'ChatGPT 링크', url: 'https://chat.openai.com/c/12345678-90ab-cdef-1234-567890abcdef', icon: 'chat' },
    ],
    todos: [
        { id: 't1-1', text: 'Gemini 응답 스트리밍 구현', completed: true },
        { id: 't1-2', text: '사용자 인증 추가', completed: false },
        { id: 't1-3', text: '문서 내보내기 기능 (PDF, MD)', completed: false },
    ],
    documentation: `# AI 문서 작성기\n\n## 기능 명세\n- **입력**: Git 저장소 URL\n- **출력**: 마크다운 형식의 README 파일\n- **프로세스**: 소스 코드 분석 -> 주요 기능 요약 -> README 생성\n\n## API 명세\n- \`POST /api/generate\`\n  - **body**: \`{ "repoUrl": "string" }\`\n  - **response**: \`{ "markdown": "string" }\`\n`,
    testInfo: {
        testCommand: 'npm test',
        lastTestTime: '2023-10-27T09:00:00Z',
        lastTestSuccess: true,
        coverage: 88,
    },
    blockers: [
        { id: 'b1-1', text: 'API 키 할당량 문제로 Gemini 호출이 간헐적으로 실패함', resolved: false },
    ],
    bugs: [
        { id: 'bug1-1', text: 'TypeScript 프로젝트에서 `import` 구문 분석 오류', priority: 'High', resolved: false },
        { id: 'bug1-2', text: '생성된 마크다운의 테이블 형식이 깨짐', priority: 'Medium', resolved: true },
    ]
  },
  {
    id: '2',
    name: 'Docker 관리 UI',
    description: 'Flask와 순수 JS로 제작된 Docker 컨테이너 관리용 웹 대시보드입니다.',
    status: AppStatus.STOPPED,
    devStage: DevStage.DEPLOYED,
    path: '/apps/docker-manager',
    command: 'docker-compose up -d',
    techStack: ['Flask', 'Docker', 'JavaScript', 'Nginx'],
    logs: [
        '정보: 서버를 정상적으로 종료합니다...',
        '성공: Docker 컨테이너가 중지되었습니다.',
    ],
    links: [
      { label: 'GitHub 저장소', url: 'https://github.com/example/docker-manager', icon: 'github' },
    ],
    metrics: { dbCalls: 1204, apiUsage: 8900 },
    deploymentInfo: {
        buildCommand: 'docker-compose build',
        buildOutputPath: './',
        deploymentTarget: 'DockerHub',
        deploymentCommand: 'docker-compose push',
        version: 'v1.1.2',
        gitCommitHash: 'a1b2c3d',
        lastBuildTime: '2023-10-27T10:00:00Z',
        lastBuildSuccess: true,
        releaseNotes: '초기 배포 버전입니다. 기본 컨테이너 관리 기능을 포함합니다.',
        lastDeploymentTime: '2023-10-27T10:05:00Z'
    },
    todos: [ { id: 't2-1', text: '볼륨 관리 기능 추가', completed: true}]
  },
  {
    id: '3',
    name: 'ImageGen 서비스',
    description: 'Imagen 3 모델을 사용하는 이미지 생성 서비스입니다. 간단한 API 엔드포인트를 제공합니다.',
    status: AppStatus.STOPPED,
    devStage: DevStage.PLANNING,
    path: '/apps/imagegen-service',
    command: 'node server.js',
    techStack: ['Node.js', 'Imagen 3 API', 'Express'],
    logs: ['정보: 사용자에 의해 서버가 중지되었습니다.'],
    links: [
      { label: 'GitHub 저장소', url: 'https://github.com/example/imagegen', icon: 'github' },
    ],
    ideas: '사용자가 생성한 이미지를 갤러리 형태로 저장하는 기능 추가.\n- 일일 생성 횟수 제한 기능.\n- 워터마크 추가 옵션.'
  },
];

const AppManager = () => {
  const [apps, setApps] = useState<App[]>(() => {
    const savedApps = localStorage.getItem('apps');
    return savedApps ? JSON.parse(savedApps) : initialApps;
  });
  const [mainTodos, setMainTodos] = useState<TodoItem[]>(() => {
    const savedMainTodos = localStorage.getItem('mainTodos');
    return savedMainTodos ? JSON.parse(savedMainTodos) : [
      { id: 'm-1', text: '전체 앱 상태 모니터링 시스템 점검', completed: false },
      { id: 'm-2', text: '백업 스크립트 실행 확인', completed: true },
    ];
  });

  const [logModalAppId, setLogModalAppId] = useState<string | null>(null);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [detailsModalAppId, setDetailsModalAppId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'apps' | 'shorts'>('apps');

  const handleUpdateApp = (id: string, updatedData: Partial<App>) => {
    setApps(prevApps =>
      prevApps.map(app =>
        app.id === id ? { ...app, ...updatedData } : app
      )
    );
  };
  
  const updateAppStatus = (id: string, newStatus: AppStatus, logMessage: string) => {
     handleUpdateApp(id, { status: newStatus, logs: [...(apps.find(a=>a.id === id)?.logs || []), `[${new Date().toISOString()}] ${logMessage}`] });
  };

  const handleStart = useCallback((id: string) => {
    updateAppStatus(id, AppStatus.RUNNING, '정보: 사용자가 애플리케이션을 시작했습니다.');
  }, [apps]);

  const handleStop = useCallback((id: string) => {
    updateAppStatus(id, AppStatus.STOPPED, '정보: 사용자가 애플리케이션을 중지했습니다.');
  }, [apps]);
  
  const handleDelete = useCallback((id: string) => {
    if (window.confirm('정말로 이 앱을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        setApps(prevApps => prevApps.filter(app => app.id !== id));
    }
  }, []);

  const handleViewLogs = useCallback((id: string) => {
    setLogModalAppId(id);
  }, []);
  
  const handleViewDetails = useCallback((id: string) => {
    setDetailsModalAppId(id);
  }, []);

  const handleCloseLogModal = () => {
    setLogModalAppId(null);
  };
  
  const handleCloseDetailsModal = () => {
    setDetailsModalAppId(null);
  };

  const handleOpenAddNewModal = () => {
    setEditingApp(null);
    setAppModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    const appToEdit = apps.find(app => app.id === id);
    if (appToEdit) {
      setEditingApp(appToEdit);
      setAppModalOpen(true);
    }
  };

  const handleCloseAppModal = () => {
    setAppModalOpen(false);
    setEditingApp(null);
  };
  
  const handleSaveApp = (appData: App) => {
    if(editingApp) { // Editing existing app
        handleUpdateApp(editingApp.id, appData);
    } else { // Adding new app
        const newApp: App = {
            id: String(Date.now()),
            status: AppStatus.STOPPED,
            logs: [`[${new Date().toISOString()}] 정보: 애플리케이션이 생성되었습니다.`],
            ...appData,
            ideas: appData.ideas || '',
            todos: appData.todos || [],
            blockers: appData.blockers || [],
            bugs: appData.bugs || [],
            documentation: appData.documentation || `# ${appData.name || '새 앱'}\n\n이곳에 문서 내용을 작성하세요.`,
            metrics: appData.metrics || { dbCalls: 0, apiUsage: 0 },
            deploymentInfo: appData.deploymentInfo || {
                buildCommand: '',
                buildOutputPath: '',
                deploymentTarget: '',
                version: 'v0.1.0',
            },
            testInfo: appData.testInfo || {
                testCommand: 'npm test',
            },
            links: appData.links || [],
        };
        setApps([newApp, ...apps]);
    }
    handleCloseAppModal();
  };

  const appForLogs = apps.find(app => app.id === logModalAppId);
  const appForDetails = apps.find(app => app.id === detailsModalAppId);

  useEffect(() => {
    localStorage.setItem('apps', JSON.stringify(apps));
  }, [apps]);

  useEffect(() => {
    localStorage.setItem('mainTodos', JSON.stringify(mainTodos));
  }, [mainTodos]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">AppPilot</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <button
                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${selectedTab === 'apps' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedTab('apps')}
              >
                <span className="material-icons mr-2 align-middle">apps</span>
                앱 관리
              </button>
            </li>
            <li className="mb-4">
              <button
                className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${selectedTab === 'shorts' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setSelectedTab('shorts')}
              >
                <span className="material-icons mr-2 align-middle">videocam</span>
                쇼츠 아이디어
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Header onAddNewApp={handleOpenAddNewModal} showAddNewAppButton={selectedTab === 'apps'} />
        <main>
          {selectedTab === 'apps' && (
            <>
              <MainTodoList todos={mainTodos} setTodos={setMainTodos} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    onStart={handleStart}
                    onStop={handleStop}
                    onViewLogs={handleViewLogs}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </>
          )}
          {selectedTab === 'shorts' && (
            <ShortsIdeaManager />
          )}
        </main>
      </div>
      
      <LogModal
        isOpen={!!logModalAppId}
        onClose={handleCloseLogModal}
        appName={appForLogs?.name || ''}
        logs={appForLogs?.logs || []}
      />
      
      <AppDetailsModal
        isOpen={!!detailsModalAppId}
        onClose={handleCloseDetailsModal}
        app={appForDetails || null}
        onUpdateApp={handleUpdateApp}
      />
      
      <AppModal
        isOpen={appModalOpen}
        onClose={handleCloseAppModal}
        onSave={handleSaveApp}
        appToEdit={editingApp}
      />
    </div>
  );
}

export default AppManager;
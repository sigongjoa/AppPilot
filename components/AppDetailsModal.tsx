import React, { useState, useEffect } from 'react';
import { App, AppStatus, DevStage, TodoItem, Metrics, DeploymentInfo, BlockerItem, BugItem, TestInfo, LinkItem } from '../types';

interface AppDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: App | null;
  onUpdateApp: (id: string, updatedData: Partial<App>) => void;
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

const statusConfig = {
    [AppStatus.RUNNING]: {
        color: 'bg-green-500 text-green-600',
        icon: 'play_arrow'
    },
    [AppStatus.STOPPED]: {
        color: 'bg-red-500 text-red-600',
        icon: 'stop'
    },
};

const DetailItem: React.FC<{ icon: string, label: string, value: string | React.ReactNode, isCode?: boolean, className?: string }> = ({ icon, label, value, isCode = false, className = '' }) => (
    <div className={className}>
        <dt className="flex items-center gap-2 text-sm font-medium text-gray-400 truncate">
            <span className="material-icons text-base">{icon}</span>
            {label}
        </dt>
        <dd className={`mt-1 text-gray-700 break-words ${isCode ? 'font-mono bg-gray-100 p-2 rounded-md text-sm' : 'text-base'}`}>{value}</dd>
    </div>
);

const Section: React.FC<{title: string, icon: string, children: React.ReactNode, className?: string}> = ({title, icon, children, className=""}) => (
    <div className={className}>
        <h4 className="flex items-center gap-3 text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">
            <span className="material-icons text-xl">{icon}</span>
            {title}
        </h4>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const ChecklistItem: React.FC<{isMet: boolean, text: string}> = ({ isMet, text }) => (
    <li className={`flex items-center gap-3 transition-colors duration-300 ${isMet ? 'text-green-600' : 'text-red-600'}`}>
        <span className="material-icons text-lg">{isMet ? 'check_circle' : 'cancel'}</span>
        <span className="font-medium">{text}</span>
    </li>
);

const DevTabButton: React.FC<{icon: string, label: string, isActive: boolean, onClick: () => void}> = ({icon, label, isActive, onClick}) => (
    <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-all duration-200 ${isActive ? 'text-blue-600 border-blue-600 bg-gray-100' : 'text-gray-600 border-transparent hover:bg-gray-200'}`}>
        <span className="material-icons text-base">{icon}</span>
        {label}
    </button>
);



const EditableTextItem: React.FC<{ icon: string, label: string, value: string | undefined, onUpdate: (value: string) => void, placeholder: string, isCode?: boolean }> = ({ icon, label, value, onUpdate, placeholder, isCode = false }) => {
    const [currentValue, setCurrentValue] = useState(value || '');

    useEffect(() => {
        setCurrentValue(value || '');
    }, [value]);

    const handleBlur = () => {
        if (currentValue !== value) {
            onUpdate(currentValue);
        }
    };

    return (
        <div>
            <dt className="flex items-center gap-2 text-sm font-medium text-gray-400 truncate">
                <span className="material-icons text-base">{icon}</span>
                {label}
            </dt>
            <dd className="mt-1">
                <input
                    type="text"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`w-full bg-gray-100 border-transparent rounded-md px-3 py-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 ${isCode ? 'font-mono' : ''}`}
                />
            </dd>
        </div>
    );
};

const EditableLinkItem: React.FC<{ link: LinkItem, onUpdate: (link: LinkItem) => void, onDelete: () => void }> = ({ link, onUpdate, onDelete }) => {
    const [currentLabel, setCurrentLabel] = useState(link.label);
    const [currentUrl, setCurrentUrl] = useState(link.url);

    useEffect(() => {
        setCurrentLabel(link.label);
        setCurrentUrl(link.url);
    }, [link]);

    const handleBlur = () => {
        if (currentLabel !== link.label || currentUrl !== link.url) {
            onUpdate({ ...link, label: currentLabel, url: currentUrl });
        }
    };

    return (
        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <input
                type="text"
                value={currentLabel}
                onChange={(e) => setCurrentLabel(e.target.value)}
                onBlur={handleBlur}
                placeholder="링크 레이블"
                className="flex-1 bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
                type="url"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                onBlur={handleBlur}
                placeholder="URL"
                className="flex-2 bg-white border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
            <button onClick={onDelete} className="p-1 text-red-500 hover:text-red-700">
                <span className="material-icons text-lg">delete</span>
            </button>
        </div>
    );
};

// Stage-specific content component
const StageSpecificContent: React.FC<{app: App; onUpdateApp: (id: string, data: Partial<App>) => void;}> = ({ app, onUpdateApp }) => {
    
    const [activeDevTab, setActiveDevTab] = useState<'tracking' | 'docs' | 'testing'>('tracking');
    const [activeTrackingTab, setActiveTrackingTab] = useState<'todos' | 'blockers' | 'bugs'>('todos');

    // State for new item inputs
    const [newTodoText, setNewTodoText] = useState('');
    const [newBlockerText, setNewBlockerText] = useState('');
    const [newBugText, setNewBugText] = useState('');
    const [newBugPriority, setNewBugPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

    const handleUpdateIdeas = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdateApp(app.id, { ideas: e.target.value });
    };

    const handleUpdateDocumentation = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onUpdateApp(app.id, { documentation: e.target.value });
    };

    const createItemUpdater = <T extends {id: string}>(field: keyof App, item: T) => {
        const items = (app[field] as unknown as T[] || []);
        const updatedItems = items.map(i => i.id === item.id ? item : i);
        onUpdateApp(app.id, { [field]: updatedItems });
    };

    const createItemDeleter = <T extends {id: string}>(field: keyof App, itemId: string) => {
        const items = (app[field] as unknown as T[] || []);
        const updatedItems = items.filter(i => i.id !== itemId);
        onUpdateApp(app.id, { [field]: updatedItems });
    };

    const createItemAdder = <T extends {id: string}>(field: keyof App, newItem: T) => {
        const items = (app[field] as unknown as T[] || []);
        onUpdateApp(app.id, { [field]: [...items, newItem] });
    };
    
    // Todo handlers
    const handleAddTodo = (e: React.FormEvent) => { e.preventDefault(); if (newTodoText.trim() === '') return; createItemAdder('todos', { id: `t-${Date.now()}`, text: newTodoText.trim(), completed: false }); setNewTodoText(''); };
    const handleToggleTodo = (todo: TodoItem) => createItemUpdater('todos', {...todo, completed: !todo.completed});
    const handleDeleteTodo = (id: string) => createItemDeleter('todos', id);

    // Blocker handlers
    const handleAddBlocker = (e: React.FormEvent) => { e.preventDefault(); if (newBlockerText.trim() === '') return; createItemAdder('blockers', { id: `b-${Date.now()}`, text: newBlockerText.trim(), resolved: false }); setNewBlockerText(''); };
    const handleToggleBlocker = (blocker: BlockerItem) => createItemUpdater('blockers', {...blocker, resolved: !blocker.resolved});
    const handleDeleteBlocker = (id: string) => createItemDeleter('blockers', id);

    // Bug handlers
    const handleAddBug = (e: React.FormEvent) => { e.preventDefault(); if (newBugText.trim() === '') return; createItemAdder('bugs', { id: `bug-${Date.now()}`, text: newBugText.trim(), priority: newBugPriority, resolved: false }); setNewBugText(''); };
    const handleToggleBug = (bug: BugItem) => createItemUpdater('bugs', {...bug, resolved: !bug.resolved});
    const handleDeleteBug = (id: string) => createItemDeleter('bugs', id);

    const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedMetrics = { ...(app.metrics || { dbCalls: 0, apiUsage: 0 }), [name]: Number(value) || 0 };
        onUpdateApp(app.id, { metrics: updatedMetrics });
    };
    
    const handleUpdateDeploymentInfo = (data: Partial<DeploymentInfo>) => {
        onUpdateApp(app.id, { deploymentInfo: { ...(app.deploymentInfo as DeploymentInfo), ...data } });
    };

    const handleUpdateTestInfo = (data: Partial<App['testInfo']>) => {
        onUpdateApp(app.id, { testInfo: { ...(app.testInfo!), ...data } });
    }

    const handleBuild = () => {
        const success = Math.random() > 0.1; // 90%
        handleUpdateDeploymentInfo({ lastBuildTime: new Date().toISOString(), lastBuildSuccess: success });
        onUpdateApp(app.id, { logs: [...(app.logs || []), `[${new Date().toISOString()}] 정보: 빌드를 시작합니다... 결과: ${success ? '성공' : '실패'}`] });
    };

    const handleDeploy = () => {
        handleUpdateDeploymentInfo({ lastDeploymentTime: new Date().toISOString() });
        onUpdateApp(app.id, { logs: [...(app.logs || []), `[${new Date().toISOString()}] 정보: 프로덕션 배포를 시뮬레이션했습니다 (버전: ${app.deploymentInfo?.version}).`] });
    };
    
    const handleRunTests = () => {
        const success = Math.random() > 0.15; // 85%
        const coverage = success ? Math.floor(Math.random() * (98 - 70 + 1) + 70) : app.testInfo?.coverage;
        handleUpdateTestInfo({ lastTestTime: new Date().toISOString(), lastTestSuccess: success, coverage });
        onUpdateApp(app.id, { logs: [...(app.logs || []), `[${new Date().toISOString()}] 정보: 테스트 실행... 결과: ${success ? '성공' : '실패'}`] });
    };


    switch (app.devStage) {
        case DevStage.PLANNING:
            return (
                <Section title="아이디어" icon="lightbulb">
                    <textarea
                        value={app.ideas || ''}
                        onChange={handleUpdateIdeas}
                        rows={12}
                        placeholder="이 프로젝트에 대한 아이디어나 기획 내용을 자유롭게 작성하세요."
                        className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    />
                </Section>
            );
        case DevStage.DEVELOPMENT:
            return (
                <div>
                    <div className="flex border-b border-gray-200">
                        <DevTabButton icon="checklist" label="개발 추적" isActive={activeDevTab === 'tracking'} onClick={() => setActiveDevTab('tracking')} />
                        <DevTabButton icon="description" label="문서" isActive={activeDevTab === 'docs'} onClick={() => setActiveDevTab('docs')} />
                        <DevTabButton icon="science" label="테스트" isActive={activeDevTab === 'testing'} onClick={() => setActiveDevTab('testing')} />
                    </div>
                    <div className="pt-6">
                        {activeDevTab === 'tracking' && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
                                    <button onClick={() => setActiveTrackingTab('todos')} className={`flex-1 text-center text-sm p-2 rounded-md transition-colors ${activeTrackingTab === 'todos' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-200'}`}>할 일</button>
                                    <button onClick={() => setActiveTrackingTab('blockers')} className={`flex-1 text-center text-sm p-2 rounded-md transition-colors ${activeTrackingTab === 'blockers' ? 'bg-yellow-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-200'}`}>블로커</button>
                                    <button onClick={() => setActiveTrackingTab('bugs')} className={`flex-1 text-center text-sm p-2 rounded-md transition-colors ${activeTrackingTab === 'bugs' ? 'bg-red-600 text-white font-semibold' : 'text-gray-700 hover:bg-gray-200'}`}>버그</button>
                                </div>
                                {activeTrackingTab === 'todos' && <div>
                                    <form onSubmit={handleAddTodo} className="flex gap-2"><input type="text" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} placeholder="새로운 할 일..." className="flex-grow bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500"/><button type="submit" className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><span className="material-icons">add</span></button></form>
                                    <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">{(app.todos || []).map(t => <li key={t.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={t.completed} onChange={() => handleToggleTodo(t)} className="w-5 h-5 rounded bg-gray-300 border-gray-400 text-blue-500 focus:ring-blue-600" /><span className={t.completed ? 'text-gray-500 line-through' : 'text-gray-700'}>{t.text}</span></label><button onClick={() => handleDeleteTodo(t.id)} className="p-1 text-gray-500 hover:text-red-500 rounded-full"><span className="material-icons">delete</span></button></li>)}</ul>
                                </div>}
                                {activeTrackingTab === 'blockers' && <div>
                                    <form onSubmit={handleAddBlocker} className="flex gap-2"><input type="text" value={newBlockerText} onChange={(e) => setNewBlockerText(e.target.value)} placeholder="새로운 블로커..." className="flex-grow bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-yellow-500"/><button type="submit" className="p-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"><span className="material-icons">add</span></button></form>
                                    <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">{(app.blockers || []).map(b => <li key={b.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={b.resolved} onChange={() => handleToggleBlocker(b)} className="w-5 h-5 rounded bg-gray-300 border-gray-400 text-yellow-500 focus:ring-yellow-600" /><span className={b.resolved ? 'text-gray-500 line-through' : 'text-yellow-700'}>{b.text}</span></label><button onClick={() => handleDeleteBlocker(b.id)} className="p-1 text-gray-500 hover:text-red-500 rounded-full"><span className="material-icons">delete</span></button></li>)}</ul>
                                </div>}
                                {activeTrackingTab === 'bugs' && <div>
                                    <form onSubmit={handleAddBug} className="flex gap-2 items-center"><input type="text" value={newBugText} onChange={(e) => setNewBugText(e.target.value)} placeholder="새로운 버그..." className="flex-grow bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-red-500"/><select value={newBugPriority} onChange={e => setNewBugPriority(e.target.value as any)} className="bg-gray-50 border-gray-300 rounded-md py-2 text-gray-800"><option>High</option><option>Medium</option><option>Low</option></select><button type="submit" className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"><span className="material-icons">add</span></button></form>
                                    <ul className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">{(app.bugs || []).map(b => <li key={b.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md"><label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={b.resolved} onChange={() => handleToggleBug(b)} className="w-5 h-5 rounded bg-gray-300 border-gray-400 text-red-500 focus:ring-red-600" /><span className={b.resolved ? 'text-gray-500 line-through' : 'text-red-700'}>{`[${b.priority}] ${b.text}`}</span></label><button onClick={() => handleDeleteBug(b.id)} className="p-1 text-gray-500 hover:text-red-500 rounded-full"><span className="material-icons">delete</span></button></li>)}</ul>
                                </div>}
                            </div>
                        )}
                        {activeDevTab === 'docs' && (
                             <Section title="문서 (Markdown)" icon="description">
                                <textarea
                                    value={app.documentation || ''}
                                    onChange={handleUpdateDocumentation}
                                    rows={12}
                                    placeholder="기능 명세, API, README 등 프로젝트 문서를 마크다운으로 작성하세요."
                                    className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </Section>
                        )}
                        {activeDevTab === 'testing' && (
                            <Section title="테스트" icon="science">
                                <DetailItem icon="terminal" label="테스트 명령어" value={app.testInfo?.testCommand || 'N/A'} isCode />
                                <div className="grid grid-cols-2 gap-4">
                                     <DetailItem icon="check_circle" label="최근 결과" value={app.testInfo?.lastTestSuccess ? <span className="text-green-600">성공</span> : <span className="text-red-600">실패</span>} />
                                     <DetailItem icon="bar_chart" label="커버리지" value={`${app.testInfo?.coverage || 0}%`} />
                                </div>
                                <p className="text-xs text-gray-500">마지막 실행: {app.testInfo?.lastTestTime ? new Date(app.testInfo.lastTestTime).toLocaleString() : '없음'}</p>
                                <button onClick={handleRunTests} className="w-full px-4 py-3 text-base font-bold text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                                    <span className="material-icons">science</span> 테스트 실행
                                </button>
                            </Section>
                        )}
                    </div>
                </div>
            );
        case DevStage.DEPLOYED:
            const { deploymentInfo, todos } = app;
            const allTodosCompleted = !todos?.some(t => !t.completed);
            const releaseNotesExist = !!deploymentInfo?.releaseNotes?.trim();
            const buildIsSuccessful = deploymentInfo?.lastBuildSuccess === true;
            const canDeploy = allTodosCompleted && releaseNotesExist && buildIsSuccessful;

            return (
                <div className="space-y-8">
                    <Section title="빌드 & 릴리즈 정보" icon="inventory_2">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                            <DetailItem icon="settings" label="현재 버전" value={deploymentInfo?.version || 'N/A'} />
                            <DetailItem icon="commit" label="최신 커밋" value={deploymentInfo?.gitCommitHash || 'N/A'} />
                            <DetailItem icon="rocket_launch" label="배포 대상" value={deploymentInfo?.deploymentTarget || 'N/A'} />
                            <DetailItem icon="terminal" label="빌드 명령어" value={deploymentInfo?.buildCommand || 'N/A'} isCode className="col-span-2 md:col-span-3"/>
                        </div>
                        <div className="pt-4 border-t border-gray-200 flex items-center justify-between gap-4">
                            <div className="text-sm">
                                <p className="text-gray-500">마지막 빌드: <span className="text-gray-700">{deploymentInfo?.lastBuildTime ? new Date(deploymentInfo.lastBuildTime).toLocaleString() : '없음'}</span></p>
                                <p className={`font-bold ${deploymentInfo?.lastBuildSuccess ? 'text-green-600' : 'text-red-600'}`}>{deploymentInfo?.lastBuildSuccess === undefined ? 'N/A' : (deploymentInfo.lastBuildSuccess ? '성공' : '실패')}</p>
                            </div>
                            <button onClick={handleBuild} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                <span className="material-icons">inventory_2</span> 앱 빌드
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">릴리즈 노트</label>
                            <textarea
                                value={deploymentInfo?.releaseNotes || ''}
                                onChange={(e) => handleUpdateDeploymentInfo({ releaseNotes: e.target.value })}
                                rows={4}
                                placeholder="이 버전의 변경 사항을 기록하세요..."
                                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </Section>

                    <Section title="배포" icon="rocket_launch">
                         <div>
                            <h5 className="font-semibold text-gray-800 mb-3">배포 전 체크리스트</h5>
                            <ul className="space-y-2 text-sm p-4 bg-gray-100 rounded-lg">
                                <ChecklistItem isMet={allTodosCompleted} text="모든 할 일이 완료되었는가?" />
                                <ChecklistItem isMet={releaseNotesExist} text="릴리즈 노트가 작성되었는가?" />
                                <ChecklistItem isMet={buildIsSuccessful} text="최신 빌드가 성공했는가?" />
                            </ul>
                         </div>
                         <div className="pt-4 border-t border-gray-200 flex flex-col items-center gap-2">
                            <button onClick={handleDeploy} disabled={!canDeploy} className="w-full px-4 py-3 text-base font-bold text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                                <span className="material-icons">rocket_launch</span> 프로덕션 배포
                            </button>
                            {deploymentInfo?.lastDeploymentTime && <p className="text-xs text-gray-500">마지막 배포: {new Date(deploymentInfo.lastDeploymentTime).toLocaleString()}</p>}
                         </div>
                    </Section>

                    <Section title="서비스 지표" icon="bar_chart">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="flex items-center gap-2 text-sm font-medium text-gray-700"><span className="material-icons">storage</span>DB 호출량</span>
                                <input type="number" name="dbCalls" value={app.metrics?.dbCalls || 0} onChange={handleMetricsChange} className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500" />
                            </label>
                            <label className="block">
                                <span className="flex items-center gap-2 text-sm font-medium text-gray-700"><span className="material-icons">api</span>API 사용량</span>
                                <input type="number" name="apiUsage" value={app.metrics?.apiUsage || 0} onChange={handleMetricsChange} className="mt-1 w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500" />
                            </label>
                        </div>
                    </Section>
                </div>
            );
        default:
            return null;
    }
};


export const AppDetailsModal: React.FC<AppDetailsModalProps> = ({ isOpen, onClose, app, onUpdateApp }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedApp, setEditedApp] = useState<App | null>(null);

  useEffect(() => {
    if (app) {
      setEditedApp(app);
    }
  }, [app]);

  if (!isOpen || !editedApp) return null;
  
  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEditedApp(prev => prev ? { ...prev, devStage: e.target.value as DevStage } : null);
  };

  const handleSave = () => {
    if (editedApp) {
      onUpdateApp(editedApp.id, editedApp);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedApp(app); // Revert to original app data
    setIsEditing(false);
  };

  const handleUpdateEditedApp = (field: keyof App, value: any) => {
    setEditedApp(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleUpdateLink = (updatedLink: LinkItem) => {
    setEditedApp(prev => {
      if (!prev) return null;
      const updatedLinks = prev.links.map(link => link.url === updatedLink.url ? updatedLink : link);
      return { ...prev, links: updatedLinks };
    });
  };

  const handleAddLink = () => {
    setEditedApp(prev => {
      if (!prev) return null;
      const newLink: LinkItem = { label: '', url: '', icon: 'link' };
      return { ...prev, links: [...prev.links, newLink] };
    });
  };

  const handleDeleteLink = (linkToDelete: LinkItem) => {
    setEditedApp(prev => {
      if (!prev) return null;
      const updatedLinks = prev.links.filter(link => link.url !== linkToDelete.url);
      return { ...prev, links: updatedLinks };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-200">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{editedApp.name}</h2>
                <p className="text-gray-600 mt-1">{editedApp.description}</p>
            </div>
            <div className="flex items-center gap-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">저장</button>
                        <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">취소</button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">수정</button>
                )}
                <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                    <span className="material-icons">close</span>
                </button>
            </div>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className={`flex items-center justify-center gap-2 p-2 rounded-md ${statusConfig[editedApp.status].color.split(' ')[0]} ${statusConfig[editedApp.status].color.split(' ')[1]}`}>
                    <span className="material-icons">{statusConfig[editedApp.status].icon}</span>
                    <span className="font-semibold">{statusKorean[editedApp.status]}</span>
                </div>
                 <div>
                   <select
                     value={editedApp.devStage}
                     onChange={handleStageChange}
                     className="w-full h-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                   >
                     {Object.values(DevStage).map((stage) => (
                       <option key={stage} value={stage}>
                         {devStageKorean[stage]}
                       </option>
                     ))}
                   </select>
                </div>
            </div>
            
             { (editedApp.devStage === DevStage.PLANNING || editedApp.devStage === DevStage.DEVELOPMENT) && (
              <dl className="space-y-4 border-b border-gray-200 pb-6">
                  {isEditing ? (
                      <>
                          <EditableTextItem
                              icon="folder"
                              label="프로젝트 경로"
                              value={editedApp.path}
                              onUpdate={(value) => handleUpdateEditedApp('path', value)}
                              placeholder="프로젝트 경로"
                              isCode
                          />
                          <EditableTextItem
                              icon="terminal"
                              label="실행 명령어"
                              value={editedApp.command}
                              onUpdate={(value) => handleUpdateEditedApp('command', value)}
                              placeholder="실행 명령어"
                              isCode
                          />
                          <Section title="링크" icon="link">
                            {editedApp.links.map((link, index) => (
                                <EditableLinkItem
                                    key={index}
                                    link={link}
                                    onUpdate={handleUpdateLink}
                                    onDelete={() => handleDeleteLink(link)}
                                />
                            ))}
                            <button onClick={handleAddLink} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                                <span className="material-icons">add</span> 링크 추가
                            </button>
                          </Section>
                      </>
                  ) : (
                      <>
                          <DetailItem icon="folder" label="프로젝트 경로" value={editedApp.path} isCode />
                          <DetailItem icon="terminal" label="실행 명령어" value={editedApp.command} isCode />
                          <Section title="링크" icon="link">
                            {editedApp.links.map((link, index) => (
                                <DetailItem key={index} icon={link.icon || 'link'} label={link.label} value={<a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link.url}</a>} />
                            ))}
                          </Section>
                      </>
                  )}
                  <div>
                      <dt className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <span className="material-icons">build</span>
                          기술 스택
                      </dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                          {editedApp.techStack.map((tech) => (
                              <span key={tech} className="px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-700 rounded-full">{tech}</span>
                          ))}
                      </dd>
                  </div>
              </dl>
            )}

            {/* Stage-specific content */}
            <StageSpecificContent app={editedApp} onUpdateApp={onUpdateApp} />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100 border-t border-gray-200 flex justify-end">
            {!isEditing && (
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">닫기</button>
            )}
        </div>
      </div>
    </div>
  );
};
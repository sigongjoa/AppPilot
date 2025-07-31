export enum AppStatus {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
}

export enum DevStage {
  PLANNING = 'Planning',
  DEVELOPMENT = 'Development',
  DEPLOYED = 'Deployed',
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface BlockerItem {
  id: string;
  text: string;
  resolved: boolean;
}

export interface BugItem {
  id: string;
  text: string;
  priority: 'High' | 'Medium' | 'Low';
  resolved: boolean;
}

export interface TestInfo {
  testCommand: string;
  lastTestTime?: string;
  lastTestSuccess?: boolean;
  coverage?: number; // as a percentage
}

export interface Metrics {
  dbCalls: number;
  apiUsage: number;
}

export interface DeploymentInfo {
  buildCommand: string;
  buildOutputPath: string;
  lastBuildTime?: string;
  lastBuildSuccess?: boolean;
  deploymentTarget: string;
  deploymentCommand?: string;
  lastDeploymentTime?: string;
  version: string;
  gitCommitHash?: string;
  releaseNotes?: string;
}

export interface LinkItem {
  label: string;
  url: string;
  icon?: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  status: AppStatus;
  devStage: DevStage;
  path: string;
  command: string;
  techStack: string[];
  logs: string[];
  links: LinkItem[];
  // Stage-specific data
  ideas?: string;
  todos?: TodoItem[];
  metrics?: Metrics;
  deploymentInfo?: DeploymentInfo;
  documentation?: string;
  testInfo?: TestInfo;
  blockers?: BlockerItem[];
  bugs?: BugItem[];
}

export type ShortIdeaStatus = 'Idea' | 'Planning' | 'Scripting' | 'Filming' | 'Editing' | 'Uploaded';

export interface ShortIdea {
  id: string;
  title: string;
  description: string;
  status: ShortIdeaStatus;
  createdAt: number;
  statusNotes?: {
    [key in ShortIdeaStatus]?: string;
  };
}

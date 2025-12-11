export enum AgentStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  EXECUTING = 'EXECUTING',
  WAITING = 'WAITING',
  ERROR = 'ERROR',
  COMPLETED = 'COMPLETED',
}

export interface AgentNode {
  id: string;
  label: string;
  type: 'planner' | 'executor' | 'reviewer' | 'tool' | 'start' | 'end';
  status: AgentStatus;
  x: number;
  y: number;
}

export interface AgentLink {
  source: string;
  target: string;
  animated?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string; // e.g., "ExecutionEngine", "KafkaConsumer"
  message: string;
  metadata?: Record<string, any>;
}

export interface OntologyNode {
  id: string;
  group: number; // 1: Entity, 2: Attribute, 3: Relation
  radius: number;
  label: string;
}

export interface OntologyLink {
  source: string;
  target: string;
  value: number;
}

export interface SystemMetric {
  name: string;
  value: number | string;
  change: number;
  unit: string;
}

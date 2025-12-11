export type Lang = 'en' | 'zh';

export const translations = {
  en: {
    sidebar: {
      dashboard: 'Infra Dashboard',
      orchestration: 'Agent FSM',
      ontology: 'Ontology Graph',
      logs: 'Event Stream',
      config: 'Platform Config',
      version: 'V 2.5.0-beta',
      env: 'Env: PROD-US-EAST'
    },
    dashboard: {
      title: 'Infrastructure Overview',
      subtitle: 'Connected to cluster',
      stats: {
        throughput: 'Total Pipeline Throughput',
        activeAgents: 'Active Agents',
        latency: 'VectorDB Latency (P99)',
        entities: 'Ontology Entities',
        vsLastHour: 'vs last hour'
      },
      chartTitle: 'Pipeline Throughput (Token Velocity)',
      copilot: {
        title: 'Gemini Copilot',
        button: 'Analyze Infra',
        thinking: 'Thinking...',
        placeholder: 'System operational. Click Analyze to run diagnostics.'
      }
    },
    fsm: {
      title: 'Execution Engine (DAG)',
      subtitle: 'LangGraph Runtime • Parallel Execution • State Recovery',
      nodes: {
        start: 'Input Trigger',
        planner: 'Planner Agent',
        executor_sql: 'Text2SQL Agent',
        executor_rag: 'RAG Retriever',
        aggregator: 'Result Aggregator',
        end: 'Final Response'
      }
    },
    ontology: {
      title: 'Ontology Knowledge Layer',
      subtitle: 'Semantic Graph automatically extracted from business data (Insight Agent)'
    },
    logs: {
      title: 'LIVE EVENT STREAM',
      buffer: 'buffer: 50 lines'
    },
    system: {
      healthy: 'System Healthy'
    }
  },
  zh: {
    sidebar: {
      dashboard: '基础设施看板',
      orchestration: '智能体编排 (FSM)',
      ontology: '本体知识图谱',
      logs: '实时事件流',
      config: '平台配置',
      version: 'V 2.5.0-beta',
      env: '环境: PROD-US-EAST'
    },
    dashboard: {
      title: '基础设施概览',
      subtitle: '已连接集群',
      stats: {
        throughput: '全链路吞吐量',
        activeAgents: '活跃智能体',
        latency: '向量库延迟 (P99)',
        entities: '本体实体数',
        vsLastHour: '环比上小时'
      },
      chartTitle: '流水线吞吐量 (Token速率)',
      copilot: {
        title: 'Gemini 智能助手',
        button: '诊断基础设施',
        thinking: '思考中...',
        placeholder: '系统运行正常。点击“诊断”运行智能分析。'
      }
    },
    fsm: {
      title: '执行引擎 (DAG)',
      subtitle: 'LangGraph 运行时 • 并行执行 • 状态恢复',
      nodes: {
        start: '输入触发',
        planner: '规划智能体',
        executor_sql: 'Text2SQL 智能体',
        executor_rag: 'RAG 检索器',
        aggregator: '结果聚合器',
        end: '最终响应'
      }
    },
    ontology: {
      title: '本体知识层',
      subtitle: '基于业务数据自动抽取的语义图谱 (Insight Agent)'
    },
    logs: {
      title: '实时事件流',
      buffer: '缓存: 50 行'
    },
    system: {
      healthy: '系统健康'
    }
  }
};
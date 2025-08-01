import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Settings, 
  MessageCircle, 
  FileCheck, 
  Calculator, 
  Users, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Zap,
  DollarSign,
  Shield,
  Brain,
  Cpu,
  Network,
  Server,
  Code,
  Eye,
  Wrench,
  Bot,
  Bell,
  X
} from 'lucide-react';

// Agent and Tool Configurations
const agentConfigs = {
  onboardingAgent: {
    name: 'Interview Agent',
    type: 'LangGraph',
    llm: 'GPT-4',
    color: 'bg-blue-500',
    icon: MessageCircle,
    tools: ['conversation_tool', 'form_builder', 'document_uploader'],
    mcpServers: ['ui_server', 'validation_server']
  },
  verificationAgent: {
    name: 'Verification Agent',
    type: 'CrewAI',
    llm: 'Claude-3.5',
    color: 'bg-purple-500',
    icon: FileCheck,
    tools: ['credit_bureau_api', 'plaid_connector', 'id_verification', 'ocr_tool'],
    mcpServers: ['banking_server', 'credit_server', 'identity_server']
  },
  assessmentAgent: {
    name: 'Risk Assessment Agent',
    type: 'LlamaStack',
    llm: 'Llama-3.1-70B',
    color: 'bg-orange-500',
    icon: Calculator,
    tools: ['risk_calculator', 'financial_analyzer', 'policy_engine'],
    mcpServers: ['risk_modeling_server', 'compliance_server']
  },
  reviewAgent: {
    name: 'Review Coordinator',
    type: 'Custom Agent',
    llm: 'GPT-4o',
    color: 'bg-yellow-500',
    icon: Users,
    tools: ['case_manager', 'notification_tool', 'priority_scorer'],
    mcpServers: ['workflow_server', 'communication_server']
  },
  processAgent: {
    name: 'Processing Agent',
    type: 'LangGraph',
    llm: 'GPT-4',
    color: 'bg-indigo-500',
    icon: FileText,
    tools: ['document_generator', 'esignature_api', 'core_banking_connector'],
    mcpServers: ['document_server', 'banking_core_server']
  }
};

const toolConfigs = {
  conversation_tool: { icon: MessageCircle, color: 'text-blue-600' },
  form_builder: { icon: FileText, color: 'text-green-600' },
  document_uploader: { icon: FileCheck, color: 'text-purple-600' },
  credit_bureau_api: { icon: Database, color: 'text-red-600' },
  plaid_connector: { icon: Network, color: 'text-green-600' },
  id_verification: { icon: Shield, color: 'text-blue-600' },
  ocr_tool: { icon: Eye, color: 'text-orange-600' },
  risk_calculator: { icon: Calculator, color: 'text-red-600' },
  financial_analyzer: { icon: DollarSign, color: 'text-green-600' },
  policy_engine: { icon: Settings, color: 'text-gray-600' },
  case_manager: { icon: FileText, color: 'text-blue-600' },
  notification_tool: { icon: Bell, color: 'text-yellow-600' },
  priority_scorer: { icon: AlertTriangle, color: 'text-red-600' },
  document_generator: { icon: FileText, color: 'text-indigo-600' },
  esignature_api: { icon: Wrench, color: 'text-purple-600' },
  core_banking_connector: { icon: Database, color: 'text-green-600' }
};

// Enhanced workflow steps with agent configurations
const workflowSteps = [
  {
    id: 'trigger',
    type: 'trigger',
    position: { x: 100, y: 264 },
    agent: null,
    duration: 1000
  },
  {
    id: 'onboarding',
    type: 'onboarding',
    position: { x: 350, y: 264 },
    agent: agentConfigs.onboardingAgent,
    thoughts: [
      'Analyzing applicant type based on initial response...',
      'Determining required documentation for self-employed status...',
      'Generating dynamic follow-up questions...',
      'Validating uploaded documents using OCR...'
    ],
    duration: 8000
  },
  {
    id: 'verification',
    type: 'verification',
    position: { x: 600, y: 264 },
    agent: agentConfigs.verificationAgent,
    thoughts: [
      'Connecting to credit bureau APIs...',
      'Verifying bank account information via Plaid...',
      'Running KYC checks on provided documents...',
      'Cross-referencing data across multiple sources...',
      'Calculating confidence scores for each data point...'
    ],
    duration: 12000
  },
  {
    id: 'assessment',
    type: 'assessment',
    position: { x: 850, y: 264 },
    agent: agentConfigs.assessmentAgent,
    thoughts: [
      'Loading risk assessment models...',
      'Calculating debt-to-income ratio...',
      'Analyzing cash flow patterns...',
      'Applying regulatory compliance rules...',
      'Generating risk score and confidence level...'
    ],
    duration: 10000
  },
  {
    id: 'humanReview',
    type: 'humanReview',
    position: { x: 600, y: 544 },
    agent: agentConfigs.reviewAgent,
    thoughts: [
      'Analyzing risk score confidence level...',
      'Creating case summary for human review...',
      'Assigning to appropriate loan officer...',
      'Setting up notification workflows...'
    ],
    duration: 5000
  },
  {
    id: 'processing',
    type: 'processing',
    position: { x: 1100, y: 264 },
    agent: agentConfigs.processAgent,
    thoughts: [
      'Generating loan agreement documents...',
      'Preparing e-signature workflow...',
      'Updating core banking systems...',
      'Sending approval notifications...'
    ],
    duration: 7000
  }
];

const WorkflowNode = ({ step, isActive, isCompleted, onClick, executionProgress, isPendingHuman }) => {
  const nodeConfig = step.agent || { 
    icon: Zap, 
    color: 'bg-green-500', 
    name: 'System Trigger',
    type: 'System'
  };
  const Icon = nodeConfig.icon;
  
  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (isPendingHuman) return <Users className="w-4 h-4 text-yellow-400 animate-bounce" />;
    if (isActive) return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
    return null;
  };

  const getStatusColor = () => {
    if (isCompleted) return 'border-green-400 bg-gray-800 bg-opacity-90 shadow-lg shadow-green-400/20';
    if (isPendingHuman) return 'border-yellow-400 bg-gray-800 bg-opacity-90 shadow-xl shadow-yellow-400/30 transform scale-105 animate-pulse';
    if (isActive) return 'border-blue-400 bg-gray-800 bg-opacity-90 shadow-xl shadow-blue-400/30 transform scale-105';
    return 'border-gray-600 bg-gray-900 bg-opacity-90 hover:border-gray-500 backdrop-blur-sm';
  };

  return (
    <div className="relative">
      <div
        className={`absolute cursor-pointer transition-all duration-300 ${getStatusColor()} border-2 rounded-xl p-4 w-56 h-32 hover:shadow-lg overflow-hidden`}
        style={{ left: step.position.x, top: step.position.y }}
        onClick={() => onClick(step)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`${nodeConfig.color} rounded-full p-2 relative shadow-lg`}>
            <Icon className="w-4 h-4 text-white" />
            {isActive && (
              <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30"></div>
            )}
          </div>
          {getStatusIcon()}
        </div>
        
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-white">{nodeConfig.name}</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-xs text-gray-400">Step {workflowSteps.findIndex(s => s.id === step.id) + 1}</span>
          </div>
        </div>
        <div className="text-xs text-gray-400 mb-2">
          <div className="flex items-center space-x-1">
            <Cpu className="w-3 h-3" />
            <span>{nodeConfig.type}</span>
            {nodeConfig.llm && (
              <>
                <span>•</span>
                <span>{nodeConfig.llm}</span>
              </>
            )}
          </div>
        </div>
        
        {isActive && executionProgress && (
          <div className="mb-2">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${executionProgress * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {Math.round(executionProgress * 100)}% complete
            </div>
          </div>
        )}
        

      </div>

      {/* Floating Activity Popup */}
      {isActive && (
        <div 
          className="absolute z-50 transform -translate-x-1/2 -translate-y-full"
          style={{ 
            left: step.position.x + 112,
            top: step.position.y - 20
          }}
        >
          <div className="bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-400 rounded-xl p-4 shadow-2xl backdrop-blur-sm min-w-80">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className={`${step.agent?.color || 'bg-blue-500'} rounded-full p-2 animate-pulse`}>
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <div className="font-bold text-white">{step.agent?.name || 'System'}</div>
                <div className="text-xs text-blue-300">{step.agent?.type} • {step.agent?.llm}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Progress</span>
                <span>{Math.round((executionProgress || 0) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(executionProgress || 0) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Active Tools and MCP Servers */}
            {step.agent?.tools && step.agent.tools.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-blue-300 mb-3 flex items-center space-x-2 font-semibold">
                  <Wrench className="w-4 h-4" />
                  <span>Tools Being Called ({step.agent.tools.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {step.agent.tools.map((tool, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs bg-gray-800 bg-opacity-50 p-2 rounded border border-gray-600">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-200 font-medium">{tool.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {step.agent?.mcpServers && step.agent.mcpServers.length > 0 && (
              <div className="mb-4">
                <div className="text-sm text-purple-300 mb-3 flex items-center space-x-2 font-semibold">
                  <Server className="w-4 h-4" />
                  <span>MCP Servers ({step.agent.mcpServers.length})</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {step.agent.mcpServers.map((server, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs bg-purple-900 bg-opacity-30 p-2 rounded border border-purple-600">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-purple-200 font-medium">{server.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-center space-x-1">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
          
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-400"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const ConnectionArrow = ({ from, to, isActive, isCompleted, isNext }) => {
  const startX = from.x + 224; // Right edge of from box (w-56 = 224px)
  const startY = from.y + 64; // Center of box height (128px / 2)
  const endX = to.x; // Left edge of to box
  const endY = to.y + 64; // Center of box height (128px / 2)
  
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Enhanced color scheme and animations
  const getArrowColor = () => {
    if (isActive) return "#3b82f6"; // Bright blue for active
    if (isCompleted) return "#10b981"; // Green for completed
    if (isNext) return "#8b5cf6"; // Purple for next
    return "#9ca3af"; // Lighter gray for better visibility
  };
  
  const getStrokeWidth = () => {
    if (isActive) return "4";
    if (isCompleted) return "3";
    if (isNext) return "2.5";
    return "2";
  };
  
  const getOpacity = () => {
    if (isActive) return "1";
    if (isCompleted) return "0.9";
    if (isNext) return "0.8";
    return "0.7";
  };
  
  const getDashArray = () => {
    if (isActive) return "0"; // Solid line for active
    if (isCompleted) return "0"; // Solid line for completed
    if (isNext) return "8,4"; // Dashed for next
    return "2,2"; // Dotted for default
  };
  
  const getConnectorType = () => {
    if (isActive) return "thick"; // Thick connector for active
    if (isCompleted) return "medium"; // Medium connector for completed
    if (isNext) return "dashed"; // Dashed connector for next
    return "dotted"; // Dotted connector for default
  };
  
  const getAnimation = () => {
    if (isActive) return "flow-active";
    if (isCompleted) return "flow-completed";
    if (isNext) return "flow-next";
    return "";
  };
  
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <marker
          id={`arrowhead-${isActive ? 'active' : isCompleted ? 'completed' : isNext ? 'next' : 'default'}`}
          markerWidth="12"
          markerHeight="8"
          refX="10"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 12 4, 0 8"
            fill={getArrowColor()}
            opacity={getOpacity()}
          />
        </marker>
        
        {/* Gradient definitions for enhanced visual appeal */}
        <linearGradient id={`gradient-${isActive ? 'active' : isCompleted ? 'completed' : isNext ? 'next' : 'default'}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={getArrowColor()} stopOpacity="0.3" />
          <stop offset="50%" stopColor={getArrowColor()} stopOpacity="1" />
          <stop offset="100%" stopColor={getArrowColor()} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      {/* Background path for glow effect */}
      <path
        d={`M ${startX} ${startY} Q ${midX} ${midY - 20} ${endX} ${endY}`}
        stroke={getArrowColor()}
        strokeWidth={parseInt(getStrokeWidth()) + 4}
        fill="none"
        opacity="0.2"
        filter="blur(2px)"
      />
      
      {/* Main arrow path */}
      <path
        d={`M ${startX} ${startY} Q ${midX} ${midY - 20} ${endX} ${endY}`}
        stroke={isActive ? `url(#gradient-${isActive ? 'active' : 'default'})` : getArrowColor()}
        strokeWidth={getStrokeWidth()}
        fill="none"
        markerEnd={`url(#arrowhead-${isActive ? 'active' : isCompleted ? 'completed' : isNext ? 'next' : 'default'})`}
        opacity={getOpacity()}
        strokeDasharray={getDashArray()}
        className={getAnimation()}
        style={{
          filter: isActive ? 'drop-shadow(0 0 4px currentColor)' : 'none'
        }}
      />
      
      {/* Additional connector lines for workflow structure */}
      <path
        d={`M ${startX} ${startY} Q ${midX} ${midY - 20} ${endX} ${endY}`}
        stroke={getArrowColor()}
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="1,1"
      />
      
      {/* Animated flow particles for active connections */}
      {isActive && (
        <circle
          cx={startX}
          cy={startY}
          r="2"
          fill={getArrowColor()}
          opacity="0.8"
          className="animate-ping"
        />
      )}
    </svg>
  );
};

const NodeDetailsPanel = ({ step, executionData, onClose, isActive, executionProgress }) => {
  if (!step) return null;
  
  const nodeConfig = step.agent || { 
    icon: Zap, 
    color: 'bg-green-500', 
    name: 'System Trigger',
    type: 'System'
  };
  const Icon = nodeConfig.icon;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`${nodeConfig.color} rounded-full p-2`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{nodeConfig.name}</h2>
                <div className="text-sm text-gray-400 flex items-center space-x-1">
                  <Cpu className="w-3 h-3" />
                  <span>{nodeConfig.type}</span>
                  {nodeConfig.llm && (
                    <>
                      <span>•</span>
                      <span>{nodeConfig.llm}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {step.agent && (
              <div>
                <h3 className="font-medium mb-3 flex items-center space-x-2 text-white">
                  <Bot className="w-4 h-4" />
                  <span>Agent Configuration</span>
                </h3>
                <div className="bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Framework:</span>
                    <span className="font-medium text-white">{step.agent.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">LLM:</span>
                    <span className="font-medium text-blue-400">{step.agent.llm}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tools:</span>
                    <span className="font-medium text-green-400">{step.agent.tools.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">MCP Servers:</span>
                    <span className="font-medium text-purple-400">{step.agent.mcpServers.length}</span>
                  </div>
                </div>
              </div>
            )}

            {step.agent?.tools && (
              <div>
                <h3 className="font-medium mb-3 flex items-center space-x-2 text-white">
                  <Wrench className="w-4 h-4" />
                  <span>Available Tools</span>
                </h3>
                <div className="space-y-2">
                  {step.agent.tools.map((tool) => {
                    const toolConfig = toolConfigs[tool];
                    const ToolIcon = toolConfig?.icon || Code;
                    return (
                      <div key={tool} className="flex items-center space-x-3 p-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded">
                        <ToolIcon className={`w-4 h-4 ${toolConfig?.color || 'text-gray-400'}`} />
                        <span className="text-sm font-medium text-gray-300">{tool.replace('_', ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step.agent?.mcpServers && (
              <div>
                <h3 className="font-medium mb-3 flex items-center space-x-2 text-white">
                  <Server className="w-4 h-4" />
                  <span>MCP Servers</span>
                </h3>
                <div className="space-y-2">
                  {step.agent.mcpServers.map((server) => (
                    <div key={server} className="flex items-center space-x-3 p-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded">
                      <Network className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-gray-300">{server.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-green-400 bg-green-900 bg-opacity-20 rounded-lg p-3">
              <div className="text-green-400 text-sm font-medium">✓ Panel is working!</div>
              <div className="text-gray-300 text-xs mt-1">
                Click different workflow nodes to see their configurations
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ExecutionLog = ({ logs }) => {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-48 bg-black border-t border-gray-800 text-white p-4 overflow-hidden">
      <h3 className="font-medium mb-2 flex items-center space-x-2">
        <Database className="w-4 h-4" />
        <span>Agent Execution Log</span>
      </h3>
      <div ref={logRef} className="h-32 overflow-y-auto space-y-1 text-sm font-mono">
        {logs.map((log, index) => (
          <div key={index} className="flex space-x-2">
            <span className="text-gray-500 text-xs">{log.timestamp}</span>
            <span className={
              log.level === 'error' ? 'text-red-400' :
              log.level === 'success' ? 'text-green-400' :
              log.level === 'agent' ? 'text-blue-400' :
              log.level === 'tool' ? 'text-yellow-400' :
              'text-gray-400'
            }>
              [{log.level.toUpperCase()}]
            </span>
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AgenticLoanWorkflow() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [executionData, setExecutionData] = useState({});
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [executionProgress, setExecutionProgress] = useState({});
  const [currentThoughts, setCurrentThoughts] = useState({});
  const [activeTools, setActiveTools] = useState({});
  const [activeMcpServers, setActiveMcpServers] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [pendingHumanReview, setPendingHumanReview] = useState(null);
  const [humanReviewData, setHumanReviewData] = useState({});

  const addLog = (level, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, level, message }]);
  };

  const simulateAgentExecution = async (step) => {
    const stepId = step.id;
    const agent = step.agent;
    
    if (!agent) {
      addLog('info', 'System trigger activated');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { status: 'completed', trigger: 'application_started' };
    }

    addLog('agent', `${agent.name} (${agent.type}) starting execution...`);
    addLog('info', `Loading ${agent.llm} model...`);
    
    const totalDuration = step.duration || 5000;
    let progress = 0;
    const progressInterval = 100;
    const progressIncrement = progressInterval / totalDuration;

    const progressTimer = setInterval(() => {
      progress = Math.min(1, progress + progressIncrement);
      setExecutionProgress(prev => ({ ...prev, [stepId]: progress }));
    }, progressInterval);

    await new Promise(resolve => setTimeout(resolve, totalDuration));

    clearInterval(progressTimer);
    setExecutionProgress(prev => ({ ...prev, [stepId]: 1 }));
    
    addLog('success', `${agent.name} completed successfully`);
    
    const mockResponses = {
      onboarding: {
        status: 'completed',
        applicant_data: { 
          name: 'Sarah Johnson',
          type: 'self-employed', 
          income: 85000,
          employment: 'Freelance Marketing Consultant',
          requested_amount: 45000,
          loan_purpose: 'Business Equipment Purchase'
        },
        documents_collected: ['tax_returns', 'bank_statements', 'business_license'],
        confidence: 0.95
      },
      verification: {
        status: 'completed',
        credit_score: 742,
        identity_verified: true,
        income_verified: true,
        debt_to_income: 0.28,
        existing_loans: 1,
        risk_flags: [],
        account_history: '18 months verified'
      },
      assessment: {
        status: 'completed',
        risk_score: 0.23,
        dti_ratio: 0.28,
        recommendation: 'APPROVE',
        confidence: 0.87,
        monthly_payment: 678,
        loan_term: '72 months',
        interest_rate: 6.4,
        flags: ['Self-employed income', 'First-time business borrower']
      },
      humanReview: {
        status: 'completed',
        case_created: true,
        assigned_officer: 'jane_doe',
        priority: 'medium'
      },
      processing: {
        status: 'completed',
        documents_generated: true,
        notifications_sent: true,
        core_system_updated: true
      }
    };

    return mockResponses[step.type] || { status: 'completed' };
  };

  const executeWorkflow = async () => {
    setIsRunning(true);
    setCompletedSteps(new Set());
    setExecutionData({});
    setExecutionProgress({});
    setCurrentThoughts({});
    setActiveTools({});
    setActiveMcpServers({});
    setLogs([]);
    
    addLog('info', 'Initializing agentic workflow execution...');

    try {
      // Define the correct workflow execution order
      const executionOrder = ['trigger', 'onboarding', 'verification', 'assessment', 'humanReview', 'processing'];
      
      for (let i = 0; i < executionOrder.length; i++) {
        const stepId = executionOrder[i];
        const step = workflowSteps.find(s => s.id === stepId);
        
        if (!step) continue;
        
        if (step.type === 'humanReview') {
          const assessmentData = executionData['assessment'];
          const verificationData = executionData['verification'];
          const onboardingData = executionData['onboarding'];
          
          if (assessmentData?.confidence && assessmentData.confidence > 0.85) {
            addLog('info', 'High confidence score - but flagging for manual review');
          }
          
          // Always require human review for loan processing
          setPendingHumanReview(step.id);
          setHumanReviewData({
            // Applicant Information
            applicantName: onboardingData?.applicant_data?.name || 'Sarah Johnson',
            employment: onboardingData?.applicant_data?.employment || 'Freelance Marketing Consultant',
            requestedAmount: onboardingData?.applicant_data?.requested_amount || 45000,
            loanPurpose: onboardingData?.applicant_data?.loan_purpose || 'Business Equipment Purchase',
            
            // Financial Details
            annualIncome: onboardingData?.applicant_data?.income || 85000,
            creditScore: verificationData?.credit_score || 742,
            debtToIncome: assessmentData?.dti_ratio || 0.28,
            monthlyPayment: assessmentData?.monthly_payment || 678,
            loanTerm: assessmentData?.loan_term || '72 months',
            interestRate: assessmentData?.interest_rate || 6.4,
            
            // Risk Assessment
            riskScore: assessmentData?.risk_score || 0.23,
            confidence: assessmentData?.confidence || 0.87,
            recommendation: assessmentData?.recommendation || 'APPROVE',
            flaggedItems: assessmentData?.flags || ['Self-employed income', 'First-time business borrower'],
            
            // Additional Context
            accountHistory: verificationData?.account_history || '18 months verified',
            existingLoans: verificationData?.existing_loans || 1
          });
          
          addLog('warning', 'Workflow paused - Human review required');
          setCurrentStep(null);
          setIsRunning(false);
          return; // Stop execution until manual approval
        }

        setCurrentStep(step.id);
        addLog('info', `Starting step: ${step.id}`);
        
        const response = await simulateAgentExecution(step);
        setExecutionData(prev => ({ ...prev, [step.id]: response }));
        setCompletedSteps(prev => new Set([...prev, step.id]));
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      addLog('success', 'Agentic workflow completed successfully!');
    } catch (error) {
      addLog('error', `Workflow failed: ${error.message}`);
    } finally {
      setCurrentStep(null);
      setIsRunning(false);
    }
  };

  const resetWorkflow = () => {
    setIsRunning(false);
    setCurrentStep(null);
    setCompletedSteps(new Set());
    setExecutionData({});
    setExecutionProgress({});
    setCurrentThoughts({});
    setActiveTools({});
    setActiveMcpServers({});
    setLogs([]);
    setPendingHumanReview(null);
    setHumanReviewData({});
  };

  const approveHumanReview = async (decision) => {
    if (!pendingHumanReview) return;
    
    const stepId = pendingHumanReview;
    setPendingHumanReview(null);
    
    addLog('info', `Human review ${decision}: ${stepId}`);
    
    // Mark the human review step as completed
    setCompletedSteps(prev => new Set([...prev, stepId]));
    setExecutionData(prev => ({ 
      ...prev, 
      [stepId]: { 
        decision, 
        reviewer: 'Loan Officer',
        timestamp: new Date().toISOString(),
        ...humanReviewData
      }
    }));
    
    if (decision === 'approved') {
      // Continue to processing step
      addLog('success', 'Loan approved - proceeding to processing');
      continueWorkflowFromStep('processing');
    } else {
      addLog('error', 'Loan rejected - workflow terminated');
    }
  };

  const continueWorkflowFromStep = async (stepId) => {
    setIsRunning(true);
    const step = workflowSteps.find(s => s.id === stepId);
    
    if (step) {
      setCurrentStep(step.id);
      addLog('info', `Resuming workflow: ${step.id}`);
      
      const response = await simulateAgentExecution(step);
      setExecutionData(prev => ({ ...prev, [step.id]: response }));
      setCompletedSteps(prev => new Set([...prev, step.id]));
      
      addLog('success', 'Agentic workflow completed successfully!');
    }
    
    setCurrentStep(null);
    setIsRunning(false);
  };

  const getConnections = () => {
    const connections = [];
    
    // Define the workflow flow: trigger -> onboarding -> verification -> assessment -> humanReview -> processing
    const flowOrder = ['trigger', 'onboarding', 'verification', 'assessment', 'humanReview', 'processing'];
    
    for (let i = 0; i < flowOrder.length - 1; i++) {
      const currentStepId = flowOrder[i];
      const nextStepId = flowOrder[i + 1];
      
      const currentStep = workflowSteps.find(s => s.id === currentStepId);
      const nextStep = workflowSteps.find(s => s.id === nextStepId);
      
      if (currentStep && nextStep) {
        const isCurrentActive = currentStepId === currentStep && isRunning && !completedSteps.has(currentStep.id);
        const isCurrentCompleted = completedSteps.has(currentStep.id);
        const isNextCompleted = completedSteps.has(nextStep.id);
        
        connections.push({
          from: currentStep,
          to: nextStep,
          isActive: isCurrentActive,
          isCompleted: isCurrentCompleted && isNextCompleted,
          isNext: isCurrentCompleted && !isNextCompleted && !isRunning
        });
      }
    }

    return connections;
  };



  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 shadow-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Agentic Loan Processing</h1>
              <p className="text-gray-400 text-sm">Multi-agent AI system with LLMs, tools, and MCP servers</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={executeWorkflow}
              disabled={isRunning}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              <span className="font-medium">{isRunning ? 'Running...' : 'Start'}</span>
            </button>
            
            <button
              onClick={resetWorkflow}
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Reset</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium">Analytics</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${showAnalytics ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showAnalytics && (
                <div className="absolute top-full right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-6 min-w-80 z-50">
                  <h3 className="font-bold mb-4 flex items-center space-x-3 text-lg text-white">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span>Workflow Analytics</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-800 bg-opacity-40 rounded-xl border border-gray-600">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{Object.keys(agentConfigs).length}</div>
                      <div className="text-sm text-gray-400 font-medium">Total Agents</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 bg-opacity-40 rounded-xl border border-gray-600">
                      <div className="text-2xl font-bold text-green-400 mb-1">{completedSteps.size}</div>
                      <div className="text-sm text-gray-400 font-medium">Completed</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 bg-opacity-40 rounded-xl border border-gray-600">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        {currentStep ? workflowSteps.find(s => s.id === currentStep)?.agent?.tools.length || 0 : 0}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">Active Tools</div>
                    </div>
                    <div className="text-center p-3 bg-gray-800 bg-opacity-40 rounded-xl border border-gray-600">
                      <div className="text-2xl font-bold text-yellow-400 mb-1">
                        {currentStep ? workflowSteps.find(s => s.id === currentStep)?.agent?.mcpServers.length || 0 : 0}
                      </div>
                      <div className="text-sm text-gray-400 font-medium">MCP Servers</div>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Status:</span>
                      <span className={`font-bold text-lg ${
                        isRunning ? 'text-blue-400' : 
                        completedSteps.size === workflowSteps.length ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {isRunning ? 'RUNNING' : 
                         completedSteps.size === workflowSteps.length ? 'COMPLETED' : 'READY'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
            >
              <Database className="w-4 h-4" />
              <span className="font-medium">Logs</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 p-8" style={{ minHeight: 'calc(100vh - 100px)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {getConnections().map((connection, index) => (
          <ConnectionArrow
            key={index}
            from={connection.from.position}
            to={connection.to.position}
            isActive={connection.isActive}
            isCompleted={connection.isCompleted}
            isNext={connection.isNext}
          />
        ))}

        {workflowSteps.map((step) => (
          <WorkflowNode
            key={step.id}
            step={step}
            isActive={currentStep === step.id}
            isCompleted={completedSteps.has(step.id)}
            isPendingHuman={pendingHumanReview === step.id}
            onClick={setSelectedNode}
            executionProgress={executionProgress[step.id]}
          />
        ))}






      </div>

      {selectedNode && (
        <NodeDetailsPanel
          step={selectedNode}
          executionData={executionData[selectedNode.id]}
          onClose={() => setSelectedNode(null)}
          isActive={currentStep === selectedNode.id}
          executionProgress={executionProgress[selectedNode.id]}
        />
      )}

      {showLogs && <ExecutionLog logs={logs} />}
      
      {/* Human Review Modal */}
      {pendingHumanReview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Loan Review Required</h2>
                  <p className="text-yellow-100 text-sm">Review and approve loan application for {humanReviewData.applicantName}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Loan Summary Card */}
              <div className="bg-blue-900 bg-opacity-30 border border-blue-600 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-300 mb-4">📋 Loan Application Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Requested Amount</div>
                    <div className="text-2xl font-bold text-green-400">${humanReviewData.requestedAmount?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Monthly Payment</div>
                    <div className="text-xl font-semibold text-white">${humanReviewData.monthlyPayment}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Interest Rate</div>
                    <div className="text-xl font-semibold text-white">{humanReviewData.interestRate}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Loan Term</div>
                    <div className="text-xl font-semibold text-white">{humanReviewData.loanTerm}</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Applicant Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-3">👤 Applicant Information</h3>
                  <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{humanReviewData.applicantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Employment:</span>
                      <span className="text-white">{humanReviewData.employment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Annual Income:</span>
                      <span className="text-green-400 font-medium">${humanReviewData.annualIncome?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Loan Purpose:</span>
                      <span className="text-white">{humanReviewData.loanPurpose}</span>
                    </div>
                  </div>
                </div>
                
                {/* Financial Assessment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-3">📊 Financial Assessment</h3>
                  <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Credit Score:</span>
                      <span className="text-blue-400 font-medium">{humanReviewData.creditScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Debt-to-Income:</span>
                      <span className="text-white">{(humanReviewData.debtToIncome * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Existing Loans:</span>
                      <span className="text-white">{humanReviewData.existingLoans}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account History:</span>
                      <span className="text-white">{humanReviewData.accountHistory}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* AI Assessment */}
              <div className="bg-gray-800 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-bold text-white mb-4">🤖 AI Risk Assessment</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Risk Score</div>
                    <div className="text-2xl font-bold text-orange-400">{(humanReviewData.riskScore * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-2xl font-bold text-blue-400">{(humanReviewData.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400">AI Recommendation</div>
                    <div className={`text-lg font-bold ${
                      humanReviewData.recommendation === 'APPROVE' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {humanReviewData.recommendation}
                    </div>
                  </div>
                </div>
                
                {humanReviewData.flaggedItems && humanReviewData.flaggedItems.length > 0 && (
                  <div className="bg-yellow-900 bg-opacity-30 border border-yellow-600 p-4 rounded-lg">
                    <div className="text-sm text-yellow-400 mb-2">⚠️ Items Requiring Attention</div>
                    <ul className="text-yellow-200 space-y-1">
                      {humanReviewData.flaggedItems.map((item, index) => (
                        <li key={index} className="text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Decision Buttons */}
              <div className="border-t border-gray-700 pt-6">
                <div className="text-center mb-4">
                  <p className="text-white font-medium">
                    As a Loan Officer, do you approve this ${humanReviewData.requestedAmount?.toLocaleString()} loan for {humanReviewData.applicantName}?
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Monthly payment: ${humanReviewData.monthlyPayment} • {humanReviewData.loanTerm} • {humanReviewData.interestRate}% APR
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => approveHumanReview('approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-lg"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Approve ${humanReviewData.requestedAmount?.toLocaleString()} Loan</span>
                  </button>
                  <button
                    onClick={() => approveHumanReview('rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 text-lg"
                  >
                    <X className="w-6 h-6" />
                    <span>Reject Application</span>
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    👤 Logged in as: <span className="text-yellow-400 font-medium">Loan Officer</span> • All decisions are recorded for audit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
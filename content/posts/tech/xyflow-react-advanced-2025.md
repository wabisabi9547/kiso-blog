---
title: "@xyflow/react 마스터클래스: 복잡한 시각적 워크플로우 구축하기"
date: "2025-04-23"
category: "tech"
tags: ["React", "XYFlow", "Visualization", "Workflow", "Performance"]
excerpt: "@xyflow/react의 고급 기능부터 대규모 노드 시스템 최적화까지. 복잡한 비즈니스 워크플로우를 위한 커스텀 노드, 성능 튜닝, 실시간 협업 패턴을 심층 분석합니다."
author: "KISO"
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0bQ_ry1RmNtFpXDZJTwRzTxlP2MsORr6SxkJiWxLXHRr4CEL0-gvs7Ifnmi2UAdNoCbo&usqp=CAU"
---

# @xyflow/react 마스터클래스: 복잡한 시각적 워크플로우 구축하기

@xyflow/react(구 ReactFlow)는 단순한 플로우차트 라이브러리를 넘어 복잡한 비즈니스 워크플로우와 데이터 파이프라인을 구축할 수 있는 강력한 도구로 진화했습니다. 이번 포스트에서는 기본 사용법을 넘어, 엔터프라이즈급 애플리케이션에서 활용할 수 있는 고급 패턴과 최적화 기법들을 심도 있게 다뤄보겠습니다.

## 고급 노드 시스템 아키텍처

### 타입 안전한 노드 팩토리 패턴

대규모 워크플로우에서는 노드 타입을 체계적으로 관리하는 것이 중요합니다:

```typescript
// types/workflow.ts
interface BaseNodeData {
  id: string
  label: string
  description?: string
  config: Record<string, any>
  validation?: ValidationRule[]
}

interface ProcessingNodeData extends BaseNodeData {
  type: 'processing'
  processor: ProcessorConfig
  inputSchema: JSONSchema
  outputSchema: JSONSchema
}

interface DecisionNodeData extends BaseNodeData {
  type: 'decision'
  conditions: ConditionRule[]
  branches: BranchConfig[]
}

interface IntegrationNodeData extends BaseNodeData {
  type: 'integration'
  service: ServiceConfig
  authentication: AuthConfig
  rateLimiting?: RateLimitConfig
}

type WorkflowNodeData = ProcessingNodeData | DecisionNodeData | IntegrationNodeData

// 노드 팩토리
class NodeFactory {
  private nodeTypes = new Map<string, NodeType>()
  private validators = new Map<string, NodeValidator>()
  
  registerNodeType<T extends WorkflowNodeData>(
    type: T['type'],
    component: ComponentType<NodeProps<T>>,
    validator: NodeValidator<T>
  ) {
    this.nodeTypes.set(type, component)
    this.validators.set(type, validator)
  }
  
  createNode<T extends WorkflowNodeData>(
    type: T['type'],
    data: Omit<T, 'type' | 'id'>,
    position: { x: number; y: number }
  ): Node<T> {
    const validator = this.validators.get(type)
    if (!validator) {
      throw new Error(`Unknown node type: ${type}`)
    }
    
    const nodeData = { ...data, type, id: generateNodeId() } as T
    const validationResult = validator.validate(nodeData)
    
    if (!validationResult.isValid) {
      throw new Error(`Node validation failed: ${validationResult.errors.join(', ')}`)
    }
    
    return {
      id: nodeData.id,
      type,
      position,
      data: nodeData,
    }
  }
  
  getNodeTypes() {
    return Object.fromEntries(this.nodeTypes.entries())
  }
}

// 커스텀 노드 컴포넌트
const ProcessingNode: React.FC<NodeProps<ProcessingNodeData>> = ({ 
  data, 
  selected,
  id 
}) => {
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResults, setExecutionResults] = useState<ExecutionResult | null>(null)
  
  const executeNode = useCallback(async () => {
    setIsExecuting(true)
    try {
      const result = await processNodeExecution(data.processor, data.config)
      setExecutionResults(result)
      
      // 실행 결과를 다음 노드로 전파
      propagateResults(id, result)
    } catch (error) {
      setExecutionResults({ 
        success: false, 
        error: error.message,
        timestamp: Date.now()
      })
    } finally {
      setIsExecuting(false)
    }
  }, [data, id])
  
  return (
    <div className={`processing-node ${selected ? 'selected' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => validateConnection(params)}
      />
      
      <div className="node-header">
        <div className="node-title">{data.label}</div>
        <div className="node-actions">
          <button 
            onClick={executeNode}
            disabled={isExecuting}
            className="execute-button"
          >
            {isExecuting ? <Spinner /> : <PlayIcon />}
          </button>
        </div>
      </div>
      
      <div className="node-content">
        <ProcessorConfigEditor 
          config={data.config}
          schema={data.processor.configSchema}
          onChange={(newConfig) => updateNodeConfig(id, newConfig)}
        />
        
        {executionResults && (
          <ExecutionResultsDisplay results={executionResults} />
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={!isExecuting}
      />
    </div>
  )
}
```

### 동적 포트 시스템

복잡한 워크플로우에서는 노드의 입력과 출력 포트가 동적으로 변경될 수 있어야 합니다:

```typescript
// hooks/useDynamicPorts.ts
interface DynamicPort {
  id: string
  type: 'input' | 'output'
  dataType: string
  label: string
  position: Position
  required: boolean
  connected: boolean
}

function useDynamicPorts(nodeId: string, nodeData: any) {
  const [ports, setPorts] = useState<DynamicPort[]>([])
  const { getConnectedEdges } = useReactFlow()
  
  // 노드 데이터 변경시 포트 재계산
  useEffect(() => {
    const newPorts = calculatePorts(nodeData)
    setPorts(newPorts)
  }, [nodeData])
  
  // 연결 상태 업데이트
  useEffect(() => {
    const connectedEdges = getConnectedEdges([{ id: nodeId }])
    
    setPorts(prevPorts => 
      prevPorts.map(port => ({
        ...port,
        connected: connectedEdges.some(edge => 
          (edge.source === nodeId && edge.sourceHandle === port.id) ||
          (edge.target === nodeId && edge.targetHandle === port.id)
        )
      }))
    )
  }, [nodeId, getConnectedEdges])
  
  const addPort = useCallback((type: 'input' | 'output', dataType: string) => {
    const newPort: DynamicPort = {
      id: `${type}-${Date.now()}`,
      type,
      dataType,
      label: `${type} ${ports.filter(p => p.type === type).length + 1}`,
      position: type === 'input' ? Position.Left : Position.Right,
      required: false,
      connected: false,
    }
    
    setPorts(prev => [...prev, newPort])
  }, [ports])
  
  const removePort = useCallback((portId: string) => {
    setPorts(prev => prev.filter(p => p.id !== portId))
  }, [])
  
  const validateConnection = useCallback((connection: Connection) => {
    const sourcePort = ports.find(p => p.id === connection.sourceHandle)
    const targetPort = ports.find(p => p.id === connection.targetHandle)
    
    if (!sourcePort || !targetPort) return false
    
    // 데이터 타입 호환성 검사
    return isDataTypeCompatible(sourcePort.dataType, targetPort.dataType)
  }, [ports])
  
  return {
    ports,
    addPort,
    removePort,
    validateConnection,
  }
}

// 동적 포트를 사용하는 커스텀 노드
const DynamicPortsNode: React.FC<NodeProps> = ({ id, data }) => {
  const { ports, addPort, removePort, validateConnection } = useDynamicPorts(id, data)
  
  return (
    <div className="dynamic-ports-node">
      {ports
        .filter(p => p.type === 'input')
        .map((port, index) => (
          <Handle
            key={port.id}
            id={port.id}
            type="target"
            position={port.position}
            style={{ 
              top: `${30 + index * 25}px`,
              background: getPortColor(port.dataType)
            }}
            onConnect={(params) => validateConnection(params)}
          >
            <div className="port-label">{port.label}</div>
            {!port.required && (
              <button 
                className="remove-port"
                onClick={() => removePort(port.id)}
              >
                ×
              </button>
            )}
          </Handle>
        ))}
      
      <div className="node-body">
        <h3>{data.label}</h3>
        
        <div className="port-controls">
          <button onClick={() => addPort('input', 'any')}>
            Add Input
          </button>
          <button onClick={() => addPort('output', 'any')}>
            Add Output
          </button>
        </div>
      </div>
      
      {ports
        .filter(p => p.type === 'output')
        .map((port, index) => (
          <Handle
            key={port.id}
            id={port.id}
            type="source"
            position={port.position}
            style={{ 
              top: `${30 + index * 25}px`,
              background: getPortColor(port.dataType)
            }}
          >
            <div className="port-label">{port.label}</div>
          </Handle>
        ))}
    </div>
  )
}
```

## 대규모 워크플로우 성능 최적화

### 가상화와 레벨 오브 디테일

수천 개의 노드를 다룰 때는 렌더링 성능이 중요합니다:

```typescript
// hooks/useVirtualization.ts
interface ViewportNode {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: string
  visible: boolean
  lodLevel: 0 | 1 | 2 // Level of Detail
}

function useVirtualization(nodes: Node[], viewport: Viewport) {
  const [visibleNodes, setVisibleNodes] = useState<ViewportNode[]>([])
  const viewportRef = useRef<HTMLDivElement>(null)
  
  // 뷰포트 기반 컬링
  const updateVisibleNodes = useCallback(() => {
    if (!viewportRef.current) return
    
    const viewportBounds = {
      left: -viewport.x / viewport.zoom,
      top: -viewport.y / viewport.zoom,
      right: (-viewport.x + viewportRef.current.clientWidth) / viewport.zoom,
      bottom: (-viewport.y + viewportRef.current.clientHeight) / viewport.zoom,
    }
    
    // 성능을 위한 공간 인덱싱 (QuadTree)
    const spatialIndex = new QuadTree(viewportBounds)
    nodes.forEach(node => spatialIndex.insert(node))
    
    const candidateNodes = spatialIndex.retrieve(viewportBounds)
    
    const newVisibleNodes = candidateNodes.map(node => {
      const bounds = getNodeBounds(node)
      const intersects = intersectsBounds(bounds, viewportBounds)
      
      let lodLevel: 0 | 1 | 2 = 0
      if (viewport.zoom < 0.5) lodLevel = 2
      else if (viewport.zoom < 0.8) lodLevel = 1
      
      return {
        id: node.id,
        x: node.position.x,
        y: node.position.y,
        width: bounds.width,
        height: bounds.height,
        type: node.type || 'default',
        visible: intersects,
        lodLevel,
      }
    })
    
    setVisibleNodes(newVisibleNodes)
  }, [nodes, viewport])
  
  // 디바운스된 업데이트
  const debouncedUpdate = useMemo(
    () => debounce(updateVisibleNodes, 16), // 60fps
    [updateVisibleNodes]
  )
  
  useEffect(() => {
    debouncedUpdate()
  }, [debouncedUpdate])
  
  return { visibleNodes, viewportRef }
}

// LOD 기반 노드 렌더러
const LODNodeRenderer: React.FC<{ 
  node: ViewportNode
  data: any 
}> = memo(({ node, data }) => {
  // LOD 레벨에 따른 렌더링 단순화
  switch (node.lodLevel) {
    case 2: // 원거리 - 단순한 형태만
      return (
        <div 
          className={`node-lod-2 ${node.type}`}
          style={{
            width: node.width,
            height: node.height,
            transform: `translate(${node.x}px, ${node.y}px)`,
          }}
        >
          <div className="node-icon" />
        </div>
      )
    
    case 1: // 중거리 - 기본 정보만
      return (
        <div 
          className={`node-lod-1 ${node.type}`}
          style={{
            width: node.width,
            height: node.height,
            transform: `translate(${node.x}px, ${node.y}px)`,
          }}
        >
          <div className="node-header">{data.label}</div>
          <div className="node-status">{data.status}</div>
        </div>
      )
    
    default: // 근거리 - 전체 상세 정보
      return (
        <FullDetailNode node={node} data={data} />
      )
  }
})
```

### 실시간 협업 시스템

여러 사용자가 동시에 워크플로우를 편집할 수 있는 시스템:

```typescript
// hooks/useCollaboration.ts
interface CollaborationState {
  users: CollaborationUser[]
  selections: Record<string, string[]> // userId -> nodeIds
  cursors: Record<string, { x: number; y: number }>
  locks: Record<string, string> // nodeId -> userId
}

interface CollaborationEvent {
  type: 'node_update' | 'node_create' | 'node_delete' | 'edge_create' | 'edge_delete' | 'selection_change' | 'cursor_move'
  userId: string
  timestamp: number
  data: any
}

function useCollaboration(workflowId: string) {
  const [collabState, setCollabState] = useState<CollaborationState>({
    users: [],
    selections: {},
    cursors: {},
    locks: {},
  })
  
  const ws = useRef<WebSocket | null>(null)
  const conflictResolver = useRef(new ConflictResolver())
  
  useEffect(() => {
    // WebSocket 연결 설정
    ws.current = new WebSocket(`ws://localhost:8080/collaborate/${workflowId}`)
    
    ws.current.onmessage = (event) => {
      const collaborationEvent: CollaborationEvent = JSON.parse(event.data)
      handleCollaborationEvent(collaborationEvent)
    }
    
    ws.current.onopen = () => {
      // 사용자 참여 알림
      sendEvent({
        type: 'user_join',
        userId: getCurrentUserId(),
        timestamp: Date.now(),
        data: { user: getCurrentUser() }
      })
    }
    
    return () => {
      ws.current?.close()
    }
  }, [workflowId])
  
  const handleCollaborationEvent = useCallback((event: CollaborationEvent) => {
    switch (event.type) {
      case 'node_update':
        handleNodeUpdate(event)
        break
      case 'selection_change':
        handleSelectionChange(event)
        break
      case 'cursor_move':
        handleCursorMove(event)
        break
      // 다른 이벤트 타입들...
    }
  }, [])
  
  const handleNodeUpdate = useCallback((event: CollaborationEvent) => {
    const { nodeId, updates } = event.data
    
    // 충돌 감지 및 해결
    const conflict = conflictResolver.current.detectConflict(nodeId, updates)
    if (conflict) {
      const resolution = conflictResolver.current.resolveConflict(conflict)
      applyNodeUpdates(nodeId, resolution.mergedUpdates)
      
      // 충돌 해결 결과를 다른 사용자들에게 알림
      sendEvent({
        type: 'conflict_resolved',
        userId: getCurrentUserId(),
        timestamp: Date.now(),
        data: { nodeId, resolution }
      })
    } else {
      applyNodeUpdates(nodeId, updates)
    }
  }, [])
  
  const sendEvent = useCallback((event: Omit<CollaborationEvent, 'timestamp'>) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        ...event,
        timestamp: Date.now()
      }))
    }
  }, [])
  
  // 실시간 선택 공유
  const updateSelection = useCallback((nodeIds: string[]) => {
    sendEvent({
      type: 'selection_change',
      userId: getCurrentUserId(),
      data: { nodeIds }
    })
  }, [sendEvent])
  
  // 커서 위치 공유
  const updateCursor = useCallback(
    throttle((x: number, y: number) => {
      sendEvent({
        type: 'cursor_move',
        userId: getCurrentUserId(),
        data: { x, y }
      })
    }, 100),
    [sendEvent]
  )
  
  return {
    collabState,
    updateSelection,
    updateCursor,
    sendEvent,
  }
}

// 충돌 해결 시스템
class ConflictResolver {
  private pendingUpdates = new Map<string, PendingUpdate[]>()
  
  detectConflict(nodeId: string, updates: any): Conflict | null {
    const pending = this.pendingUpdates.get(nodeId) || []
    
    for (const pendingUpdate of pending) {
      if (this.hasConflictingFields(updates, pendingUpdate.updates)) {
        return {
          nodeId,
          conflictingUpdates: [updates, pendingUpdate.updates],
          timestamp: Date.now()
        }
      }
    }
    
    return null
  }
  
  resolveConflict(conflict: Conflict): ConflictResolution {
    // 3-way merge 전략 사용
    const baseVersion = this.getBaseVersion(conflict.nodeId)
    const mergedUpdates = this.mergeUpdates(
      baseVersion,
      conflict.conflictingUpdates[0],
      conflict.conflictingUpdates[1]
    )
    
    return {
      nodeId: conflict.nodeId,
      mergedUpdates,
      strategy: 'three_way_merge',
      timestamp: Date.now()
    }
  }
  
  private mergeUpdates(base: any, update1: any, update2: any): any {
    const merged = { ...base }
    
    // 필드별 충돌 해결 로직
    Object.keys(update1).forEach(key => {
      if (update2.hasOwnProperty(key)) {
        // 충돌하는 필드
        if (update1[key] !== update2[key]) {
          // 타임스탬프 기반 우선순위 또는 사용자 정의 해결책
          merged[key] = this.resolveFieldConflict(key, update1[key], update2[key])
        } else {
          merged[key] = update1[key]
        }
      } else {
        merged[key] = update1[key]
      }
    })
    
    Object.keys(update2).forEach(key => {
      if (!update1.hasOwnProperty(key)) {
        merged[key] = update2[key]
      }
    })
    
    return merged
  }
}
```

## 비즈니스 로직 통합 패턴

### 워크플로우 실행 엔진

워크플로우를 실제로 실행할 수 있는 엔진 구현:

```typescript
// engine/WorkflowEngine.ts
interface ExecutionContext {
  workflowId: string
  executionId: string
  variables: Record<string, any>
  state: 'running' | 'paused' | 'completed' | 'failed'
  currentNode?: string
  startTime: number
  endTime?: number
}

class WorkflowEngine {
  private executionContexts = new Map<string, ExecutionContext>()
  private nodeExecutors = new Map<string, NodeExecutor>()
  private eventBus = new EventEmitter()
  
  registerNodeExecutor(nodeType: string, executor: NodeExecutor) {
    this.nodeExecutors.set(nodeType, executor)
  }
  
  async executeWorkflow(
    workflow: Workflow,
    initialVariables: Record<string, any> = {}
  ): Promise<ExecutionResult> {
    const executionId = generateExecutionId()
    const context: ExecutionContext = {
      workflowId: workflow.id,
      executionId,
      variables: { ...initialVariables },
      state: 'running',
      startTime: Date.now(),
    }
    
    this.executionContexts.set(executionId, context)
    
    try {
      // 시작 노드 찾기
      const startNode = workflow.nodes.find(node => node.type === 'start')
      if (!startNode) {
        throw new Error('No start node found in workflow')
      }
      
      // 실행 시작
      await this.executeFromNode(workflow, startNode, context)
      
      context.state = 'completed'
      context.endTime = Date.now()
      
      return {
        success: true,
        executionId,
        duration: context.endTime - context.startTime,
        variables: context.variables,
      }
    } catch (error) {
      context.state = 'failed'
      context.endTime = Date.now()
      
      return {
        success: false,
        executionId,
        error: error.message,
        duration: context.endTime! - context.startTime,
      }
    }
  }
  
  private async executeFromNode(
    workflow: Workflow,
    node: Node,
    context: ExecutionContext
  ): Promise<void> {
    context.currentNode = node.id
    
    // 실행 전 이벤트 발생
    this.eventBus.emit('node:before_execute', { node, context })
    
    const executor = this.nodeExecutors.get(node.type || 'default')
    if (!executor) {
      throw new Error(`No executor found for node type: ${node.type}`)
    }
    
    try {
      // 노드 실행
      const result = await executor.execute(node, context)
      
      // 변수 업데이트
      if (result.variables) {
        Object.assign(context.variables, result.variables)
      }
      
      // 실행 후 이벤트 발생
      this.eventBus.emit('node:after_execute', { node, context, result })
      
      // 다음 노드들 실행
      await this.executeNextNodes(workflow, node, context, result)
      
    } catch (error) {
      this.eventBus.emit('node:error', { node, context, error })
      throw error
    }
  }
  
  private async executeNextNodes(
    workflow: Workflow,
    currentNode: Node,
    context: ExecutionContext,
    result: NodeExecutionResult
  ): Promise<void> {
    // 현재 노드에서 나가는 엣지들 찾기
    const outgoingEdges = workflow.edges.filter(edge => edge.source === currentNode.id)
    
    for (const edge of outgoingEdges) {
      // 조건부 실행 체크
      if (edge.data?.condition && !this.evaluateCondition(edge.data.condition, context)) {
        continue
      }
      
      const nextNode = workflow.nodes.find(node => node.id === edge.target)
      if (!nextNode) {
        continue
      }
      
      // 병렬 실행 또는 순차 실행 결정
      if (edge.data?.parallel) {
        // 병렬 실행 (Promise 분기)
        this.executeFromNode(workflow, nextNode, { ...context }).catch(error => {
          this.eventBus.emit('parallel:error', { node: nextNode, error })
        })
      } else {
        // 순차 실행
        await this.executeFromNode(workflow, nextNode, context)
      }
    }
  }
  
  private evaluateCondition(condition: string, context: ExecutionContext): boolean {
    try {
      // 안전한 조건 평가 (sandboxed evaluation)
      const evaluator = new ConditionEvaluator(context.variables)
      return evaluator.evaluate(condition)
    } catch (error) {
      console.warn('Condition evaluation failed:', error)
      return false
    }
  }
  
  // 실행 일시정지/재개
  pauseExecution(executionId: string): void {
    const context = this.executionContexts.get(executionId)
    if (context && context.state === 'running') {
      context.state = 'paused'
      this.eventBus.emit('execution:paused', { executionId })
    }
  }
  
  resumeExecution(executionId: string): void {
    const context = this.executionContexts.get(executionId)
    if (context && context.state === 'paused') {
      context.state = 'running'
      this.eventBus.emit('execution:resumed', { executionId })
    }
  }
}

// 특정 노드 타입 실행기 예시
class APICallNodeExecutor implements NodeExecutor {
  async execute(node: Node, context: ExecutionContext): Promise<NodeExecutionResult> {
    const { url, method, headers, body } = node.data.config
    
    // 변수 치환
    const resolvedUrl = this.resolveVariables(url, context.variables)
    const resolvedBody = this.resolveVariables(body, context.variables)
    
    try {
      const response = await fetch(resolvedUrl, {
        method,
        headers,
        body: resolvedBody ? JSON.stringify(resolvedBody) : undefined,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const responseData = await response.json()
      
      return {
        success: true,
        variables: {
          [`${node.id}_response`]: responseData,
          [`${node.id}_status`]: response.status,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
  
  private resolveVariables(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return variables[varName] || match
    })
  }
}
```

## 디버깅과 모니터링

### 실시간 실행 트레이싱

```typescript
// debugging/ExecutionTracer.ts
interface ExecutionTrace {
  executionId: string
  nodeId: string
  timestamp: number
  event: 'start' | 'complete' | 'error' | 'pause'
  duration?: number
  input?: any
  output?: any
  error?: string
  memoryUsage?: number
  cpuUsage?: number
}

class ExecutionTracer {
  private traces = new Map<string, ExecutionTrace[]>()
  private listeners = new Set<(trace: ExecutionTrace) => void>()
  
  startTracing(executionId: string): void {
    this.traces.set(executionId, [])
  }
  
  trace(trace: ExecutionTrace): void {
    const executionTraces = this.traces.get(trace.executionId) || []
    executionTraces.push(trace)
    this.traces.set(trace.executionId, executionTraces)
    
    // 리스너들에게 알림
    this.listeners.forEach(listener => listener(trace))
  }
  
  getExecutionTimeline(executionId: string): ExecutionTrace[] {
    return this.traces.get(executionId) || []
  }
  
  subscribe(listener: (trace: ExecutionTrace) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  
  // 성능 분석
  analyzePerformance(executionId: string): PerformanceAnalysis {
    const traces = this.getExecutionTimeline(executionId)
    
    const nodePerformance = new Map<string, {
      count: number
      totalDuration: number
      avgDuration: number
      maxDuration: number
      errors: number
    }>()
    
    traces.forEach(trace => {
      if (!nodePerformance.has(trace.nodeId)) {
        nodePerformance.set(trace.nodeId, {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          maxDuration: 0,
          errors: 0,
        })
      }
      
      const stats = nodePerformance.get(trace.nodeId)!
      stats.count++
      
      if (trace.duration) {
        stats.totalDuration += trace.duration
        stats.maxDuration = Math.max(stats.maxDuration, trace.duration)
        stats.avgDuration = stats.totalDuration / stats.count
      }
      
      if (trace.event === 'error') {
        stats.errors++
      }
    })
    
    return {
      executionId,
      totalDuration: traces[traces.length - 1]?.timestamp - traces[0]?.timestamp,
      nodePerformance: Object.fromEntries(nodePerformance),
      bottlenecks: this.identifyBottlenecks(nodePerformance),
    }
  }
}

// 디버깅 UI 컴포넌트
const ExecutionDebugger: React.FC<{ executionId: string }> = ({ executionId }) => {
  const [traces, setTraces] = useState<ExecutionTrace[]>([])
  const [selectedTrace, setSelectedTrace] = useState<ExecutionTrace | null>(null)
  const tracer = useRef(new ExecutionTracer())
  
  useEffect(() => {
    const unsubscribe = tracer.current.subscribe((trace) => {
      if (trace.executionId === executionId) {
        setTraces(prev => [...prev, trace])
      }
    })
    
    return unsubscribe
  }, [executionId])
  
  return (
    <div className="execution-debugger">
      <div className="traces-timeline">
        {traces.map((trace, index) => (
          <div
            key={index}
            className={`trace-item ${trace.event}`}
            onClick={() => setSelectedTrace(trace)}
          >
            <div className="trace-node">{trace.nodeId}</div>
            <div className="trace-event">{trace.event}</div>
            <div className="trace-time">{trace.duration}ms</div>
          </div>
        ))}
      </div>
      
      {selectedTrace && (
        <div className="trace-details">
          <h3>Trace Details</h3>
          <pre>{JSON.stringify(selectedTrace, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

## 결론: @xyflow/react의 엔터프라이즈 활용

@xyflow/react는 단순한 다이어그램 도구를 넘어 복잡한 비즈니스 워크플로우를 시각화하고 실행할 수 있는 강력한 플랫폼으로 발전했습니다. 

**핵심 강점들:**

1. **확장성**: 대규모 워크플로우 처리를 위한 가상화와 성능 최적화
2. **협업**: 실시간 멀티유저 편집과 충돌 해결
3. **통합성**: 다양한 시스템과의 연동을 위한 확장 가능한 아키텍처
4. **관찰성**: 실행 추적과 디버깅을 위한 완전한 도구 체인

**실제 적용 분야:**

- **데이터 파이프라인**: ETL 프로세스 시각화 및 실행
- **비즈니스 프로세스**: 워크플로우 자동화 및 승인 시스템
- **AI/ML 파이프라인**: 모델 훈련 및 배포 프로세스 관리
- **시스템 아키텍처**: 마이크로서비스 의존성 시각화

@xyflow/react의 진정한 가치는 복잡한 로직을 직관적으로 표현하고, 동시에 실제로 실행 가능한 시스템을 만들 수 있다는 점입니다. 앞으로 더욱 지능적인 자동 레이아웃, AI 기반 워크플로우 최적화, 그리고 클라우드 네이티브 실행 환경과의 통합이 기대됩니다. 
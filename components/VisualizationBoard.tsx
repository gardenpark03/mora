'use client'

import { useCallback, useEffect, useMemo } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  Position,
} from 'reactflow'
import { motion } from 'framer-motion'
import 'reactflow/dist/style.css'
import { VisualizationNode, VisualizationEdge } from '@/lib/types'

interface VisualizationBoardProps {
  nodes: VisualizationNode[]
  edges: VisualizationEdge[]
}

// 커스텀 노드 컴포넌트
function CustomNode({ data }: { data: any }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, type: 'spring' }}
      className="px-4 py-3 rounded-lg border-2 border-indigo-300 bg-white shadow-lg min-w-[180px] max-w-[250px]"
    >
      <div className="flex items-start space-x-2">
        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-indigo-600 mb-1">{data.speaker}</div>
          <div className="text-sm text-gray-800 leading-tight line-clamp-3">{data.label}</div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(data.timestamp).toLocaleTimeString('ko-KR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const nodeTypes = {
  topic: CustomNode,
  decision: CustomNode,
  action: CustomNode,
  question: CustomNode,
}

export default function VisualizationBoard({ nodes, edges }: VisualizationBoardProps) {
  // React Flow용 노드 변환
  const flowNodes: Node[] = useMemo(() => {
    return nodes.map((node, index) => ({
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      style: {
        background: 'transparent',
        border: 'none',
        padding: 0,
      },
    }))
  }, [nodes])

  // React Flow용 엣지 변환
  const flowEdges: Edge[] = useMemo(() => {
    return edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated ?? true,
      style: {
        stroke: '#a78bfa',
        strokeWidth: 2,
      },
      type: 'smoothstep',
    }))
  }, [edges])

  const onNodesChange = useCallback(() => {}, [])
  const onEdgesChange = useCallback(() => {}, [])

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl border border-gray-200 overflow-hidden">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls className="bg-white rounded-lg shadow-lg border border-gray-200" />
        <MiniMap 
          className="bg-white rounded-lg shadow-lg border border-gray-200"
          nodeColor="#4f46e5"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={16} 
          size={1}
          color="#c7d2fe"
        />
      </ReactFlow>
    </div>
  )
}

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar'; // We will create this next

const API_BASE = "/api";

export default function AlfieApp() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  // 1. Initial Load of the Graph
  useEffect(() => {
    const initMap = async () => {
      const res = await fetch(`${API_BASE}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matrix: JSON.parse(localStorage.getItem('alfie_matrix')) || { "2.5": "MASTERED", "5.1": "NEEDS_REVIEW" },
          edges: [{ source: "2.5", target: "5.1", relationship: "prerequisite" }]
        })
      });
      const data = await res.json();
      renderGraph(data.updated_matrix);
    };
    initMap();
  }, []);

  const renderGraph = (matrix) => {
    const newNodes = Object.entries(matrix).map(([id, status], i) => ({
      id,
      data: { label: id, status },
      position: { x: 250, y: i * 150 },
      style: { 
        background: status === 'MASTERED' ? '#4ade80' : status === 'LOCKED' ? '#9ca3af' : '#f87171',
        color: '#fff', borderRadius: '12px', width: 150, textAlign: 'center'
      }
    }));
    setNodes(newNodes);
  };

  // 2. Handle Node Clicks
  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', background: '#121212' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodeClick={onNodeClick}
          onNodesChange={(chs) => setNodes((nds) => applyNodeChanges(chs, nds))}
          fitView
        >
          <Background color="#333" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      {selectedNode && (
        <Sidebar 
          node={selectedNode} 
          onClose={() => setSelectedNode(null)} 
          apiBase={API_BASE}
        />
      )}
    </div>
  );
}
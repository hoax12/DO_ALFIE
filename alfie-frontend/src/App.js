import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  applyEdgeChanges, 
  applyNodeChanges 
} from 'reactflow';
import 'reactflow/dist/style.css';

// Initial dummy data based on our Algebra mind map
const initialNodes = [
  { id: '2.5', data: { label: '2.5 Quadratic Equations' }, position: { x: 250, y: 5 }, style: { background: '#4ade80' } },
  { id: '5.1', data: { label: '5.1 Quadratic Functions' }, position: { x: 250, y: 100 }, style: { background: '#f87171' } },
];

const initialEdges = [
  { id: 'e2.5-5.1', source: '2.5', target: '5.1', label: 'prerequisite', animated: true },
];

export default function AlfieMap() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Function to call your DigitalOcean FastAPI backend
  const checkUnlock = async () => {
    const response = await fetch('https://alfie-app-lgi6t.ondigitalocean.app//unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matrix: { "2.5": "MASTERED", "5.1": "LOCKED" },
        edges: [{ source: "2.5", target: "5.1", relationship: "prerequisite" }]
      }),
    });
    const data = await response.json();
    console.log("Updated Mastery:", data.updated_matrix);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      <button 
        onClick={checkUnlock}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 4 }}
      >
        Refresh Mastery
      </button>
    </div>
  );
}
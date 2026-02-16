import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

// This connects to YOUR live backend
const API_BASE = "/api"; 

export default function AlfieApp() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Fetch initial state from the backend
  useEffect(() => {
    const fetchMap = async () => {
      // In a real session, you'd pass the actual student state here
      const response = await fetch(`${API_BASE}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matrix: { "2.5": "MASTERED", "5.1": "LOCKED" }, 
          edges: [{ source: "2.5", target: "5.1", relationship: "prerequisite" }]
        })
      });
      const data = await response.json();
      
      // Map the backend mastery to React Flow Nodes
      const newNodes = Object.entries(data.updated_matrix).map(([id, status], index) => ({
        id,
        data: { label: `${id} - ${status}` },
        position: { x: 100, y: index * 100 },
        style: { 
          background: status === 'MASTERED' ? '#4ade80' : status === 'LOCKED' ? '#9ca3af' : '#f87171',
          color: '#fff',
          borderRadius: '8px',
          padding: '10px'
        }
      }));
      setNodes(newNodes);
    };
    fetchMap();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <h2 style={{ color: 'white', padding: '20px', position: 'absolute', zIndex: 10 }}>ALFIE: Algebra Knowledge Graph</h2>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background color="#333" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
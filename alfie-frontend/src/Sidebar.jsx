import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';

export default function Sidebar({ node, onClose, apiBase }) {
  const [explanation, setExplanation] = useState("Loading lesson from PDFs...");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Fetch Explanation on Open
  useEffect(() => {
    const fetchStudy = async () => {
      const res = await fetch(`${apiBase}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: "Quadratic Concepts", node_id: node.id })
      });
      const data = await res.json();
      setExplanation(data.explanation);
    };
    if (node.data.status !== 'LOCKED') fetchStudy();
    else setExplanation("🔒 This lesson is locked. Complete prerequisites first!");
  }, [node]);

  const handleChat = async () => {
    const userMsg = { role: 'user', text: chatInput };
    setChatHistory([...chatHistory, userMsg]);
    setChatInput("");

    const res = await fetch(`${apiBase}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: chatInput })
    });
    const data = await res.json();
    setChatHistory(prev => [...prev, { role: 'alfie', text: data.answer }]);
  };

  return (
    <div style={{ width: '400px', background: '#1e1e1e', color: 'white', padding: '20px', borderLeft: '1px solid #333', overflowY: 'auto' }}>
      <button onClick={onClose} style={{ float: 'right' }}>✖</button>
      <h3>Lesson {node.id}</h3>
      <hr />
      
      <h4>📖 Study Material</h4>
      <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{explanation}</p>

      {/* quiz component inserted below */}
      <div style={{ marginTop: '30px' }}>
        <Quiz 
          node={node} 
          apiBase={apiBase} 
          onPass={() => {
            // This is where the magic happens!
            alert("Mastery achieved! Updating graph...");
            // 1. Call your /api/unlock endpoint
            // 2. Refresh the graph in the main App.jsx
          }} 
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <h4>💬 Ask Alfie</h4>
        <div style={{ height: '200px', border: '1px solid #444', padding: '10px', overflowY: 'scroll', marginBottom: '10px' }}>
          {chatHistory.map((m, i) => (
            <p key={i} style={{ color: m.role === 'user' ? '#4ade80' : '#60a5fa' }}>
              <strong>{m.role === 'user' ? 'You: ' : 'Alfie: '}</strong>{m.text}
            </p>
          ))}
        </div>
        <input 
          value={chatInput} 
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask a question..."
          style={{ width: '80%', padding: '8px' }}
        />
        <button onClick={handleChat}>Send</button>
      </div>
    </div>
  );
}
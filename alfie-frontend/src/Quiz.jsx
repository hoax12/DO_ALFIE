import React, { useState } from 'react';

export default function Quiz({ node, apiBase, onPass }) {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);

  const generateQuiz = async () => {
    setLoading(true);
    const res = await fetch(`${apiBase}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: `Generate a 3-question math quiz for ${node.id}. 
               Format as JSON: [{"q": "text", "options": ["a", "b", "c"], "correct": 0}]` 
      })
    });
    const data = await res.json();
    // Note: In production, ensure the LLM returns valid JSON
    try {
      setQuizData(JSON.parse(data.answer));
    } catch (e) {
      alert("Alfie is still thinking... try generating again!");
    }
    setLoading(false);
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quizData.forEach((q, i) => {
      if (userAnswers[i] === q.correct) correctCount++;
    });
    const finalScore = (correctCount / quizData.length) * 100;
    setScore(finalScore);
    if (finalScore >= 80) onPass();
  };

  return (
    <div style={{ marginTop: '20px', border: '1px solid #4ade80', padding: '15px', borderRadius: '8px' }}>
      {!quizData ? (
        <button onClick={generateQuiz} disabled={loading}>
          {loading ? "Generating Quiz..." : "🚀 Start Lesson Quiz"}
        </button>
      ) : (
        <div>
          {quizData.map((q, i) => (
            <div key={i} style={{ marginBottom: '15px' }}>
              <p><strong>Q{i+1}:</strong> {q.q}</p>
              {q.options.map((opt, idx) => (
                <label key={idx} style={{ display: 'block', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name={`q${i}`} 
                    onChange={() => setUserAnswers({...userAnswers, [i]: idx})} 
                  /> {opt}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz}>Submit Answers</button>
          {score !== null && (
            <p style={{ color: score >= 80 ? '#4ade80' : '#f87171' }}>
              Score: {score}% {score >= 80 ? "- Mastery Unlocked!" : "- Needs Review"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
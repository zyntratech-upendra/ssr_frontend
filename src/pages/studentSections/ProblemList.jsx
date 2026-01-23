import React from 'react';

function ProblemList({ problems, platform }) {
  const getDifficultyColor = (difficulty) => {
    const lower = difficulty?.toLowerCase() || '';
    if (lower.includes('easy') || lower.includes('school')) return '#27ae60';
    if (lower.includes('medium')) return '#f39c12';
    if (lower.includes('hard')) return '#e74c3c';
    return '#7f8c8d';
  };

  const openProblem = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={columnStyle}>Problem</div>
        <div style={columnStyle}>Difficulty</div>
        {platform === 'leetcode' && <div style={columnStyle}>AC Rate</div>}
        {platform === 'codechef' && <div style={columnStyle}>Success Rate</div>}
        {platform === 'hackerrank' && <div style={columnStyle}>Category</div>}
      </div>

      <div style={listStyle}>
        {problems.map((problem, index) => (
          <div
            key={index}
            style={rowStyle}
            onClick={() => openProblem(problem.url)}
          >
            <div style={problemTitleStyle}>
              <h3 style={titleStyle}>{problem.title}</h3>
              {platform === 'leetcode' && problem.tags && (
                <div style={tagsStyle}>
                  {problem.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} style={tagStyle}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div style={difficultyStyle}>
              <span style={{
                ...badgeStyle,
                backgroundColor: getDifficultyColor(problem.difficulty)
              }}>
                {problem.difficulty}
              </span>
            </div>
            {platform === 'leetcode' && (
              <div style={statsStyle}>
                {problem.acRate ? `${problem.acRate.toFixed(1)}%` : 'N/A'}
              </div>
            )}
            {platform === 'codechef' && (
              <div style={statsStyle}>
                {problem.successRate || 'N/A'}
              </div>
            )}
            {platform === 'hackerrank' && (
              <div style={statsStyle}>
                {problem.category}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'hidden'
};

const headerStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr',
  gap: '1rem',
  padding: '1rem 1.5rem',
  backgroundColor: '#34495e',
  color: 'white',
  fontWeight: '600',
  fontSize: '0.95rem'
};

const columnStyle = {
  textAlign: 'left'
};

const listStyle = {
  maxHeight: '70vh',
  overflowY: 'auto'
};

const rowStyle = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr',
  gap: '1rem',
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid #ecf0f1',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  alignItems: 'center'
};

const problemTitleStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const titleStyle = {
  fontSize: '1rem',
  fontWeight: '500',
  color: '#2c3e50',
  margin: 0
};

const tagsStyle = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap'
};

const tagStyle = {
  fontSize: '0.75rem',
  padding: '0.25rem 0.5rem',
  backgroundColor: '#ecf0f1',
  color: '#7f8c8d',
  borderRadius: '4px'
};

const difficultyStyle = {
  textAlign: 'left'
};

const badgeStyle = {
  display: 'inline-block',
  padding: '0.375rem 0.75rem',
  borderRadius: '4px',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: '500'
};

const statsStyle = {
  fontSize: '0.95rem',
  color: '#7f8c8d',
  textAlign: 'left'
};

export default ProblemList;

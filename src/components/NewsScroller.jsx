import React from 'react';

const NewsScroller = () => {
  const styles = {
    scrollerContainer: {
      backgroundColor: '#7A54B1',
      padding: '12px 0',
      overflow: 'hidden',
      position: 'relative',
    },
    scrollerLabel: {
      backgroundColor: '#5a3a8f',
      color: '#ffffff',
      padding: '12px 25px',
      fontSize: '14px',
      fontWeight: '600',
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      zIndex: 10,
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    },
    scrollerContent: {
      display: 'flex',
      gap: '60px',
      paddingLeft: '150px',
      animation: 'scroll 25s linear infinite',
      whiteSpace: 'nowrap',
    },
    newsItem: {
      color: '#ffffff',
      fontSize: '14px',
      display: 'inline-block',
    },
    newsLink: {
      color: '#ffffff',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
    },
    newBadge: {
      backgroundColor: '#ff4444',
      color: '#ffffff',
      padding: '2px 8px',
      borderRadius: '3px',
      fontSize: '10px',
      fontWeight: '700',
      marginLeft: '8px',
      animation: 'pulse 2s ease-in-out infinite',
    },
  };

  const newsItems = [
    'NAAC A++ Accredited Institution with CGPA 3.51',
    'Admissions Open for Academic Year 2025-26 - Apply Now!',
    'Placement Drive 2025: 500+ Students Placed in Top Companies',
    'Research Excellence: 100+ Publications in SCI/Scopus Journals',
    'International Collaboration with Universities from USA, UK, Australia',
    'New State-of-the-Art Research Labs Inaugurated',
    'Student Innovation Team Wins National Level Hackathon',
  ];

  const keyframesStyle = `
    @keyframes scroll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }
  `;

  return (
    <>
      <style>{keyframesStyle}</style>
      <div style={styles.scrollerContainer}>
        <div style={styles.scrollerLabel}>
          📢 LATEST NEWS
        </div>
        <div style={styles.scrollerContent}>
          {[...newsItems, ...newsItems].map((news, index) => (
            <div key={index} style={styles.newsItem}>
              <a href="#" style={styles.newsLink}>
                {news}
                {index % 3 === 0 && <span style={styles.newBadge}>NEW</span>}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewsScroller;

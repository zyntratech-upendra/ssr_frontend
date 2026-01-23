import React, { useState } from 'react';
import SubjectManagement from '../pages/SubjectManagement';
import SemesterManagement from '../pages/SemesterManagement';
import TeacherAllocation from '../pages/TeacherAllocation';
import TimetablePreparation from '../pages/TimetablePreparation';
import TakeAttendance from '../pages/TakeAttendance';
import AttendanceReport from '../pages/AttendanceReport';
import Attendance from '../../../server/models/Attendance.js';
import SectionManagement from '../pages/SectionManagement.jsx';


function AttendanceSidebar() {
  const [activeTab, setActiveTab] = useState('subjects');
  const [currentTeacherId, setCurrentTeacherId] = useState('68e53e8cccbc2832a367206f');

  const renderContent = () => {
    switch (activeTab) {
      case 'subjects':
        return <SubjectManagement />;
      case 'semesters':
        return <SemesterManagement />;
      case 'allocation':
        return <TeacherAllocation />;
      case 'timetable':
        return <TimetablePreparation />;
      case 'attendance':
        return <TakeAttendance teacherId={'6908f2dfc4983efc102b9b11'} />;
      case 'report':
        return <AttendanceReport />;
      case 'section':
        return <SectionManagement />;
      default:
        return <SubjectManagement />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#007bff',
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
            College Attendance System
          </h1>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('subjects')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === 'subjects' ? 'white' : 'transparent',
                color: activeTab === 'subjects' ? '#007bff' : 'white',
                border: activeTab === 'subjects' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'subjects' ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              Subjects
            </button>
            <button
              onClick={() => setActiveTab('semesters')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === 'semesters' ? 'white' : 'transparent',
                color: activeTab === 'semesters' ? '#007bff' : 'white',
                border: activeTab === 'semesters' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'semesters' ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              Semesters
            </button>
            <button
              onClick={() => setActiveTab('allocation')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === 'allocation' ? 'white' : 'transparent',
                color: activeTab === 'allocation' ? '#007bff' : 'white',
                border: activeTab === 'allocation' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'allocation' ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              Allocation
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === 'timetable' ? 'white' : 'transparent',
                color: activeTab === 'timetable' ? '#007bff' : 'white',
                border: activeTab === 'timetable' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'timetable' ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              Timetable
            </button>
             <button
              onClick={() => setActiveTab('section')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === 'section' ? 'white' : 'transparent',
                color: activeTab === 'section' ? '#007bff' : 'white',
                border: activeTab === 'section' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab ==='section' ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              Section
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === 'attendance' ? 'white' : 'transparent',
                color: activeTab === 'attendance' ? '#007bff' : 'white',
                border: activeTab === 'attendance' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'attendance' ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              Attendance
            </button>
            <button
              onClick={() => setActiveTab('report')}
              style={{
                padding: '8px 16px',
                backgroundColor: activeTab === 'report' ? 'white' : 'transparent',
                color: activeTab === 'report' ? '#007bff' : 'white',
                border: activeTab === 'report' ? 'none' : '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === 'report' ? 'bold' : 'normal',
                fontSize: '14px'
              }}
            >
              Reports
            </button>
          </div>
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default AttendanceSidebar;

import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import ResumeUpload from './interview/ResumeUpload'
import ChatInterface from './interview/ChatInterface'
import InterviewProgress from './interview/InterviewProgress'
import InterviewComplete from './interview/InterviewComplete'

const IntervieweeTab = () => {
  const { phase, currentCandidate } = useSelector(state => state.interview)

  const renderPhase = () => {
    switch (phase) {
      case 'upload':
        return <ResumeUpload />
      case 'details':
      case 'interview':
        return (
          <div className="interview-container">
            <InterviewProgress />
            <ChatInterface />
          </div>
        )
      case 'completed':
        return <InterviewComplete />
      default:
        return <ResumeUpload />
    }
  }

  return (
    <motion.div
      className="interviewee-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tab-header">
        <div className="header-content">
          <h2>Interview Experience</h2>
          <p>Complete your AI-powered interview for the Full-Stack Developer position</p>
        </div>
        {currentCandidate && (
          <div className="candidate-info">
            <div className="avatar">
              {currentCandidate.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div className="info">
              <span className="name">{currentCandidate.name || 'Candidate'}</span>
              <span className="email">{currentCandidate.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className="tab-content">
        {renderPhase()}
      </div>

      <style jsx>{`
        .interviewee-tab {
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .tab-header {
          padding: 32px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .header-content p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .info {
          display: flex;
          flex-direction: column;
        }

        .name {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .email {
          font-size: 13px;
          color: #6b7280;
        }

        .tab-content {
          padding: 32px;
        }

        .interview-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (max-width: 768px) {
          .tab-header {
            padding: 24px;
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          
          .header-content h2 {
            font-size: 20px;
          }
          
          .header-content p {
            font-size: 14px;
          }
          
          .tab-content {
            padding: 24px;
          }
          
          .candidate-info {
            align-self: stretch;
          }
        }

        @media (max-width: 480px) {
          .tab-header {
            padding: 20px;
          }
          
          .tab-content {
            padding: 20px;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default IntervieweeTab

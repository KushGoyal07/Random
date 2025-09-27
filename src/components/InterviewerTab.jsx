import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import CandidateList from './dashboard/CandidateList'
import CandidateDetail from './dashboard/CandidateDetail'

const InterviewerTab = () => {
  const { selectedCandidate } = useSelector(state => state.ui)
  const { candidates } = useSelector(state => state.candidates)

  return (
    <motion.div
      className="interviewer-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="tab-header">
        <div className="header-content">
          <h2>Interview Dashboard</h2>
          <p>Manage and review candidate interviews</p>
        </div>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{candidates.length}</span>
            <span className="stat-label">Total Candidates</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {candidates.filter(c => c.score >= 70).length}
            </span>
            <span className="stat-label">High Performers</span>
          </div>
        </div>
      </div>

      <div className="tab-content">
        {selectedCandidate ? (
          <CandidateDetail candidate={selectedCandidate} />
        ) : (
          <CandidateList />
        )}
      </div>

      <style jsx>{`
        .interviewer-tab {
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

        .stats {
          display: flex;
          gap: 24px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          min-width: 100px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #3b82f6;
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
          margin-top: 4px;
        }

        .tab-content {
          padding: 32px;
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
          
          .stats {
            gap: 16px;
            align-self: stretch;
          }
          
          .stat-item {
            flex: 1;
            padding: 12px 16px;
          }
          
          .stat-value {
            font-size: 20px;
          }
          
          .tab-content {
            padding: 24px;
          }
        }

        @media (max-width: 480px) {
          .tab-header {
            padding: 20px;
          }
          
          .tab-content {
            padding: 20px;
          }
          
          .stats {
            gap: 12px;
          }
          
          .stat-item {
            padding: 10px 12px;
          }
          
          .stat-value {
            font-size: 18px;
          }
          
          .stat-label {
            font-size: 12px;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default InterviewerTab

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { resetInterview } from '../store/slices/interviewSlice'
import { setShowWelcomeModal } from '../store/slices/uiSlice'

const WelcomeBackModal = () => {
  const dispatch = useDispatch()
  const { currentCandidate, phase, currentQuestionIndex, questions } = useSelector(state => state.interview)

  const handleResume = () => {
    dispatch(setShowWelcomeModal(false))
  }

  const handleStartNew = () => {
    dispatch(resetInterview())
    dispatch(setShowWelcomeModal(false))
  }

  const getProgressText = () => {
    if (phase === 'details') return 'Collecting missing details'
    if (phase === 'interview') return `Question ${currentQuestionIndex + 1} of ${questions.length}`
    return 'Interview in progress'
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="modal-header">
          <div className="welcome-icon">
            <ArrowRight size={24} />
          </div>
          <h3>Welcome Back!</h3>
          <p>You have an unfinished interview session</p>
        </div>

        <div className="candidate-info">
          <div className="avatar">
            {currentCandidate?.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div className="info">
            <span className="name">{currentCandidate?.name || 'Candidate'}</span>
            <span className="email">{currentCandidate?.email}</span>
            <span className="progress">{getProgressText()}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={handleStartNew}>
            <RotateCcw size={16} />
            Start New Interview
          </button>
          <button className="btn-primary" onClick={handleResume}>
            <ArrowRight size={16} />
            Resume Interview
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 32px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .welcome-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 16px;
        }

        .modal-header h3 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .modal-header p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .name {
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .email {
          font-size: 14px;
          color: #6b7280;
        }

        .progress {
          font-size: 13px;
          color: #3b82f6;
          font-weight: 500;
          margin-top: 4px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .btn-secondary,
        .btn-primary {
          flex: 1;
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 24px;
            margin: 20px;
          }
          
          .modal-header h3 {
            font-size: 20px;
          }
          
          .welcome-icon {
            width: 56px;
            height: 56px;
          }
          
          .candidate-info {
            padding: 16px;
          }
          
          .avatar {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default WelcomeBackModal

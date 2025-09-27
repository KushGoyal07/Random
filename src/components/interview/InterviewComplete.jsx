import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Trophy, Star, CheckCircle, BarChart3, MessageSquare } from 'lucide-react'
import { addCandidate } from '../../store/slices/candidatesSlice'
import { setActiveTab } from '../../store/slices/uiSlice'
import { v4 as uuidv4 } from 'uuid'

const InterviewComplete = () => {
  const dispatch = useDispatch()
  const { 
    currentCandidate, 
    score, 
    summary, 
    answers, 
    questions, 
    chatHistory 
  } = useSelector(state => state.interview)

  useEffect(() => {
    // Add candidate to the dashboard
    if (currentCandidate && score !== null) {
      const candidateData = {
        id: uuidv4(),
        ...currentCandidate,
        score,
        summary,
        answers,
        questions,
        chatHistory,
        completedAt: new Date().toISOString(),
        status: 'completed'
      }
      dispatch(addCandidate(candidateData))
    }
  }, [currentCandidate, score, summary, answers, questions, chatHistory, dispatch])

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  const handleViewDashboard = () => {
    dispatch(setActiveTab('interviewer'))
  }

  return (
    <motion.div
      className="interview-complete"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="completion-header">
        <motion.div
          className="trophy-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
        >
          <Trophy size={48} />
        </motion.div>
        <h2>Interview Completed!</h2>
        <p>Thank you for participating in our AI-powered interview process</p>
      </div>

      <div className="results-container">
        <motion.div
          className="score-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="score-header">
            <Star size={24} />
            <h3>Your Score</h3>
          </div>
          <div className="score-display">
            <div 
              className="score-circle"
              style={{ 
                background: `conic-gradient(${getScoreColor(score)} ${score * 3.6}deg, #f1f5f9 0deg)` 
              }}
            >
              <div className="score-inner">
                <span className="score-value">{score}</span>
                <span className="score-max">/100</span>
              </div>
            </div>
            <div className="score-info">
              <span 
                className="score-label"
                style={{ color: getScoreColor(score) }}
              >
                {getScoreLabel(score)}
              </span>
              <span className="score-description">Overall Performance</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="summary-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="summary-header">
            <MessageSquare size={24} />
            <h3>AI Summary</h3>
          </div>
          <div className="summary-content">
            <p>{summary}</p>
          </div>
        </motion.div>
      </div>

      <div className="stats-grid">
        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{answers.length}</span>
            <span className="stat-label">Questions Answered</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="stat-icon">
            <BarChart3 size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {Math.round(answers.reduce((acc, answer, index) => {
                const msg = chatHistory.find(m => m.type === 'ai' && m.score)
                return acc + (msg?.score || 0)
              }, 0) / answers.length) || 0}
            </span>
            <span className="stat-label">Avg Question Score</span>
          </div>
        </motion.div>

        <motion.div
          className="stat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="stat-icon">
            <Trophy size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {answers.filter((_, index) => {
                const question = questions[index]
                return question?.difficulty === 'hard'
              }).length}
            </span>
            <span className="stat-label">Hard Questions</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="action-buttons"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button className="btn-primary" onClick={handleViewDashboard}>
          <BarChart3 size={16} />
          View Dashboard
        </button>
        <button 
          className="btn-secondary"
          onClick={() => window.location.reload()}
        >
          Start New Interview
        </button>
      </motion.div>

      <style jsx>{`
        .interview-complete {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .completion-header {
          margin-bottom: 40px;
        }

        .trophy-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 24px;
          box-shadow: 0 10px 25px rgba(251, 191, 36, 0.3);
        }

        .completion-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .completion-header p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .results-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }

        .score-card,
        .summary-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .score-header,
        .summary-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          color: #3b82f6;
        }

        .score-header h3,
        .summary-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .score-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .score-inner {
          width: 90px;
          height: 90px;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .score-value {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .score-max {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .score-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .score-label {
          font-size: 16px;
          font-weight: 600;
        }

        .score-description {
          font-size: 14px;
          color: #6b7280;
        }

        .summary-content {
          text-align: left;
        }

        .summary-content p {
          font-size: 15px;
          line-height: 1.6;
          color: #374151;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .completion-header h2 {
            font-size: 28px;
          }
          
          .trophy-icon {
            width: 70px;
            height: 70px;
          }
          
          .results-container {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .score-card,
          .summary-card {
            padding: 20px;
          }
          
          .score-circle {
            width: 100px;
            height: 100px;
          }
          
          .score-inner {
            width: 75px;
            height: 75px;
          }
          
          .score-value {
            font-size: 24px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default InterviewComplete

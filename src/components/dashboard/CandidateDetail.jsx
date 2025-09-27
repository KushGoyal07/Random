import React from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, MessageSquare, CheckCircle, User, Mail, Phone } from 'lucide-react'
import { setSelectedCandidate } from '../../store/slices/uiSlice'

const CandidateDetail = ({ candidate }) => {
  const dispatch = useDispatch()

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10b981'
      case 'medium': return '#f59e0b'
      case 'hard': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <motion.div
      className="candidate-detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header">
        <button 
          className="back-button"
          onClick={() => dispatch(setSelectedCandidate(null))}
        >
          <ArrowLeft size={20} />
          Back to List
        </button>
        
        <div className="candidate-header">
          <div className="candidate-avatar">
            {candidate.name?.charAt(0)?.toUpperCase() || 'C'}
          </div>
          <div className="candidate-info">
            <h2>{candidate.name || 'Unknown Candidate'}</h2>
            <p>Interview completed on {new Date(candidate.completedAt).toLocaleDateString()}</p>
          </div>
          <div className="score-summary">
            <div 
              className="score-circle"
              style={{ 
                background: `conic-gradient(${getScoreColor(candidate.score)} ${candidate.score * 3.6}deg, #f1f5f9 0deg)` 
              }}
            >
              <div className="score-inner">
                <span className="score-value">{candidate.score}</span>
                <span className="score-max">/100</span>
              </div>
            </div>
            <span 
              className="score-label"
              style={{ color: getScoreColor(candidate.score) }}
            >
              {getScoreLabel(candidate.score)}
            </span>
          </div>
        </div>
      </div>

      <div className="detail-content">
        <div className="content-grid">
          <div className="main-content">
            <div className="section">
              <div className="section-header">
                <MessageSquare size={20} />
                <h3>AI Summary</h3>
              </div>
              <div className="summary-content">
                <p>{candidate.summary}</p>
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <CheckCircle size={20} />
                <h3>Question Performance</h3>
              </div>
              <div className="questions-list">
                {candidate.questions?.map((question, index) => {
                  const answer = candidate.answers?.[index]
                  const chatMessage = candidate.chatHistory?.find(
                    msg => msg.type === 'ai' && msg.score && msg.content.includes('feedback')
                  )
                  
                  return (
                    <div key={question.id} className="question-item">
                      <div className="question-header">
                        <div className="question-number">Q{index + 1}</div>
                        <div 
                          className="difficulty-badge"
                          style={{ 
                            background: `${getDifficultyColor(question.difficulty)}15`,
                            color: getDifficultyColor(question.difficulty)
                          }}
                        >
                          {question.difficulty}
                        </div>
                        {chatMessage?.score && (
                          <div className="question-score">
                            <Star size={14} />
                            {chatMessage.score}/10
                          </div>
                        )}
                      </div>
                      <div className="question-content">
                        <div className="question-text">
                          <strong>Question:</strong> {question.question}
                        </div>
                        <div className="answer-text">
                          <strong>Answer:</strong> {answer?.answer || 'No answer provided'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <MessageSquare size={20} />
                <h3>Complete Chat History</h3>
              </div>
              <div className="chat-history">
                {candidate.chatHistory?.map((message) => (
                  <div key={message.id} className={`chat-message ${message.type}`}>
                    <div className="message-content">
                      <p>{message.content}</p>
                      {message.score && (
                        <div className="message-score">Score: {message.score}/10</div>
                      )}
                    </div>
                    <div className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar">
            <div className="section">
              <div className="section-header">
                <User size={20} />
                <h3>Contact Information</h3>
              </div>
              <div className="contact-details">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{candidate.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <span>{candidate.phone}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                <Clock size={20} />
                <h3>Interview Stats</h3>
              </div>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Questions Answered</span>
                  <span className="stat-value">{candidate.answers?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Score</span>
                  <span className="stat-value">
                    {Math.round(
                      candidate.chatHistory
                        ?.filter(msg => msg.score)
                        ?.reduce((acc, msg) => acc + msg.score, 0) / 
                      candidate.chatHistory?.filter(msg => msg.score)?.length || 0
                    ) || 0}/10
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Hard Questions</span>
                  <span className="stat-value">
                    {candidate.questions?.filter(q => q.difficulty === 'hard').length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .candidate-detail {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .detail-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          margin-bottom: 20px;
          transition: color 0.2s ease;
        }

        .back-button:hover {
          color: #374151;
        }

        .candidate-header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .candidate-avatar {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 24px;
        }

        .candidate-info {
          flex: 1;
        }

        .candidate-info h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .candidate-info p {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
        }

        .score-summary {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .score-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .score-inner {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .score-value {
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .score-max {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .score-label {
          font-size: 14px;
          font-weight: 600;
        }

        .detail-content {
          padding: 32px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        .section {
          margin-bottom: 32px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: #3b82f6;
        }

        .section-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .summary-content p {
          font-size: 15px;
          line-height: 1.6;
          color: #374151;
          margin: 0;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .question-item {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
        }

        .question-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .question-number {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .difficulty-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .question-score {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-left: auto;
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
        }

        .question-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .question-text,
        .answer-text {
          font-size: 14px;
          line-height: 1.5;
          color: #374151;
        }

        .question-text strong,
        .answer-text strong {
          color: #1f2937;
        }

        .chat-history {
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chat-message {
          padding: 12px 16px;
          border-radius: 12px;
          max-width: 80%;
        }

        .chat-message.ai {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          align-self: flex-start;
        }

        .chat-message.user {
          background: #dbeafe;
          border: 1px solid #bfdbfe;
          align-self: flex-end;
        }

        .chat-message.system {
          background: #fef3c7;
          border: 1px solid #fde68a;
          align-self: center;
        }

        .message-content p {
          font-size: 14px;
          line-height: 1.4;
          color: #374151;
          margin: 0;
        }

        .message-score {
          margin-top: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #3b82f6;
        }

        .message-time {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #374151;
        }

        .contact-item svg {
          color: #6b7280;
        }

        .stats-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .detail-header {
            padding: 20px;
          }
          
          .candidate-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .candidate-info h2 {
            font-size: 24px;
          }
          
          .detail-content {
            padding: 24px;
          }
          
          .content-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .question-item {
            padding: 16px;
          }
          
          .question-header {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default CandidateDetail

import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, Clock } from 'lucide-react'

const InterviewProgress = () => {
  const { questions, currentQuestionIndex, phase, answers } = useSelector(state => state.interview)

  if (phase !== 'interview' || questions.length === 0) return null

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <motion.div
      className="interview-progress"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="progress-header">
        <div className="progress-info">
          <h4>Interview Progress</h4>
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="progress-stats">
          <div className="stat">
            <CheckCircle size={16} />
            <span>{answers.length} Completed</span>
          </div>
          <div className="stat">
            <Clock size={16} />
            <span>{questions.length - answers.length} Remaining</span>
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>

      <div className="questions-overview">
        {questions.map((question, index) => {
          const isCompleted = index < currentQuestionIndex || (index === currentQuestionIndex && answers.length > index)
          const isCurrent = index === currentQuestionIndex
          
          return (
            <div
              key={question.id}
              className={`question-indicator ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <div className="indicator-icon">
                {isCompleted ? (
                  <CheckCircle size={16} />
                ) : (
                  <Circle size={16} />
                )}
              </div>
              <div className="indicator-info">
                <span className="question-number">Q{index + 1}</span>
                <span className={`difficulty ${question.difficulty}`}>
                  {question.difficulty}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .interview-progress {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .progress-info h4 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .progress-info p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .progress-stats {
          display: flex;
          gap: 16px;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .stat svg {
          color: #3b82f6;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #f1f5f9;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 4px;
        }

        .progress-percentage {
          font-size: 14px;
          font-weight: 600;
          color: #3b82f6;
          min-width: 40px;
          text-align: right;
        }

        .questions-overview {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .question-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .question-indicator.completed {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .question-indicator.current {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .indicator-icon {
          color: #9ca3af;
        }

        .question-indicator.completed .indicator-icon {
          color: #10b981;
        }

        .question-indicator.current .indicator-icon {
          color: #3b82f6;
        }

        .indicator-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .question-number {
          font-size: 12px;
          font-weight: 600;
          color: #1f2937;
        }

        .difficulty {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          padding: 2px 4px;
          border-radius: 4px;
        }

        .difficulty.easy {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .difficulty.medium {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .difficulty.hard {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        @media (max-width: 768px) {
          .interview-progress {
            padding: 20px;
          }
          
          .progress-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          
          .progress-info h4 {
            font-size: 16px;
          }
          
          .progress-stats {
            gap: 12px;
          }
          
          .questions-overview {
            gap: 6px;
          }
          
          .question-indicator {
            padding: 6px 10px;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default InterviewProgress

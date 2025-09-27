import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertTriangle } from 'lucide-react'

const QuestionTimer = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setTimeLeft(duration)
    setIsWarning(false)
  }, [duration])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        
        if (prev <= 10 && !isWarning) {
          setIsWarning(true)
        }
        
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, onTimeUp, isWarning])

  const progress = (timeLeft / duration) * 100
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const getTimerColor = () => {
    if (timeLeft <= 10) return '#ef4444'
    if (timeLeft <= 30) return '#f59e0b'
    return '#3b82f6'
  }

  return (
    <motion.div
      className={`question-timer ${isWarning ? 'warning' : ''}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="timer-content">
        <div className="timer-icon">
          {isWarning ? <AlertTriangle size={20} /> : <Clock size={20} />}
        </div>
        
        <div className="timer-info">
          <div className="time-display">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="timer-label">Time Remaining</div>
        </div>
        
        <div className="progress-container">
          <svg className="progress-ring" width="60" height="60">
            <circle
              className="progress-ring-background"
              cx="30"
              cy="30"
              r="25"
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <motion.circle
              className="progress-ring-progress"
              cx="30"
              cy="30"
              r="25"
              fill="transparent"
              stroke={getTimerColor()}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 25}`}
              strokeDashoffset={`${2 * Math.PI * 25 * (1 - progress / 100)}`}
              initial={{ strokeDashoffset: 0 }}
              animate={{ 
                strokeDashoffset: `${2 * Math.PI * 25 * (1 - progress / 100)}`,
                stroke: getTimerColor()
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="progress-text" style={{ color: getTimerColor() }}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      <style jsx>{`
        .question-timer {
          background: white;
          border-radius: 12px;
          padding: 16px 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .question-timer.warning {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
          animation: pulse 1s infinite;
        }

        .timer-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .timer-icon {
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .question-timer.warning .timer-icon {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .timer-info {
          flex: 1;
        }

        .time-display {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
          margin-bottom: 4px;
        }

        .question-timer.warning .time-display {
          color: #ef4444;
        }

        .timer-label {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .progress-container {
          position: relative;
          width: 60px;
          height: 60px;
        }

        .progress-ring {
          transform: rotate(-90deg);
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 600;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          50% {
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          }
        }

        @media (max-width: 768px) {
          .question-timer {
            padding: 12px 16px;
          }
          
          .timer-content {
            gap: 12px;
          }
          
          .timer-icon {
            width: 36px;
            height: 36px;
          }
          
          .time-display {
            font-size: 20px;
          }
          
          .progress-container {
            width: 50px;
            height: 50px;
          }
          
          .progress-ring {
            width: 50px;
            height: 50px;
          }
          
          .progress-ring circle {
            r: 20;
            cx: 25;
            cy: 25;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default QuestionTimer

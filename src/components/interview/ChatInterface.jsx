import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User } from 'lucide-react'
import { addChatMessage, addAnswer, nextQuestion, setPhase, completeInterview } from '../../store/slices/interviewSlice'
import { generateQuestions, evaluateAnswer, generateFinalScore } from '../../utils/aiService'
import QuestionTimer from './QuestionTimer'

const ChatInterface = () => {
  const dispatch = useDispatch()
  const { 
    chatHistory, 
    phase, 
    questions, 
    currentQuestionIndex, 
    answers,
    currentCandidate 
  } = useSelector(state => state.interview)
  
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory])

  useEffect(() => {
    if (phase === 'interview' && questions.length === 0) {
      generateInterviewQuestions()
    }
  }, [phase])

  const generateInterviewQuestions = async () => {
    setIsTyping(true)
    try {
      const generatedQuestions = await generateQuestions()
      dispatch({ type: 'interview/setQuestions', payload: generatedQuestions })
      
      // Ask first question
      setTimeout(() => {
        dispatch(addChatMessage({
          id: Date.now(),
          type: 'ai',
          content: generatedQuestions[0].question,
          timestamp: new Date().toISOString(),
          difficulty: generatedQuestions[0].difficulty
        }))
        setIsTyping(false)
      }, 1000)
    } catch (error) {
      console.error('Error generating questions:', error)
      setIsTyping(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    dispatch(addChatMessage(userMessage))
    setMessage('')

    if (phase === 'details') {
      handleDetailsCollection(userMessage.content)
    } else if (phase === 'interview') {
      handleInterviewAnswer(userMessage.content)
    }
  }

  const handleDetailsCollection = (userInput) => {
    // Simple logic to collect missing details
    // In a real app, you'd use more sophisticated NLP
    const candidate = { ...currentCandidate }
    
    if (!candidate.name && userInput.length > 2) {
      candidate.name = userInput
    } else if (!candidate.email && userInput.includes('@')) {
      candidate.email = userInput
    } else if (!candidate.phone && /\d{10,}/.test(userInput.replace(/\D/g, ''))) {
      candidate.phone = userInput
    }

    dispatch({ type: 'interview/setCurrentCandidate', payload: candidate })

    // Check if all details are collected
    if (candidate.name && candidate.email && candidate.phone) {
      setTimeout(() => {
        dispatch(addChatMessage({
          id: Date.now(),
          type: 'ai',
          content: "Perfect! All your details are complete. Let's begin your interview for the Full-Stack Developer position. Are you ready?",
          timestamp: new Date().toISOString()
        }))
        dispatch(setPhase('interview'))
      }, 500)
    } else {
      const missingFields = []
      if (!candidate.name) missingFields.push('name')
      if (!candidate.email) missingFields.push('email')
      if (!candidate.phone) missingFields.push('phone')

      setTimeout(() => {
        dispatch(addChatMessage({
          id: Date.now(),
          type: 'ai',
          content: `Thank you! I still need your ${missingFields.join(', ')}. Could you please provide that?`,
          timestamp: new Date().toISOString()
        }))
      }, 500)
    }
  }

  const handleInterviewAnswer = async (answer) => {
    const currentQuestion = questions[currentQuestionIndex]
    
    // Add answer to store
    const answerData = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer,
      difficulty: currentQuestion.difficulty,
      timestamp: new Date().toISOString()
    }
    
    dispatch(addAnswer(answerData))

    // Evaluate answer and provide feedback
    setIsTyping(true)
    try {
      const evaluation = await evaluateAnswer(currentQuestion.question, answer, currentQuestion.difficulty)
      
      setTimeout(() => {
        dispatch(addChatMessage({
          id: Date.now(),
          type: 'ai',
          content: evaluation.feedback,
          timestamp: new Date().toISOString(),
          score: evaluation.score
        }))
        setIsTyping(false)

        // Move to next question or complete interview
        if (currentQuestionIndex < questions.length - 1) {
          setTimeout(() => {
            dispatch(nextQuestion())
            const nextQ = questions[currentQuestionIndex + 1]
            dispatch(addChatMessage({
              id: Date.now() + 1,
              type: 'ai',
              content: nextQ.question,
              timestamp: new Date().toISOString(),
              difficulty: nextQ.difficulty
            }))
          }, 1500)
        } else {
          // Interview complete
          setTimeout(async () => {
            const finalResult = await generateFinalScore(answers.concat([answerData]))
            dispatch({ type: 'interview/setScore', payload: finalResult.score })
            dispatch({ type: 'interview/setSummary', payload: finalResult.summary })
            dispatch(completeInterview())
            
            dispatch(addChatMessage({
              id: Date.now() + 1,
              type: 'ai',
              content: `Interview completed! Your final score is ${finalResult.score}/100. ${finalResult.summary}`,
              timestamp: new Date().toISOString()
            }))
          }, 2000)
        }
      }, 1000)
    } catch (error) {
      console.error('Error evaluating answer:', error)
      setIsTyping(false)
    }
  }

  const handleTimeUp = () => {
    if (phase === 'interview' && currentQuestionIndex < questions.length) {
      handleSubmit({ preventDefault: () => {} })
      if (!message.trim()) {
        setMessage('Time up - no answer provided')
        setTimeout(() => {
          handleSubmit({ preventDefault: () => {} })
        }, 100)
      }
    }
  }

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        <AnimatePresence>
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              className={`message ${msg.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-avatar">
                {msg.type === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {msg.difficulty && (
                    <div className={`difficulty-badge ${msg.difficulty}`}>
                      {msg.difficulty}
                    </div>
                  )}
                  <p>{msg.content}</p>
                  {msg.score && (
                    <div className="score-badge">
                      Score: {msg.score}/10
                    </div>
                  )}
                </div>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="message ai typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="message-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {phase === 'interview' && questions.length > 0 && currentQuestionIndex < questions.length && (
        <QuestionTimer
          duration={questions[currentQuestionIndex]?.duration || 60}
          onTimeUp={handleTimeUp}
          isActive={true}
        />
      )}

      <form className="chat-input" onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              phase === 'details' 
                ? 'Type your response...' 
                : phase === 'interview' 
                ? 'Type your answer...' 
                : 'Type a message...'
            }
            className="message-input"
            disabled={isTyping || phase === 'completed'}
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!message.trim() || isTyping || phase === 'completed'}
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      <style jsx>{`
        .chat-interface {
          display: flex;
          flex-direction: column;
          height: 600px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .chat-messages {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .message {
          display: flex;
          gap: 12px;
          max-width: 80%;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message.ai .message-avatar {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .message.user .message-avatar {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .message.system .message-avatar {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .message-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .message.user .message-content {
          align-items: flex-end;
        }

        .message-bubble {
          padding: 16px 20px;
          border-radius: 16px;
          position: relative;
        }

        .message.ai .message-bubble {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .message.user .message-bubble {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .message.system .message-bubble {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .message-bubble p {
          margin: 0;
          font-size: 15px;
          line-height: 1.5;
        }

        .difficulty-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .difficulty-badge.easy {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }

        .difficulty-badge.medium {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }

        .difficulty-badge.hard {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .score-badge {
          margin-top: 8px;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .message-time {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          background: #9ca3af;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .chat-input {
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          background: #fafbfc;
        }

        .input-container {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .message-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 15px;
          background: white;
          transition: all 0.2s ease;
        }

        .message-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .message-input:disabled {
          background: #f3f4f6;
          color: #9ca3af;
        }

        .send-button {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .send-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .send-button:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          .chat-interface {
            height: 500px;
          }
          
          .chat-messages {
            padding: 16px;
            gap: 12px;
          }
          
          .message {
            max-width: 90%;
          }
          
          .message-avatar {
            width: 36px;
            height: 36px;
          }
          
          .message-bubble {
            padding: 12px 16px;
          }
          
          .message-bubble p {
            font-size: 14px;
          }
          
          .chat-input {
            padding: 16px;
          }
          
          .message-input {
            padding: 10px 14px;
            font-size: 14px;
          }
          
          .send-button {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </div>
  )
}

export default ChatInterface

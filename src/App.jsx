import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import TabNavigation from './components/TabNavigation'
import IntervieweeTab from './components/IntervieweeTab'
import InterviewerTab from './components/InterviewerTab'
import WelcomeBackModal from './components/WelcomeBackModal'
import { setActiveTab } from './store/slices/uiSlice'

function App() {
  const dispatch = useDispatch()
  const { activeTab } = useSelector(state => state.ui)
  const { hasUnfinishedInterview } = useSelector(state => state.interview)

  useEffect(() => {
    // Check for unfinished interviews on app load
    const handleKeyDown = (e) => {
      // Keyboard shortcuts for accessibility
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '1') {
          e.preventDefault()
          dispatch(setActiveTab('interviewee'))
        } else if (e.key === '2') {
          e.preventDefault()
          dispatch(setActiveTab('interviewer'))
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="container">
          <TabNavigation />
          <div className="tab-content">
            <AnimatePresence mode="wait">
              {activeTab === 'interviewee' ? (
                <motion.div
                  key="interviewee"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <IntervieweeTab />
                </motion.div>
              ) : (
                <motion.div
                  key="interviewer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <InterviewerTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <AnimatePresence>
        {hasUnfinishedInterview && <WelcomeBackModal />}
      </AnimatePresence>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .main-content {
          padding-top: 80px;
          min-height: calc(100vh - 80px);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .tab-content {
          margin-top: 32px;
          position: relative;
          min-height: 600px;
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }
          
          .main-content {
            padding-top: 70px;
          }
          
          .tab-content {
            margin-top: 24px;
          }
        }
      `}</style>
    </div>
  )
}

export default App

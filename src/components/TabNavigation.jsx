import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { MessageSquare, BarChart3 } from 'lucide-react'
import { setActiveTab } from '../store/slices/uiSlice'

const TabNavigation = () => {
  const dispatch = useDispatch()
  const { activeTab } = useSelector(state => state.ui)
  const { candidates } = useSelector(state => state.candidates)

  const tabs = [
    {
      id: 'interviewee',
      label: 'Interview',
      icon: MessageSquare,
      description: 'Candidate Experience'
    },
    {
      id: 'interviewer',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Manage Candidates',
      badge: candidates.length > 0 ? candidates.length : null
    }
  ]

  return (
    <div className="tab-navigation">
      <div className="tab-list" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              className={`tab-button ${isActive ? 'active' : ''}`}
              onClick={() => dispatch(setActiveTab(tab.id))}
            >
              <div className="tab-content">
                <div className="tab-icon">
                  <Icon size={20} />
                  {tab.badge && (
                    <span className="badge">{tab.badge}</span>
                  )}
                </div>
                <div className="tab-text">
                  <span className="tab-label">{tab.label}</span>
                  <span className="tab-description">{tab.description}</span>
                </div>
              </div>
              
              {isActive && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <style jsx>{`
        .tab-navigation {
          background: white;
          border-radius: 16px;
          padding: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .tab-list {
          display: flex;
          gap: 4px;
        }

        .tab-button {
          position: relative;
          flex: 1;
          background: transparent;
          border: none;
          padding: 16px 20px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .tab-button:hover {
          background: #f8fafc;
        }

        .tab-button.active {
          background: #f1f5f9;
          color: #3b82f6;
        }

        .tab-content {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .tab-icon {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .tab-button.active .tab-icon {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ef4444;
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tab-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .tab-label {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.2;
        }

        .tab-button.active .tab-label {
          color: #3b82f6;
        }

        .tab-description {
          font-size: 13px;
          color: #6b7280;
          font-weight: 400;
        }

        .active-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%);
          border-radius: 12px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 768px) {
          .tab-navigation {
            padding: 6px;
            border-radius: 12px;
          }
          
          .tab-button {
            padding: 12px 16px;
          }
          
          .tab-content {
            gap: 10px;
          }
          
          .tab-icon {
            width: 36px;
            height: 36px;
          }
          
          .tab-label {
            font-size: 14px;
          }
          
          .tab-description {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .tab-description {
            display: none;
          }
          
          .tab-content {
            justify-content: center;
          }
          
          .tab-text {
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
}

export default TabNavigation

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'

const Header = () => {
  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="header"
    >
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <Brain size={28} />
            <Sparkles size={16} className="sparkle" />
          </div>
          <div className="logo-text">
            <h1>Crisp</h1>
            <span>AI-Powered Interview Assistant</span>
          </div>
        </div>
        
        <div className="header-actions">
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(229, 231, 235, 0.8);
          height: 80px;
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          position: relative;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .sparkle {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #fbbf24;
          border-radius: 50%;
          padding: 2px;
          animation: pulse 2s infinite;
        }

        .logo-text h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
          line-height: 1;
        }

        .logo-text span {
          font-size: 13px;
          color: #6b7280;
          font-weight: 500;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #059669;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @media (max-width: 768px) {
          .header {
            height: 70px;
          }
          
          .header-content {
            padding: 0 16px;
          }
          
          .logo-icon {
            width: 40px;
            height: 40px;
          }
          
          .logo-text h1 {
            font-size: 20px;
          }
          
          .logo-text span {
            font-size: 12px;
          }
          
          .status-indicator {
            padding: 6px 12px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .logo-text span {
            display: none;
          }
          
          .status-indicator span {
            display: none;
          }
        }
      `}</style>
    </motion.header>
  )
}

export default Header

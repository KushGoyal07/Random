import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowUpDown, Star, Clock, CheckCircle } from 'lucide-react'
import { setSearchTerm, setSortBy, setSortOrder } from '../../store/slices/candidatesSlice'
import { setSelectedCandidate } from '../../store/slices/uiSlice'

const CandidateList = () => {
  const dispatch = useDispatch()
  const { candidates, searchTerm, sortBy, sortOrder } = useSelector(state => state.candidates)

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => 
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'name') {
        aValue = aValue?.toLowerCase() || ''
        bValue = bValue?.toLowerCase() || ''
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [candidates, searchTerm, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'))
    } else {
      dispatch(setSortBy(field))
      dispatch(setSortOrder('desc'))
    }
  }

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

  if (candidates.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="empty-icon">
          <CheckCircle size={48} />
        </div>
        <h3>No Candidates Yet</h3>
        <p>Candidates will appear here after completing their interviews</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="candidate-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="list-header">
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search candidates by name or email..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <button className="filter-button">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>
                <button 
                  className="sort-button"
                  onClick={() => handleSort('name')}
                >
                  Candidate
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th>Contact</th>
              <th>
                <button 
                  className="sort-button"
                  onClick={() => handleSort('score')}
                >
                  Score
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th>Summary</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredAndSortedCandidates.map((candidate, index) => (
                <motion.tr
                  key={candidate.id}
                  className="candidate-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => dispatch(setSelectedCandidate(candidate))}
                >
                  <td>
                    <div className="candidate-info">
                      <div className="avatar">
                        {candidate.name?.charAt(0)?.toUpperCase() || 'C'}
                      </div>
                      <div className="info">
                        <span className="name">{candidate.name || 'Unknown'}</span>
                        <span className="id">ID: {candidate.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <span className="email">{candidate.email}</span>
                      <span className="phone">{candidate.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div className="score-display">
                      <div 
                        className="score-badge"
                        style={{ 
                          background: `${getScoreColor(candidate.score)}15`,
                          color: getScoreColor(candidate.score),
                          border: `1px solid ${getScoreColor(candidate.score)}30`
                        }}
                      >
                        <Star size={14} />
                        {candidate.score}/100
                      </div>
                      <span 
                        className="score-label"
                        style={{ color: getScoreColor(candidate.score) }}
                      >
                        {getScoreLabel(candidate.score)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="summary-preview">
                      {candidate.summary?.substring(0, 80)}
                      {candidate.summary?.length > 80 && '...'}
                    </div>
                  </td>
                  <td>
                    <div className="completion-info">
                      <Clock size={14} />
                      <span>
                        {new Date(candidate.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .candidate-list {
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .empty-state {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          margin: 0 auto 24px;
        }

        .empty-state h3 {
          font-size: 24px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .empty-state p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .list-header {
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .search-container {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-container svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 14px;
          background: #f9fafb;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          background: white;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .filter-controls {
          display: flex;
          gap: 12px;
        }

        .filter-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-button:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .table-container {
          overflow-x: auto;
        }

        .candidates-table {
          width: 100%;
          border-collapse: collapse;
        }

        .candidates-table th {
          padding: 16px 24px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .sort-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .sort-button:hover {
          color: #374151;
        }

        .candidate-row {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .candidate-row:hover {
          background: #f8fafc;
        }

        .candidates-table td {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }

        .candidate-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }

        .info {
          display: flex;
          flex-direction: column;
        }

        .name {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
        }

        .id {
          font-size: 12px;
          color: #9ca3af;
          font-family: monospace;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .email {
          font-size: 14px;
          color: #374151;
        }

        .phone {
          font-size: 13px;
          color: #6b7280;
        }

        .score-display {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .score-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          width: fit-content;
        }

        .score-label {
          font-size: 12px;
          font-weight: 500;
        }

        .summary-preview {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.4;
          max-width: 200px;
        }

        .completion-info {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .list-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .search-container {
            max-width: none;
          }
          
          .table-container {
            overflow-x: scroll;
          }
          
          .candidates-table {
            min-width: 800px;
          }
          
          .candidates-table th,
          .candidates-table td {
            padding: 12px 16px;
          }
          
          .avatar {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default CandidateList

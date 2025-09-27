import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { setCurrentCandidate, setPhase, addChatMessage } from '../../store/slices/interviewSlice'
import { parseResume } from '../../utils/resumeParser'

const ResumeUpload = () => {
  const dispatch = useDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }, [])

  const handleFiles = async (files) => {
    if (files.length === 0) return

    const file = files[0]
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file')
      return
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    setUploadedFile(file)

    try {
      const candidateData = await parseResume(file)
      
      dispatch(setCurrentCandidate(candidateData))
      dispatch(addChatMessage({
        id: Date.now(),
        type: 'system',
        content: `Resume uploaded successfully! Hello ${candidateData.name || 'there'}, I'm your AI interview assistant.`,
        timestamp: new Date().toISOString()
      }))

      // Check if we need to collect missing details
      const missingFields = []
      if (!candidateData.name) missingFields.push('name')
      if (!candidateData.email) missingFields.push('email')
      if (!candidateData.phone) missingFields.push('phone')

      if (missingFields.length > 0) {
        dispatch(setPhase('details'))
        dispatch(addChatMessage({
          id: Date.now() + 1,
          type: 'ai',
          content: `I need to collect some additional information before we begin. Could you please provide your ${missingFields.join(', ')}?`,
          timestamp: new Date().toISOString()
        }))
      } else {
        dispatch(setPhase('interview'))
        dispatch(addChatMessage({
          id: Date.now() + 1,
          type: 'ai',
          content: "Perfect! All your details are complete. Let's begin your interview for the Full-Stack Developer position. Are you ready?",
          timestamp: new Date().toISOString()
        }))
      }

      toast.success('Resume uploaded and processed successfully!')
    } catch (error) {
      console.error('Resume parsing error:', error)
      toast.error('Failed to process resume. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <motion.div
      className="resume-upload"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="upload-header">
        <h3>Upload Your Resume</h3>
        <p>Start your AI-powered interview by uploading your resume (PDF or DOCX)</p>
      </div>

      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          className="file-input"
          id="resume-upload"
          disabled={isUploading}
        />
        
        <div className="upload-content">
          {isUploading ? (
            <motion.div
              className="upload-progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="spinner"></div>
              <h4>Processing Resume...</h4>
              <p>Extracting your information using AI</p>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              className="upload-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={48} className="success-icon" />
              <h4>Resume Uploaded Successfully!</h4>
              <p>{uploadedFile.name}</p>
            </motion.div>
          ) : (
            <div className="upload-prompt">
              <Upload size={48} className="upload-icon" />
              <h4>Drag & drop your resume here</h4>
              <p>or <label htmlFor="resume-upload" className="upload-link">browse files</label></p>
              <div className="file-types">
                <span>Supported formats: PDF, DOCX</span>
                <span>Max size: 10MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="upload-info">
        <div className="info-item">
          <FileText size={20} />
          <div>
            <h5>What we extract</h5>
            <p>Name, email, phone number, and relevant experience</p>
          </div>
        </div>
        <div className="info-item">
          <AlertCircle size={20} />
          <div>
            <h5>Privacy & Security</h5>
            <p>Your data is processed locally and stored securely</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .resume-upload {
          max-width: 600px;
          margin: 0 auto;
        }

        .upload-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .upload-header h3 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .upload-header p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .upload-zone {
          position: relative;
          border: 2px dashed #d1d5db;
          border-radius: 16px;
          padding: 48px 32px;
          text-align: center;
          transition: all 0.3s ease;
          background: #fafbfc;
          margin-bottom: 32px;
        }

        .upload-zone.dragging {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
          transform: scale(1.02);
        }

        .upload-zone.uploading {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .upload-content {
          position: relative;
          z-index: 1;
          pointer-events: none;
        }

        .upload-prompt .upload-icon {
          color: #9ca3af;
          margin-bottom: 16px;
        }

        .upload-prompt h4 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .upload-prompt p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 16px 0;
        }

        .upload-link {
          color: #3b82f6;
          font-weight: 600;
          cursor: pointer;
          pointer-events: all;
          text-decoration: underline;
        }

        .upload-link:hover {
          color: #1d4ed8;
        }

        .file-types {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 14px;
          color: #9ca3af;
        }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .upload-progress h4 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .upload-progress p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .upload-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .success-icon {
          color: #10b981;
        }

        .upload-success h4 {
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .upload-success p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .upload-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .info-item svg {
          color: #3b82f6;
          margin-top: 2px;
        }

        .info-item h5 {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .info-item p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .upload-header h3 {
            font-size: 24px;
          }
          
          .upload-header p {
            font-size: 15px;
          }
          
          .upload-zone {
            padding: 32px 24px;
          }
          
          .upload-prompt h4 {
            font-size: 18px;
          }
          
          .upload-prompt p {
            font-size: 15px;
          }
          
          .upload-info {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .info-item {
            padding: 16px;
          }
        }
      `}</style>
    </motion.div>
  )
}

export default ResumeUpload

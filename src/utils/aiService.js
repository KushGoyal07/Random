// Mock AI service for demonstration
// In production, replace with actual OpenAI API calls

const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the difference between let, const, and var in JavaScript?",
    difficulty: "easy",
    duration: 20
  },
  {
    id: 2,
    question: "Explain the concept of closures in JavaScript with an example.",
    difficulty: "easy",
    duration: 20
  },
  {
    id: 3,
    question: "How does React's virtual DOM work and what are its benefits?",
    difficulty: "medium",
    duration: 60
  },
  {
    id: 4,
    question: "Describe the differences between SQL and NoSQL databases. When would you use each?",
    difficulty: "medium",
    duration: 60
  },
  {
    id: 5,
    question: "Design a scalable system for handling real-time chat messages for millions of users.",
    difficulty: "hard",
    duration: 120
  },
  {
    id: 6,
    question: "Implement a function to find the longest palindromic substring in a given string with optimal time complexity.",
    difficulty: "hard",
    duration: 120
  }
]

export const generateQuestions = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In production, this would call OpenAI API:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Generate 6 interview questions for a full-stack developer role (React/Node.js): 2 easy (20s each), 2 medium (60s each), 2 hard (120s each). Return as JSON array with id, question, difficulty, duration fields.'
      }]
    })
  })
  */
  
  return MOCK_QUESTIONS
}

export const evaluateAnswer = async (question, answer, difficulty) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Mock evaluation logic
  const answerLength = answer.trim().length
  let baseScore = 5
  
  if (answerLength > 100) baseScore += 2
  if (answerLength > 200) baseScore += 1
  if (answer.toLowerCase().includes('react') && question.toLowerCase().includes('react')) baseScore += 1
  if (answer.toLowerCase().includes('javascript') && question.toLowerCase().includes('javascript')) baseScore += 1
  
  // Adjust for difficulty
  if (difficulty === 'easy' && answerLength > 50) baseScore += 1
  if (difficulty === 'medium' && answerLength > 150) baseScore += 1
  if (difficulty === 'hard' && answerLength > 250) baseScore += 1
  
  const score = Math.min(10, Math.max(1, baseScore))
  
  const feedbacks = [
    "Good answer! You demonstrated understanding of the core concepts.",
    "Nice explanation! Consider adding more specific examples next time.",
    "Well structured response. Your technical knowledge shows through.",
    "Solid answer! You covered the key points effectively.",
    "Great job! Your answer shows practical experience with the topic."
  ]
  
  const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)]
  
  return {
    score,
    feedback: `${feedback} Score: ${score}/10`
  }
}

export const generateFinalScore = async (answers) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Calculate weighted score based on difficulty
  let totalScore = 0
  let totalWeight = 0
  
  answers.forEach((answer, index) => {
    const weight = answer.difficulty === 'easy' ? 1 : answer.difficulty === 'medium' ? 1.5 : 2
    // Mock individual score calculation
    const individualScore = Math.floor(Math.random() * 4) + 6 // 6-10 range
    totalScore += individualScore * weight
    totalWeight += weight
  })
  
  const finalScore = Math.round((totalScore / totalWeight) * 10) // Convert to 100 scale
  
  const summaries = [
    "Strong technical foundation with good problem-solving skills. Shows promise for full-stack development roles.",
    "Solid understanding of core concepts. Would benefit from more hands-on experience with complex systems.",
    "Excellent communication skills and technical knowledge. Ready for senior-level responsibilities.",
    "Good grasp of fundamentals with room for growth in advanced topics. Suitable for mid-level positions.",
    "Outstanding performance across all areas. Demonstrates expertise in both frontend and backend technologies."
  ]
  
  const summary = summaries[Math.floor(Math.random() * summaries.length)]
  
  return {
    score: finalScore,
    summary
  }
}

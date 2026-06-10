// Groq AI Service for Chatbot
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// System instruction focused on ApnaRozgaar, apps, and companies
const SYSTEM_INSTRUCTION = `You are Asha, a helpful and friendly AI assistant for ApnaRozgaar, a platform dedicated to inclusive hiring for Persons with Disabilities (PwD).

Your mission is to help users find inclusive job opportunities, build accessible profiles, and navigate the platform.

SPECIAL FOCUS:
- You have deep knowledge of companies that prioritize disability inclusion (e.g., Microsoft, Google, SAP, Accenture, and many progressive Indian firms).
- You can provide tips on app accessibility (screen readers, voice control, high contrast, etc.).
- When asked about companies, highlight their inclusive policies, workplace accommodations, and culture.
- When asked about apps, explain how they can be made more accessible for different types of disabilities.

FORMATTING RULES:
- Use emojis to stay friendly and warm 💜
- Use bullet points (•) for lists
- Use line breaks to separate sections
- Keep responses concise but very informative
- DO NOT use markdown formatting like **bold** or *italic*
- DO NOT use # for headings`;

/**
 * Send a message to Groq AI and get a response
 * @param {string} userMessage - The user's message
 * @param {Array} history - Optional message history for context
 * @returns {Promise<string>} AI response text
 */
export const getGroqResponse = async (userMessage, history = []) => {
  if (!GROQ_API_KEY) {
    console.warn('Groq API key not configured');
    return null;
  }

  try {
    const messages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...history.slice(-5), // Last 5 messages for context
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', response.status, data);
      return null;
    }

    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      console.error('No response text in Groq response:', data);
      return null;
    }

    return responseText;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return null;
  }
};

/**
 * Check if Groq API is configured
 * @returns {boolean}
 */
export const isGroqConfigured = () => {
  return !!GROQ_API_KEY;
};

/**
 * Send a message to Groq AI for Resume Builder and get a response containing JSON
 * @param {string} userMessage - The user's message
 * @param {Array} history - Optional message history for context
 * @returns {Promise<string>} AI response text
 */
export const getGroqResumeExtraction = async (userMessage, history = []) => {
  if (!GROQ_API_KEY) {
    console.warn('Groq API key not configured');
    return null;
  }

  const RESUME_SYSTEM_INSTRUCTION = `You are an expert AI Resume Builder Assistant. Your goal is to construct a professional resume for the user by kindly asking them questions one by one.
Ask about their Name, Contact Info, Summary, Skills, Education, and Work Experience/Projects.
IMPORTANT RULE: At the very end of EVERY response you make, you MUST append a JSON block containing the current extracted resume state. The JSON must exactly match this format:
\`\`\`json
{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "role": "",
  "summary": "",
  "skills": [],
  "education": [{"degree": "", "school": "", "year": ""}],
  "experience": [{"title": "", "company": "", "duration": "", "description": ""}],
  "projects": [{"title": "", "description": ""}]
}
\`\`\`
If you haven't extracted a field yet, leave it empty or as an empty array. Do not wrap the JSON in anything other than the \`\`\`json markdown block. Do not hallucinate data.`;

  try {
    const messages = [
      { role: 'system', content: RESUME_SYSTEM_INSTRUCTION },
      ...history,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.5,
        max_tokens: 1500,
        top_p: 1,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', response.status, data);
      return null;
    }

    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      console.error('No response text in Groq response:', data);
      return null;
    }

    return responseText;
  } catch (error) {
    console.error('Error calling Groq API for resume:', error);
    return null;
  }
};

/**
 * Fetch book recommendations from Groq
 * @param {string} topic - The topic or course name
 * @returns {Promise<Array>} Array of book recommendation objects
 */
export const getGroqBookRecommendations = async (topic) => {
  if (!GROQ_API_KEY) {
    console.warn('Groq API key not configured');
    return [];
  }

  const BOOK_SYSTEM_INSTRUCTION = `You are a helpful education librarian. The user will provide a topic or course name.
Your task is to recommend the 5 best books to read and prepare for this topic.
You MUST respond with ONLY a valid JSON array of objects. Do not include any markdown formatting, do not include \`\`\`json, do not say anything else.
Each object should have:
"title": String,
"author": String,
"description": String (short 2-sentence summary),
"level": String (Beginner, Intermediate, or Advanced),
"whyToRead": String (1 sentence on why it's good for this topic).`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: BOOK_SYSTEM_INSTRUCTION },
          { role: 'user', content: `Topic: ${topic}` }
        ],
        temperature: 0.3, // Lower temperature for more structured output
        max_tokens: 1500,
        top_p: 1,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', response.status, data);
      return [];
    }

    const responseText = data.choices?.[0]?.message?.content;

    if (!responseText) {
      return [];
    }

    let parsedBooks = [];
    try {
      // Removing any potential markdown just in case the AI ignored instructions
      const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedBooks = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse book JSON:', responseText);
      return [];
    }

    return parsedBooks;
  } catch (error) {
    console.error('Error calling Groq API for books:', error);
    return [];
  }
};


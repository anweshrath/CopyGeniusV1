import axios from 'axios';

// OpenAI API
const generateWithOpenAI = async (
  apiKey: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert copywriter with deep knowledge of marketing psychology and persuasive writing techniques.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating with OpenAI:', error);
    throw new Error('Failed to generate content with OpenAI');
  }
};

// Gemini API
const generateWithGemini = async (
  apiKey: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Error generating with Gemini:', error);
    throw new Error('Failed to generate content with Gemini');
  }
};

// Generate copy based on parameters
export const generateCopy = async (
  apiKey: string,
  provider: 'openai' | 'gemini',
  type: string,
  niche: string,
  purpose: string,
  framework: string
): Promise<string> => {
  const prompt = `
    Create a compelling ${type} for the ${niche} niche with the purpose of ${purpose}.
    
    Use the ${framework} copywriting framework to structure the content.
    
    Make it persuasive, engaging, and tailored to the target audience.
    Include appropriate hooks, benefits, and calls to action.
    
    The copy should be ready to use with minimal editing.
  `;

  if (provider === 'openai') {
    return generateWithOpenAI(apiKey, prompt);
  } else {
    return generateWithGemini(apiKey, prompt);
  }
};

// Suggest improvements to existing copy
export const suggestImprovements = async (
  apiKey: string,
  provider: 'openai' | 'gemini',
  content: string,
  type: string,
  framework: string
): Promise<string> => {
  const prompt = `
    Improve the following ${type} that uses the ${framework} framework:
    
    "${content}"
    
    Analyze the copy and suggest improvements to make it more persuasive, engaging, and effective.
    Focus on enhancing the headline, strengthening the value proposition, improving the flow, and making the call to action more compelling.
    
    Provide a complete revised version of the copy, not just suggestions.
  `;

  if (provider === 'openai') {
    return generateWithOpenAI(apiKey, prompt);
  } else {
    return generateWithGemini(apiKey, prompt);
  }
};

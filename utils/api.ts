import axios from 'axios';

export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post('/api/generate', { prompt });
    return response.data.response;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
};
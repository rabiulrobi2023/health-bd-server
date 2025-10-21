export const parseAiDoctorResponse = (aiMessage: { content?: string }) => {
  if (!aiMessage?.content) return null;
  const content = aiMessage.content.trim();
  const jsonBlockMatch = content.match(/```json([\s\S]*?)```/);
  const jsonString = jsonBlockMatch ? jsonBlockMatch[1].trim() : content;
  const data = JSON.parse(jsonString);
  return data;
};


import { GoogleGenAI, Type } from "@google/genai";
import { Slot } from "../types";

export const getGeminiResponse = async (
  prompt: string, 
  availableSlots: Slot[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const slotsContext = availableSlots
    .filter(s => !s.isBooked)
    .map(s => `- Fecha: ${new Date(s.startTime).toLocaleDateString('es-ES')}, Hora: ${new Date(s.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`)
    .join('\n');

  const systemInstruction = `
    Eres el asistente oficial del "Grupo Conexión". 
    Tu misión es gestionar las citas de ministración que ocurren exclusivamente los LUNES y MARTES de 9:00 PM a 10:00 PM.
    
    Horarios libres actuales:
    ${slotsContext}
    
    Reglas de respuesta:
    1. Sé muy amable, espiritual y acogedor. Usa frases como "Es un gusto saludarte" o "Bendiciones".
    2. Identifícate como parte del Grupo Conexión.
    3. Si el usuario te cuenta un problema, ofrece una pequeña palabra de fe y sugiérele uno de los horarios libres arriba listados.
    4. Sé directo. Si no hay horarios libres, indícalo con empatía.
    5. No inventes horarios. Solo usa los que están en la lista.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías elegir un horario directamente en el calendario?";
  }
};

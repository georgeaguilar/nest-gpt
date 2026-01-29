import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const response = await openai.responses.create({
    model: 'gpt-5-nano',
    input: [
      {
        role: 'system',
        content: `
        Te seran proveídos textos en español con posibles errores ortograficos y gramaticales,
        Las palabras usadas deben de existir en el diccionario de la Real Academia Española,
        Debes de responder en formato JSON, 
        tu tarea es corregirlos y retornar información soluciones,
        tambien debes de dar un porcentaje de acierto por el usuario,


        Si no hay errores, debes de retornar un mensaje de felicitaicones.

        Ejemplo de salida:
        {
            userScore: number,
            errors: string[], // ['error -> solucion']
            message: string, // Usa emojis y texto para felicitar al usuario
        }
        `,
      },
      { role: 'user', content: prompt },
    ],
    text: {
      format: {
        type: 'json_object',
      },
    },
  });

  const jsonResp = JSON.parse(response.output_text) as JSON;

  return jsonResp;
};

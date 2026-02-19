
import { GoogleGenAI, Type } from "@google/genai";
import type { MetabolizerStatus, RiskCategory, ClinicalRecommendation, LLMExplanation } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    recommendation: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: 'A concise summary of the clinical recommendation.',
        },
        dosageAdjustment: {
          type: Type.STRING,
          description: 'Specific advice on dosage adjustment (e.g., \'Reduce dose by 50%\', \'Standard dosing\').',
        },
        alternativeTherapy: {
          type: Type.STRING,
          description: 'Suggestions for alternative drugs or therapies, if applicable.',
        },
        cpicGuideline: {
          type: Type.STRING,
          description: 'Reference to the relevant CPIC guideline (e.g., \'CPIC Guideline for CYP2D6 and Codeine\').'
        }
      },
      required: ['summary', 'dosageAdjustment', 'alternativeTherapy', 'cpicGuideline'],
    },
    explanation: {
      type: Type.OBJECT,
      properties: {
        summary: {
          type: Type.STRING,
          description: 'A brief, easy-to-understand summary of the pharmacogenomic findings.'
        },
        biologicalMechanism: {
          type: Type.STRING,
          description: 'Explanation of the biological and genetic mechanism causing the predicted drug response.',
        },
        variantInterpretation: {
          type: Type.STRING,
          description: 'Details on how the specific gene variant affects enzyme activity or drug metabolism.'
        },
        riskInterpretation: {
          type: Type.STRING,
          description: 'Interpretation of what the predicted risk means for the patient clinically.',
        },
      },
      required: ['summary', 'biologicalMechanism', 'variantInterpretation', 'riskInterpretation'],
    },
  },
  required: ['recommendation', 'explanation'],
};

export async function generateMedicalExplanation(
  drug: string,
  gene: string,
  phenotype: MetabolizerStatus,
  risk: RiskCategory
): Promise<{ recommendation: ClinicalRecommendation; explanation: LLMExplanation }> {
  const prompt = `
    Act as an expert pharmacogenomics clinical decision support system.
    Given the following patient genetic profile and prescribed drug, generate a clinical report.
    The report must be evidence-based, citing biological mechanisms and potential clinical outcomes.
    The recommendation must align with established clinical guidelines like CPIC.

    Patient Data:
    - Drug: ${drug}
    - Gene: ${gene}
    - Phenotype: ${phenotype}
    - Predicted Risk: ${risk}

    Task:
    Generate a JSON object containing a detailed clinical recommendation and an explainability report.
    Do not include any text, markdown formatting, or explanations outside of the JSON structure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    if (!response.text) {
        throw new Error("API returned an empty response.");
    }
    
    const parsedJson = JSON.parse(response.text);

    return {
      recommendation: parsedJson.recommendation,
      explanation: parsedJson.explanation,
    };
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
}

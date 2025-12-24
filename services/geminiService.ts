
import { GoogleGenAI, Type } from "@google/genai";
import type { ComplaintAnalysis, StudentDetails } from "../types";

// FIX: Per coding guidelines, the API key must be obtained from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    priority: {
      type: Type.STRING,
      enum: ["High", "Medium", "Low"],
      description: "Priority of the complaint."
    },
    category: {
      type: Type.STRING,
      description: "A short, descriptive title for the complaint, considering text and image."
    },
    department: {
      type: Type.STRING,
      description: "The department responsible for handling the complaint."
    },
  },
  required: ["priority", "category", "department"],
};


export const analyzeComplaint = async (
  complaintText: string,
  studentDetails: StudentDetails,
  image?: { base64: string; mimeType: string }
): Promise<ComplaintAnalysis> => {
  const prompt = `
    You are a highly efficient college administration assistant. Your task is to analyze a student's complaint and classify it for the helpdesk system.

    Analyze the complaint based on the student's details, the text, and (if provided) the image. Provide a JSON response with 'priority', 'category', and 'department'.

    **Student Details:**
    - Name: ${studentDetails.name}
    - Class & Division: ${studentDetails.class} - ${studentDetails.division}
    - Roll Number: ${studentDetails.rollNo}

    **Analysis Guidelines:**

    1.  **priority**: Assign a priority level: "High", "Medium", or "Low".
        - "High": Urgent issues affecting safety, health, or ability to perform academic work (e.g., power outage, broken window in dorm, exam conflict, fire hazard in image).
        - "Medium": Issues causing significant inconvenience but not critical (e.g., slow Wi-Fi, noisy library, broken furniture).
        - "Low": Minor issues or suggestions (e.g., request for more water coolers, suggestion for a new club).

    2.  **category**: Provide a short, descriptive title (e.g., "Wi-Fi Outage in Library", "Leaking Faucet in Hostel Bathroom", "Broken Window in Room 301").

    3.  **department**: Assign to the most relevant department: "IT Services", "Maintenance & Facilities", "Academic Affairs", "Student Affairs", "Administration", "Library Services", or "Hostel Management".

    **Student Complaint Text:**
    "${complaintText}"
    `;

    const textPart = { text: prompt };
    const imagePart = image ? {
        inlineData: {
            mimeType: image.mimeType,
            data: image.base64,
        }
    } : null;

    const parts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [textPart];
    if (imagePart) {
        parts.push(imagePart);
    }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text?.trim();
    if (!jsonText) {
      throw new Error("Received an empty response from the AI.");
    }
    const parsedResponse = JSON.parse(jsonText);
    
    if (
      !parsedResponse.priority ||
      !parsedResponse.category ||
      !parsedResponse.department
    ) {
      throw new Error("Invalid JSON structure from Gemini");
    }

    return parsedResponse as ComplaintAnalysis;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini.");
  }
};

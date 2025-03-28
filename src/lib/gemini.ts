
export interface AlgaeFormData {
  ph: number;
  temperature: number;
  volume: number;
  harvestFrequency: string;
  image: File | null;
}

export async function processAlgaeData(
  formData: AlgaeFormData,
  apiKey: string
): Promise<string> {
  try {
    let imageData = null;
    
    // Process image if provided
    if (formData.image) {
      const base64Image = await fileToBase64(formData.image);
      imageData = base64Image;
    }
    
    // Construct the prompt
    const prompt = `Act as an algae biofuel expert. For pH ${formData.ph}, temperature ${formData.temperature}°C, volume ${formData.volume}L, and ${formData.harvestFrequency} harvesting:
a) Recommend top 3 algae strains in a markdown table with columns: Strain, Growth Rate, Lipid %, Ideal pH, Ideal Temp
b) Provide optimal harvesting schedule
c) Suggest lipid optimization techniques
d) Estimate biofuel yield potential
${formData.image ? "e) Analyze the uploaded algae image and provide insights" : ""}`;

    // Prepare the request body
    const requestBody: any = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      }
    };

    // Add image to request if available
    if (imageData) {
      requestBody.contents[0].parts.push({
        inlineData: {
          mimeType: formData.image.type,
          data: imageData.split(',')[1] // Remove the data:image/jpeg;base64, part
        }
      });
    }

    // Call the Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    // Extract the text response from Gemini's response format
    if (data.candidates && data.candidates[0]?.content?.parts?.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};


import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2 } from "lucide-react";

interface GeminiResponseProps {
  response: string;
  hasImage: boolean;
}

const GeminiResponse: React.FC<GeminiResponseProps> = ({ response, hasImage }) => {
  if (!response) return null;

  // Split the response into sections based on common markdown headers
  const splitSections = (content: string) => {
    // Identify sections by common headers that might be returned by Gemini
    const sections = [
      { title: "Algae Strain Recommendations", content: "" },
      { title: "Harvesting Schedule", content: "" },
      { title: "Lipid Optimization Techniques", content: "" },
      { title: "Biofuel Yield Potential", content: "" },
    ];

    // If image was provided, try to extract image analysis section
    if (hasImage) {
      sections.push({ title: "Image Analysis", content: "" });
    }

    // Try to find these sections in the content
    let currentSection = -1;
    const lines = content.split('\n');
    let sectionsFound = false;

    const processedLines = lines.map(line => {
      // Check if this line corresponds to a section header
      const headerMatch = line.match(/^#+\s*(.+)$/);
      if (headerMatch) {
        const headerText = headerMatch[1].trim().toLowerCase();
        
        for (let i = 0; i < sections.length; i++) {
          const sectionTitle = sections[i].title.toLowerCase();
          if (headerText.includes(sectionTitle) || 
              sectionTitle.includes(headerText) ||
              (headerText.includes("strain") && sectionTitle.includes("strain")) ||
              (headerText.includes("harvest") && sectionTitle.includes("harvest")) ||
              (headerText.includes("lipid") && sectionTitle.includes("lipid")) ||
              (headerText.includes("yield") && sectionTitle.includes("yield")) ||
              (headerText.includes("image") && sectionTitle.includes("image"))) {
            currentSection = i;
            sectionsFound = true;
            return null; // Remove the header from output as we'll use our own styling
          }
        }
      }

      // Add line to current section if we're in one
      if (currentSection >= 0 && line.trim()) {
        sections[currentSection].content += line + '\n';
      }

      return line;
    });

    // If no sections were found in the response, return the original content
    if (!sectionsFound) {
      return null;
    }

    return sections.filter(section => section.content.trim());
  };

  const sections = splitSections(response);

  return (
    <div className="space-y-6 mt-8">
      <Card className="bg-white shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-water-light to-algae-light">
          <CardTitle className="text-2xl font-bold text-white">
            Algae Biofuel Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!sections ? (
            // If sections couldn't be extracted, render the full response
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {response}
              </ReactMarkdown>
            </div>
          ) : (
            // Render each section with custom styling
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-algae" />
                    <h3 className="text-lg font-semibold text-algae-dark">
                      {section.title}
                    </h3>
                  </div>
                  <Separator className="bg-algae/20" />
                  <div className="prose prose-sm max-w-none p-3 bg-slate-50 rounded-md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {section.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {hasImage && (
            <Alert className="mt-6 border-water">
              <Info className="h-4 w-4 text-water" />
              <AlertTitle>Image Analysis Included</AlertTitle>
              <AlertDescription>
                The recommendations include analysis of your uploaded algae image.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeminiResponse;

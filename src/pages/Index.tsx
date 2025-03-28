
import React, { useState } from "react";
import AlgaeBiofuelForm from "@/components/AlgaeBiofuelForm";
import GeminiResponse from "@/components/GeminiResponse";
import { processAlgaeData, AlgaeFormData } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Info, Leaf, Droplets, Thermometer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");
  const [hasImage, setHasImage] = useState<boolean>(false);
  const [showInfoTab, setShowInfoTab] = useState<boolean>(true);

  const handleFormSubmit = async (formData: AlgaeFormData) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API Key in the settings tab",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setHasImage(!!formData.image);
    
    try {
      const geminiResponse = await processAlgaeData(formData, apiKey);
      setResponse(geminiResponse);
      
      // Switch to results tab automatically on success
      setShowInfoTab(false);
      
      toast({
        title: "Analysis Complete",
        description: "Recommendations are ready to view",
      });
    } catch (error) {
      console.error("Error:", error);
      
      toast({
        title: "Error Processing Request",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-algae-light/10 to-water-light/10">
      <header className="pt-8 pb-6 px-4 text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-algae-light p-3 rounded-full">
            <Leaf className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-algae-dark to-water-dark bg-clip-text text-transparent">
          Algae Biofuel Advisor
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto mt-2">
          Optimize your algae cultivation for maximum biofuel production using AI-powered recommendations
        </p>
      </header>

      <main className="flex-1 container max-w-5xl px-4 pb-12">
        <Tabs defaultValue={showInfoTab ? "info" : "form"} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="info" onClick={() => setShowInfoTab(true)}>
              <Info className="h-4 w-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="form" onClick={() => setShowInfoTab(false)}>
              <Droplets className="h-4 w-4 mr-2" />
              Cultivation Parameters
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Thermometer className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-algae-light/20 to-water-light/20">
                <CardTitle>Welcome to the Algae Biofuel Advisor</CardTitle>
                <CardDescription>
                  Powered by Google's Gemini AI
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p>
                  This tool helps you optimize algae cultivation for biofuel production by providing
                  AI-powered recommendations based on your specific parameters.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium flex items-center text-algae-dark">
                      <span className="bg-algae-light/20 p-1.5 rounded-full mr-2">
                        <Droplets className="h-4 w-4 text-algae-dark" />
                      </span>
                      Strain Selection
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Get recommended algae strains based on your cultivation parameters
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium flex items-center text-algae-dark">
                      <span className="bg-algae-light/20 p-1.5 rounded-full mr-2">
                        <Leaf className="h-4 w-4 text-algae-dark" />
                      </span>
                      Optimization Tips
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Learn techniques to maximize lipid production and biofuel yield
                    </p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium flex items-center text-algae-dark">
                      <span className="bg-algae-light/20 p-1.5 rounded-full mr-2">
                        <Thermometer className="h-4 w-4 text-algae-dark" />
                      </span>
                      Harvest Planning
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      Get optimal harvesting schedules to maximize your biofuel production
                    </p>
                  </div>
                </div>
                
                <Alert className="mt-6">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Getting Started</AlertTitle>
                  <AlertDescription>
                    To use this tool, you'll need a Google Gemini API key. Go to the Settings tab to enter your key, then 
                    switch to the Cultivation Parameters tab to input your data.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2">
                <AlgaeBiofuelForm onSubmit={handleFormSubmit} isLoading={loading} />
              </div>
              
              <div className="w-full md:w-1/2">
                {response ? (
                  <GeminiResponse response={response} hasImage={hasImage} />
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center border border-dashed border-slate-300">
                    <div className="text-center">
                      <Leaf className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-slate-600">No Results Yet</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        Fill out the form and submit to see algae biofuel recommendations
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader className="bg-gradient-to-r from-algae-light/20 to-water-light/20">
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Configure your Google Gemini API access
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Gemini API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                  />
                  <p className="text-sm text-slate-500">
                    Your API key is stored locally in your browser and never sent to our servers.
                  </p>
                </div>
                
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>How to get a Gemini API Key</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>
                      1. Visit <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
                    </p>
                    <p>
                      2. Sign in with your Google account
                    </p>
                    <p>
                      3. Go to the API keys section and create a new key
                    </p>
                    <p>
                      4. Copy and paste the key here
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="py-4 px-4 text-center text-slate-500 text-sm">
        <p>© 2023 Algae Biofuel Advisor • Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default Index;

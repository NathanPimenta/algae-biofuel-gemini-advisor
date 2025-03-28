
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlgaeBiofuelFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

interface FormData {
  ph: number;
  temperature: number;
  volume: number;
  harvestFrequency: string;
  image: File | null;
}

const AlgaeBiofuelForm: React.FC<AlgaeBiofuelFormProps> = ({ onSubmit, isLoading }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    ph: 7,
    temperature: 25,
    volume: 1000,
    harvestFrequency: "Weekly",
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.ph < 0 || formData.ph > 14) {
      newErrors.ph = "pH must be between 0 and 14";
    }
    
    if (formData.temperature < 0 || formData.temperature > 50) {
      newErrors.temperature = "Temperature must be between 0°C and 50°C";
    }
    
    if (formData.volume <= 0) {
      newErrors.volume = "Volume must be greater than 0";
    }
    
    if (!formData.harvestFrequency) {
      newErrors.harvestFrequency = "Please select a harvest frequency";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    
    if (type === "number") {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      harvestFrequency: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    } else {
      setImagePreview(null);
      setFormData((prev) => ({
        ...prev,
        image: null,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    } else {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-algae-light to-water-light">
        <CardTitle className="text-2xl font-bold text-white">Algae Biofuel Advisor</CardTitle>
        <CardDescription className="text-white/90">
          Enter your cultivation parameters to get expert recommendations
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="ph">Water pH (0-14)</Label>
            <Input
              id="ph"
              name="ph"
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={formData.ph}
              onChange={handleChange}
              className={cn(errors.ph && "border-red-500")}
            />
            {errors.ph && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle size={14} className="mr-1" /> {errors.ph}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              min="0"
              max="50"
              value={formData.temperature}
              onChange={handleChange}
              className={cn(errors.temperature && "border-red-500")}
            />
            {errors.temperature && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle size={14} className="mr-1" /> {errors.temperature}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="volume">Water Volume (Liters)</Label>
            <Input
              id="volume"
              name="volume"
              type="number"
              min="1"
              value={formData.volume}
              onChange={handleChange}
              className={cn(errors.volume && "border-red-500")}
            />
            {errors.volume && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle size={14} className="mr-1" /> {errors.volume}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvestFrequency">Harvest Frequency</Label>
            <Select 
              value={formData.harvestFrequency} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className={cn(errors.harvestFrequency && "border-red-500")}>
                <SelectValue placeholder="Select harvest frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {errors.harvestFrequency && (
              <p className="text-sm text-red-500 flex items-center mt-1">
                <AlertCircle size={14} className="mr-1" /> {errors.harvestFrequency}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Algae Image (Optional)</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => document.getElementById("image")?.click()}
              >
                <Upload size={16} className="mr-2" />
                {formData.image ? 'Change Image' : 'Upload Image'}
              </Button>
              {formData.image && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: null }));
                    setImagePreview(null);
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
            <Input
              id="image"
              name="image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2 relative aspect-video rounded-md overflow-hidden bg-muted">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50">
          <Button 
            type="submit" 
            className="w-full bg-algae hover:bg-algae-dark text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Analyzing...
              </>
            ) : (
              "Get Recommendations"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AlgaeBiofuelForm;

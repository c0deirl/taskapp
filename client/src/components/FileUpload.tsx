import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileImage } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  currentFile?: string;
  label?: string;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "*/*", 
  currentFile, 
  label = "Upload File",
  className = ""
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (accept.startsWith("image/") || accept === "image/*") {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
    onFileSelect(file);
    console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearFile = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    console.log('File cleared');
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        data-testid="input-file-hidden"
      />
      
      {preview && (accept.startsWith("image/") || accept === "image/*") ? (
        <Card className="relative">
          <CardContent className="p-4">
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded-md"
                data-testid="img-file-preview"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={clearFile}
                data-testid="button-clear-file"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="mt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                data-testid="button-change-file"
              >
                Change File
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`transition-colors hover-elevate cursor-pointer ${
            isDragOver ? "border-primary bg-primary/5" : "border-dashed"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          data-testid="card-file-upload"
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className={`rounded-full p-4 mb-4 ${
              isDragOver ? "bg-primary/20" : "bg-muted"
            }`}>
              {accept.startsWith("image/") || accept === "image/*" ? (
                <FileImage className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            
            <h3 className="font-medium mb-2">{label}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop a file here, or click to browse
            </p>
            
            <Button variant="outline" size="sm" data-testid="button-browse-file">
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            
            {accept && (
              <p className="text-xs text-muted-foreground mt-2">
                Accepted: {accept}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
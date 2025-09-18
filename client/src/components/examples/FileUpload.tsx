import { FileUpload } from '../FileUpload';

export default function FileUploadExample() {
  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name, 'Size:', file.size);
  };

  return (
    <div className="p-4 space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Image Upload</h3>
        <FileUpload 
          onFileSelect={handleFileSelect}
          accept="image/*"
          label="Upload Logo"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Any File Upload</h3>
        <FileUpload 
          onFileSelect={handleFileSelect}
          accept="*/*"
          label="Upload Any File"
        />
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Upload, Camera, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

const genAI = new GoogleGenerativeAI('AIzaSyCqLwSGt7fxpCJAeouzXateEMjpTz7a9pM');

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError('');
      setDescription('');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const generateDescription = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError('');
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const base64Data = await convertToBase64(selectedImage);
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: selectedImage.type,
        },
      };

      const prompt = "Describe this image in detail. Include what you see, the colors, composition, mood, and any notable elements or objects present.";
      
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      setDescription(text);
    } catch (err) {
      setError('Failed to analyze the image. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Camera className="h-16 w-16 text-cyan-400 mr-4 drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              AI Photo Analyzer
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Upload any photo and let our advanced AI describe what it sees with 
            <span className="text-cyan-400 font-medium"> incredible detail</span> and 
            <span className="text-purple-400 font-medium"> stunning accuracy</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 p-8 md:p-12">
            {/* Upload Area */}
            <div className="mb-8">
              <div
                className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-500 ${
                  isDragOver
                    ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                    : selectedImage
                    ? 'border-green-400 bg-green-400/10 shadow-lg shadow-green-400/20'
                    : 'border-gray-600 hover:border-purple-400 hover:bg-purple-400/5 hover:shadow-lg hover:shadow-purple-400/10'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="space-y-6">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full max-h-80 rounded-xl shadow-2xl mx-auto border border-gray-600"
                      />
                      <div className="absolute -top-3 -right-3">
                        <CheckCircle className="h-10 w-10 text-green-400 bg-gray-800 rounded-full p-1 shadow-lg" />
                      </div>
                    </div>
                    <p className="text-green-400 font-semibold text-lg">Image uploaded successfully!</p>
                    <button
                      onClick={resetUpload}
                      className="text-gray-400 hover:text-white underline transition-colors duration-300 hover:decoration-purple-400"
                    >
                      Choose a different image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <Upload className="h-20 w-20 text-gray-500 mx-auto animate-bounce" />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-white mb-3">
                        Drag and drop your image here
                      </p>
                      <p className="text-gray-400 mb-6 text-lg">or</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 inline-flex items-center space-x-3 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-1"
                      >
                        <Upload className="h-6 w-6" />
                        <span>Browse Files</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, GIF, WebP (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Generate Button */}
            {selectedImage && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={generateDescription}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 inline-flex items-center space-x-4 shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-2 hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-white"></div>
                      <span>Analyzing Magic...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-7 w-7 animate-pulse" />
                      <span>Generate Description</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-6 bg-red-900/30 border border-red-500/50 rounded-xl flex items-center space-x-4 backdrop-blur-sm">
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-lg">{error}</p>
              </div>
            )}

            {/* Results */}
            {description && (
              <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-gray-600/50 shadow-2xl">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
                  <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    AI Analysis
                  </span>
                </h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap text-lg font-light">
                    {description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm">
            Powered by Google's Gemini AI • Built with React & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
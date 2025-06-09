import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Upload, Camera, Sparkles, AlertCircle, CheckCircle, Zap, Eye, Brain, Stars } from 'lucide-react';

const genAI = new GoogleGenerativeAI('AIzaSyCqLwSGt7fxpCJAeouzXateEMjpTz7a9pM');

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Ultra Dynamic Background */}
      <div className="absolute inset-0">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 via-indigo-900 to-black"></div>
        
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 via-pink-500/20 to-yellow-500/20 animate-gradient-shift"></div>
        
        {/* Multiple Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-complex"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob-complex animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-complex animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob-complex animation-delay-6000"></div>
        
        {/* Radial Gradient Overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient-1 opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-radial-gradient-2 opacity-30 animate-pulse-slow animation-delay-3000"></div>
        
        {/* Dynamic Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid-shift"></div>
        
        {/* Floating Particles System */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full animate-float-complex ${
                i % 4 === 0 ? 'w-3 h-3 bg-cyan-400' :
                i % 4 === 1 ? 'w-2 h-2 bg-purple-400' :
                i % 4 === 2 ? 'w-4 h-4 bg-pink-400' :
                'w-1 h-1 bg-yellow-400'
              } opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 25}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Mouse-Following Spotlight */}
        <div 
          className="absolute w-96 h-96 bg-gradient-radial from-white/10 to-transparent rounded-full pointer-events-none transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
        
        {/* Animated Lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-line-move"
              style={{
                top: `${10 + i * 12}%`,
                width: '100%',
                animationDelay: `${i * 2}s`,
                animationDuration: `${8 + i}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Ultra Stunning Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8 relative">
            <div className="relative group">
              {/* Glowing Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full opacity-30 blur-xl animate-pulse-glow"></div>
              
              {/* Main Icon */}
              <div className="relative bg-gradient-to-r from-gray-900 to-black p-6 rounded-full border border-cyan-400/30 shadow-2xl">
                <Brain className="h-20 w-20 text-cyan-400 animate-pulse-bright" />
                
                {/* Orbiting Icons */}
                <div className="absolute inset-0 animate-spin-slow">
                  <Eye className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-purple-400" />
                  <Sparkles className="absolute top-1/2 -right-2 transform -translate-y-1/2 h-6 w-6 text-pink-400" />
                  <Zap className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-yellow-400" />
                  <Stars className="absolute top-1/2 -left-2 transform -translate-y-1/2 h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 relative">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent animate-gradient-text drop-shadow-2xl">
              AI VISION
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent blur-sm opacity-50 animate-gradient-text"></div>
          </h1>
          
          <div className="relative">
            <p className="text-2xl md:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light mb-4">
              Unleash the power of 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold animate-pulse-text"> advanced AI vision</span> to analyze your photos with 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 font-bold animate-pulse-text"> unprecedented detail</span>
            </p>
            <div className="flex justify-center space-x-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-bounce`} style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Glass Effect */}
        <div className="max-w-6xl mx-auto">
          <div className="relative group">
            {/* Glowing Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"></div>
            
            <div className="relative bg-gray-900/20 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-700/30 p-8 md:p-16 overflow-hidden">
              {/* Internal Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
              
              {/* Upload Area */}
              <div className="relative mb-12">
                <div
                  className={`border-2 border-dashed rounded-3xl p-12 md:p-16 text-center transition-all duration-700 relative overflow-hidden ${
                    isDragOver
                      ? 'border-cyan-400 bg-cyan-400/10 shadow-2xl shadow-cyan-400/30 scale-105'
                      : selectedImage
                      ? 'border-green-400 bg-green-400/10 shadow-2xl shadow-green-400/30'
                      : 'border-gray-600 hover:border-purple-400 hover:bg-purple-400/5 hover:shadow-2xl hover:shadow-purple-400/20 hover:scale-102'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 bg-circuit-pattern opacity-5 animate-circuit-flow"></div>
                  
                  {imagePreview ? (
                    <div className="space-y-8 relative z-10">
                      <div className="relative inline-block group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-cyan-400 rounded-2xl opacity-30 blur-xl animate-pulse-glow"></div>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="relative max-w-full max-h-96 rounded-2xl shadow-2xl mx-auto border-2 border-green-400/50 transform transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute -top-4 -right-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                            <CheckCircle className="relative h-12 w-12 text-green-400 bg-gray-900 rounded-full p-1 shadow-2xl" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <p className="text-green-400 font-bold text-2xl animate-pulse-text">✨ Image Ready for Analysis! ✨</p>
                        <button
                          onClick={resetUpload}
                          className="text-gray-400 hover:text-white underline transition-all duration-300 hover:decoration-purple-400 text-lg hover:scale-110"
                        >
                          Choose a different masterpiece
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 relative z-10">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                        <Upload className="relative h-24 w-24 text-gray-400 mx-auto animate-bounce-complex" />
                      </div>
                      <div className="space-y-6">
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                          Drop Your Visual Masterpiece Here
                        </h3>
                        <p className="text-gray-300 mb-8 text-xl">or embark on your AI journey by</p>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="relative group bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-500 inline-flex items-center space-x-4 shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-3 hover:scale-110 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <Upload className="h-8 w-8 animate-pulse" />
                          <span className="relative z-10">Browse Your Gallery</span>
                        </button>
                      </div>
                      <div className="flex justify-center space-x-4 text-sm text-gray-400">
                        <span className="bg-gray-800/50 px-4 py-2 rounded-full">JPG</span>
                        <span className="bg-gray-800/50 px-4 py-2 rounded-full">PNG</span>
                        <span className="bg-gray-800/50 px-4 py-2 rounded-full">GIF</span>
                        <span className="bg-gray-800/50 px-4 py-2 rounded-full">WebP</span>
                      </div>
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

              {/* Ultra Stunning Generate Button */}
              {selectedImage && (
                <div className="flex justify-center mb-12">
                  <button
                    onClick={generateDescription}
                    disabled={isLoading}
                    className="relative group bg-gradient-to-r from-pink-500 via-purple-600 via-indigo-600 to-cyan-500 hover:from-pink-400 hover:via-purple-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-16 py-8 rounded-3xl font-black text-2xl transition-all duration-700 inline-flex items-center space-x-6 shadow-2xl hover:shadow-purple-500/60 transform hover:-translate-y-4 hover:scale-110 overflow-hidden"
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                        <span className="relative z-10">🔮 AI MAGIC IN PROGRESS...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-10 w-10 animate-pulse-bright" />
                        <span className="relative z-10">🚀 UNLEASH AI VISION</span>
                        <Zap className="h-10 w-10 animate-pulse-bright" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Enhanced Error Message */}
              {error && (
                <div className="mb-8 relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl opacity-30 blur-xl"></div>
                  <div className="relative p-8 bg-red-900/20 border-2 border-red-500/50 rounded-2xl flex items-center space-x-6 backdrop-blur-xl">
                    <AlertCircle className="h-8 w-8 text-red-400 flex-shrink-0 animate-pulse" />
                    <p className="text-red-300 text-xl font-semibold">{error}</p>
                  </div>
                </div>
              )}

              {/* Ultra Enhanced Results */}
              {description && (
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gray-800/40 via-gray-900/40 to-black/40 backdrop-blur-2xl rounded-3xl p-10 md:p-12 border border-gray-600/30 shadow-2xl overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-gradient-shift"></div>
                    
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                        <Brain className="relative h-12 w-12 text-cyan-400 animate-pulse-bright" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AI VISION ANALYSIS
                      </h3>
                      <div className="flex space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <Sparkles key={i} className={`h-8 w-8 text-yellow-400 animate-pulse`} style={{ animationDelay: `${i * 0.3}s` }} />
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 rounded-full"></div>
                      <p className="text-gray-100 leading-relaxed whitespace-pre-wrap text-xl font-light pl-8 relative">
                        {description}
                      </p>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse animation-delay-1000"></div>
                      <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse animation-delay-2000"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-20">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            <Brain className="h-6 w-6 text-purple-400 animate-pulse" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
          </div>
          <p className="text-gray-400 text-lg font-light">
            Powered by <span className="text-cyan-400 font-semibold">Google's Gemini AI</span> • 
            Crafted with <span className="text-purple-400 font-semibold">React & TypeScript</span> • 
            <span className="text-pink-400 font-semibold">Built for the Future</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
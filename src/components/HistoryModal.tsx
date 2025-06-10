import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2, Eye, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type PhotoAnalysis = Database['public']['Tables']['photo_analyses']['Row'];

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function HistoryModal({ isOpen, onClose, user }: HistoryModalProps) {
  const [analyses, setAnalyses] = useState<PhotoAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<PhotoAnalysis | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchAnalyses();
    }
  }, [isOpen, user]);

  const fetchAnalyses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('photo_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('photo_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAnalyses(analyses.filter(analysis => analysis.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative group max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Glowing Border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition-opacity duration-500"></div>
        
        <div className="relative bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-700/30 overflow-hidden">
          {/* Internal Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
          
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-700/30">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Analysis History
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-[70vh]">
            {/* List Panel */}
            <div className="w-1/2 border-r border-gray-700/30 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
                </div>
              ) : analyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Eye className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-xl">No analyses yet</p>
                  <p className="text-sm">Upload and analyze your first photo!</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      onClick={() => setSelectedAnalysis(analysis)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                        selectedAnalysis?.id === analysis.id
                          ? 'border-cyan-400/50 bg-cyan-400/10'
                          : 'border-gray-700/30 bg-gray-800/30 hover:border-purple-400/50 hover:bg-purple-400/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-medium truncate">
                            {analysis.image_name}
                          </h3>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(analysis.created_at)}</span>
                          </div>
                          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                            {analysis.ai_description.substring(0, 100)}...
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAnalysis(analysis.id);
                          }}
                          className="text-gray-400 hover:text-red-400 transition-colors duration-300 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            <div className="w-1/2 overflow-y-auto">
              {selectedAnalysis ? (
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {selectedAnalysis.image_name}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(selectedAnalysis.created_at)}</span>
                      </div>
                    </div>

                    {selectedAnalysis.image_url && (
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl opacity-20 blur-xl"></div>
                        <img
                          src={selectedAnalysis.image_url}
                          alt={selectedAnalysis.image_name}
                          className="relative w-full max-h-64 object-cover rounded-2xl border border-gray-600/50"
                        />
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 rounded-full"></div>
                      <div className="pl-6">
                        <h4 className="text-lg font-semibold text-cyan-400 mb-3">
                          AI Analysis
                        </h4>
                        <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                          {selectedAnalysis.ai_description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Select an analysis</p>
                    <p className="text-sm">Choose from your history to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
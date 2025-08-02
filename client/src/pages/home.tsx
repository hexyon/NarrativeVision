import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Settings, 
  Plus, 
  Clock, 
  Download, 
  Image as ImageIcon,
  Brain,
  Link,
  Upload,
  CloudUpload,
  Tag,
  Flag,
  Mountain,
  Route,
  Cloud,
  Sparkles
} from "lucide-react";
import type { StoryChapter } from "@shared/schema";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all story chapters
  const { data: chapters = [], isLoading } = useQuery<StoryChapter[]>({
    queryKey: ["/api/chapters"],
  });

  // Upload and analyze image mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || error.error || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chapters"] });
      toast({
        title: "Image uploaded successfully!",
        description: "Your story has been updated with a new chapter.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  // Export story mutation
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visual-story-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Story exported successfully!",
        description: "Your story has been downloaded as a JSON file.",
      });
    },
    onError: () => {
      toast({
        title: "Export failed",
        description: "Unable to export your story. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Reset story mutation
  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/chapters', { method: 'DELETE' });
      if (!response.ok) throw new Error('Reset failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chapters"] });
      toast({
        title: "Story reset",
        description: "All chapters have been deleted. Start fresh!",
      });
    },
  });

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('shadow-neu-focus');
    e.currentTarget.classList.remove('shadow-neu-lg');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('shadow-neu-focus');
    e.currentTarget.classList.add('shadow-neu-lg');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('shadow-neu-focus');
    e.currentTarget.classList.add('shadow-neu-lg');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const then = typeof date === 'string' ? new Date(date) : date;
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) === 1 ? '' : 's'} ago`;
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neu-light via-neu-base to-neu-surface">
      {/* Header */}
      <header className="bg-gradient-to-r from-neu-base to-neu-light shadow-neu border-b border-neu-shadow/20 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neu-accent to-neu-accent-light rounded-neu-sm shadow-neu-sm flex items-center justify-center group hover:animate-neu-pulse">
                <Eye className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-neu-accent to-neu-accent-light bg-clip-text text-transparent">
                NarrativeVision
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="px-4 py-2 rounded-neu-sm bg-gradient-to-r from-neu-base to-neu-light shadow-neu-inset">
                <span className="text-sm text-neu-dark font-medium">
                  Stories Created: <span className="font-bold text-neu-accent">{chapters.length}</span>
                </span>
              </div>
              <button
                onClick={() => resetMutation.mutate()}
                className="p-3 rounded-neu-sm bg-gradient-to-br from-neu-base to-neu-light shadow-neu hover:shadow-neu-hover active:shadow-neu-pressed transition-all duration-200 group"
              >
                <Settings className="w-5 h-5 text-neu-dark group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Upload Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-neu-accent mr-3 animate-pulse" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-neu-accent to-neu-accent-light bg-clip-text text-transparent">
                Continue Your Visual Story
              </h2>
              <Sparkles className="w-8 h-8 text-neu-accent ml-3 animate-pulse" />
            </div>
            <p className="text-lg text-neu-dark max-w-3xl mx-auto leading-relaxed">
              Upload images and watch as AI weaves them into an evolving narrative, 
              connecting each moment to create a unique story that grows with every frame.
            </p>
          </div>
          
          {/* Upload Zone */}
          <div 
            className="neu-card p-12 cursor-pointer transition-all duration-300 hover:shadow-neu-xl group"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleFileUpload(file);
              };
              input.click();
            }}
          >
            <div className="text-center">
              {isUploading ? (
                <div className="animate-fade-in">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-neu-accent to-neu-accent-light rounded-full shadow-neu-lg flex items-center justify-center">
                      <Brain className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-neu-accent-light to-neu-accent rounded-full animate-neu-float"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-neu-accent to-neu-accent-light rounded-full animate-neu-float" style={{animationDelay: '1s'}}></div>
                  </div>
                  <h3 className="text-2xl font-bold text-neu-dark mb-3">AI is Analyzing Your Image</h3>
                  <p className="text-neu-dark/80 mb-8 text-lg">Creating connections and weaving your story...</p>
                  <div className="w-48 h-3 bg-gradient-to-r from-neu-base to-neu-light rounded-full mx-auto overflow-hidden shadow-neu-inset">
                    <div className="h-full bg-gradient-to-r from-neu-accent to-neu-accent-light rounded-full animate-neu-pulse w-3/4"></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-neu-accent to-neu-accent-light rounded-full shadow-neu-lg flex items-center justify-center group-hover:animate-neu-float">
                      <CloudUpload className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-neu-accent-light to-neu-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-r from-neu-accent to-neu-accent-light rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-neu-dark mb-3">Upload Your Next Image</h3>
                  <p className="text-neu-dark/80 mb-8 text-lg">Drag and drop an image here, or click to browse</p>
                  <div className="neu-button inline-flex items-center px-8 py-4 text-white font-semibold text-lg bg-gradient-to-r from-neu-accent to-neu-accent-light">
                    <Plus className="w-5 h-5 mr-3" />
                    Choose Image
                  </div>
                  <p className="text-sm text-neu-dark/60 mt-6">Supports JPG, PNG, WebP up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Story Timeline */}
        {isLoading ? (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-12">
              <Skeleton className="h-10 w-64 rounded-neu bg-neu-base shadow-neu-inset" />
              <Skeleton className="h-8 w-40 rounded-neu bg-neu-base shadow-neu-inset" />
            </div>
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="neu-card p-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <Skeleton className="h-8 w-40 rounded-neu bg-neu-base shadow-neu-inset" />
                      <Skeleton className="h-8 w-60 rounded-neu bg-neu-base shadow-neu-inset" />
                      <Skeleton className="h-40 w-full rounded-neu bg-neu-base shadow-neu-inset" />
                    </div>
                    <Skeleton className="h-80 rounded-neu-lg bg-neu-base shadow-neu-inset" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : chapters.length > 0 ? (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-neu-accent to-neu-accent-light bg-clip-text text-transparent">
                Your Evolving Story
              </h3>
              <div className="flex items-center space-x-6">
                <div className="px-4 py-2 rounded-neu-sm bg-gradient-to-r from-neu-base to-neu-light shadow-neu-inset">
                  <span className="text-sm text-neu-dark/80 font-medium">{chapters.length} chapters so far</span>
                </div>
                <button
                  onClick={() => exportMutation.mutate()}
                  disabled={exportMutation.isPending}
                  className="neu-button inline-flex items-center px-6 py-3 text-neu-accent font-semibold bg-gradient-to-r from-neu-base to-neu-light"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Story
                </button>
              </div>
            </div>

            {/* Timeline Container */}
            <div className="space-y-12 relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-neu-accent via-neu-accent-light to-neu-accent rounded-full shadow-neu-sm"></div>
              
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="relative animate-fade-in">
                  {/* Chapter Number Badge */}
                  <div className="absolute left-0 top-8 w-12 h-12 bg-gradient-to-br from-neu-accent to-neu-accent-light rounded-full shadow-neu-lg flex items-center justify-center text-white font-bold text-lg z-10 border-4 border-neu-base">
                    {chapter.chapterNumber}
                  </div>
                  
                  {/* Chapter Content */}
                  <div className="ml-20">
                    <div className="neu-card p-10 hover:shadow-neu-xl transition-all duration-500">
                      <div className={`grid md:grid-cols-2 gap-10 ${index % 2 === 0 ? '' : 'md:grid-flow-col-dense'}`}>
                        <div className={`space-y-6 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                          <div className="flex items-center space-x-3 px-4 py-2 rounded-neu-sm bg-gradient-to-r from-neu-base to-neu-light shadow-neu-inset w-fit">
                            <Clock className="w-4 h-4 text-neu-accent" />
                            <span className="text-sm text-neu-dark font-medium">{formatTimeAgo(chapter.createdAt!)}</span>
                          </div>
                          
                          <h4 className="text-xl font-bold text-neu-dark">
                            Chapter {chapter.chapterNumber}: The Story Continues
                          </h4>
                          
                          <div className="prose prose-slate max-w-none">
                            <div className="p-6 rounded-neu-sm bg-gradient-to-r from-neu-light to-neu-base shadow-neu-inset">
                              <p className="text-neu-dark leading-relaxed text-base">{chapter.narrative}</p>
                            </div>
                          </div>
                          
                          {/* Connections */}
                          {chapter.connections && Array.isArray(chapter.connections) && chapter.connections.length > 0 && (
                            <div className="p-6 rounded-neu-sm bg-gradient-to-r from-neu-accent/10 to-neu-accent-light/10 shadow-neu-inset border-l-4 border-neu-accent">
                              <p className="text-sm text-neu-dark">
                                <Link className="w-4 h-4 text-neu-accent mr-2 inline" />
                                <strong className="text-neu-accent">Connections:</strong> 
                                <span className="ml-2">{chapter.connections.join(', ')}</span>
                              </p>
                            </div>
                          )}
                          
                          {/* Tags */}
                          {chapter.tags && Array.isArray(chapter.tags) && chapter.tags.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-neu-shadow/20">
                              {chapter.tags.map((tag, tagIndex) => (
                                <div key={tagIndex} className="flex items-center px-3 py-1 rounded-neu-sm bg-gradient-to-r from-neu-base to-neu-light shadow-neu-inset">
                                  <Tag className="w-3 h-3 mr-2 text-neu-accent" />
                                  <span className="text-xs font-medium text-neu-dark">{tag}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                          <div className="relative overflow-hidden rounded-neu-lg shadow-neu-lg">
                            <img 
                              src={chapter.imageUrl} 
                              alt={`Chapter ${chapter.chapterNumber}`}
                              className="w-full h-64 md:h-80 object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <section className="text-center py-20">
            <div className="max-w-lg mx-auto">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-neu-base to-neu-light rounded-full shadow-neu-lg flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-neu-dark/40" />
                </div>
                <div className="absolute -top-2 -right-4 w-8 h-8 bg-gradient-to-r from-neu-accent to-neu-accent-light rounded-full animate-neu-float"></div>
                <div className="absolute -bottom-4 -left-2 w-6 h-6 bg-gradient-to-r from-neu-accent-light to-neu-accent rounded-full animate-neu-float" style={{animationDelay: '1.5s'}}></div>
              </div>
              
              <h3 className="text-2xl font-bold text-neu-dark mb-4">Start Your Visual Story</h3>
              <p className="text-neu-dark/80 mb-8 text-lg leading-relaxed">
                Upload your first image to begin an AI-generated narrative that will evolve 
                with each new photo you add, creating connections and building an epic tale.
              </p>
              
              <button 
                className="neu-button inline-flex items-center px-8 py-4 text-white font-semibold text-lg bg-gradient-to-r from-neu-accent to-neu-accent-light"
                onClick={() => {
                  const uploadZone = document.querySelector('[data-upload-zone]');
                  uploadZone?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Plus className="w-5 h-5 mr-3" />
                Upload First Image
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          className="w-16 h-16 bg-gradient-to-br from-neu-accent to-neu-accent-light text-white rounded-full shadow-neu-xl hover:shadow-neu-lg active:shadow-neu-pressed transition-all duration-300 flex items-center justify-center group hover:animate-neu-float"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFileUpload(file);
            };
            input.click();
          }}
        >
          <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}

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
  Cloud
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
    e.currentTarget.classList.add('border-primary');
    e.currentTarget.classList.remove('border-slate-300');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    e.currentTarget.classList.add('border-slate-300');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary');
    e.currentTarget.classList.add('border-slate-300');
    
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/favicon.ico" alt="NarrativeVision" className="w-8 h-8 rounded-lg" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">NarrativeVision</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Stories Created: <span className="font-semibold text-primary">{chapters.length}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetMutation.mutate()}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.84L12 20.53a4.008 4.008 0 0 1-5.66 0L2.81 17c-.78-.79-.78-2.05 0-2.84l10.6-10.6c.79-.78 2.05-.78 2.83 0M4.22 15.58l3.54 3.53c.78.79 2.04.79 2.83 0l3.53-3.53l-4.95-4.95l-4.95 4.95Z"/>
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Continue Your Visual Story</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Upload images and watch as AI weaves them into an evolving narrative, connecting each moment to create a unique story.
            </p>
          </div>
          
          {/* Upload Zone */}
          <Card 
            className="border-2 border-dashed border-slate-300 hover:border-primary transition-colors duration-300 cursor-pointer"
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
            <CardContent className="p-8">
              <div className="text-center">
                {isUploading ? (
                  <div className="animate-pulse">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">AI is Analyzing Your Image</h3>
                    <p className="text-slate-600 mb-6">Creating connections and weaving your story...</p>
                    <div className="w-32 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <CloudUpload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Your Next Image</h3>
                    <p className="text-slate-600 mb-6">Drag and drop an image here, or click to browse</p>
                    <Button className="bg-primary hover:bg-blue-700 text-white shadow-md hover:shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                    <p className="text-sm text-slate-500 mt-4">Supports JPG, PNG, WebP up to 10MB</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Story Timeline */}
        {isLoading ? (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-32 w-full" />
                      </div>
                      <Skeleton className="h-64 md:h-80 rounded-xl" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : chapters.length > 0 ? (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Your Evolving Story</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500">{chapters.length} chapters so far</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportMutation.mutate()}
                  disabled={exportMutation.isPending}
                  className="text-primary hover:text-blue-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export Story
                </Button>
              </div>
            </div>

            {/* Timeline Container */}
            <div className="space-y-8">
              {chapters.map((chapter, index) => (
                <Card key={chapter.id} className="relative overflow-hidden animate-fade-in shadow-lg">
                  <div className="absolute left-6 top-6 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {chapter.chapterNumber}
                  </div>
                  
                  {/* Connection Line */}
                  {index > 0 && (
                    <div className="absolute left-9 -top-4 w-0.5 h-8 bg-gradient-to-b from-primary to-secondary"></div>
                  )}
                  
                  <CardContent className="p-8">
                    <div className={`grid md:grid-cols-2 gap-8 ${index % 2 === 0 ? '' : 'md:grid-flow-col-dense'}`}>
                      <div className={`space-y-4 min-w-0 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(chapter.createdAt!)}</span>
                        </div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          Chapter {chapter.chapterNumber}: The Story Continues
                        </h4>
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-700 leading-relaxed">{chapter.narrative}</p>
                        </div>
                        
                        {/* Connections */}
                        {chapter.connections && Array.isArray(chapter.connections) && chapter.connections.length > 0 && (
                          <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-primary">
                            <p className="text-sm text-slate-600">
                              <Link className="w-4 h-4 text-primary mr-2 inline" />
                              <strong>Connections:</strong> {chapter.connections.join(', ')}
                            </p>
                          </div>
                        )}
                        
                        {/* Tags */}
                        {chapter.tags && Array.isArray(chapter.tags) && chapter.tags.length > 0 && (
                          <div className="pt-4 border-t border-slate-100">
                            <div className="flex flex-wrap items-center gap-2 w-full overflow-visible">
                              {chapter.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs flex-shrink-0 whitespace-nowrap">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className={index % 2 === 0 ? 'md:order-2' : 'md:order-1'}>
                        <img 
                          src={chapter.imageUrl} 
                          alt={`Chapter ${chapter.chapterNumber}`}
                          className="w-full h-64 md:h-80 object-cover rounded-xl shadow-md"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Start Your Visual Story</h3>
              <p className="text-slate-600 mb-6">
                Upload your first image to begin an AI-generated narrative that will evolve with each new photo you add.
              </p>
              <Button 
                className="bg-primary hover:bg-blue-700 text-white"
                onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload First Image
              </Button>
            </div>
          </section>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="w-14 h-14 bg-gradient-to-br from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl"
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
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

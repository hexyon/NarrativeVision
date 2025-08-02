import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertStoryChapterSchema } from "@shared/schema";
import { analyzeImageWithContext } from "./openai";
import { ObjectStorageService } from "./objectStorage";
import multer from "multer";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all story chapters for the current session (simplified without auth)
  app.get("/api/chapters", async (req, res) => {
    try {
      const chapters = await storage.getAllChapters();
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ 
        error: "Failed to fetch chapters",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get upload URL for image
  app.post("/api/upload-url", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ 
        error: "Failed to get upload URL",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Analyze uploaded image and create story chapter
  app.post("/api/analyze-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageBuffer = req.file.buffer;
      const base64Image = imageBuffer.toString('base64');

      // Get previous chapters for context
      const previousChapters = await storage.getAllChapters();
      const contextChapters = previousChapters.map(chapter => ({
        narrative: chapter.narrative,
        tags: chapter.tags as string[],
        chapterNumber: chapter.chapterNumber
      }));

      // Analyze image with AI
      const analysis = await analyzeImageWithContext(base64Image, contextChapters);

      // For now, we'll use a data URL for the image since we're doing direct upload
      // In a real implementation, you'd upload to object storage first
      const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

      // Create new chapter
      const newChapter = await storage.createChapter({
        userId: null, // No auth for now
        imageUrl,
        narrative: analysis.narrative,
        connections: analysis.connections,
        tags: analysis.tags,
        chapterNumber: previousChapters.length + 1
      });

      res.json(newChapter);
    } catch (error) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ 
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Alternative endpoint for URL-based image upload (for object storage integration)
  app.post("/api/chapters", async (req, res) => {
    try {
      const body = z.object({
        imageUrl: z.string().url(),
        base64Image: z.string().optional()
      }).parse(req.body);

      let base64Image = body.base64Image;
      
      // If no base64 provided, fetch the image
      if (!base64Image && body.imageUrl.startsWith('http')) {
        const response = await fetch(body.imageUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch image from URL');
        }
        const buffer = await response.arrayBuffer();
        base64Image = Buffer.from(buffer).toString('base64');
      }

      if (!base64Image) {
        return res.status(400).json({ error: "Unable to process image" });
      }

      // Get previous chapters for context
      const previousChapters = await storage.getAllChapters();
      const contextChapters = previousChapters.map(chapter => ({
        narrative: chapter.narrative,
        tags: chapter.tags as string[],
        chapterNumber: chapter.chapterNumber
      }));

      // Analyze image with AI
      const analysis = await analyzeImageWithContext(base64Image, contextChapters);

      // Create new chapter
      const newChapter = await storage.createChapter({
        userId: null, // No auth for now
        imageUrl: body.imageUrl,
        narrative: analysis.narrative,
        connections: analysis.connections,
        tags: analysis.tags,
        chapterNumber: previousChapters.length + 1
      });

      res.json(newChapter);
    } catch (error) {
      console.error("Error creating chapter:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request data",
          details: error.errors
        });
      }
      res.status(500).json({ 
        error: "Failed to create chapter",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete all chapters (reset story)
  app.delete("/api/chapters", async (req, res) => {
    try {
      await storage.deleteAllChapters();
      res.json({ message: "All chapters deleted successfully" });
    } catch (error) {
      console.error("Error deleting chapters:", error);
      res.status(500).json({ 
        error: "Failed to delete chapters",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Export story as JSON
  app.get("/api/export", async (req, res) => {
    try {
      const chapters = await storage.getAllChapters();
      const storyData = {
        title: `Visual Story - ${chapters.length} Chapters`,
        createdAt: new Date().toISOString(),
        chapters: chapters.map(chapter => ({
          chapterNumber: chapter.chapterNumber,
          narrative: chapter.narrative,
          connections: chapter.connections,
          tags: chapter.tags,
          createdAt: chapter.createdAt
        }))
      };

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="visual-story-${Date.now()}.json"`);
      res.json(storyData);
    } catch (error) {
      console.error("Error exporting story:", error);
      res.status(500).json({ 
        error: "Failed to export story",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

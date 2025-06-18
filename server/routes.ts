import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProjectSchema, insertAudioFileSchema, insertVideoFileSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Audio Files
  app.get("/api/audio-files", async (req, res) => {
    try {
      const audioFiles = await storage.getAudioFiles();
      res.json(audioFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audio files" });
    }
  });

  app.post("/api/audio-files", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const audioFileData = {
        name: req.body.name || req.file.originalname,
        originalName: req.file.originalname,
        path: req.file.path,
        duration: parseInt(req.body.duration) || null,
        bpm: req.body.bpm ? parseInt(req.body.bpm) : null,
        key: req.body.key || null,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const validatedData = insertAudioFileSchema.parse(audioFileData);
      const audioFile = await storage.createAudioFile(validatedData);
      res.status(201).json(audioFile);
    } catch (error) {
      res.status(400).json({ message: "Invalid audio file data" });
    }
  });

  app.get("/api/audio-files/:id/stream", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audioFile = await storage.getAudioFile(id);
      if (!audioFile) {
        return res.status(404).json({ message: "Audio file not found" });
      }

      if (!fs.existsSync(audioFile.path)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.setHeader('Content-Type', audioFile.mimeType);
      res.setHeader('Content-Length', audioFile.size);
      
      const stream = fs.createReadStream(audioFile.path);
      stream.pipe(res);
    } catch (error) {
      res.status(500).json({ message: "Failed to stream audio file" });
    }
  });

  // Video Files
  app.get("/api/video-files", async (req, res) => {
    try {
      const videoFiles = await storage.getVideoFiles();
      res.json(videoFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video files" });
    }
  });

  app.post("/api/video-files", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const videoFileData = {
        name: req.body.name || req.file.originalname,
        originalName: req.file.originalname,
        path: req.file.path,
        duration: parseInt(req.body.duration) || null,
        width: req.body.width ? parseInt(req.body.width) : null,
        height: req.body.height ? parseInt(req.body.height) : null,
        mimeType: req.file.mimetype,
        size: req.file.size,
      };

      const validatedData = insertVideoFileSchema.parse(videoFileData);
      const videoFile = await storage.createVideoFile(validatedData);
      res.status(201).json(videoFile);
    } catch (error) {
      res.status(400).json({ message: "Invalid video file data" });
    }
  });

  // Export endpoints
  app.post("/api/export/audio/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // TODO: Implement audio export logic
      res.json({ message: "Audio export started", projectId });
    } catch (error) {
      res.status(500).json({ message: "Failed to export audio" });
    }
  });

  app.post("/api/export/video/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // TODO: Implement video export logic
      res.json({ message: "Video export started", projectId });
    } catch (error) {
      res.status(500).json({ message: "Failed to export video" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

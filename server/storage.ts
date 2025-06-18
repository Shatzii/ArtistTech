import { projects, audioFiles, videoFiles, type Project, type AudioFile, type VideoFile, type InsertProject, type InsertAudioFile, type InsertVideoFile } from "@shared/schema";

export interface IStorage {
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Audio Files
  getAudioFile(id: number): Promise<AudioFile | undefined>;
  getAudioFiles(): Promise<AudioFile[]>;
  createAudioFile(audioFile: InsertAudioFile): Promise<AudioFile>;
  deleteAudioFile(id: number): Promise<boolean>;

  // Video Files
  getVideoFile(id: number): Promise<VideoFile | undefined>;
  getVideoFiles(): Promise<VideoFile[]>;
  createVideoFile(videoFile: InsertVideoFile): Promise<VideoFile>;
  deleteVideoFile(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private projects: Map<number, Project>;
  private audioFiles: Map<number, AudioFile>;
  private videoFiles: Map<number, VideoFile>;
  private currentProjectId: number;
  private currentAudioFileId: number;
  private currentVideoFileId: number;

  constructor() {
    this.projects = new Map();
    this.audioFiles = new Map();
    this.videoFiles = new Map();
    this.currentProjectId = 1;
    this.currentAudioFileId = 1;
    this.currentVideoFileId = 1;
  }

  // Projects
  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const existing = this.projects.get(id);
    if (!existing) return undefined;

    const updated: Project = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Audio Files
  async getAudioFile(id: number): Promise<AudioFile | undefined> {
    return this.audioFiles.get(id);
  }

  async getAudioFiles(): Promise<AudioFile[]> {
    return Array.from(this.audioFiles.values());
  }

  async createAudioFile(insertAudioFile: InsertAudioFile): Promise<AudioFile> {
    const id = this.currentAudioFileId++;
    const audioFile: AudioFile = {
      ...insertAudioFile,
      id,
      createdAt: new Date(),
    };
    this.audioFiles.set(id, audioFile);
    return audioFile;
  }

  async deleteAudioFile(id: number): Promise<boolean> {
    return this.audioFiles.delete(id);
  }

  // Video Files
  async getVideoFile(id: number): Promise<VideoFile | undefined> {
    return this.videoFiles.get(id);
  }

  async getVideoFiles(): Promise<VideoFile[]> {
    return Array.from(this.videoFiles.values());
  }

  async createVideoFile(insertVideoFile: InsertVideoFile): Promise<VideoFile> {
    const id = this.currentVideoFileId++;
    const videoFile: VideoFile = {
      ...insertVideoFile,
      id,
      createdAt: new Date(),
    };
    this.videoFiles.set(id, videoFile);
    return videoFile;
  }

  async deleteVideoFile(id: number): Promise<boolean> {
    return this.videoFiles.delete(id);
  }
}

export const storage = new MemStorage();

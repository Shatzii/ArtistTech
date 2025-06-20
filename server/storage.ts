import { 
  projects, 
  audioFiles, 
  videoFiles, 
  teachers, 
  students, 
  lessons, 
  exercises, 
  voiceCommands,
  chatMessages,
  lessonRecordings,
  studentProgress,
  type Project, 
  type AudioFile, 
  type VideoFile, 
  type Teacher,
  type Student,
  type Lesson,
  type Exercise,
  type VoiceCommand,
  type ChatMessage,
  type InsertProject, 
  type InsertAudioFile, 
  type InsertVideoFile,
  type InsertTeacher,
  type InsertStudent,
  type InsertLesson,
  type InsertExercise,
  type InsertVoiceCommand,
  type InsertChatMessage
} from "@shared/schema";

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

  // Educational System
  // Teachers
  getTeacher(id: number): Promise<Teacher | undefined>;
  getTeachers(): Promise<Teacher[]>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  updateTeacher(id: number, teacher: Partial<InsertTeacher>): Promise<Teacher | undefined>;
  deleteTeacher(id: number): Promise<boolean>;

  // Students
  getStudent(id: number): Promise<Student | undefined>;
  getStudents(): Promise<Student[]>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: number, student: Partial<InsertStudent>): Promise<Student | undefined>;
  deleteStudent(id: number): Promise<boolean>;

  // Lessons
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessons(): Promise<Lesson[]>;
  getLessonsByTeacher(teacherId: number): Promise<Lesson[]>;
  getLessonsByStudent(studentId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, lesson: Partial<InsertLesson>): Promise<Lesson | undefined>;
  deleteLesson(id: number): Promise<boolean>;

  // Exercises
  getExercise(id: number): Promise<Exercise | undefined>;
  getExercises(): Promise<Exercise[]>;
  getExercisesByInstrument(instrument: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: number, exercise: Partial<InsertExercise>): Promise<Exercise | undefined>;
  deleteExercise(id: number): Promise<boolean>;

  // Voice Commands
  getVoiceCommandsByLesson(lessonId: number): Promise<VoiceCommand[]>;
  createVoiceCommand(command: InsertVoiceCommand): Promise<VoiceCommand>;

  // Chat Messages
  getChatMessagesByLesson(lessonId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {

  // Basic implementations to get platform functional
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: number, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db.update(projects).set(updateData).where(eq(projects.id, id)).returning();
    return project;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  async getAudioFile(id: number): Promise<AudioFile | undefined> {
    const [audioFile] = await db.select().from(audioFiles).where(eq(audioFiles.id, id));
    return audioFile;
  }

  async getAudioFiles(): Promise<AudioFile[]> {
    return await db.select().from(audioFiles);
  }

  async createAudioFile(insertAudioFile: InsertAudioFile): Promise<AudioFile> {
    const [audioFile] = await db.insert(audioFiles).values(insertAudioFile).returning();
    return audioFile;
  }

  async deleteAudioFile(id: number): Promise<boolean> {
    const result = await db.delete(audioFiles).where(eq(audioFiles.id, id));
    return result.rowCount > 0;
  }

  async getVideoFile(id: number): Promise<VideoFile | undefined> {
    const [videoFile] = await db.select().from(videoFiles).where(eq(videoFiles.id, id));
    return videoFile;
  }

  async getVideoFiles(): Promise<VideoFile[]> {
    return await db.select().from(videoFiles);
  }

  async createVideoFile(insertVideoFile: InsertVideoFile): Promise<VideoFile> {
    const [videoFile] = await db.insert(videoFiles).values(insertVideoFile).returning();
    return videoFile;
  }

  async deleteVideoFile(id: number): Promise<boolean> {
    const result = await db.delete(videoFiles).where(eq(videoFiles.id, id));
    return result.rowCount > 0;
  }

  async getTeacher(id: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.id, id));
    return teacher;
  }

  async getTeachers(): Promise<Teacher[]> {
    return await db.select().from(teachers);
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const [teacher] = await db.insert(teachers).values(insertTeacher).returning();
    return teacher;
  }

  async updateTeacher(id: number, updateData: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const [teacher] = await db.update(teachers).set(updateData).where(eq(teachers.id, id)).returning();
    return teacher;
  }

  async deleteTeacher(id: number): Promise<boolean> {
    const result = await db.delete(teachers).where(eq(teachers.id, id));
    return result.rowCount > 0;
  }

  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student;
  }

  async getStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db.insert(students).values(insertStudent).returning();
    return student;
  }

  async updateStudent(id: number, updateData: Partial<InsertStudent>): Promise<Student | undefined> {
    const [student] = await db.update(students).set(updateData).where(eq(students.id, id)).returning();
    return student;
  }

  async deleteStudent(id: number): Promise<boolean> {
    const result = await db.delete(students).where(eq(students.id, id));
    return result.rowCount > 0;
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async getLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons);
  }

  async getLessonsByTeacher(teacherId: number): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.teacherId, teacherId));
  }

  async getLessonsByStudent(studentId: number): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.studentId, studentId));
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db.insert(lessons).values(insertLesson).returning();
    return lesson;
  }

  async updateLesson(id: number, updateData: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const [lesson] = await db.update(lessons).set(updateData).where(eq(lessons.id, id)).returning();
    return lesson;
  }

  async deleteLesson(id: number): Promise<boolean> {
    const result = await db.delete(lessons).where(eq(lessons.id, id));
    return result.rowCount > 0;
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }

  async getExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }

  async getExercisesByInstrument(instrument: string): Promise<Exercise[]> {
    return await db.select().from(exercises).where(eq(exercises.instrument, instrument));
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db.insert(exercises).values(insertExercise).returning();
    return exercise;
  }

  async updateExercise(id: number, updateData: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const [exercise] = await db.update(exercises).set(updateData).where(eq(exercises.id, id)).returning();
    return exercise;
  }

  async deleteExercise(id: number): Promise<boolean> {
    const result = await db.delete(exercises).where(eq(exercises.id, id));
    return result.rowCount > 0;
  }

  async getVoiceCommandsByLesson(lessonId: number): Promise<VoiceCommand[]> {
    return await db.select().from(voiceCommands).where(eq(voiceCommands.lessonId, lessonId));
  }

  async createVoiceCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const [command] = await db.insert(voiceCommands).values(insertCommand).returning();
    return command;
  }

  async getChatMessagesByLesson(lessonId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.lessonId, lessonId));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    this.videoFiles = new Map();
    this.teachers = new Map();
    this.students = new Map();
    this.lessons = new Map();
    this.exercises = new Map();
    this.voiceCommands = new Map();
    this.chatMessages = new Map();
    this.currentProjectId = 1;
    this.currentAudioFileId = 1;
    this.currentVideoFileId = 1;
    this.currentTeacherId = 1;
    this.currentStudentId = 1;
    this.currentLessonId = 1;
    this.currentExerciseId = 1;
    this.currentVoiceCommandId = 1;
    this.currentChatMessageId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample teacher
    const sampleTeacher: Teacher = {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@musicteacher.com",
      profileImageUrl: null,
      bio: "Professional piano instructor with 15 years of experience teaching young musicians.",
      specialization: "piano",
      createdAt: new Date(),
    };
    this.teachers.set(1, sampleTeacher);
    this.currentTeacherId = 2;

    // Sample student
    const sampleStudent: Student = {
      id: 1,
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      age: 12,
      parentEmail: "parent@email.com",
      level: "beginner",
      instrument: "piano",
      createdAt: new Date(),
    };
    this.students.set(1, sampleStudent);
    this.currentStudentId = 2;

    // Sample exercises
    const pianoExercise: Exercise = {
      id: 1,
      title: "C Major Scale Practice",
      description: "Learn to play the C major scale with proper fingering",
      difficulty: "easy",
      instrument: "piano",
      audioPath: null,
      sheetMusicPath: null,
      instructions: "Start with your right thumb on C. Play each note clearly and evenly.",
      voiceCommands: ["play scale", "stop", "slower", "faster", "repeat"],
      createdAt: new Date(),
    };
    this.exercises.set(1, pianoExercise);
    this.currentExerciseId = 2;
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
      duration: insertAudioFile.duration ?? null,
      bpm: insertAudioFile.bpm ?? null,
      key: insertAudioFile.key ?? null,
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
      duration: insertVideoFile.duration ?? null,
      width: insertVideoFile.width ?? null,
      height: insertVideoFile.height ?? null,
      createdAt: new Date(),
    };
    this.videoFiles.set(id, videoFile);
    return videoFile;
  }

  async deleteVideoFile(id: number): Promise<boolean> {
    return this.videoFiles.delete(id);
  }

  // Teachers
  async getTeacher(id: number): Promise<Teacher | undefined> {
    return this.teachers.get(id);
  }

  async getTeachers(): Promise<Teacher[]> {
    return Array.from(this.teachers.values());
  }

  async createTeacher(insertTeacher: InsertTeacher): Promise<Teacher> {
    const id = this.currentTeacherId++;
    const teacher: Teacher = {
      ...insertTeacher,
      id,
      profileImageUrl: insertTeacher.profileImageUrl ?? null,
      bio: insertTeacher.bio ?? null,
      specialization: insertTeacher.specialization ?? null,
      createdAt: new Date(),
    };
    this.teachers.set(id, teacher);
    return teacher;
  }

  async updateTeacher(id: number, updateData: Partial<InsertTeacher>): Promise<Teacher | undefined> {
    const existing = this.teachers.get(id);
    if (!existing) return undefined;

    const updated: Teacher = {
      ...existing,
      ...updateData,
    };
    this.teachers.set(id, updated);
    return updated;
  }

  async deleteTeacher(id: number): Promise<boolean> {
    return this.teachers.delete(id);
  }

  // Students
  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentStudentId++;
    const student: Student = {
      ...insertStudent,
      id,
      age: insertStudent.age ?? null,
      parentEmail: insertStudent.parentEmail ?? null,
      level: insertStudent.level ?? "beginner",
      instrument: insertStudent.instrument ?? null,
      createdAt: new Date(),
    };
    this.students.set(id, student);
    return student;
  }

  async updateStudent(id: number, updateData: Partial<InsertStudent>): Promise<Student | undefined> {
    const existing = this.students.get(id);
    if (!existing) return undefined;

    const updated: Student = {
      ...existing,
      ...updateData,
    };
    this.students.set(id, updated);
    return updated;
  }

  async deleteStudent(id: number): Promise<boolean> {
    return this.students.delete(id);
  }

  // Lessons
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }

  async getLessonsByTeacher(teacherId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(lesson => lesson.teacherId === teacherId);
  }

  async getLessonsByStudent(studentId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(lesson => lesson.studentId === studentId);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentLessonId++;
    const lesson: Lesson = {
      ...insertLesson,
      id,
      status: insertLesson.status ?? "scheduled",
      duration: insertLesson.duration ?? 30,
      description: insertLesson.description ?? null,
      recordingPath: insertLesson.recordingPath ?? null,
      notes: insertLesson.notes ?? null,
      createdAt: new Date(),
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async updateLesson(id: number, updateData: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const existing = this.lessons.get(id);
    if (!existing) return undefined;

    const updated: Lesson = {
      ...existing,
      ...updateData,
    };
    this.lessons.set(id, updated);
    return updated;
  }

  async deleteLesson(id: number): Promise<boolean> {
    return this.lessons.delete(id);
  }

  // Exercises
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByInstrument(instrument: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(exercise => exercise.instrument === instrument);
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.currentExerciseId++;
    const exercise: Exercise = {
      ...insertExercise,
      id,
      description: insertExercise.description ?? null,
      audioPath: insertExercise.audioPath ?? null,
      sheetMusicPath: insertExercise.sheetMusicPath ?? null,
      instructions: insertExercise.instructions ?? null,
      voiceCommands: insertExercise.voiceCommands ?? null,
      createdAt: new Date(),
    };
    this.exercises.set(id, exercise);
    return exercise;
  }

  async updateExercise(id: number, updateData: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const existing = this.exercises.get(id);
    if (!existing) return undefined;

    const updated: Exercise = {
      ...existing,
      ...updateData,
    };
    this.exercises.set(id, updated);
    return updated;
  }

  async deleteExercise(id: number): Promise<boolean> {
    return this.exercises.delete(id);
  }

  // Voice Commands
  async getVoiceCommandsByLesson(lessonId: number): Promise<VoiceCommand[]> {
    return Array.from(this.voiceCommands.values()).filter(cmd => cmd.lessonId === lessonId);
  }

  async createVoiceCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const id = this.currentVoiceCommandId++;
    const command: VoiceCommand = {
      ...insertCommand,
      id,
      recognized: insertCommand.recognized ?? null,
      confidence: insertCommand.confidence ?? null,
      executed: insertCommand.executed ?? false,
      result: insertCommand.result ?? null,
    };
    this.voiceCommands.set(id, command);
    return command;
  }

  // Chat Messages
  async getChatMessagesByLesson(lessonId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(msg => msg.lessonId === lessonId);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const message: ChatMessage = {
      ...insertMessage,
      id,
      type: insertMessage.type ?? "text",
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new DatabaseStorage();

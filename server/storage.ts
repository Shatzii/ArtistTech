import { 
  users,
  projects, 
  audioFiles, 
  videoFiles,
  cmsSettings,
  cmsPages,
  cmsFeatures,
  cmsMedia,
  cmsNavigation,
  type User,
  type Project, 
  type AudioFile, 
  type VideoFile,
  type CmsSetting,
  type CmsPage,
  type CmsFeature,
  type CmsMedia,
  type CmsNavigation,
  type InsertUser,
  type InsertProject, 
  type InsertAudioFile, 
  type InsertVideoFile,
  type InsertCmsSetting,
  type InsertCmsPage,
  type InsertCmsFeature,
  type InsertCmsMedia,
  type InsertCmsNavigation
} from "../shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  // Audio Files
  getAudioFile(id: number): Promise<AudioFile | undefined>;
  getAudioFiles(): Promise<AudioFile[]>;
  getUserAudioFiles(userId: number): Promise<AudioFile[]>;
  createAudioFile(audioFile: InsertAudioFile): Promise<AudioFile>;
  deleteAudioFile(id: number): Promise<boolean>;

  // Video Files
  getVideoFile(id: number): Promise<VideoFile | undefined>;
  getVideoFiles(): Promise<VideoFile[]>;
  createVideoFile(videoFile: InsertVideoFile): Promise<VideoFile>;
  deleteVideoFile(id: number): Promise<boolean>;

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

  // CMS Settings
  getCmsSetting(key: string): Promise<CmsSetting | undefined>;
  getCmsSettings(): Promise<CmsSetting[]>;
  getCmsSettingsByCategory(category: string): Promise<CmsSetting[]>;
  createCmsSetting(setting: InsertCmsSetting): Promise<CmsSetting>;
  updateCmsSetting(id: number, setting: Partial<InsertCmsSetting>): Promise<CmsSetting | undefined>;
  deleteCmsSetting(id: number): Promise<boolean>;

  // CMS Pages
  getCmsPage(id: number): Promise<CmsPage | undefined>;
  getCmsPageBySlug(slug: string): Promise<CmsPage | undefined>;
  getCmsPages(): Promise<CmsPage[]>;
  getPublishedCmsPages(): Promise<CmsPage[]>;
  createCmsPage(page: InsertCmsPage): Promise<CmsPage>;
  updateCmsPage(id: number, page: Partial<InsertCmsPage>): Promise<CmsPage | undefined>;
  deleteCmsPage(id: number): Promise<boolean>;

  // CMS Features
  getCmsFeature(id: number): Promise<CmsFeature | undefined>;
  getCmsFeatureByKey(key: string): Promise<CmsFeature | undefined>;
  getCmsFeatures(): Promise<CmsFeature[]>;
  getEnabledCmsFeatures(): Promise<CmsFeature[]>;
  getCmsFeaturesByCategory(category: string): Promise<CmsFeature[]>;
  createCmsFeature(feature: InsertCmsFeature): Promise<CmsFeature>;
  updateCmsFeature(id: number, feature: Partial<InsertCmsFeature>): Promise<CmsFeature | undefined>;
  deleteCmsFeature(id: number): Promise<boolean>;

  // CMS Media
  getCmsMedia(id: number): Promise<CmsMedia | undefined>;
  getCmsMediaList(): Promise<CmsMedia[]>;
  getPublicCmsMedia(): Promise<CmsMedia[]>;
  createCmsMedia(media: InsertCmsMedia): Promise<CmsMedia>;
  updateCmsMedia(id: number, media: Partial<InsertCmsMedia>): Promise<CmsMedia | undefined>;
  deleteCmsMedia(id: number): Promise<boolean>;

  // CMS Navigation
  getCmsNavigation(id: number): Promise<CmsNavigation | undefined>;
  getCmsNavigationList(): Promise<CmsNavigation[]>;
  getActiveCmsNavigation(): Promise<CmsNavigation[]>;
  createCmsNavigation(nav: InsertCmsNavigation): Promise<CmsNavigation>;
  updateCmsNavigation(id: number, nav: Partial<InsertCmsNavigation>): Promise<CmsNavigation | undefined>;
  deleteCmsNavigation(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Projects
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
    return (result.rowCount ?? 0) > 0;
  }

  // Audio Files
  async getAudioFile(id: number): Promise<AudioFile | undefined> {
    const [audioFile] = await db.select().from(audioFiles).where(eq(audioFiles.id, id));
    return audioFile;
  }

  async getAudioFiles(): Promise<AudioFile[]> {
    return await db.select().from(audioFiles);
  }

  async getUserAudioFiles(userId: number): Promise<AudioFile[]> {
    return await db.select().from(audioFiles).where(eq(audioFiles.userId, userId));
  }

  async createAudioFile(insertAudioFile: InsertAudioFile): Promise<AudioFile> {
    const [audioFile] = await db.insert(audioFiles).values(insertAudioFile).returning();
    return audioFile;
  }

  async deleteAudioFile(id: number): Promise<boolean> {
    const result = await db.delete(audioFiles).where(eq(audioFiles.id, id));
    return result.rowCount > 0;
  }

  // Video Files
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

  // Teachers
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

  // Students
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

  // Lessons
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

  // Exercises
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

  // Voice Commands
  async getVoiceCommandsByLesson(lessonId: number): Promise<VoiceCommand[]> {
    return await db.select().from(voiceCommands).where(eq(voiceCommands.lessonId, lessonId));
  }

  async createVoiceCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const [command] = await db.insert(voiceCommands).values(insertCommand).returning();
    return command;
  }

  // Chat Messages
  async getChatMessagesByLesson(lessonId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.lessonId, lessonId));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }

  // CMS Settings implementation
  async getCmsSetting(key: string): Promise<CmsSetting | undefined> {
    const [setting] = await db.select().from(cmsSettings).where(eq(cmsSettings.key, key));
    return setting;
  }

  async getCmsSettings(): Promise<CmsSetting[]> {
    return await db.select().from(cmsSettings);
  }

  async getCmsSettingsByCategory(category: string): Promise<CmsSetting[]> {
    return await db.select().from(cmsSettings).where(eq(cmsSettings.category, category));
  }

  async createCmsSetting(setting: InsertCmsSetting): Promise<CmsSetting> {
    const [newSetting] = await db.insert(cmsSettings).values(setting).returning();
    return newSetting;
  }

  async updateCmsSetting(id: number, setting: Partial<InsertCmsSetting>): Promise<CmsSetting | undefined> {
    const [updated] = await db.update(cmsSettings).set(setting).where(eq(cmsSettings.id, id)).returning();
    return updated;
  }

  async deleteCmsSetting(id: number): Promise<boolean> {
    const result = await db.delete(cmsSettings).where(eq(cmsSettings.id, id));
    return (result.rowCount || 0) > 0;
  }

  // CMS Pages implementation
  async getCmsPage(id: number): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.id, id));
    return page;
  }

  async getCmsPageBySlug(slug: string): Promise<CmsPage | undefined> {
    const [page] = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug));
    return page;
  }

  async getCmsPages(): Promise<CmsPage[]> {
    return await db.select().from(cmsPages);
  }

  async getPublishedCmsPages(): Promise<CmsPage[]> {
    return await db.select().from(cmsPages).where(eq(cmsPages.status, 'published'));
  }

  async createCmsPage(page: InsertCmsPage): Promise<CmsPage> {
    const [newPage] = await db.insert(cmsPages).values(page).returning();
    return newPage;
  }

  async updateCmsPage(id: number, page: Partial<InsertCmsPage>): Promise<CmsPage | undefined> {
    const [updated] = await db.update(cmsPages).set(page).where(eq(cmsPages.id, id)).returning();
    return updated;
  }

  async deleteCmsPage(id: number): Promise<boolean> {
    const result = await db.delete(cmsPages).where(eq(cmsPages.id, id));
    return (result.rowCount || 0) > 0;
  }

  // CMS Features implementation
  async getCmsFeature(id: number): Promise<CmsFeature | undefined> {
    const [feature] = await db.select().from(cmsFeatures).where(eq(cmsFeatures.id, id));
    return feature;
  }

  async getCmsFeatureByKey(key: string): Promise<CmsFeature | undefined> {
    const [feature] = await db.select().from(cmsFeatures).where(eq(cmsFeatures.key, key));
    return feature;
  }

  async getCmsFeatures(): Promise<CmsFeature[]> {
    return await db.select().from(cmsFeatures);
  }

  async getEnabledCmsFeatures(): Promise<CmsFeature[]> {
    return await db.select().from(cmsFeatures).where(eq(cmsFeatures.isEnabled, true));
  }

  async getCmsFeaturesByCategory(category: string): Promise<CmsFeature[]> {
    return await db.select().from(cmsFeatures).where(eq(cmsFeatures.category, category));
  }

  async createCmsFeature(feature: InsertCmsFeature): Promise<CmsFeature> {
    const [newFeature] = await db.insert(cmsFeatures).values(feature).returning();
    return newFeature;
  }

  async updateCmsFeature(id: number, feature: Partial<InsertCmsFeature>): Promise<CmsFeature | undefined> {
    const [updated] = await db.update(cmsFeatures).set(feature).where(eq(cmsFeatures.id, id)).returning();
    return updated;
  }

  async deleteCmsFeature(id: number): Promise<boolean> {
    const result = await db.delete(cmsFeatures).where(eq(cmsFeatures.id, id));
    return (result.rowCount || 0) > 0;
  }

  // CMS Media implementation
  async getCmsMedia(id: number): Promise<CmsMedia | undefined> {
    const [media] = await db.select().from(cmsMedia).where(eq(cmsMedia.id, id));
    return media;
  }

  async getCmsMediaList(): Promise<CmsMedia[]> {
    return await db.select().from(cmsMedia);
  }

  async getPublicCmsMedia(): Promise<CmsMedia[]> {
    return await db.select().from(cmsMedia).where(eq(cmsMedia.isPublic, true));
  }

  async createCmsMedia(media: InsertCmsMedia): Promise<CmsMedia> {
    const [newMedia] = await db.insert(cmsMedia).values(media).returning();
    return newMedia;
  }

  async updateCmsMedia(id: number, media: Partial<InsertCmsMedia>): Promise<CmsMedia | undefined> {
    const [updated] = await db.update(cmsMedia).set(media).where(eq(cmsMedia.id, id)).returning();
    return updated;
  }

  async deleteCmsMedia(id: number): Promise<boolean> {
    const result = await db.delete(cmsMedia).where(eq(cmsMedia.id, id));
    return (result.rowCount || 0) > 0;
  }

  // CMS Navigation implementation
  async getCmsNavigation(id: number): Promise<CmsNavigation | undefined> {
    const [nav] = await db.select().from(cmsNavigation).where(eq(cmsNavigation.id, id));
    return nav;
  }

  async getCmsNavigationList(): Promise<CmsNavigation[]> {
    return await db.select().from(cmsNavigation);
  }

  async getActiveCmsNavigation(): Promise<CmsNavigation[]> {
    return await db.select().from(cmsNavigation).where(eq(cmsNavigation.isActive, true));
  }

  async createCmsNavigation(nav: InsertCmsNavigation): Promise<CmsNavigation> {
    const [newNav] = await db.insert(cmsNavigation).values(nav).returning();
    return newNav;
  }

  async updateCmsNavigation(id: number, nav: Partial<InsertCmsNavigation>): Promise<CmsNavigation | undefined> {
    const [updated] = await db.update(cmsNavigation).set(nav).where(eq(cmsNavigation.id, id)).returning();
    return updated;
  }

  async deleteCmsNavigation(id: number): Promise<boolean> {
    const result = await db.delete(cmsNavigation).where(eq(cmsNavigation.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
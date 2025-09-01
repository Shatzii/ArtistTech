import { relations } from "drizzle-orm/relations";
import { classrooms, classroomSessions, students, studentEnrollments, sharedContent, teachers, liveClassParticipants, users } from "./schema";

export const classroomSessionsRelations = relations(classroomSessions, ({one, many}) => ({
	classroom: one(classrooms, {
		fields: [classroomSessions.classroomId],
		references: [classrooms.id]
	}),
	liveClassParticipants: many(liveClassParticipants),
}));

export const classroomsRelations = relations(classrooms, ({one, many}) => ({
	classroomSessions: many(classroomSessions),
	studentEnrollments: many(studentEnrollments),
	sharedContents: many(sharedContent),
	teacher: one(teachers, {
		fields: [classrooms.teacherId],
		references: [teachers.id]
	}),
}));

export const studentEnrollmentsRelations = relations(studentEnrollments, ({one}) => ({
	student: one(students, {
		fields: [studentEnrollments.studentId],
		references: [students.id]
	}),
	classroom: one(classrooms, {
		fields: [studentEnrollments.classroomId],
		references: [classrooms.id]
	}),
}));

export const studentsRelations = relations(students, ({one, many}) => ({
	studentEnrollments: many(studentEnrollments),
	liveClassParticipants: many(liveClassParticipants),
	user: one(users, {
		fields: [students.userId],
		references: [users.id]
	}),
}));

export const sharedContentRelations = relations(sharedContent, ({one}) => ({
	classroom: one(classrooms, {
		fields: [sharedContent.classroomId],
		references: [classrooms.id]
	}),
}));

export const teachersRelations = relations(teachers, ({one, many}) => ({
	classrooms: many(classrooms),
	user: one(users, {
		fields: [teachers.userId],
		references: [users.id]
	}),
}));

export const liveClassParticipantsRelations = relations(liveClassParticipants, ({one}) => ({
	classroomSession: one(classroomSessions, {
		fields: [liveClassParticipants.sessionId],
		references: [classroomSessions.id]
	}),
	student: one(students, {
		fields: [liveClassParticipants.studentId],
		references: [students.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	students: many(students),
	teachers: many(teachers),
}));
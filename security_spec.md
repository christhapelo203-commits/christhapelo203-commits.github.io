# EduTrack Security Specification

## Data Invariants
1. A User must have a valid role assigned from students, teachers, parents, or admins.
2. Attendance records must belong to a valid student and class.
3. Homework submissions can only be made by students enrolled in the class.
4. Messages in a channel can only be read/sent by members of that channel (or its associated class).
5. Only teachers can mark attendance and create homework/assessments.
6. Admins have school-wide visibility.

## The Dirty Dozen Payloads (to be blocked)
1. Creating a user with `role: 'admin'` without being an existing admin.
2. Updating someone else's assessment score.
3. Deleting school information as a student.
4. Reading private messages in a channel the user isn't part of.
5. Marking attendance for a date in the future (client-side timestamp bypass).
6. Changing `userId` on a profile to spoof another identity.
7. Submitting homework for a class the user isn't enrolled in.
8. Injection of massive strings into `name` fields.
9. Modifying `createdAt` field after creation.
10. Creating a message with a spoofed `sender_id`.
11. Reading the list of all students as another student (PII protection).
12. Bulk deleting notifications for other users.

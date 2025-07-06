export interface Student {
  sId: string;
  name: string;
  email: string;
  enrollmentTime: number;
  pfp:string;
  phone:number;
  chatId:string
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueDateTime:number;
  timeOfCreation: number;
  totalMarks: number;
  attachments?: AssignmentFile[];
  submissions: AssignmentSubmission[];
}

export interface AssignmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}
export interface FileUrls {
  id:string;
  url:string;
}
export interface FilesU {
  id:string;
  url:string;
}
export interface AssignmentSubmission {
  id: string;
  sId: string;
  name: string;
  pfp: string;
  dateOfSubmission: string;
  timeOfSubmission:number;
  teacherRemarks: TeacherRemarks[];
  feedback?: string;
  attachments?: AssignmentFile[];
}
export interface TeacherRemarks {
  msg:string;
  timeOfCreation:number;
}
export interface Notice {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
}

export interface ClassSchedule {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'lecture' | 'lab' | 'discussion' | 'exam';
  meetingLink?: string;
  clsId?:string;
}

export interface BatchSettings {
  name: string;
  cls: number;
  subject: string;
  studentNo: number;
  timeOfCreation: number;
  scheduledCls:number;
}

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface ComplaintAnalysis {
  priority: PriorityLevel;
  category: string;
  department: string;
}

export interface StudentDetails {
  name: string;
  class: string;
  division: string;
  rollNo: string;
}

export interface AnalyzedComplaint extends ComplaintAnalysis {
  id: string;
  originalText: string;
  timestamp: Date;
  imageUrl?: string;
  studentDetails: StudentDetails;
}

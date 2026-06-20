export interface User {
  id: number;
  name: string;
  email: string;
  country: string;
  state: string;
  category: string;
  course: string;
  degreeLevel: string;
  income: number;
  marks: number;
  mobile?: string;
  skills?: string;
  isSubscribed?: boolean;
}

export interface Scholarship {
  id: number;
  title: string;
  provider: string;
  country: string;
  amount: number;
  currency: string;
  eligibility: string;
  category: string;
  state: string;
  course: string;
  degreeLevel: string;
  deadline: string;
  documents: string;
  applyLink: string;
  status: 'ACTIVE' | 'ENDING_SOON' | 'EXPIRED';
  lastUpdated: string;
}

export interface AIEvaluation {
  eligible: Array<{
    scholarshipId: number;
    title: string;
    matchPercentage: number;
    reason: string;
  }>;
  notEligible: Array<{
    title: string;
    reason: string;
  }>;
  suggestions: string[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

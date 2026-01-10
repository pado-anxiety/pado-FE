export interface LearningStep {
  step: number;
  title: string;
  content: string[];
  image?: string;
}

export interface LearningData {
  title: string;
  description: string;
  steps: LearningStep[];
}

export interface WindowLearningData {
  subject: string;
  title: string;
  description: string;
}

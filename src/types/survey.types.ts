export interface Question {
  id: string;
  text: string;
  type: "rating" | "text" | "rating-10";
}

export interface Answer {
  questionId: string;
  value: string | number;
}

export interface SurveySession {
  id: string;
  answers: Answer[];
  completed: boolean;
}

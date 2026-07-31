export type AnswerValue = {
  value: string;
  label: string;
  noAttempts?: number;
};

export type Submission = {
  id: string;
  createdAt: string;
  answers: Record<string, AnswerValue>;
};

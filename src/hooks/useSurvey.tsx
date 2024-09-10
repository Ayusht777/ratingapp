import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Question, SurveySession, Answer } from "../types/survey.types";

const questions: Question[] = [
  { id: "1", text: "How satisfied are you with our products?", type: "rating" },
  {
    id: "2",
    text: "How fair are the prices compared to similar retailers?",
    type: "rating",
  },
  {
    id: "3",
    text: "How satisfied are you with the value for money of your purchase?",
    type: "rating",
  },
  {
    id: "4",
    text: "On a scale of 1-10 how would you recommend us to your friends and family?",
    type: "rating-10",
  },
  { id: "5", text: "What could we do to improve our service?", type: "text" },
];

export const useSurvey = () => {
  const [session, setSession] = useState<SurveySession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const storedSession = localStorage.getItem("surveySession");
    if (storedSession) {
      setSession(JSON.parse(storedSession));
    } else {
      const newSession: SurveySession = {
        id: uuidv4(),
        answers: [],
        completed: false,
      };
      setSession(newSession);
      localStorage.setItem("surveySession", JSON.stringify(newSession));
    }
  }, []);

  const saveAnswer = (answer: Answer) => {
    if (session) {
      const updatedAnswers = [
        ...session.answers.filter((a) => a.questionId !== answer.questionId),
        answer,
      ];
      const updatedSession = { ...session, answers: updatedAnswers };
      setSession(updatedSession);
      localStorage.setItem("surveySession", JSON.stringify(updatedSession));
    }
  };

  const completeSession = () => {
    if (session) {
      const completedSession = { ...session, completed: true };
      setSession(completedSession);
      localStorage.setItem("surveySession", JSON.stringify(completedSession));
    }
  };

  const resetSession = () => {
    const newSession: SurveySession = {
      id: uuidv4(),
      answers: [],
      completed: false,
    };
    setSession(newSession);
    localStorage.setItem("surveySession", JSON.stringify(newSession));
    setCurrentQuestionIndex(0);
  };

  return {
    session,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveAnswer,
    completeSession,
    resetSession,
  };
};

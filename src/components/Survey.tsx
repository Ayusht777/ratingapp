import { useState } from "react";
import { useSurvey } from "../hooks/useSurvey";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Rating from "react-rating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export const Survey = () => {
  const {
    session,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveAnswer,
    completeSession,
    resetSession,
  } = useSurvey();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleStart = () => {
    setShowWelcome(false);
  };

  const handleAnswer = (value: string | number) => {
    const currentQuestion = questions[currentQuestionIndex];
    saveAnswer({ questionId: currentQuestion.id, value });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    completeSession();
    setShowConfirmDialog(false);
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      setShowWelcome(true);
      resetSession();
    }, 5000);
  };

  if (showWelcome) {
    return (
      <div className="w-full min-h-dvh flex items-center justify-center bg-neutral-900">
        <Card className="w-[350px] mx-auto mt-10 dark">
          <CardHeader>
            <CardTitle>👋 Welcome to our Survey</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We'd love to hear your feedback!</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStart}>Start Survey</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (showThankYou) {
    return (
      <div className="w-full min-h-dvh flex items-center justify-center bg-neutral-900">
        <Card className="w-[350px] mx-auto mt-10 dark">
          <CardHeader>
            <CardTitle>Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We appreciate your feedback.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <div className="w-full min-h-dvh flex items-center justify-center bg-neutral-900">
        <Card className="w-[350px] mx-auto mt-10 dark">
          <CardHeader>
            <CardTitle>{currentQuestion.text}</CardTitle>
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </CardHeader>
          <CardContent>
            {currentQuestion.type === "rating" && (
              <Rating
                initialRating={
                  (session?.answers.find(
                    (a) => a.questionId === currentQuestion.id
                  )?.value as number) || 0
                }
                onChange={handleAnswer}
                emptySymbol={<span className="text-2xl">☆</span>}
                fullSymbol={<span className="text-2xl text-yellow-400">★</span>}
              />
            )}

            {currentQuestion.type === "rating-10" && (
              <Rating
                initialRating={
                  (session?.answers.find(
                    (a) => a.questionId === currentQuestion.id
                  )?.value as number) || 0
                }
                onChange={handleAnswer}
                emptySymbol={<span className="text-xl">☆</span>}
                fullSymbol={<span className="text-xl text-yellow-400">★</span>}
                stop={10}
              />
            )}

            {currentQuestion.type === "text" && (
              <Input
                value={
                  (session?.answers.find(
                    (a) => a.questionId === currentQuestion.id
                  )?.value as string) || ""
                }
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete}>Complete</Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="dark">
          <AlertDialogHeader>
            <AlertDialogTitle className={cn("text-white")}>
              Confirm Submission
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your survey responses?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn("text-white")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

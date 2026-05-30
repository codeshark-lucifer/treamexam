"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Question {
  id: string;
  categoryId: string;
  examType: string;
  questionKh: string;
  questionEn: string;
  optionsKh: string[];
  optionsEn: string[];
  answer: number;
}

interface PreparedQuestion extends Question {
  displayOptions: {
    textKh: string;
    textEn: string;
    originalIndex: number;
  }[];
}

interface Props {
  categoryId: string;
  examTypeId: string;
  questions: Question[];
}

export default function ExamInterface({
  categoryId,
  examTypeId,
  questions: initialQuestions,
}: Props) {
  const router = useRouter();

  const [questions, setQuestions] = useState<PreparedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [timer, setTimer] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!finished && !loading && questions.length > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [finished, loading, questions.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Prepare questions (shuffle options)
  useEffect(() => {
    const prepared = initialQuestions.map((q) => {
      const options = q.optionsKh.map((kh, index) => ({
        textKh: kh,
        textEn: q.optionsEn[index],
        originalIndex: index,
      }));

      // shuffle options
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      return {
        ...q,
        displayOptions: options,
      };
    });

    setQuestions(prepared);
  }, [initialQuestions]);

  if (questions.length === 0) {
    return <div className="flex flex-col items-center justify-center p-20 text-[var(--muted)]">
      <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-[var(--primary)]"></i>
      <p className="font-bold">កំពុងរៀបចំវិញ្ញាសា...</p>
    </div>;
  }

  const currentQuestion = questions[currentIndex];

  // NEXT QUESTION
  const handleNext = () => {
    if (selectedIndex === null) return;

    const selected =
      currentQuestion.displayOptions[selectedIndex];

    const isCorrect =
      selected.originalIndex === currentQuestion.answer;

    const result = {
      questionId: currentQuestion.id,
      question: currentQuestion.questionKh,
      selectedAnswer: selected.originalIndex,
      selectedText: selected.textKh,
      correctAnswer: currentQuestion.answer,
      correctText: currentQuestion.optionsKh[currentQuestion.answer],
      isCorrect,
    };

    const updated = [...answers, result];
    setAnswers(updated);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      setSelectedIndex(null);
    } else {
      submitExam(updated);
    }
  };

  // SUBMIT EXAM
  const submitExam = async (finalAnswers: any[]) => {
    setLoading(true);

    const correctCount = finalAnswers.filter(
      (a) => a.isCorrect
    ).length;

    const score = Math.round(
      (correctCount / questions.length) * 100
    );

    try {
      const res = await fetch("/api/user/exam/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
          examTypeId,
          score,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
          answers: finalAnswers,
        }),
      });

      const data = await res.json();

      setResultData({
        score,
        correctCount,
        answers: finalAnswers,
        apiResultId: data.resultId,
      });
    } catch (err) {
      console.error("Submit error:", err);
    }

    setFinished(true);
    setLoading(false);
  };

  // RESULT SCREEN
  if (finished && resultData) {
    const isPass = resultData.score >= 50;

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in duration-500">
        {/* SCORE CARD */}
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-10 text-center shadow-lg overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--primary)]/5 rounded-tr-full"></div>

          <div className="relative mb-6 mx-auto w-40 h-40 rounded-full border-8 border-[var(--line)] flex flex-col items-center justify-center bg-white shadow-inner">
             <div 
               className="absolute inset-[-8px] rounded-full border-8 border-[var(--green)]"
               style={{ 
                 clipPath: `conic-gradient(var(--green) ${resultData.score}%, transparent 0)`,
                 transform: 'rotate(0deg)'
               }}
             ></div>
             <span className="text-4xl font-black text-[var(--ink)]">{resultData.score}%</span>
             <span className="text-[10px] uppercase font-black text-[var(--muted)] tracking-widest mt-1">សរុប / Total</span>
          </div>

          <h1 className={`text-3xl font-black mb-2 ${isPass ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
            {isPass ? 'អបអរសាទរ!' : 'ព្យាយាមម្តងទៀត!'}
          </h1>
          <p className="text-[var(--muted)] font-medium max-w-md mx-auto mb-8">
            {isPass 
              ? 'អ្នកទទួលបានលទ្ធផលល្អប្រសើរ។ សូមបន្តការខិតខំប្រឹងប្រែងបន្ថែមទៀត!' 
              : 'លទ្ធផលនេះមិនទាន់គ្រប់គ្រាន់ទេ។ សូមព្យាយាមម្តងទៀតដើម្បីទទួលបានពិន្ទុខ្ពស់ជាងនេះ!'}
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
             <div className="bg-[var(--secondary)] p-3 rounded-[var(--radius)]">
                <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-tighter mb-1">ត្រឹមត្រូវ / Correct</p>
                <p className="text-xl font-black text-[var(--ink)]">{resultData.correctCount}</p>
             </div>
             <div className="bg-[var(--line)]/30 p-3 rounded-[var(--radius)]">
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-tighter mb-1">សរុប / Questions</p>
                <p className="text-xl font-black text-[var(--ink)]">{questions.length}</p>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
             <button
               onClick={() => window.location.reload()}
               className="px-8 py-3 bg-[var(--primary)] text-white font-black rounded-[var(--radius)] shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-1 transition-all active:scale-95"
             >
               <i className="fa-solid fa-rotate-right mr-2"></i>
               ប្រឡងម្តងទៀត / Try Again
             </button>
             <button
               onClick={() => router.push("/user/dashboard")}
               className="px-8 py-3 bg-[var(--surface)] border border-[var(--line)] text-[var(--primary)] font-black rounded-[var(--radius)] hover:bg-[var(--secondary)] transition-all"
             >
               <i className="fa-solid fa-gauge-high mr-2"></i>
               ផ្ទាំងគ្រប់គ្រង / Dashboard
             </button>
          </div>
        </div>

        {/* REVIEW SECTION */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-l-4 border-[var(--primary)] pl-3">
            <i className="fa-solid fa-magnifying-glass-chart text-[var(--primary)]"></i>
            ពិនិត្យចម្លើយឡើងវិញ / Review Answers
          </h2>

          <div className="grid gap-4">
            {resultData.answers.map((ans: any, index: number) => {
              const q = questions[index];
              return (
                <div
                  key={index}
                  className={`bg-[var(--surface)] border-2 rounded-[var(--radius)] p-6 transition-all ${
                    ans.isCorrect
                      ? "border-[var(--green)]/30 shadow-sm"
                      : "border-[var(--red)]/30 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ans.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {ans.isCorrect ? 'ត្រឹមត្រូវ / Correct' : 'មិនត្រឹមត្រូវ / Incorrect'}
                    </span>
                    <span className="text-[var(--muted)] text-sm font-bold">សំណួរទី #{index + 1}</span>
                  </div>

                  <p className="text-lg font-bold text-[var(--ink)] leading-relaxed mb-4">
                    {q.questionKh}
                  </p>

                  <div className="grid gap-2">
                    <div className={`p-3 rounded-[var(--radius)] border flex items-center gap-3 ${ans.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${ans.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                         <i className={`fa-solid ${ans.isCorrect ? 'fa-check' : 'fa-xmark'}`}></i>
                      </span>
                      <div className="text-sm">
                        <p className="font-black text-[10px] uppercase tracking-tighter opacity-70">ចម្លើយរបស់អ្នក / Your Answer</p>
                        <p className="font-bold">{ans.selectedText}</p>
                      </div>
                    </div>

                    {!ans.isCorrect && (
                      <div className="p-3 rounded-[var(--radius)] border border-green-200 bg-green-50 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 font-bold">
                           <i className="fa-solid fa-check"></i>
                        </span>
                        <div className="text-sm">
                          <p className="font-black text-[10px] uppercase tracking-tighter opacity-70">ចម្លើយត្រឹមត្រូវ / Correct Answer</p>
                          <p className="font-bold">{ans.correctText}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // PROGRESS
  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER & PROGRESS */}
      <div className="bg-[var(--surface)] p-4 md:p-6 rounded-[var(--radius)] border border-[var(--line)] shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--secondary)] text-[var(--primary)] flex items-center justify-center">
                 <i className="fa-solid fa-file-pen"></i>
              </div>
              <div>
                <h2 className="font-black text-[var(--ink)] leading-tight">សំណួរទី {currentIndex + 1}</h2>
                <p className="text-[var(--muted)] text-[10px] font-bold uppercase tracking-widest">Question {currentIndex + 1} / {questions.length}</p>
              </div>
           </div>
           
           <div className="bg-[var(--secondary)] px-4 py-2 rounded-[var(--radius)] font-black text-[var(--primary)] text-sm shadow-inner">
             <i className="fa-solid fa-clock mr-2"></i>
             {formatTime(timer)}
           </div>
        </div>

        <div className="w-full h-3 bg-[var(--line)] rounded-full overflow-hidden border border-[var(--line)]">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-500 shadow-[0_0_10px_rgba(154,98,58,0.3)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius)] p-6 md:p-10 shadow-lg animate-in slide-in-from-bottom-8 duration-500">
        <span className="text-[var(--primary)] font-black uppercase text-xs tracking-[0.2em] mb-4 block opacity-70">សំណួរ / Question</span>
        <h1 className="text-xl md:text-2xl font-bold text-[var(--ink)] leading-relaxed mb-10">
          {currentQuestion.questionKh}
          <span className="block text-base font-medium text-[var(--muted)] mt-4 border-t border-[var(--line)] pt-4 italic">
             {currentQuestion.questionEn}
          </span>
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          {currentQuestion.displayOptions.map((opt, index) => {
            const label = String.fromCharCode(65 + index);
            const isSelected = selectedIndex === index;

            return (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`group w-full p-4 border-2 rounded-[var(--radius)] text-left transition-all flex items-center gap-4 ${
                  isSelected
                    ? "border-[var(--primary)] bg-[var(--secondary)] shadow-md"
                    : "border-[var(--line)] hover:border-[var(--primary)]/40 hover:bg-[var(--secondary)]/30"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black transition-colors ${
                  isSelected ? 'bg-[var(--primary)] text-white' : 'bg-[var(--line)]/50 text-[var(--muted)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]'
                }`}>
                  {label}
                </div>
                <div>
                  <div className={`font-bold transition-colors ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--ink)]'}`}>
                    {opt.textKh}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] font-medium mt-1 leading-snug">
                    {opt.textEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="mt-12 flex justify-between items-center border-t border-[var(--line)] pt-8">
           <button 
             onClick={() => router.back()}
             className="text-[var(--muted)] font-bold hover:text-[var(--primary)] transition-colors flex items-center gap-2"
           >
             <i className="fa-solid fa-arrow-left"></i>
             ចាកចេញ / Exit
           </button>

           <button
            disabled={selectedIndex === null || loading}
            onClick={handleNext}
            className={`px-10 py-4 rounded-[var(--radius)] font-black text-white shadow-xl transition-all active:scale-95 ${
              selectedIndex === null 
                ? 'bg-[var(--muted)] opacity-50 cursor-not-allowed' 
                : 'bg-[var(--primary)] shadow-[var(--primary)]/30 hover:-translate-y-1'
            }`}
          >
            {currentIndex === questions.length - 1
              ? "បញ្ចប់ការប្រឡង / Finish"
              : "សំណួរបន្ទាប់ / Next"}
            <i className="fa-solid fa-arrow-right ml-3"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
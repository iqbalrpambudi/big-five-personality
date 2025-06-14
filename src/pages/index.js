import Image from "next/image";
import {
  questions,
  answerOptions,
  traitMapping,
  reverseScoredIds,
  traitDescriptions,
} from "@/constant/question";
import dataonLogo from "@/assets/dataon.png";
import sunfishLogo from "@/assets/sunfishlogo.png";
import { useState, useEffect } from "react";
import { generatePDF } from "@/utils/pdfGenerator";
import TestResult from "@/components/TestResult";
import config from "../../postcss.config.mjs";

const _dummy = {
  1: 3,
  2: 1,
  3: 3,
  4: 2,
  5: 4,
  6: 2,
  7: 4,
  8: 3,
  9: 3,
  10: 3,
  11: 2,
  12: 2,
  13: 3,
  14: 4,
  15: 4,
  16: 2,
  17: 3,
  18: 2,
  19: 1,
  20: 2,
  21: 1,
  22: 4,
  23: 2,
  24: 3,
  25: 1,
  26: 3,
  27: 5,
  28: 1,
  29: 3,
  30: 1,
  31: 3,
  32: 1,
  33: 4,
  34: 3,
  35: 2,
  36: 3,
  37: 3,
  38: 3,
  39: 1,
  40: 3,
  41: 1,
  42: 3,
  43: 2,
  44: 3,
};

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [testDuration, setTestDuration] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scores = calculateScores();
    if (scores) {
      handleEmailSubmit(scores);
    }
  };

  const handleEmailSubmit = async (res) => {
    setIsSending(true);
    try {
      const response = await fetch("/api/send-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          results: res,
          testDuration,
        }),
      });

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        setModalMessage("Your response has been recorded!, thanks");
        setShowResults(true);
        setResults(res);
      } else {
        setModalMessage(data.message || "Failed to send response. Please try again.");
      }
    } catch (error) {
      setModalMessage("An error occurred while sending data");
      setShowModal(true);
    } finally {
      setIsSending(false);
    }
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute(s) and ${seconds % 60} second(s)`;
  };

  const calculateScores = () => {
    const unansweredQuestions = questions.filter((q) => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      setModalMessage("Please answer all questions before viewing the results.");
      setShowModal(true);
      return null;
    }

    const endTime = new Date();
    const duration = endTime - startTime;
    setTestDuration(formatDuration(duration));

    const scores = {};
    for (const trait in traitMapping) {
      let score = 0;
      const { questions: traitQuestions } = traitMapping[trait];
      traitQuestions.forEach((qId) => {
        let qScore = answers[qId];
        if (reverseScoredIds.includes(qId)) {
          qScore = 6 - qScore;
        }
        score += qScore;
      });
      scores[trait] = score;
    }
    return scores;
  };

  const downloadResults = async () => {
    try {
      setIsSending(true);
      const pdf = await generatePDF(results, testDuration, traitMapping, traitDescriptions);
      pdf.save("personality-test-results.pdf");
    } catch (error) {
      setModalMessage("Failed to generate PDF. Please try again.");
      setShowModal(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:px-8 md:py-3 max-w-3xl relative">
      <div className="logo-container flex justify-start items-center gap-4">
        <Image src={dataonLogo} alt="Dataon Logo" width={100} height={100} />
        <Image src={sunfishLogo} alt="Sunfish Logo" width={100} height={100} />
      </div>

      <header className="text-center mb-8 mt-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Big Five Personality Test</h1>
        <p className="text-gray-600 mt-2">Answer each statement according to how relevant it is to you.</p>
      </header>

      {!showResults ? (
        <form onSubmit={handleSubmit}>
          <div>
            {questions.map((q) => (
              <div key={q.id} className="question-card">
                <p className="text-lg font-semibold text-gray-700 mb-4">{q.text}</p>
                <div className="flex flex-wrap justify-center md:justify-start">
                  {answerOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`radio-label ${answers[q.id] === opt.value ? "selected-radio" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        value={opt.value}
                        checked={answers[q.id] === opt.value}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="mr-2"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button type="submit" className="action-button" disabled={isSending}>
              {isSending ? "Submitting..." : "View Results"}
            </button>
          </div>
        </form>
      ) : (
        <TestResult results={results} testDuration={testDuration} />
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification</h3>
            <p className="text-gray-600">{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="modal-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

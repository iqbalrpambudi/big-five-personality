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
import { useState } from "react";

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [testDuration, setTestDuration] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [startTime, setStartTime] = useState(null);

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
      setResults(scores);
      setShowResults(true);
      // Automatically send email after showing results
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

  const getInterpretation = (traitName, score) => {
    const { min, max } = traitMapping[traitName];
    const range = max - min;
    const lowThreshold = min + range / 3;
    const highThreshold = min + (2 * range) / 3;

    if (score < lowThreshold) return traitDescriptions[traitName].Low;
    if (score <= highThreshold) return traitDescriptions[traitName].Moderate;
    return traitDescriptions[traitName].High;
  };

  const downloadResults = () => {
    const data = {
      answers,
      results,
      testDuration,
    };
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
        <div className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
            Your Personality Test Results
          </h2>
          <p className="text-center text-gray-600 mb-6">Time taken: {testDuration}</p>

          <div className="grid grid-cols-1 gap-6">
            {Object.entries(results).map(([trait, score]) => {
              const { max } = traitMapping[trait];
              const percentage = ((score - traitMapping[trait].min) / (max - traitMapping[trait].min)) * 100;
              return (
                <div key={trait} className="result-card p-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-1">{trait}</h3>
                  <p className="text-lg text-blue-600 font-bold mb-2">
                    Score: {score} / {max}
                  </p>
                  <div className="progress-bar-container mb-3">
                    <div
                      className="progress-bar"
                      style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                    />
                  </div>
                  <p className="text-gray-600 text-sm">{getInterpretation(trait, score)}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <button onClick={downloadResults} className="action-button secondary">
              Download Results
            </button>
          </div>
        </div>
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

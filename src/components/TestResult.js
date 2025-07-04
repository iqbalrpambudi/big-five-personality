import { traitMapping, traitDescriptions } from "@/constant/question";

export default function TestResult(props) {
  const getInterpretation = (traitName, score) => {
    const { min, max } = traitMapping[traitName];
    const range = max - min;
    const lowThreshold = min + range / 3;
    const highThreshold = min + (2 * range) / 3;

    if (score < lowThreshold) return traitDescriptions[traitName].Low;
    if (score <= highThreshold) return traitDescriptions[traitName].Moderate;
    return traitDescriptions[traitName].High;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
        Your Personality Test Results
      </h2>
      <p className="text-center text-gray-600 mb-2">Time taken: {props.testDuration}</p>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(props.results).map(([trait, score]) => {
          const { max } = traitMapping[trait];
          const percentage = ((score - traitMapping[trait].min) / (max - traitMapping[trait].min)) * 100;
          return (
            <div key={trait} className="result-card p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-1">{trait}</h3>
              <p className="text-gray-600 text-sm mb-2">{traitDescriptions[trait].Description}</p>
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
    </div>
  );
}

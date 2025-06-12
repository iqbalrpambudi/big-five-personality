export const questions = [
  { id: 1, text: "1. Is talkative" },
  { id: 2, text: "2. Tends to find fault with others" },
  { id: 3, text: "3. Does a thorough job" },
  { id: 4, text: "4. Is depressed, blue" },
  { id: 5, text: "5. Is original, comes up with new ideas" },
  { id: 6, text: "6. Is reserved" },
  { id: 7, text: "7. Is helpful and unselfish with others" },
  { id: 8, text: "8. Can be somewhat careless" },
  { id: 9, text: "9. Is relaxed, handles stress well" },
  { id: 10, text: "10. Is curious about many different things" },
  { id: 11, text: "11. Is full of energy" },
  { id: 12, text: "12. Starts quarrels with others" },
  { id: 13, text: "13. Is a reliable worker" },
  { id: 14, text: "14. Gets tense easily" },
  { id: 15, text: "15. Is ingenious, a deep thinker" },
  { id: 16, text: "16. Generates a lot of enthusiasm" },
  { id: 17, text: "17. Has a forgiving nature" },
  { id: 18, text: "18. Tends to be disorganized" },
  { id: 19, text: "19. Worries a lot" },
  { id: 20, text: "20. Has an active imagination" },
  { id: 21, text: "21. Tends to be quiet" },
  { id: 22, text: "22. Is generally trusting" },
  { id: 23, text: "23. Tends to be lazy" },
  { id: 24, text: "24. Is emotionally stable, not easily upset" },
  { id: 25, text: "25. Is inventive" },
  { id: 26, text: "26. Is outgoing, sociable" },
  { id: 27, text: "27. Can be cold and aloof" },
  { id: 28, text: "28. Perseveres until the task is finished" },
  { id: 29, text: "29. Can be moody" },
  { id: 30, text: "30. Values artistic, aesthetic experiences" },
  { id: 31, text: "31. Is sometimes shy, inhibited" },
  { id: 32, text: "32. Is considerate and kind to almost everyone" },
  { id: 33, text: "33. Does things efficiently" },
  { id: 34, text: "34. Remains calm in tense situations" },
  { id: 35, text: "35. Prefers work that is routine" },
  { id: 36, text: "36. Is outgoing, sociable" },
  { id: 37, text: "37. Can be rude to others at times" },
  { id: 38, text: "38. Makes plans and follows through with them" },
  { id: 39, text: "39. Gets nervous easily" },
  { id: 40, text: "40. Likes to reflect, play with ideas" },
  { id: 41, text: "41. Has few artistic interests" },
  { id: 42, text: "42. Likes to cooperate with others" },
  { id: 43, text: "43. Is easily distracted" },
  { id: 44, text: "44. Is sophisticated in art, music, or literature" },
];

export const reverseScoredIds = [2, 6, 8, 9, 12, 18, 21, 23, 24, 27, 31, 34, 35, 37, 41, 43];

export const traitMapping = {
  Openness: { questions: [5, 10, 15, 20, 25, 30, 35, 40, 41, 44], min: 10, max: 50 },
  Conscientiousness: { questions: [3, 8, 13, 18, 23, 28, 33, 38, 43], min: 9, max: 45 },
  Extroversion: { questions: [1, 6, 11, 16, 21, 26, 31, 36], min: 8, max: 40 },
  Agreeableness: { questions: [2, 7, 12, 17, 22, 27, 32, 37, 42], min: 9, max: 45 },
  Neuroticism: { questions: [4, 9, 14, 19, 24, 29, 34, 39], min: 8, max: 40 },
};

export const traitDescriptions = {
  Openness: {
    Low: "Practical, conventional, prefers routine.",
    Moderate: "Balances practicality with openness to new ideas.",
    High: "Curious, wide range of interests, independent, and open to new experiences.",
  },
  Conscientiousness: {
    Low: "Impulsive, may be disorganized, and careless.",
    Moderate: "Reasonably reliable and organized.",
    High: "Hard-working, dependable, organized, and responsible.",
  },
  Extroversion: {
    Low: "Tends to be quiet, reserved, and prefers solitude.",
    Moderate: "Comfortable in social situations as well as when alone.",
    High: "Outgoing, warm, sociable, enthusiastic, and seeks adventure.",
  },
  Agreeableness: {
    Low: "May be critical, uncooperative, and sometimes suspicious.",
    Moderate: "Reasonably cooperative and empathetic.",
    High: "Helpful, trusting, empathetic, and cooperative.",
  },
  Neuroticism: {
    Low: "Calm, emotionally stable, doesn't panic easily, and handles stress maturely.",
    Moderate: "Experiences negative emotions occasionally but is generally stable.",
    High: "Anxious, may be unhappy, prone to emotional swings, and vulnerable to stress.",
  },
};

export const answerOptions = [
  { value: 1, text: "Strongly Disagree" },
  { value: 2, text: "Disagree" },
  { value: 3, text: "Neutral" },
  { value: 4, text: "Agree" },
  { value: 5, text: "Strongly Agree" },
];

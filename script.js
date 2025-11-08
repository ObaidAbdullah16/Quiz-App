// ===================================
// CONFIGURATION
// ===================================

// Google Gemini API endpoint - using gemini-pro model (most stable)
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// ===================================
// GLOBAL VARIABLES
// ===================================

let apiKey = ""; // User's Google Gemini API key
let quizData = null; // Stores the entire quiz (topic + all 5 questions)
let currentQuestionIndex = 0; // Tracks which question we're currently on (0 = first question)
let score = 0; // Tracks how many questions the user answered correctly
let usedTopics = []; // Tracks topics that have been used to ensure variety

// List of diverse topics to choose from
const TOPIC_LIST = [
  "World History",
  "Ancient Civilizations",
  "Modern History",
  "Art History",
  "Biology",
  "Chemistry",
  "Physics",
  "Astronomy",
  "Space Exploration",
  "Geography",
  "World Capitals",
  "Countries and Flags",
  "Mountains and Rivers",
  "Movies and Cinema",
  "Classic Films",
  "Hollywood",
  "Animated Movies",
  "Sports",
  "Football/Soccer",
  "Basketball",
  "Olympics",
  "Cricket",
  "Technology",
  "Computer Science",
  "Programming",
  "Artificial Intelligence",
  "Music",
  "Classical Music",
  "Rock Music",
  "Pop Music",
  "Jazz",
  "Literature",
  "Famous Authors",
  "Classic Novels",
  "Poetry",
  "Science Fiction",
  "Fantasy",
  "Mythology",
  "Greek Mythology",
  "Food and Cooking",
  "World Cuisine",
  "Desserts",
  "Beverages",
  "Animals",
  "Marine Life",
  "Birds",
  "Mammals",
  "Insects",
  "Mathematics",
  "Famous Scientists",
  "Inventions",
  "Nobel Prize Winners",
  "Architecture",
  "Famous Buildings",
  "Ancient Wonders",
  "Modern Architecture",
  "Video Games",
  "Board Games",
  "Card Games",
  "Puzzles",
  "Fashion",
  "Photography",
  "Painting",
  "Sculpture",
  "Economics",
  "Business",
  "Marketing",
  "Finance",
  "Medicine",
  "Human Body",
  "Health",
  "Nutrition",
  "Psychology",
  "Philosophy",
  "Religion",
  "Culture",
  "Languages",
  "Travel",
  "Landmarks",
  "UNESCO Sites",
  "Climate",
  "Weather",
  "Natural Disasters",
  "Ecology",
  "Cars and Vehicles",
  "Aviation",
  "Trains",
  "Ships",
];

// ===================================
// DOM ELEMENTS - Getting references to HTML elements so we can control them
// ===================================

const apiKeySection = document.getElementById("apiKeySection");
const apiKeyInput = document.getElementById("apiKeyInput");
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn");
const quizSection = document.getElementById("quizSection");
const resultsSection = document.getElementById("resultsSection");
const loadingSpinner = document.getElementById("loadingSpinner");

const topicName = document.getElementById("topicName");
const currentQuestion = document.getElementById("currentQuestion");
const questionText = document.getElementById("questionText");
const explanationContainer = document.getElementById("explanationContainer");
const explanationBox = document.getElementById("explanationBox");
const explanationText = document.getElementById("explanationText");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const scoreElement = document.getElementById("score");
const finalScore = document.getElementById("finalScore");
const resultMessage = document.getElementById("resultMessage");
const restartBtn = document.getElementById("restartBtn");

// ===================================
// EVENT LISTENERS
// ===================================

saveApiKeyBtn.addEventListener("click", saveApiKeyAndStart);
nextQuestionBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

window.addEventListener("load", () => {
  const savedKey = localStorage.getItem("geminiApiKey");
  if (savedKey) {
    apiKeyInput.value = savedKey;
  }

  // Load used topics from localStorage
  const savedTopics = localStorage.getItem("usedTopics");
  if (savedTopics) {
    usedTopics = JSON.parse(savedTopics);
  }
});

// ===================================
// MAIN FUNCTIONS
// ===================================

/**
 * Save the user's API key and start the quiz
 */
function saveApiKeyAndStart() {
  const key = apiKeyInput.value.trim();

  if (!key) {
    alert("Please enter your API key!");
    return;
  }

  apiKey = key;
  localStorage.setItem("geminiApiKey", key);
  apiKeySection.style.display = "none";
  startQuiz();
}

/**
 * Start a new quiz
 */
async function startQuiz() {
  loadingSpinner.style.display = "block";

  try {
    quizData = await generateQuiz();
    loadingSpinner.style.display = "none";
    quizSection.style.display = "block";
    topicName.textContent = quizData.topic;

    // Add topic to used topics list
    usedTopics.push(quizData.topic);
    localStorage.setItem("usedTopics", JSON.stringify(usedTopics));

    currentQuestionIndex = 0;
    score = 0;
    scoreElement.textContent = score;
    displayQuestion();
  } catch (error) {
    loadingSpinner.style.display = "none";
    console.error("Full error:", error);
    alert(
      "Error generating quiz: " +
        error.message +
        "\n\nTroubleshooting:\n" +
        "1. Check your API key is correct\n" +
        "2. Make sure you have internet connection\n" +
        "3. Check browser console (F12) for details\n" +
        "4. Try refreshing the page"
    );
    apiKeySection.style.display = "block";
  }
}

/**
 * Get a random topic that hasn't been used recently
 */
function getRandomUnusedTopic() {
  // If all topics have been used, reset the list
  if (usedTopics.length >= TOPIC_LIST.length) {
    usedTopics = [];
    localStorage.setItem("usedTopics", JSON.stringify(usedTopics));
  }

  // Get topics that haven't been used
  const availableTopics = TOPIC_LIST.filter(
    (topic) => !usedTopics.includes(topic)
  );

  // Pick a random topic from available ones
  const randomIndex = Math.floor(Math.random() * availableTopics.length);
  return availableTopics[randomIndex];
}

/**
 * Generate quiz questions using Google Gemini AI
 */
async function generateQuiz() {
  // Get a random unused topic
  const selectedTopic = getRandomUnusedTopic();

  const prompt = `Generate a quiz about "${selectedTopic}" with the following JSON format:
{
  "topic": "${selectedTopic}",
  "questions": [
    {
      "question": "question text here",
      "options": ["option A", "option B", "option C", "option D"],
      "correct": 0,
      "explanation": "a brief 2-3 sentence explanation about why this answer is correct and interesting facts"
    }
  ]
}

Requirements:
- Generate exactly 5 questions about ${selectedTopic}
- Make questions interesting and educational
- "correct" field should be the index (0-3) of the correct answer in the options array
- Make sure the JSON is valid
- Only respond with the JSON, nothing else
- DO NOT change the topic - it must be "${selectedTopic}"`;

  console.log("Selected topic:", selectedTopic);
  console.log("Sending request to:", API_URL);

  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error response:", errorData);
    throw new Error(
      `API Error: ${errorData.error?.message || "Unknown error"}`
    );
  }

  const data = await response.json();
  console.log("API Response:", data);

  const aiResponse = data.candidates[0].content.parts[0].text;

  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid response from AI - no JSON found");
  }

  const quizJson = JSON.parse(jsonMatch[0]);

  // Ensure the topic is set correctly
  quizJson.topic = selectedTopic;

  return quizJson;
}

/**
 * Display the current question on the screen
 */
function displayQuestion() {
  const question = quizData.questions[currentQuestionIndex];

  currentQuestion.textContent = currentQuestionIndex + 1;
  questionText.textContent = question.question;

  const answerButtons = document.querySelectorAll(".answer-btn");
  const labels = ["A", "B", "C", "D"];

  answerButtons.forEach((btn, index) => {
    btn.textContent = `${labels[index]}. ${question.options[index]}`;
    btn.className = "btn btn-outline-primary answer-btn";
    btn.disabled = false;

    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener("click", () => selectAnswer(index));
  });

  explanationContainer.style.display = "none";
}

/**
 * Handle when user selects an answer
 */
function selectAnswer(selectedIndex) {
  const question = quizData.questions[currentQuestionIndex];
  const correctIndex = question.correct;
  const answerButtons = document.querySelectorAll(".answer-btn");

  answerButtons.forEach((btn) => (btn.disabled = true));

  answerButtons[correctIndex].classList.remove("btn-outline-primary");
  answerButtons[correctIndex].classList.add("btn-success");

  if (selectedIndex !== correctIndex) {
    answerButtons[selectedIndex].classList.remove("btn-outline-primary");
    answerButtons[selectedIndex].classList.add("btn-danger");
    explanationBox.className = "alert alert-danger";
  } else {
    score++;
    scoreElement.textContent = score;
    explanationBox.className = "alert alert-success";
  }

  explanationText.textContent = question.explanation;
  explanationContainer.style.display = "block";
}

/**
 * Move to the next question
 */
function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= quizData.questions.length) {
    showResults();
  } else {
    displayQuestion();
  }
}

/**
 * Show the final results screen
 */
function showResults() {
  quizSection.style.display = "none";
  resultsSection.style.display = "block";
  finalScore.textContent = score;

  if (score === 5) {
    resultMessage.textContent = "🏆 Perfect score! You're amazing!";
  } else if (score >= 3) {
    resultMessage.textContent = "👏 Great job! You know your stuff!";
  } else {
    resultMessage.textContent =
      "💪 Keep practicing! You'll do better next time!";
  }
}

/**
 * Restart the quiz with a new topic
 */
function restartQuiz() {
  resultsSection.style.display = "none";
  startQuiz();
}

// Reset all the topics
function resetTopics() {
  usedTopics = [];
  localStorage.removeItem("usedTopics");
  alert("Topic history cleared! You'll see fresh topics now.");
}

// Show the list of used topics
function showTopicHistory() {
  if (usedTopics.length === 0) {
    alert("No topics used yet!");
  } else {
    alert("Topics you've seen:\n\n" + usedTopics.join("\n"));
  }
}

// ===================================
// CONFIGURATION
// ===================================

// Google Gemini API endpoint - this is where we send requests to generate quiz questions
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// ===================================
// GLOBAL VARIABLES
// ===================================

let apiKey = ""; // User's Google Gemini API key
let quizData = null; // Stores the entire quiz (topic + all 5 questions)
let currentQuestionIndex = 0; // Tracks which question we're currently on (0 = first question)
let score = 0; // Tracks how many questions the user answered correctly

// ===================================
// DOM ELEMENTS - Getting references to HTML elements so we can control them
// ===================================

const apiKeySection = document.getElementById("apiKeySection"); // The section where user enters API key
const apiKeyInput = document.getElementById("apiKeyInput"); // The input box for API key
const saveApiKeyBtn = document.getElementById("saveApiKeyBtn"); // The "Save & Start Quiz" button
const quizSection = document.getElementById("quizSection"); // The section that shows quiz questions
const resultsSection = document.getElementById("resultsSection"); // The section that shows final results
const loadingSpinner = document.getElementById("loadingSpinner"); // The loading animation

const topicName = document.getElementById("topicName"); // Displays the current quiz topic
const currentQuestion = document.getElementById("currentQuestion"); // Shows current question number (1-5)
const questionText = document.getElementById("questionText"); // Displays the actual question text
const explanationContainer = document.getElementById("explanationContainer"); // Container for explanation after answer
const explanationBox = document.getElementById("explanationBox"); // The colored box around explanation
const explanationText = document.getElementById("explanationText"); // The explanation text itself
const nextQuestionBtn = document.getElementById("nextQuestionBtn"); // "Next Question" button
const scoreElement = document.getElementById("score"); // Displays current score
const finalScore = document.getElementById("finalScore"); // Displays final score at end
const resultMessage = document.getElementById("resultMessage"); // Message at end (encouraging text)
const restartBtn = document.getElementById("restartBtn"); // "Try Another Topic" button

// ===================================
// EVENT LISTENERS - What happens when users click buttons
// ===================================

// When user clicks "Save & Start Quiz" button, run the saveApiKeyAndStart function
saveApiKeyBtn.addEventListener("click", saveApiKeyAndStart);

// When user clicks "Next Question" button, run the nextQuestion function
nextQuestionBtn.addEventListener("click", nextQuestion);

// When user clicks "Try Another Topic" button, run the restartQuiz function
restartBtn.addEventListener("click", restartQuiz);

// When the page loads, check if user already saved an API key before
window.addEventListener("load", () => {
  const savedKey = localStorage.getItem("geminiApiKey"); // Check browser's local storage
  if (savedKey) {
    apiKeyInput.value = savedKey; // If found, fill it in automatically
  }
});

// ===================================
// MAIN FUNCTIONS
// ===================================

/**
 * Save the user's API key and start the quiz
 * This runs when user clicks "Save & Start Quiz"
 */
function saveApiKeyAndStart() {
  const key = apiKeyInput.value.trim(); // Get the API key from input box and remove extra spaces

  // Check if the user actually entered something
  if (!key) {
    alert("Please enter your API key!"); // Show alert if empty
    return; // Stop the function here
  }

  // If we get here, the key is valid
  apiKey = key; // Save to our global variable
  localStorage.setItem("geminiApiKey", key); // Save to browser's storage (so user doesn't need to enter again)

  // Hide the API key section and start the quiz
  apiKeySection.style.display = "none";
  startQuiz();
}

/**
 * Start a new quiz
 * This generates questions from AI and displays the first one
 */
async function startQuiz() {
  // Show the loading spinner (the spinning circle)
  loadingSpinner.style.display = "block";

  try {
    // Try to generate quiz questions using AI (this takes a few seconds)
    quizData = await generateQuiz(); // 'await' means "wait for this to finish"

    // If we get here, quiz was generated successfully!
    loadingSpinner.style.display = "none"; // Hide loading spinner
    quizSection.style.display = "block"; // Show the quiz section

    // Display the topic that AI chose
    topicName.textContent = quizData.topic;

    // Reset everything for a fresh start
    currentQuestionIndex = 0; // Start at first question
    score = 0; // Reset score to zero
    scoreElement.textContent = score; // Update score display

    // Show the first question
    displayQuestion();
  } catch (error) {
    // If something went wrong (bad API key, no internet, etc.)
    loadingSpinner.style.display = "none"; // Hide loading spinner
    alert(
      "Error generating quiz: " +
        error.message +
        "\n\nPlease check your API key and try again."
    );
    apiKeySection.style.display = "block"; // Show API key section again so user can fix it
  }
}

/**
 * Generate quiz questions using Google Gemini AI
 * This sends a request to Google's AI and gets back a quiz
 */
async function generateQuiz() {
  // Create the prompt (instructions) for the AI
  const prompt = `Generate a random quiz with the following JSON format:
{
  "topic": "a random interesting topic (like History, Science, Geography, Movies, Sports, Technology, etc.)",
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
- Generate exactly 5 questions
- Make questions interesting and educational
- "correct" field should be the index (0-3) of the correct answer in the options array
- Make sure the JSON is valid
- Only respond with the JSON, nothing else`;

  // Send request to Google Gemini API
  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: "POST", // POST means we're sending data
    headers: {
      "Content-Type": "application/json", // Tell Google we're sending JSON
    },
    body: JSON.stringify({
      // Convert our data to JSON format
      contents: [
        {
          parts: [
            {
              text: prompt, // Our prompt from above
            },
          ],
        },
      ],
    }),
  });

  // Check if the request was successful
  if (!response.ok) {
    throw new Error("Failed to generate quiz. Please check your API key.");
  }

  // Parse the response from Google
  const data = await response.json(); // Convert response to JavaScript object
  const aiResponse = data.candidates[0].content.parts[0].text; // Get the AI's text response

  // Extract the JSON from the response (AI sometimes adds extra text, so we use regex)
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/); // Find everything between { and }
  if (!jsonMatch) {
    throw new Error("Invalid response from AI");
  }

  // Convert the JSON text to a JavaScript object and return it
  const quizJson = JSON.parse(jsonMatch[0]);

  return quizJson; // This contains the topic and 5 questions
}

/**
 * Display the current question on the screen
 * This updates all the text and buttons for the current question
 */
function displayQuestion() {
  const question = quizData.questions[currentQuestionIndex]; // Get current question from our quiz data

  // Update the question number (add 1 because we start counting at 0)
  currentQuestion.textContent = currentQuestionIndex + 1;

  // Update the question text
  questionText.textContent = question.question;

  // Get all answer buttons
  const answerButtons = document.querySelectorAll(".answer-btn");
  const labels = ["A", "B", "C", "D"]; // Labels for our buttons

  // Update each answer button
  answerButtons.forEach((btn, index) => {
    // Set button text to "A. Answer", "B. Answer", etc.
    btn.textContent = `${labels[index]}. ${question.options[index]}`;

    // Reset button styling (remove red/green from previous question)
    btn.className = "btn btn-outline-primary answer-btn";

    // Enable the button (it was disabled after previous answer)
    btn.disabled = false;

    // Remove old click listeners by cloning the button
    // This is a trick to remove all event listeners
    const newBtn = btn.cloneNode(true); // Create a copy
    btn.parentNode.replaceChild(newBtn, btn); // Replace old with new

    // Add new click listener to the new button
    newBtn.addEventListener("click", () => selectAnswer(index));
  });

  // Hide the explanation from previous question
  explanationContainer.style.display = "none";
}

/**
 * Handle when user selects an answer
 * This checks if answer is correct and shows feedback
 */
function selectAnswer(selectedIndex) {
  const question = quizData.questions[currentQuestionIndex]; // Get current question
  const correctIndex = question.correct; // Get index of correct answer (0-3)
  const answerButtons = document.querySelectorAll(".answer-btn"); // Get all buttons

  // Disable all buttons so user can't click again
  answerButtons.forEach((btn) => (btn.disabled = true));

  // Highlight the correct answer in green
  answerButtons[correctIndex].classList.remove("btn-outline-primary");
  answerButtons[correctIndex].classList.add("btn-success"); // Bootstrap green button

  // Check if user selected wrong answer
  if (selectedIndex !== correctIndex) {
    // User was wrong - highlight their answer in red
    answerButtons[selectedIndex].classList.remove("btn-outline-primary");
    answerButtons[selectedIndex].classList.add("btn-danger"); // Bootstrap red button
    explanationBox.className = "alert alert-danger"; // Red explanation box
  } else {
    // User was correct!
    score++; // Increase score by 1
    scoreElement.textContent = score; // Update score display
    explanationBox.className = "alert alert-success"; // Green explanation box
  }

  // Show the explanation
  explanationText.textContent = question.explanation;
  explanationContainer.style.display = "block"; // Make explanation visible
}

/**
 * Move to the next question
 * This runs when user clicks "Next Question" button
 */
function nextQuestion() {
  currentQuestionIndex++; // Move to next question (increase by 1)

  // Check if we've finished all questions
  if (currentQuestionIndex >= quizData.questions.length) {
    // Quiz is complete! Show results
    showResults();
  } else {
    // More questions left, show the next one
    displayQuestion();
  }
}

/**
 * Show the final results screen
 * This displays the user's score and a message
 */
function showResults() {
  // Hide the quiz section
  quizSection.style.display = "none";

  // Show the results section
  resultsSection.style.display = "block";

  // Display the final score
  finalScore.textContent = score;

  // Show different messages based on score
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
 * This runs when user clicks "Try Another Topic" button
 */
function restartQuiz() {
  // Hide the results section
  resultsSection.style.display = "none";

  // Start a new quiz (this will generate a new topic and questions)
  startQuiz();
}

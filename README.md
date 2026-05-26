# 🧠 AI Quiz App

An intelligent, beginner-friendly quiz application powered by **Google Gemini AI** that generates unlimited quiz questions on diverse topics. Get personalized learning experiences with instant feedback and detailed explanations.

## 🌐 Live Demo

👉 **[quiz.obaidinfo.xyz](https://quiz.obaidinfo.xyz)** - Primary URL  
👉 **[kwiz.obaidinfo.xyz](https://kwiz.obaidinfo.xyz)** - Alternative URL

Both URLs point to the same application hosted on AWS S3 with CloudFront CDN for fast global access.

---

## ✨ Features

- 🎲 **Random Topic Generation** - AI selects from 100+ diverse topics (History, Science, Sports, Movies, Technology, and more)
- 🤖 **AI-Powered Questions** - Uses Google Gemini 2.5 Flash for intelligent question generation
- 📊 **Real-Time Score Tracking** - See your progress instantly
- 💡 **Detailed Explanations** - Learn why answers are correct with educational explanations
- 📱 **Fully Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🚀 **No Backend Required** - Pure front-end application, works as static website
- ☁️ **Cloud Hosted** - Deployed on AWS S3 with CloudFront CDN
- 🔒 **Privacy Focused** - API key stored locally in your browser only
- 💾 **Topic History** - Tracks used topics to ensure variety in questions
- ⚡ **Fast Loading** - Instant page load with optimized assets

## 🛠️ Technologies Used

- **Frontend:**
  - HTML5 (Semantic markup)
  - CSS3 (Animations, Gradients, Responsive Design)
  - JavaScript (Vanilla ES6+, no frameworks)
  - Bootstrap 5 (UI Components)
  
- **AI & API:**
  - Google Gemini 2.5 Flash API
  - JSON-based question generation
  
- **Hosting:**
  - AWS S3 (Storage)
  - CloudFront CDN (Global distribution)
  - Route 53 DNS (Domain management)

## 📚 Available Quiz Topics

The app can generate quizzes on topics including but not limited to:

- **History:** World History, Ancient Civilizations, Modern History, Art History
- **Science:** Biology, Chemistry, Physics, Astronomy, Space Exploration
- **Geography:** World Capitals, Countries & Flags, Mountains & Rivers
- **Entertainment:** Movies, Cinema, Animated Films, TV Shows
- **Sports:** Football, Basketball, Olympics, Cricket
- **Technology:** AI, Programming, Computer Science, Inventions
- **Culture:** Music, Literature, Mythology, Languages, Art
- **And 70+ more topics!**

## 🚀 Getting Started

### Quick Start (Online)

Simply visit one of the live URLs above:
- [https://quiz.obaidinfo.xyz](https://quiz.obaidinfo.xyz)
- [https://kwiz.obaidinfo.xyz](https://kwiz.obaidinfo.xyz)

### Local Setup

1. **Clone the repository:**
```bash
git clone https://github.com/ObaidAbdullah16/Quiz-App.git
cd Quiz-App
```

2. **Get a Free Google Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy your API key

3. **Run locally:**
   - Open `index.html` in your web browser
   - Or use a local server:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

4. **Start the quiz:**
   - Paste your Google Gemini API key
   - Click "Save & Start Quiz"
   - Enjoy learning!

**Note:** Your API key is stored only in your browser's localStorage and never shared.

## 📊 How It Works

### Step-by-Step Process:

```
1. User enters API key
   ↓
2. App generates random topic
   ↓
3. AI creates 5 multiple-choice questions
   ↓
4. User answers each question
   ↓
5. Instant feedback with correct answer highlighted
   ↓
6. Detailed explanation provided
   ↓
7. Final score displayed with motivational message
   ↓
8. User can start new quiz with different topic
```

### Question Generation Flow:

```
Random Topic Selection (from 100+ topics)
          ↓
Google Gemini API Request
          ↓
AI Generates:
  - Question text
  - 4 Multiple choice options
  - Correct answer index
  - Educational explanation
          ↓
JSON Response Parsing
          ↓
Display on Screen with Animations
```

## 📁 Project Structure

```
Quiz-App/
├── index.html          # Main HTML structure
│   ├── Header section with title & buttons
│   ├── API Key input form
│   ├── Quiz display section
│   ├── Results section
│   └── Loading spinner
│
├── script.js          # JavaScript logic (~415 lines)
│   ├── API Configuration
│   ├── Global Variables & Topic List
│   ├── DOM Element References
│   ├── Event Listeners
│   ├── Quiz Generation Logic
│   ├── Question Display & Validation
│   ├── Score Calculation
│   ├── Topic History Management
│   └── Error Handling
│
├── style.css          # Custom styling (~163 lines)
│   ├── Purple gradient background
│   ├── Card & Container styling
│   ├── Button animations & hover effects
│   ├── Topic display styling
│   ├── Explanation box animations
│   ├── Loading spinner
│   └── Mobile responsive design
│
└── README.md          # This file
```

## 🎨 UI Components

### 1. **API Key Setup Section**
- Input field for Google Gemini API key
- "Save & Start Quiz" button
- Link to get free API key
- Privacy notice

### 2. **Quiz Display**
- Current topic shown in alert box
- Question counter (e.g., "Question 1/5")
- Question text
- 4 Multiple-choice answer buttons (A, B, C, D)
- Real-time score display

### 3. **Answer Feedback**
- Correct answer highlighted in green
- Wrong answer highlighted in red
- Detailed explanation with educational content
- "Next Question" button

### 4. **Results Screen**
- Final score display
- Motivational message based on performance
- "Try Another Topic" button to restart

### 5. **Utility Buttons**
- "Reset Topic History" - Clear used topics
- "Show Topic History" - View topics you've seen

## 🔐 Privacy & Security

✅ **Secure:**
- API key stored **only** in browser's localStorage
- Never transmitted to any server except Google Gemini
- No personal data collection
- No tracking or analytics

✅ **Local Storage:**
- Used topics list saved locally
- API key persists across sessions
- User can clear all data anytime

## 💰 Cost Breakdown

| Component | Cost |
|-----------|------|
| Google Gemini API | FREE (60 requests/minute) |
| AWS S3 Storage | FREE (5GB tier) |
| CloudFront CDN | FREE (1GB/month tier) |
| Route 53 DNS | $0.50/month |
| **Total Monthly Cost** | **~$0.50** |

## 📱 Responsive Design

### Breakpoints:

```css
Mobile:     320px - 576px   (Full width, optimized touch)
Tablet:     577px - 992px   (Wide layout, comfortable spacing)
Desktop:    993px+          (Max width 800px container)
```

### Mobile Optimizations:
- Reduced padding on small screens
- Touch-friendly button sizes
- Optimized font sizes
- Full-screen support

## 🧪 Testing & Debugging

### Browser Console:
Press `F12` to open developer tools. You'll see:
- Selected topic
- API request details
- API response data
- Error messages with solutions

### Troubleshooting:

**"API Error: Invalid API Key"**
- Check if your API key is correct
- Make sure it's for Google Gemini
- Regenerate key at [Google AI Studio](https://makersuite.google.com/app/apikey)

**"No JSON found in response"**
- AI failed to generate valid JSON
- Try again - it usually works on retry
- Check browser console for details

**"Network Error"**
- Check internet connection
- Verify not behind restrictive firewall
- Try disabling browser extensions

**Questions not appearing?**
- Wait for loading spinner to complete
- Check browser console (F12)
- Clear localStorage and try again

## 🚀 Deployment Guide

### Deploy on AWS S3 + CloudFront (Recommended)

1. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://quiz-app-production
   ```

2. **Upload Files:**
   ```bash
   aws s3 sync ./ s3://quiz-app-production \
     --exclude "README.md" \
     --exclude ".git"
   ```

3. **Enable Static Website Hosting:**
   - S3 Console → Properties → Static website hosting
   - Index document: `index.html`
   - Error document: `index.html` (for SPA routing)

4. **Create CloudFront Distribution:**
   - Origin: S3 website endpoint
   - Alternate domain names: `quiz.obaidinfo.xyz`, `kwiz.obaidinfo.xyz`
   - SSL certificate: Your domain certificate
   - Default root object: `index.html`

5. **Update Route 53 DNS:**
   ```
   Record name: quiz
   Type: A (Alias)
   Alias target: CloudFront domain
   
   Record name: kwiz
   Type: A (Alias)
   Alias target: CloudFront domain
   ```

### Deploy on GitHub Pages

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Settings → Pages
   - Branch: main
   - Deploy to `https://username.github.io/Quiz-App`

## 📖 Code Highlights

### Clean Code Practices:
- ✅ Extensive comments explaining logic
- ✅ Semantic variable names
- ✅ Modular functions (single responsibility)
- ✅ Error handling with helpful messages
- ✅ No external dependencies (vanilla JavaScript)

### Key Functions:

```javascript
generateQuiz()           // AI generates questions via Gemini API
displayQuestion()        // Shows current question on screen
selectAnswer()           // Handles user answer selection
nextQuestion()           // Moves to next question
showResults()            // Displays final score & message
getRandomUnusedTopic()   // Selects new topic with variety
```

## 🌟 Performance Metrics

- **Page Load Time:** < 1 second
- **Quiz Generation:** 2-3 seconds (API call)
- **Answer Feedback:** Instant (< 100ms)
- **Overall Latency:** Optimized with CDN caching

## 📝 Future Enhancements

- [ ] Difficulty levels (Easy, Medium, Hard)
- [ ] Custom topic input
- [ ] Leaderboard with scoring history
- [ ] Category-based quizzes
- [ ] Timer mode (timed questions)
- [ ] Dark mode toggle
- [ ] Multiplayer quiz sessions
- [ ] Export score as PDF
- [ ] Community-shared quizzes
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Make your changes:**
   - Add comments for complex logic
   - Ensure responsive design
   - Test on mobile & desktop
4. **Commit your changes:**
   ```bash
   git commit -m "Add YourFeature"
   ```
5. **Push to your branch:**
   ```bash
   git push origin feature/YourFeature
   ```
6. **Open a Pull Request**

### Ideas to Contribute:
- New UI themes
- Additional quiz topics
- Performance optimizations
- Accessibility improvements
- Bug fixes & testing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Obaid Abdullah**
- GitHub: [@ObaidAbdullah16](https://github.com/ObaidAbdullah16)
- Portfolio: [obaidinfo.xyz](https://obaidinfo.xyz)
- Quiz App: [quiz.obaidinfo.xyz](https://quiz.obaidinfo.xyz) | [kwiz.obaidinfo.xyz](https://kwiz.obaidinfo.xyz)

## 📚 Learning Resources

Want to learn more about the technologies used?

- [MDN - HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [MDN - CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [MDN - JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Google Gemini API Guide](https://ai.google.dev/tutorials/python_quickstart)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

## 🐛 Known Issues

None currently! If you find any bugs or have issues, please [report them](https://github.com/ObaidAbdullah16/Quiz-App/issues).

## 📞 Support

If you encounter any issues or have questions:

- 📮 Open an [Issue](https://github.com/ObaidAbdullah16/Quiz-App/issues)
- 💬 Check [Discussions](https://github.com/ObaidAbdullah16/Quiz-App/discussions)
- 🌐 Visit my [Portfolio](https://obaidinfo.xyz)
- 🎯 Try the live app at [quiz.obaidinfo.xyz](https://quiz.obaidinfo.xyz)

## ⭐ Show Your Support

Give a ⭐️ if you found this project helpful!

---

**Built with ❤️ using vanilla JavaScript and powered by Google Gemini AI**

**Last Updated:** May 26, 2026

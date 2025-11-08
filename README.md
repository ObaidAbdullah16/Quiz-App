# 🧠 AI Quiz App

A simple, beginner-friendly quiz application that uses Google Gemini AI to generate random quiz questions on various topics.

## ✨ Features

- 🎲 Random topic generation (History, Science, Sports, Movies, etc.)
- 🤖 AI-powered question generation using Google Gemini
- 📊 Score tracking
- 💡 Detailed explanations for each answer
- 📱 Fully responsive design with Bootstrap
- 🚀 No backend required - works as a static website
- ☁️ Can be hosted on AWS S3

## 🚀 How to Use

### Step 1: Get Your Free Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

**Note:** The free tier gives you plenty of requests per day for personal use!

### Step 2: Run the App

1. Download all files (`index.html`, `script.js`, `style.css`)
2. Open `index.html` in your web browser
3. Paste your API key and click "Save & Start Quiz"
4. Enjoy the quiz!

Your API key is saved in your browser's local storage, so you only need to enter it once.

## 📁 Files Included

- `index.html` - Main webpage structure
- `script.js` - All JavaScript logic (with comments)
- `style.css` - Custom styling
- `README.md` - This file

## ☁️ How to Host on AWS S3

### Step 1: Create an S3 Bucket

1. Log in to [AWS Console](https://aws.amazon.com/console/)
2. Go to S3 service
3. Click "Create bucket"
4. Choose a unique bucket name (e.g., `my-quiz-app-12345`)
5. Uncheck "Block all public access"
6. Click "Create bucket"

### Step 2: Upload Files

1. Open your bucket
2. Click "Upload"
3. Add all files: `index.html`, `script.js`, `style.css`
4. Click "Upload"

### Step 3: Enable Static Website Hosting

1. Go to bucket "Properties" tab
2. Scroll to "Static website hosting"
3. Click "Edit"
4. Select "Enable"
5. Index document: `index.html`
6. Click "Save changes"

### Step 4: Make Files Public

1. Go to "Permissions" tab
2. Click "Bucket Policy"
3. Add this policy (replace `YOUR-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

4. Click "Save changes"

### Step 5: Access Your Website

1. Go back to "Properties" tab
2. Scroll to "Static website hosting"
3. Copy the "Bucket website endpoint" URL
4. Open it in your browser!

**Example URL:** `http://my-quiz-app-12345.s3-website-us-east-1.amazonaws.com`

## 🛠️ How It Works

1. **User enters API key**: Saved in browser's localStorage
2. **AI generates quiz**: Sends request to Google Gemini API
3. **Random topic**: AI picks a random interesting topic
4. **5 Questions**: AI creates 5 multiple-choice questions
5. **Instant feedback**: Shows correct answer with explanation
6. **Final score**: Displays results at the end

## 💻 Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla - no frameworks!)
- Bootstrap 5
- Google Gemini AI API

## 📝 Code Simplicity

All code is written for absolute beginners:

- ✅ Lots of comments explaining each part
- ✅ Simple JavaScript (no complex patterns)
- ✅ Easy to read and understand
- ✅ No build tools or dependencies needed

## 🔒 Privacy

- Your API key is stored **only** in your browser (localStorage)
- No data is sent to any server except Google Gemini
- No tracking or analytics

## 💰 Cost

- **Completely FREE!**
- Google Gemini free tier: 60 requests per minute
- AWS S3 free tier: 5GB storage, 15GB transfer per month

## 🎓 Learning Resources

Want to learn more?

- [HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)
- [Bootstrap Docs](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

## 📧 Questions?

This is a simple learning project. Feel free to modify and improve it!

---

**Enjoy your quiz! 🎉**

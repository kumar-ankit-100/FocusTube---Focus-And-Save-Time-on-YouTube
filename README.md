# 🎯 FocusTube – Blur Distractions, Boost Productivity on YouTube

**FocusTube** is a Chrome extension designed to help you stay focused and reduce time wasted on distracting YouTube videos. It automatically blurs entertainment content and highlights educational videos — turning YouTube into a productivity-friendly space.

> ⚡ Future vision: Integrate a machine learning model powered by reinforcement learning to classify content dynamically and improve over time based on user interaction.

---

## 🧠 Why FocusTube?

YouTube is a goldmine of knowledge — but it’s also a rabbit hole of distractions. You open it to learn JavaScript, and 3 hours later you’re watching cat videos or prank compilations.

FocusTube helps you:
- Blur distracting content on homepage, search results, and recommended sections.
- Highlight educational videos.
- Choose whether to view blurred videos manually.
- Track session interactions to enable smart ML-based improvements later.

---


## 📸 Screenshots



---


## 🚀 Features

- ✅ **Auto Blur**: Videos with entertainment keywords or channels are automatically blurred.
- ✅ **Educational Detection**: Based on title keywords and verified channels.
- ✅ **Overlay**: Option to "Show Anyway" for blurred content.
- ✅ **Session Tracking**: Tracks video click behavior for future reinforcement learning updates.
- ✅ **Mutation Observer**: Handles dynamic YouTube loading via SPA (Single Page Application).
- ⚙️ **Configurable Settings** (e.g., blur intensity, auto-mode, threshold score).

---

## 🛠️ How It Works

**Current Logic (Rule-based)**:
- Uses predefined **educational** and **entertainment** keywords.
- Scores the video title and channel based on matches.
- If educational score < `threshold`, it applies a blur.
- User can manually unblur any content.

**Tech Stack**:
- JavaScript
- Chrome Extension APIs
- DOM Parsing + Mutation Observer

---

## 🧬 Future Scope: Smarter Classification with Machine Learning

We plan to replace the current rule-based classification with an intelligent ML system:

- 🤖 **ML Model**: Use NLP to predict whether a video is educational or distracting.
- 🔄 **Reinforcement Learning**: Adapt based on user interaction (e.g., unblurring entertainment videos frequently? Learn from that!).
- 💾 **User Feedback Loop**: Incorporate user behavior (clicks, watch time) into model training.

---

## 🔧 Installation

1. Clone or download this repo.
2. Go to `chrome://extensions/` in your browser.
3. Enable **Developer mode**.
4. Click on **Load unpacked** and select this extension folder.
5. Visit [YouTube](https://www.youtube.com) and start focusing!

---







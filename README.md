# Happy New Year 2026 - Cinematic Greeting Card

A premium, interactive web-based greeting card designed to impress. This project features a cinematic visual experience using pure HTML5 Canvas, CSS3, and JavaScript—no external libraries required.

## 🌟 Features

*   **Cinematic Intro**: Starts with a mesmerizing "New Year Protocol" envelope and deep space starfield background.
*   **Dramatic Experience**: Features a high-stakes countdown (3... 2... 1...) to build anticipation.
*   **Physics-Based Fireworks**: A custom-built particle engine rendering realistic fireworks with gravity, drag, and fade effects.
*   **3D Interactive Card**: The main greeting card responds to mouse movement with a smooth 3D parallax tilt effect.
*   **Responsive Design**: Works on desktops, tablets, and mobile devices.
*   **Audio Support**: Built-in support for background music (local or remote).

## 🚀 How to Run

1.  **Simply Open the File**: Double-click `index.html` in your web browser.
2.  **Interact**: Click the "Open Greeting" button to start the experience.
3.  **Enjoy**: Watch the countdown and the grand reveal!

## 📂 Project Structure

```text
Happy-New-Year/
├── assets/
│   ├── css/
│   │   └── main.css       # All premium styling, animations, and responsive rules
│   └── js/
│       └── main.js        # Logic for fireworks, starfield, countdown, and 3D effects
├── index.html             # The main entry point
└── README.md              # Project documentation
```

## 🎵 Customization

### Background Music
The project supports background audio.
1.  **Online URL**: You can edit `index.html` and set a URL in the `<source>` tag.
2.  **Local File**: Rename your favorite MP3 file to `music.mp3` and place it in the root folder. The code is already set up to look for it as a fallback.

### Message
To change the greeting text:
1.  Open `index.html` in a text editor.
2.  Look for the `<!-- CELEBRATION -->` section.
3.  Edit the text inside `<h1>`, `<h2>`, or `<p>` tags.

## 🛠️ Technologies Used
*   **HTML5**: Semantic structure and Audio API.
*   **CSS3**: Flexbox, 3D Transforms (`perspective`, `rotateX/Y`), CSS Gradients, and Glassmorphism.
*   **JavaScript (ES6+)**: HTML5 Canvas API for high-performance rendering of the Starfield and Firework systems.

---
*Created with ❤️ to celebrate 2026.*

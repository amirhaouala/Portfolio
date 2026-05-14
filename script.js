// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
// When the user scrolls down past 50px, add a semi-transparent
// dark background with a blur effect to the navbar.
// When back at the top, restore the transparent background.

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar?.classList.add("bg-dark/90", "backdrop-blur-md");
    navbar?.classList.remove("bg-transparent");
  } else {
    navbar?.classList.remove("bg-dark/90", "backdrop-blur-md");
    navbar?.classList.add("bg-transparent");
  }
});

// ============================================================
// MOBILE MENU TOGGLE
// ============================================================
// Handles opening and closing of the mobile navigation menu.
// Also resets the menu state when a link inside it is clicked.

const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");
const closeIcon = document.getElementById("close-icon");
const navBar = document.getElementById("navbar");

// Toggle menu visibility when the hamburger button is clicked
mobileMenuBtn?.addEventListener("click", () => {
  mobileMenu?.classList.toggle("hidden");
  menuIcon?.classList.toggle("hidden");
  closeIcon?.classList.toggle("hidden");
  navBar?.classList.toggle("bg-transparent");
});

// Close the menu automatically when the user taps a navigation link
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu?.classList.add("hidden");
    menuIcon?.classList.remove("hidden");
    closeIcon?.classList.add("hidden");
  });
});

// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================
// Uses the IntersectionObserver API to watch elements with the
// classes .reveal, .reveal-left, or .reveal-right. When they
// enter the viewport (10% visible), the .visible class is added
// to trigger the CSS fade-in animation.

const observerOptions = {
  root: null, // use the viewport as the observation area
  rootMargin: "0px", // no extra margin around the viewport
  threshold: 0.1, // trigger when 10% of the element is visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // stop observing once animated
    }
  });
}, observerOptions);

// Attach the observer to every element that should animate on scroll
document
  .querySelectorAll(".reveal, .reveal-left, .reveal-right")
  .forEach((el) => {
    observer.observe(el);
  });

// ============================================================
// CONTACT FORM HANDLING
// ============================================================
// Simulates a form submission with a 1-second delay.
// Updates the submit button text and icon to show a success state,
// then resets everything after 3 seconds.

const form = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");
const btnText = document.getElementById("btn-text");
const btnIcon = document.getElementById("btn-icon");

form?.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent the browser from actually submitting the form

  // Show loading state
  btnText.textContent = "Sending...";
  submitBtn.disabled = true;

  // Simulate network request with a 1-second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Show success state
  btnText.textContent = "Message Sent!";
  btnIcon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>'; // checkmark icon
  form.reset();

  // Revert button to its original state after 3 seconds
  setTimeout(() => {
    btnText.textContent = "Send Message";
    btnIcon.innerHTML =
      '<line x1="22" x2="11" y1="2" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>'; // send icon
    submitBtn.disabled = false;
  }, 3000);
});

// ============================================================
// TERMINAL ENGINE
// ============================================================
// Interactive command-line interface embedded in the page.
// Visitors type commands and get typed responses character-by-
// character. Available commands: skills, experience, contact, clear.

const terminalOutput = document.getElementById("terminalOutput");
const terminalInput = document.getElementById("terminalInput");
const terminalWindow = document.getElementById("terminalWindow");

// Each command maps to a response string displayed character by character
const COMMANDS = {
  skills:
    "Loading arsenal...\n\n" +
    "Go | Node.js | TypeScript | Python\n" +
    "React | SolidJS | SvelteKit | Astro | Tailwind CSS\n" +
    "Parse Server | supabase/gotrue | GraphQL | Github Actions | Laravel\n" +
    "Linux Server | Containerization | Virtualization | HAProxy\n" +
    "PostgreSQL | Redis\n" +
    "Burp Suite | Security Onion | Robot | Selenium\n" +
    "Google Colab | Data Engineering | Fine Tuning",

  experience:
    "Loading operation history...\n\n" +
    "[2023-2025] Software Engineer — ITGOCRAFT\n" +
    "[2022-2023] Software Engineer — Intuitive.ai GmbH\n" +
    "[2022] Backend Engineer — CareerBoosts\n" +
    "[2021] Full Stack Intern — Data1-it\n" +
    "[2020] Cyber Security Intern — Smart Skills",

  contact:
    "Establishing secure channel...\n\n" +
    "Phone: +216 58 804 727\n" +
    "Email: amir-haouala@outlook.com\n" +
    "Social Media: Amir Haouala\n\n",

  clear: "__CLEAR__", // Special marker — wipes and restarts
};

// Welcome message typed out on page load
const WELCOME_LINES = [
  "System initialized...",
  "Welcome to the secure terminal.",
  "Type a command to proceed:",
  "  skills     - Display technical arsenal",
  "  experience - Show operation history",
  "  contact    - Establish communication",
  "  clear      - Reset terminal",
];

let isTyping = false;
let typeInterval = null;

// Append a complete line instantly (no typing effect)
function appendLine(text, type) {
  const line = document.createElement("div");
  line.className = "whitespace-pre-wrap mb-1 font-terminal";
  line.style.color = type === "error" ? "#ff1a1a" : "#33ff00";
  line.style.fontSize = "18px";
  line.style.lineHeight = "1.6";
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  return line;
}

// Type text character by character with a small delay
function typeText(text, type) {
  return new Promise((resolve) => {
    isTyping = true;
    const line = document.createElement("div");
    line.className = "whitespace-pre-wrap mb-1 font-terminal";
    line.style.color = type === "error" ? "#ff1a1a" : "#33ff00";
    line.style.fontSize = "18px";
    line.style.lineHeight = "1.6";
    terminalOutput.appendChild(line);

    let i = 0;
    const chars = text.split("");
    typeInterval = setInterval(() => {
      if (i < chars.length) {
        line.textContent += chars[i];
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        i++;
      } else {
        clearInterval(typeInterval);
        isTyping = false;
        resolve();
      }
    }, 12);
  });
}

// Remove the current input prompt line
function removeInputLine() {
  const line = document.getElementById("currentInputLine");
  if (line) line.remove();
}

// Add the interactive input line with blinking cursor
function addInputLine() {
  removeInputLine();
  const div = document.createElement("div");
  div.id = "currentInputLine";
  div.className = "flex items-center mt-2 font-terminal";
  div.style.fontSize = "18px";
  div.style.color = "#33ff00";
  div.innerHTML =
    '<span class="mr-2">&gt;</span>' +
    '<span id="typedText"></span>' +
    '<span id="termCursor" class="cursor-blink"></span>';
  terminalOutput.appendChild(div);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Show welcome message on first load
async function showWelcome() {
  for (const line of WELCOME_LINES) {
    await typeText(line);
  }
  addInputLine();
}

// Process a command entered by the user
async function runCommand(command) {
  const cmd = command.trim().toLowerCase();
  removeInputLine();
  appendLine("> " + command);

  if (cmd === "clear") {
    terminalOutput.innerHTML = "";
    await showWelcome();
    return;
  }

  const response = COMMANDS[cmd];
  if (response) {
    await typeText(response);
  } else {
    await typeText(
      "Command not recognized. Type 'skills', 'experience', or 'contact'.",
      "error",
    );
  }

  addInputLine();
}

// Handle Enter key — submit the command
terminalInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && terminalInput.value.trim() && !isTyping) {
    const cmd = terminalInput.value;
    terminalInput.value = "";
    runCommand(cmd);
  }
});

// Sync hidden input value to the visible typed text
terminalInput?.addEventListener("input", () => {
  const display = document.getElementById("typedText");
  if (display) {
    display.textContent = terminalInput.value;
  }
});

// Clicking anywhere on the terminal focuses the hidden input
terminalWindow?.addEventListener("click", () => {
  terminalInput.focus();
});

// Click to copy email from contact command output
terminalOutput?.addEventListener("click", (e) => {
  if (e.target.textContent === "[copy_email]") {
    navigator.clipboard
      .writeText("amir-haouala@outlook.com")
      .then(() => appendLine("Email copied to clipboard!"))
      .catch(() => appendLine("Failed to copy.", "error"));
  }
});

// ============================================================
// TERMINAL ENTRANCE ANIMATION
// ============================================================
// When the terminal section scrolls into view, it scales up
// from slightly smaller with a fade-in effect.

const termObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        termObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);

if (terminalWindow) {
  termObserver.observe(terminalWindow);
}

// ============================================================
// BOOT — initialize the terminal
// ============================================================

showWelcome();
terminalInput?.focus();

// Keep terminal focused by default, but release focus when the user
// clicks on normal page content (e.g. to select text) or interacts
// with focusable elements like inputs, buttons, or links.
let allowTerminalFocus = true;

document.addEventListener("mousedown", (e) => {
  const inTerminal = e.target.closest("#terminal") != null;
  const isFocusable =
    e.target.closest(
      "input, textarea, button, a, select, label, [contenteditable]"
    ) != null;

  if (!inTerminal && !isFocusable) {
    allowTerminalFocus = false;
  }
});

document.addEventListener("mouseup", () => {
  allowTerminalFocus = true;
});

terminalInput?.addEventListener("blur", () => {
  // Capture the flag value at blur time so a later mouseup can't
  // race ahead and reset it before this timeout fires.
  const mayRefocus = allowTerminalFocus;

  setTimeout(() => {
    if (!mayRefocus) return;

    const active = document.activeElement;
    const isFocusable =
      active?.matches?.(
        "input, textarea, button, a, select, label, [contenteditable]"
      ) || active?.closest?.("#contact-form") != null;

    if (!isFocusable && active !== terminalInput) {
      terminalInput.focus();
    }
  }, 10);
});

// Easter egg: styled greeting in the browser console
console.log(
  "%c Amir Haouala ",
  "background: #c41e3a; color: #f0e6d3; font-size: 20px; font-weight: bold;",
);
console.log(
  "%c> System initialized. ",
  "color: #33ff00; font-family: monospace;",
);

// ============================================================
// SVG INLINER
// ============================================================
// Replaces <img data-svg="path/to.svg"> placeholders with the
// actual inline SVG content. This preserves currentColor styling
// (hover colour changes) while keeping SVGs in separate files.

async function inlineSVGs() {
  const images = document.querySelectorAll("img[data-svg]");
  for (const img of images) {
    try {
      const res = await fetch(img.dataset.svg);
      if (!res.ok) continue;
      const svgText = await res.text();

      // Parse the fetched SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (!svgEl) continue;

      // Copy classes from the placeholder img
      if (img.className) {
        svgEl.classList.add(...img.classList);
      }
      // Copy id if present
      if (img.id) {
        svgEl.id = img.id;
      }

      // Replace the img with the inline SVG
      img.replaceWith(svgEl);
    } catch (err) {
      // Silently fail — the img alt text remains as fallback
    }
  }
}

inlineSVGs();

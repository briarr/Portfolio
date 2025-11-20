const before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const contentscroll = document.getElementById("contentscroll");

let git = 0;
let pw = false;
const commands = [];
let suggestedCommand = null;
let awaitingConfirmation = false;

// small cache to avoid updating identical suggestion repeatedly
let lastSuggestionRest = null;

function scrollToBottom() {
  if (contentscroll) {
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }
}

const commandMap = {
  theme: "theme",
  help: "help",
  aboutme: "aboutme",
  projects: "projects",
  social: "social",
  email: "email",
  history: "history",
  sudo: "sudo",
  clear: "clear",
  dev: "dev",
  twitter: "twitter",
  linkedin: "linkedin",
  instagram: "instagram",
  github: "github",
  snake: "snake",
  copyurl: "copyurl",
  url: "copyurl",
};

// Theme presets: map CSS variable names to values.
const themes = {
  default: {
    "--color-primary": "#554c40",
    "--color-secondary": "#928e85",
    "--color-tertiary": "#a05f49",
    "--color-background": "#32312d",
    "--color-background-overlay": "#423a35",
    "--color-accent": "#9e504d",
    "--color-danger": "#9d174d",
    "--color-hover": "#5a666af0",
    "--color-shadow": "#1d1e1fb4",
    "--color-command": "#ddc5a6",
    "--color-error": "#b9896dd9",
    "--color-white": "#ffffff",
  "--ascii-gradient": "linear-gradient(90deg, #743131, #9f6328, #7e4a54, #74613a, #834f3f, #866840, #853838)",
  },
  light: {
    "--color-primary": "#2b2b2b",
    "--color-secondary": "#3b3b3b",
    "--color-tertiary": "#444444",
    "--color-background": "#f6f6f6",
    "--color-background-overlay": "#ffffff",
    "--color-accent": "#0066cc",
    "--color-danger": "#cc0000",
    "--color-hover": "#888888",
    "--color-shadow": "#00000010",
    "--color-command": "#005f73",
    "--color-error": "#b00020",
    "--color-white": "#000000",
  "--ascii-gradient": "linear-gradient(90deg, #222222, #444444, #666666, #888888)",
  },
  solarized: {
    "--color-primary": "#268bd2",
    "--color-secondary": "#839496",
    "--color-tertiary": "#b58900",
    "--color-background": "#002b36",
    "--color-background-overlay": "#073642",
    "--color-accent": "#2aa198",
    "--color-danger": "#dc322f",
    "--color-hover": "#586e75",
    "--color-shadow": "#00000088",
    "--color-command": "#b58900",
    "--color-error": "#cb4b16",
    "--color-white": "#fdf6e3",
  "--ascii-gradient": "linear-gradient(90deg, #268bd2, #2aa198, #b58900)",
  },
  neon: {
    "--color-primary": "#39ff14",
    "--color-secondary": "#a3ffce",
    "--color-tertiary": "#ff6ec7",
    "--color-background": "#0b0b0b",
    "--color-background-overlay": "#0f0f0f",
    "--color-accent": "#00e5ff",
    "--color-danger": "#ff0055",
    "--color-hover": "#66ffcc",
    "--color-shadow": "#000000cc",
    "--color-command": "#00ff9c",
    "--color-error": "#ff5577",
    "--color-white": "#ffffff",
  "--ascii-gradient": "linear-gradient(90deg, #39ff14, #00e5ff, #ff6ec7)",
  },
  dracula: {
    "--color-primary": "#6272a4",
    "--color-secondary": "#f8f8f2",
    "--color-tertiary": "#bd93f9",
    "--color-background": "#282a36",
    "--color-background-overlay": "#21222c",
    "--color-accent": "#ff79c6",
    "--color-danger": "#ff5555",
    "--color-hover": "#50fa7b",
    "--color-shadow": "#000000cc",
    "--color-command": "#8be9fd",
    "--color-error": "#ffb86c",
    "--color-white": "#f8f8f2",
    "--ascii-gradient": "linear-gradient(90deg,#6272a4,#bd93f9,#ff79c6,#8be9fd)",
  },
  matrix: {
    "--color-primary": "#00ff41",
    "--color-secondary": "#66ff88",
    "--color-tertiary": "#33cc33",
    "--color-background": "#001100",
    "--color-background-overlay": "#001a00",
    "--color-accent": "#00ff99",
    "--color-danger": "#ff3333",
    "--color-hover": "#00cc66",
    "--color-shadow": "#000000cc",
    "--color-command": "#00ff41",
    "--color-error": "#ff6666",
    "--color-white": "#b7ffb7",
    "--ascii-gradient": "linear-gradient(90deg,#003300,#006600,#00ff41,#66ff88)",
  },
  sunset: {
    "--color-primary": "#ff6b6b",
    "--color-secondary": "#ffd166",
    "--color-tertiary": "#ff9a8b",
    "--color-background": "#2b0218",
    "--color-background-overlay": "#3a0f2f",
    "--color-accent": "#ff7ab6",
    "--color-danger": "#ff5c8a",
    "--color-hover": "#ffb88c",
    "--color-shadow": "#000000bb",
    "--color-command": "#ffd166",
    "--color-error": "#ff8fab",
    "--color-white": "#fff6ee",
    "--ascii-gradient": "linear-gradient(90deg,#ff6b6b,#ff9a8b,#ffd166,#ffd1a9)",
  },
  pastel: {
    "--color-primary": "#a8d5e2",
    "--color-secondary": "#f7e9d7",
    "--color-tertiary": "#cdb4db",
    "--color-background": "#fffaf0",
    "--color-background-overlay": "#fff2e6",
    "--color-accent": "#ffd6a5",
    "--color-danger": "#ffadad",
    "--color-hover": "#c6f6d5",
    "--color-shadow": "#00000011",
    "--color-command": "#70a1d7",
    "--color-error": "#ff7b7b",
    "--color-white": "#222222",
    "--ascii-gradient": "linear-gradient(90deg,#a8d5e2,#ffd6a5,#cdb4db,#c6f6d5)",
  },
  forest: {
    "--color-primary": "#2f5d50",
    "--color-secondary": "#7aa897",
    "--color-tertiary": "#4b8b3b",
    "--color-background": "#07130a",
    "--color-background-overlay": "#0b2014",
    "--color-accent": "#4fd1a6",
    "--color-danger": "#ff6b6b",
    "--color-hover": "#66ff99",
    "--color-shadow": "#000000cc",
    "--color-command": "#9be7c4",
    "--color-error": "#ff9b9b",
    "--color-white": "#eafaf1",
    "--ascii-gradient": "linear-gradient(90deg,#0b3d2e,#2f5d50,#7aa897)",
  },
  midnight: {
    "--color-primary": "#9fb4ff",
    "--color-secondary": "#cad7ff",
    "--color-tertiary": "#7aa2ff",
    "--color-background": "#031026",
    "--color-background-overlay": "#061633",
    "--color-accent": "#6ee7ff",
    "--color-danger": "#ff6b6b",
    "--color-hover": "#8fb3ff",
    "--color-shadow": "#000000cc",
    "--color-command": "#7aa2ff",
    "--color-error": "#ff9b9b",
    "--color-white": "#e6f0ff",
    "--ascii-gradient": "linear-gradient(90deg,#031026,#12305a,#7aa2ff,#cad7ff)",
  },
  gruvbox: {
    "--color-primary": "#ebdbb2",
    "--color-secondary": "#bdae93",
    "--color-tertiary": "#d79921",
    "--color-background": "#282828",
    "--color-background-overlay": "#32302f",
    "--color-accent": "#fb4934",
    "--color-danger": "#cc241d",
    "--color-hover": "#b8bb26",
    "--color-shadow": "#000000cc",
    "--color-command": "#fe8019",
    "--color-error": "#fb4934",
    "--color-white": "#fbf1c7",
    "--ascii-gradient": "linear-gradient(90deg,#d79921,#fb4934,#b8bb26)",
  },
  onedark: {
    "--color-primary": "#abb2bf",
    "--color-secondary": "#828997",
    "--color-tertiary": "#61afef",
    "--color-background": "#282c34",
    "--color-background-overlay": "#2c3040",
    "--color-accent": "#e5c07b",
    "--color-danger": "#e06c75",
    "--color-hover": "#98c379",
    "--color-shadow": "#000000cc",
    "--color-command": "#61afef",
    "--color-error": "#e06c75",
    "--color-white": "#dcdfe4",
    "--ascii-gradient": "linear-gradient(90deg,#61afef,#e5c07b,#98c379)",
  },
  tokyonight: {
    "--color-primary": "#7aa2f7",
    "--color-secondary": "#9aa9cc",
    "--color-tertiary": "#a3be8c",
    "--color-background": "#1a1b26",
    "--color-background-overlay": "#16161e",
    "--color-accent": "#7dcfff",
    "--color-danger": "#ff7b8b",
    "--color-hover": "#c0caf5",
    "--color-shadow": "#000000cc",
    "--color-command": "#7aa2f7",
    "--color-error": "#ff7b8b",
    "--color-white": "#c8d3f5",
    "--ascii-gradient": "linear-gradient(90deg,#7aa2f7,#7dcfff,#a3be8c)",
  },
  nord: {
    "--color-primary": "#8fbcbb",
    "--color-secondary": "#d8dee9",
    "--color-tertiary": "#88c0d0",
    "--color-background": "#2e3440",
    "--color-background-overlay": "#2b3340",
    "--color-accent": "#81a1c1",
    "--color-danger": "#bf616a",
    "--color-hover": "#a3be8c",
    "--color-shadow": "#000000cc",
    "--color-command": "#88c0d0",
    "--color-error": "#bf616a",
    "--color-white": "#eceff4",
    "--ascii-gradient": "linear-gradient(90deg,#8fbcbb,#88c0d0,#81a1c1)",
  },
  catppuccin: {
    "--color-primary": "#c6d0f5",
    "--color-secondary": "#f5d6e5",
    "--color-tertiary": "#f0c6c6",
    "--color-background": "#1e1e2e",
    "--color-background-overlay": "#26233a",
    "--color-accent": "#8bd5ca",
    "--color-danger": "#ed8796",
    "--color-hover": "#f8bd96",
    "--color-shadow": "#000000cc",
    "--color-command": "#8bd5ca",
    "--color-error": "#ed8796",
    "--color-white": "#f5f7ff",
    "--ascii-gradient": "linear-gradient(90deg,#c6d0f5,#8bd5ca,#f5d6e5)",
  },
};

function applyTheme(name, silent = false) {
  const preset = themes[name];
  if (!preset) {
    addLine(`Unknown theme '${name}'. Type 'theme' to list presets.`, "error", 80);
    return;
  }
  Object.keys(preset).forEach((k) => {
    document.documentElement.style.setProperty(k, preset[k]);
  });
  localStorage.setItem("terminal-theme", name);
  if (!silent) addLine(`Theme set to '${name}'`, "color2", 80);
}

function listThemes() {
  const names = Object.keys(themes);
  addLine("<br>", "", 0);
  const active = localStorage.getItem('terminal-theme') || 'default';
  const lines = names.map((n) => {
    return `${n === active ? '→ ' : '   '}<span class=\"command\">${n}</span>`;
  });
  loopLines(lines, "color2", 80);
  addLine("<br>", "", names.length * 80 + 50);
}

// Apply saved theme on startup if present
document.addEventListener('DOMContentLoaded', function() {
  const saved = localStorage.getItem('terminal-theme');
  if (saved && themes[saved]) {
    applyTheme(saved, true);
  }
});

setTimeout(function () {
  loopLines(banner, "", 80);
  textarea.focus();
  scrollToBottom();
}, 100);

window.addEventListener("keyup", function (e) {
  enterKey(e);
  scrollToBottom();
});

window.addEventListener("keydown", function (e) {
  // Prevent the browser from moving focus on Tab when the terminal input or suggestion is active
  if (e && e.key === 'Tab') {
    const active = document.activeElement;
    const hasSuggestion = (liner && liner.querySelector('.autocomplete-suggestion'));
    if (active === textarea || active === command || hasSuggestion) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  textarea.focus();
  scrollToBottom();
});

document.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

terminal.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

textarea.addEventListener("input", function() {
  syncCommandDisplay();
  updateAutocompleteSuggestion();
  scrollToBottom();
});

textarea.value = "";
command.innerHTML = textarea.value;

// Rainbow ASCII initialization
document.addEventListener("DOMContentLoaded", function () {
  try {
    const pre = document.querySelector(".ascii-Hero .ascii");
    if (pre) {
      // preserve original whitespace and line breaks by splitting into lines
      const lines = pre.textContent.split('\n');
      const wrapper = document.createElement('div');
      wrapper.className = 'ascii rainbow-animate';
      wrapper.setAttribute('aria-hidden', 'true');
      // recreate lines with spans so background-clip applies across characters
      lines.forEach((line, idx) => {
        const lineEl = document.createElement('div');
        lineEl.style.display = 'block';
        for (let ch of line) {
          const span = document.createElement('span');
          span.textContent = ch === ' ' ? '\u00A0' : ch;
          lineEl.appendChild(span);
        }
        wrapper.appendChild(lineEl);
        if (idx < lines.length - 1) {
          // ensure line breaks are preserved
          // nothing extra needed since each line is its own div
        }
      });
      // replace the pre element with our new wrapper
      pre.parentNode.replaceChild(wrapper, pre);
    }
  } catch (e) {
    console.error('Rainbow init failed', e);
  }
});

function enterKey(e) {
  textarea.focus();
  scrollToBottom();

  if (e.keyCode === 181) {
    document.location.reload(true);
  }

  if (e.key === "Tab") {
    e.preventDefault();
    // ensure the event doesn't bubble to the browser
    if (e.stopPropagation) e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    // use the visible command text as primary source, fall back to the hidden textarea
    const raw = (command && (command.innerText || command.textContent)) || textarea.value || "";
    const partial = raw.trim().toLowerCase();
    const matches = Object.keys(commandMap).filter((cmd) =>
      cmd.startsWith(partial),
    );
    if (matches.length === 1) {
      // remove any outstanding suggestion before completing
      const existingSuggest = liner && liner.querySelector('.autocomplete-suggestion');
      if (existingSuggest) existingSuggest.remove();
      textarea.value = matches[0];
      command.innerHTML = matches[0];
    } else if (matches.length > 1) {
      addLine("<br>", "", 0);
      loopLines(matches, "color2", 80);
      addLine("<br>", "", matches.length * 80 + 100);
    }
    scrollToBottom();
    return;
  }

  if (e.ctrlKey && e.key === "r") {
    e.preventDefault();
    const search = prompt("Reverse search:");
    const match = commands
      .slice()
      .reverse()
      .find((cmd) => cmd.includes(search));
    if (match) {
      textarea.value = match;
      command.innerHTML = match;
    } else {
      addLine("No match found in history.", "error", 100);
    }
    scrollToBottom();
  }

  if (e.keyCode === 13) {
    const input = getTypedCommand().trim().toLowerCase();
    addLine("[trimq@portfolio]~$" + getTypedCommand(), "no-animation", 0);

    if (awaitingConfirmation && suggestedCommand) {
      if (input === "y") {
        commander(suggestedCommand);
      } else {
        addLine("Cancelled.", "color2", 80);
      }
      awaitingConfirmation = false;
      suggestedCommand = null;
    } else {
      commands.push(getTypedCommand());
      git = commands.length;
      commander(input);
    }

    command.innerHTML = "";
    textarea.value = "";
    // remove any outstanding suggestion when the command is submitted
    const existingSuggest = liner && liner.querySelector('.autocomplete-suggestion');
    if (existingSuggest) existingSuggest.remove();
    lastSuggestionRest = null;
    scrollToBottom();
  }

  if (e.keyCode === 38 && git !== 0) {
    git -= 1;
    textarea.value = commands[git];
    command.innerHTML = textarea.value;
    // clear suggestion after navigating history (will be recomputed on input)
    const existingSuggestUp = liner && liner.querySelector('.autocomplete-suggestion');
    if (existingSuggestUp) existingSuggestUp.remove();
    lastSuggestionRest = null;
    scrollToBottom();
  }

  if (e.keyCode === 40 && git !== commands.length) {
    git += 1;
    textarea.value = commands[git] || "";
    command.innerHTML = textarea.value;
    const existingSuggestDown = liner && liner.querySelector('.autocomplete-suggestion');
    if (existingSuggestDown) existingSuggestDown.remove();
    lastSuggestionRest = null;
    scrollToBottom();
  }
}

function commander(cmd) {
  const parts = (cmd || "").trim().split(/\s+/);
  const base = (parts[0] || "").toLowerCase();

  switch (base) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "aboutme":
      loopLines(aboutme, "color2 margin", 80);
      break;
    case "projects":
      loopLines(projects, "color2 margin", 80);
      break;
    case "theme":
      // if user typed 'theme' show list, if 'theme name' apply
      if (parts.length === 1) {
        listThemes();
      } else {
        const name = parts[1].toLowerCase();
        applyTheme(name);
      }
      break;
    case "social":
      loopLines(social, "color2 margin", 80);
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      addLine(
        'Opening mailto:<a href="mailto:yewaleprithvi2003@gmail.com"> yewaleprithvi2003@gmail.com</a>...',
        "color2",
        80,
      );
      newTab(email);
      break;
    case "clear":
      setTimeout(function () {
        const paragraphs = terminal.querySelectorAll("p");
        paragraphs.forEach((p) => p.remove());
        if (!document.getElementById("before")) {
          const beforeElement = document.createElement("a");
          beforeElement.id = "before";
          terminal.insertBefore(beforeElement, terminal.firstChild);
          before = beforeElement;
        }
        if (typeof banner !== "undefined") {
          loopLines(banner, "", 80);
        }
        textarea.focus();
        scrollToBottom();
      }, 1);
      break;
    case "dev":
      addLine("Opening Dev.to...", "color2", 80);
      newTab(dev);
      break;
    case "twitter":
      addLine("Opening Twitter...", "color2", 0);
      newTab(twitter);
      break;
    case "linkedin":
      addLine("Opening LinkedIn...", "color2", 0);
      newTab(linkedin);
      break;
    case "instagram":
      addLine("Opening Instagram...", "color2", 0);
      newTab(instagram);
      break;
    case "github":
      addLine("Opening GitHub...", "color2", 0);
      newTab(github);
      break;
    case "sudo":
      addLine("Oh no, you're not an admin...", "color2", 0);
      newTab(sudo);
      break;
    case "snake":
      runSnakeGame();
      break;
    case "copyurl":
    case "url":
      copySiteUrl();
      break;
    default:
      const closest = findClosestCommand(cmd);
      if (closest) {
        suggestedCommand = closest;
        awaitingConfirmation = true;
        addLine(
          `<span class="inherit">Command not found. Did you mean <span class="command">'${closest}'</span>? (y/n)</span>`,
          "error",
          100,
        );
      } else {
        addLine(
          `<span class="inherit">Command not found. Type <span class="command">'help'</span> for available commands.</span>`,
          "error",
          100,
        );
      }
      break;
  }
  scrollToBottom();
}

function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

// helper to copy current site URL to clipboard with fallback
function copySiteUrl() {
  const url = window.location.href;
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    // keep off-screen
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      addLine("URL copied!", "color2", 80);
    } catch (e) {
      addLine("Failed to copy URL.", "error", 80);
    }
    document.body.removeChild(ta);
    scrollToBottom();
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      addLine("URL copied!", "color2", 80);
      scrollToBottom();
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function addLine(text, style, time) {
  let t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === " " && text.charAt(i + 1) === " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }

  setTimeout(function () {
    const next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;
    before.parentNode.insertBefore(next, before);
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
  setTimeout(
    function () {
      scrollToBottom();
    },
    name.length * time + 50,
  );
}

function findClosestCommand(input) {
  const threshold = 3;
  let minDist = Infinity;
  let closest = null;
  Object.keys(commandMap).forEach((cmd) => {
    const dist = levenshtein(input, cmd);
    if (dist < minDist && dist <= threshold) {
      minDist = dist;
      closest = cmd;
    }
  });
  return closest;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

function runSnakeGame() {
  const width = 20,
    height = 10;
  let snake = [{ x: 5, y: 5 }];
  let food = { x: 10, y: 5 };
  let dir = "right";
  let score = 0;
  let interval;
  let gameElement;

  function draw() {
    let screen = `Score: ${score}\n`;
    for (let y = 0; y < height; y++) {
      let row = "";
      for (let x = 0; x < width; x++) {
        if (x === food.x && y === food.y) row += "*";
        else if (snake.some((s) => s.x === x && s.y === y)) row += "O";
        else row += ".";
      }
      screen += row + "\n";
    }

    if (!gameElement) {
      gameElement = document.createElement("p");
      gameElement.className = "color2";
      gameElement.innerHTML = `<pre>${screen}</pre>`;
      before.parentNode.insertBefore(gameElement, before);
    } else {
      gameElement.innerHTML = `<pre>${screen}</pre>`;
    }

    contentscroll.scrollTop = contentscroll.scrollHeight;
  }

  function move() {
    const head = { ...snake[0] };
    switch (dir) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    if (
      head.x < 0 ||
      head.x >= width ||
      head.y < 0 ||
      head.y >= height ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      clearInterval(interval);
      gameElement.innerHTML += `<br><span class="error">💀 Game Over! Final Score: ${score}</span>`;
      window.removeEventListener("keydown", keyHandler);
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      food = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };
    } else {
      snake.pop();
    }

    draw();
  }

  function keyHandler(e) {
    switch (e.key) {
      case "ArrowUp":
        if (dir !== "down") dir = "up";
        break;
      case "ArrowDown":
        if (dir !== "up") dir = "down";
        break;
      case "ArrowLeft":
        if (dir !== "right") dir = "left";
        break;
      case "ArrowRight":
        if (dir !== "left") dir = "right";
        break;
      case "Escape":
      case "q":
        clearInterval(interval);
        window.removeEventListener("keydown", keyHandler);
        gameElement.innerHTML += `<br><span class="color2">🛑 Snake game exited.</span>`;
        break;
    }
  }

  window.addEventListener("keydown", keyHandler);
  addLine(
    "🎮 Starting Snake game... Use arrow keys to move. 'q' or Esc to quit.",
    "color2",
    0,
  );
  draw();
  interval = setInterval(move, 250);
}

// Return the currently-typed command from the visible command element.
// Note: suggestion is now a sibling inside #liner, so reading command.textContent
// returns only what the user typed.
function getTypedCommand() {
  if (!command) return "";
  return (command.textContent || "");
}

// Update the faint autocomplete suggestion displayed after the typed text.
function updateAutocompleteSuggestion() {
  const partial = getTypedCommand().trim().toLowerCase();
  if (!partial) {
    const existing = liner && liner.querySelector('.autocomplete-suggestion');
    if (existing) {
      lastSuggestionRest = null;
      existing.remove();
    }
    return;
  }

  const match = Object.keys(commandMap).find((cmd) => cmd.startsWith(partial) && cmd !== partial);
  const rest = match ? match.slice(partial.length) : null;

  // nothing changed -> avoid DOM mutation
  if (rest === lastSuggestionRest) return;
  lastSuggestionRest = rest;

  let existing = liner && liner.querySelector('.autocomplete-suggestion');
  if (!rest) {
    if (existing) existing.remove();
    return;
  }

  if (!existing) {
    existing = document.createElement('span');
    existing.className = 'autocomplete-suggestion';
    existing.setAttribute('aria-hidden', 'true');
    existing.style.pointerEvents = 'none';
    if (liner) liner.appendChild(existing);
  }
  existing.textContent = rest;

  // Compute caret position to align suggestion so that caret overlays first character.
  // Try to read cursor offset from caret.js if possible, otherwise approximate using the typed text width.
  const cursorEl = document.getElementById('cursor');
  let left = 0;
  let top = 0;
  if (cursorEl) {
    // get position relative to liner
    const cursorRect = cursorEl.getBoundingClientRect();
    const linerRect = liner.getBoundingClientRect();
    left = cursorRect.left - linerRect.left;
  // center vertically on the cursor's middle
  top = (cursorRect.top + cursorRect.bottom) / 2 - linerRect.top;
  } else {
    // fallback: estimate using text length and character width
    const typed = getTypedCommand() || '';
    const approxCharWidth = 8; // px fallback
    left = (typed.length) * approxCharWidth;
    top = 0;
  }
  existing.style.left = `${left}px`;
  // place suggestion so its center aligns with caret middle
  existing.style.top = `${top}px`;
  existing.style.transform = 'translateY(-50%)';
}

function syncCommandDisplay() {
  const newText = (textarea && textarea.value) || "";
  const currentVisible = getTypedCommand();
  if (currentVisible === newText) return;
  // simply set the visible typed text; suggestion is a sibling and need not be removed
  if (command) command.textContent = newText;
}

// replace previous input listener with synced version
textarea.removeEventListener("input", function() {
  updateAutocompleteSuggestion();
  scrollToBottom();
});
textarea.addEventListener("input", function() {
  syncCommandDisplay();
  updateAutocompleteSuggestion();
  scrollToBottom();
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cgpaForm");
  const gpaSection = document.getElementById("gpa-section");
  const inputSection = document.getElementById("input-section");
  const resultSection = document.getElementById("result-section");
  const gpaInputs = document.getElementById("gpaInputs");
  const calculatedCgpa = document.getElementById("calculatedCgpa");
  const themeToggle = document.getElementById("themeToggle");

  // Persistent Theme with localStorage
  let isDarkMode = localStorage.getItem("theme") === "light-mode" ? false : true;
  setTheme();

  themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    setTheme();
    localStorage.setItem("theme", isDarkMode ? "dark-mode" : "light-mode");
  });

  function setTheme() {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
    themeToggle.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const coursesCompleted = parseInt(document.getElementById("coursesCompleted").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value);

    // Clear previous error messages
    clearErrorMessages();

    if (isNaN(currentCgpa) || currentCgpa < 0 || currentCgpa > 4) {
      showError("cgpaError", "CGPA must be between 0 and 4.");
      return;
    }

    if (isNaN(coursesCompleted) && isNaN(creditsCompleted)) {
      showError("courseError", "Please enter either completed courses or completed credits.");
      return;
    }

    if (!isNaN(coursesCompleted) && !isNaN(creditsCompleted)) {
      showError("courseError", "Please enter only one: either completed courses or completed credits.");
      return;
    }

    gpaInputs.innerHTML = ""; // Clear previous GPA inputs
    const numOfCourses = parseInt(document.getElementById("numOfCourses").value);

    // Dynamically generate GPA and Credit input fields for each course
    for (let i = 0; i < numOfCourses; i++) {
      const gpaGroup = document.createElement("div");
      gpaGroup.classList.add("gpa-group");
      gpaGroup.innerHTML = `
        <label>Course ${i + 1} GPA: <input type="number" min="0" max="4" step="0.01" required></label>
        <label>Credit: <input type="number" min="0.5" step="0.5" required></label>
      `;
      gpaInputs.appendChild(gpaGroup);
    }

    inputSection.classList.add("hidden");
    gpaSection.classList.remove("hidden");
  });

  document.getElementById("calculateCgpa").addEventListener("click", () => {
    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value) || 0;
    let totalCredits = creditsCompleted || parseInt(document.getElementById("coursesCompleted").value) * 3;
    let totalPoints = currentCgpa * totalCredits;
    let newCredits = 0;
    let validInput = true;

    document.querySelectorAll(".gpa-group").forEach((group) => {
      const gpa = parseFloat(group.children[0].children[0].value);
      const credit = parseFloat(group.children[1].children[0].value);

      if (isNaN(gpa) || gpa < 0 || gpa > 4 || isNaN(credit) || credit <= 0) {
        validInput = false;
      } else {
        totalPoints += gpa * credit;
        newCredits += credit;
      }
    });

    if (!validInput) {
      alert("Please enter valid GPA values (0-4) and positive credit values.");
      return;
    }

    const newCgpa = (totalPoints / (totalCredits + newCredits)).toFixed(2);
    calculatedCgpa.textContent = newCgpa;

    gpaSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
  });

  document.getElementById("recalculate").addEventListener("click", () => {
    inputSection.classList.remove("hidden");
    resultSection.classList.add("hidden");
    form.reset();
    gpaInputs.innerHTML = ""; // Clear GPA inputs for next calculation
  });

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add("visible");
  }

  function clearErrorMessages() {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.textContent = "";
      el.classList.remove("visible");
    });
  }
});

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

    let cgpaScale = parseInt(document.getElementById("cgpaScale").value);
    const customScale = parseInt(document.getElementById("customScale").value);
    if (!isNaN(customScale) && customScale > 0) {
      cgpaScale = customScale;
    }

    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value);
    const numOfCourses = parseInt(document.getElementById("numOfCourses").value);

    // Clear previous error messages
    clearErrorMessages();

    if (isNaN(currentCgpa) || currentCgpa < 0 || currentCgpa > cgpaScale) {
      showError("cgpaError", `CGPA must be between 0 and ${cgpaScale}.`);
      return;
    }

    if (isNaN(creditsCompleted) || creditsCompleted < 1 || creditsCompleted > 250) {
      showError("creditError", "Credits must be between 1 and 250.");
      return;
    }

    if (isNaN(numOfCourses) || numOfCourses < 1 || numOfCourses > 20) {
      showError("numOfCoursesError", "Please enter a number between 1 and 20 for the number of courses.");
      return;
    }

    gpaInputs.innerHTML = ""; // Clear previous GPA inputs

    // Dynamically generate GPA, credit, and optional course name input fields for each course
    for (let i = 0; i < numOfCourses; i++) {
      const gpaGroup = document.createElement("div");
      gpaGroup.classList.add("gpa-group");
      gpaGroup.innerHTML = `
        <label>Course ${i + 1} Name (Optional): <input type="text" placeholder="e.g., Math 101"></label>
        <label>Course ${i + 1} GPA: <input type="number" min="0" max="${cgpaScale}" step="0.01" required></label>
        <label>Credit: <input type="number" min="0.5" step="0.5" value="3" required></label>
      `;
      gpaInputs.appendChild(gpaGroup);
    }

    inputSection.classList.add("hidden");
    gpaSection.classList.remove("hidden");
  });

  document.getElementById("calculateCgpa").addEventListener("click", () => {
    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value);
    let totalCredits = creditsCompleted;
    let totalPoints = currentCgpa * totalCredits;
    let newCredits = 0;
    let validInput = true;

    document.querySelectorAll(".gpa-group").forEach((group) => {
      const gpa = parseFloat(group.children[1].children[0].value);
      const credit = parseFloat(group.children[2].children[0].value);

      if (isNaN(gpa) || gpa < 0 || isNaN(credit) || credit <= 0) {
        validInput = false;
      } else {
        totalPoints += gpa * credit;
        newCredits += credit;
      }
    });

    if (!validInput) {
      alert("Please enter valid GPA values and positive credit values.");
      return;
    }

    const newCgpa = (totalPoints / (totalCredits + newCredits)).toFixed(2);
    calculatedCgpa.textContent = newCgpa;

    // Add success animation or color feedback
    calculatedCgpa.classList.add("success");
    setTimeout(() => calculatedCgpa.classList.remove("success"), 1500);

    gpaSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
  });

  document.getElementById("recalculate").addEventListener("click", () => {
    inputSection.classList.remove("hidden");
    resultSection.classList.add("hidden");
    form.reset();
    gpaInputs.innerHTML = ""; // Clear GPA inputs for the next calculation
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

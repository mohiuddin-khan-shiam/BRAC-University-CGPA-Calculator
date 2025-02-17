document.addEventListener("DOMContentLoaded", () => {
  // Element References
  const form = document.getElementById("cgpaForm");
  const inputSection = document.getElementById("input-section");
  const gpaSection = document.getElementById("gpa-section");
  const resultSection = document.getElementById("result-section");
  const gpaInputs = document.getElementById("gpaInputs");
  const calculatedCgpa = document.getElementById("calculatedCgpa");
  const themeToggle = document.getElementById("themeToggle");
  const cgpaScaleSelect = document.getElementById("cgpaScale");
  const customScaleContainer = document.getElementById("customScaleContainer");
  const customScaleInput = document.getElementById("customScale");

  // Helper: Set focus on an element if exists
  function setFocus(selector) {
    const el = document.querySelector(selector);
    if (el) el.focus();
  }

  // Initialize Theme (Persistent via localStorage)
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
    themeToggle.setAttribute("aria-pressed", isDarkMode ? "true" : "false");
  }

  // Toggle visibility of custom scale input based on selection
  cgpaScaleSelect.addEventListener("change", () => {
    if (cgpaScaleSelect.value === "other") {
      customScaleContainer.classList.remove("hidden");
      customScaleContainer.setAttribute("aria-hidden", "false");
    } else {
      customScaleContainer.classList.add("hidden");
      customScaleContainer.setAttribute("aria-hidden", "true");
    }
  });

  // Clear error messages in the form
  function clearErrorMessages() {
    document.querySelectorAll(".error-message").forEach((el) => {
      el.textContent = "";
      el.classList.remove("visible");
    });
  }

  // Display an error message for a specific field
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add("visible");
  }

  // Dynamically generate course input fields based on number of courses
  function createCourseInputs(numOfCourses, cgpaScale) {
    gpaInputs.innerHTML = "";
    for (let i = 0; i < numOfCourses; i++) {
      const gpaGroup = document.createElement("div");
      gpaGroup.classList.add("gpa-group");
      gpaGroup.innerHTML = `
        <label for="courseName${i}">Course ${i + 1} Name (Optional):
          <input type="text" id="courseName${i}" placeholder="e.g., Math 101">
        </label>
        <label for="courseGpa${i}">Course ${i + 1} GPA:
          <input type="number" id="courseGpa${i}" min="0" max="${cgpaScale}" step="0.01" required>
        </label>
        <label for="courseCredit${i}">Course ${i + 1} Credit:
          <input type="number" id="courseCredit${i}" min="0.5" step="0.5" value="3" required>
        </label>
      `;
      gpaInputs.appendChild(gpaGroup);
    }
  }

  // Handle submission of the initial form to proceed to course details
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrorMessages();

    let cgpaScale;
    // Use the custom scale if "Other" is selected
    if (cgpaScaleSelect.value === "other") {
      const customScale = parseInt(customScaleInput.value, 10);
      if (isNaN(customScale) || customScale < 1 || customScale > 20) {
        showError("customScaleError", "Custom scale must be between 1 and 20.");
        return;
      }
      cgpaScale = customScale;
    } else {
      cgpaScale = parseInt(cgpaScaleSelect.value, 10);
    }

    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value, 10);
    const numOfCourses = parseInt(document.getElementById("numOfCourses").value, 10);

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

    // Generate the course input fields
    createCourseInputs(numOfCourses, cgpaScale);

    // Transition to the course details section and set focus for accessibility
    inputSection.classList.add("hidden");
    gpaSection.classList.remove("hidden");
    setFocus("#courseGpa0");
  });

  // Calculate CGPA when user clicks "Calculate CGPA"
  document.getElementById("calculateCgpa").addEventListener("click", () => {
    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value, 10);
    let totalCredits = creditsCompleted;
    let totalPoints = currentCgpa * creditsCompleted;
    let newCredits = 0;
    let validInput = true;

    const courseGroups = document.querySelectorAll(".gpa-group");
    courseGroups.forEach((group, index) => {
      const courseGpaInput = document.getElementById(`courseGpa${index}`);
      const courseCreditInput = document.getElementById(`courseCredit${index}`);

      const gpa = parseFloat(courseGpaInput.value);
      const credit = parseFloat(courseCreditInput.value);

      if (isNaN(gpa) || gpa < 0 || isNaN(credit) || credit <= 0) {
        validInput = false;
      } else {
        totalPoints += gpa * credit;
        newCredits += credit;
      }
    });

    if (!validInput) {
      alert("Please enter valid GPA and credit values for all courses.");
      return;
    }

    const newCgpa = (totalPoints / (totalCredits + newCredits)).toFixed(2);
    calculatedCgpa.textContent = newCgpa;

    // Add a subtle success animation
    calculatedCgpa.classList.add("success");
    setTimeout(() => calculatedCgpa.classList.remove("success"), 1500);

    // Transition to the result section and move focus to the result
    gpaSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
    setFocus("#calculatedCgpa");
  });

  // Reset the calculator to start a new calculation
  document.getElementById("recalculate").addEventListener("click", () => {
    inputSection.classList.remove("hidden");
    resultSection.classList.add("hidden");
    form.reset();
    gpaInputs.innerHTML = "";
    customScaleContainer.classList.add("hidden");
    customScaleContainer.setAttribute("aria-hidden", "true");
    // Set focus back to the first input of the initial form
    setFocus("#currentCgpa");
  });
});

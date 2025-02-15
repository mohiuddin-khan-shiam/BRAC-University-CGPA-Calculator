document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cgpaForm");
  const gpaSection = document.getElementById("gpa-section");
  const inputSection = document.getElementById("input-section");
  const resultSection = document.getElementById("result-section");
  const gpaInputs = document.getElementById("gpaInputs");
  const calculatedCgpa = document.getElementById("calculatedCgpa");
  const themeToggle = document.getElementById("themeToggle");

  let numOfCourses = 4;
  let isDarkMode = true;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    numOfCourses = parseInt(document.getElementById("numOfCourses").value);
    gpaInputs.innerHTML = "";

    for (let i = 0; i < numOfCourses; i++) {
      const label = document.createElement("label");
      label.textContent = `Course ${i + 1} GPA:`;
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.max = "4";
      input.step = "0.01";
      input.required = true;
      gpaInputs.appendChild(label);
      gpaInputs.appendChild(input);
    }

    inputSection.classList.add("hidden");
    gpaSection.classList.remove("hidden");
  });

  document.getElementById("calculateCgpa").addEventListener("click", () => {
    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const coursesCompleted = parseInt(document.getElementById("coursesCompleted").value);
    let totalPoints = currentCgpa * coursesCompleted;
    let validInput = true;

    const gpaValues = document.querySelectorAll("#gpaInputs input");
    gpaValues.forEach((input) => {
      const gpa = parseFloat(input.value);
      if (isNaN(gpa) || gpa < 0 || gpa > 4) {
        validInput = false;
      } else {
        totalPoints += gpa;
      }
    });

    if (!validInput) {
      alert("Please enter valid GPA values between 0 and 4.");
      return;
    }

    const newCgpa = (totalPoints / (coursesCompleted + numOfCourses)).toFixed(2);
    calculatedCgpa.textContent = newCgpa;

    gpaSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
  });

  document.getElementById("recalculate").addEventListener("click", () => {
    inputSection.classList.remove("hidden");
    resultSection.classList.add("hidden");
    form.reset();
  });

  themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
    themeToggle.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
  });
});

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

    const coursesCompleted = parseInt(document.getElementById("coursesCompleted").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value);

    if (isNaN(coursesCompleted) && isNaN(creditsCompleted)) {
      alert("Please enter either completed courses or completed credits.");
      return;
    }

    if (!isNaN(coursesCompleted) && !isNaN(creditsCompleted)) {
      alert("Please enter only one: either completed courses or completed credits.");
      return;
    }

    gpaInputs.innerHTML = ""; // Clear previous GPA inputs if they exist
    numOfCourses = parseInt(document.getElementById("numOfCourses").value);

    // Dynamically generate GPA and Credit input fields for each course
    for (let i = 0; i < numOfCourses; i++) {
      const gpaGroup = document.createElement("div");
      gpaGroup.classList.add("gpa-group");

      const gpaLabel = document.createElement("label");
      gpaLabel.textContent = `Course ${i + 1} GPA:`;
      const gpaInput = document.createElement("input");
      gpaInput.type = "number";
      gpaInput.min = "0";
      gpaInput.max = "4";
      gpaInput.step = "0.01";
      gpaInput.required = true;

      const creditLabel = document.createElement("label");
      creditLabel.textContent = `Credit:`;
      const creditInput = document.createElement("input");
      creditInput.type = "number";
      creditInput.min = "0.5";
      creditInput.step = "0.5";
      creditInput.required = true;

      gpaGroup.appendChild(gpaLabel);
      gpaGroup.appendChild(gpaInput);
      gpaGroup.appendChild(creditLabel);
      gpaGroup.appendChild(creditInput);
      gpaInputs.appendChild(gpaGroup);
    }

    inputSection.classList.add("hidden");
    gpaSection.classList.remove("hidden");
  });

  document.getElementById("calculateCgpa").addEventListener("click", () => {
    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const coursesCompleted = parseInt(document.getElementById("coursesCompleted").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value);

    let totalCredits = isNaN(creditsCompleted) ? coursesCompleted * 3 : creditsCompleted;
    let totalPoints = currentCgpa * totalCredits;
    let newCredits = 0;
    let validInput = true;

    const gpaGroups = document.querySelectorAll(".gpa-group");
    gpaGroups.forEach((group) => {
      const gpa = parseFloat(group.children[1].value);
      const credit = parseFloat(group.children[3].value);

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
    gpaInputs.innerHTML = ""; // Clear GPA inputs for the next calculation
  });

  themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
    themeToggle.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
  });
});

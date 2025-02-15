document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cgpaForm");
  const gpaSection = document.getElementById("gpa-section");
  const inputSection = document.getElementById("input-section");
  const resultSection = document.getElementById("result-section");
  const gpaInputs = document.getElementById("gpaInputs");
  const calculatedCgpa = document.getElementById("calculatedCgpa");
  const themeToggle = document.getElementById("themeToggle");
  const formError = document.getElementById("formError");

  let isDarkMode = true;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const coursesCompleted = parseInt(document.getElementById("coursesCompleted").value);
    const creditsCompleted = parseInt(document.getElementById("creditsCompleted").value);

    if (isNaN(coursesCompleted) && isNaN(creditsCompleted)) {
      formError.textContent = "Please enter either completed courses or completed credits.";
      formError.style.display = "block";
      return;
    }

    if (!isNaN(coursesCompleted) && !isNaN(creditsCompleted)) {
      formError.textContent = "Please enter only one: either completed courses or completed credits.";
      formError.style.display = "block";
      return;
    }

    formError.style.display = "none";
    gpaInputs.innerHTML = "";

    const numOfCourses = parseInt(document.getElementById("numOfCourses").value);
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

    document.querySelectorAll(".gpa-group").forEach((group) => {
      const gpa = parseFloat(group.children[0].children[0].value);
      const credit = parseFloat(group.children[1].children[0].value);
      totalPoints += gpa * credit;
      newCredits += credit;
    });

    const newCgpa = (totalPoints / (totalCredits + newCredits)).toFixed(2);
    calculatedCgpa.textContent = newCgpa;

    gpaSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
  });

  document.getElementById("recalculate").addEventListener("click", () => {
    inputSection.classList.remove("hidden");
    resultSection.classList.add("hidden");
    form.reset();
    gpaInputs.innerHTML = "";
  });

  themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
    themeToggle.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
  });
});

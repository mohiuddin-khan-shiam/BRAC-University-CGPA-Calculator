document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cgpaForm");
  const resultSection = document.getElementById("result-section");
  const inputSection = document.getElementById("input-section");
  const calculatedCgpa = document.getElementById("calculatedCgpa");
  const themeToggle = document.getElementById("themeToggle");
  
  let isDarkMode = true;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const currentCgpa = parseFloat(document.getElementById("currentCgpa").value);
    const coursesCompleted = parseInt(document.getElementById("coursesCompleted").value);
    const numOfCourses = parseInt(document.getElementById("numOfCourses").value);

    let totalPoints = currentCgpa * coursesCompleted;
    for (let i = 0; i < numOfCourses; i++) {
      totalPoints += 4;  // Assuming each new course has GPA 4.0 (A)
    }

    const newCgpa = (totalPoints / (coursesCompleted + numOfCourses)).toFixed(2);

    calculatedCgpa.textContent = newCgpa;
    inputSection.classList.add("hidden");
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

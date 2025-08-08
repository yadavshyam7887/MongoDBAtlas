// public/script.js
document.getElementById("studentForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  // Normalize numeric fields
  if (data.age !== undefined && data.age !== "") {
    const parsed = Number(data.age);
    if (!Number.isNaN(parsed)) data.age = parsed;
  }

  try {
    // Same-origin call (index.html is served by the same Express app)
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // Bubble up server error message if present
      throw new Error(result.error || `Server error (${response.status})`);
    }

    alert(result.message || "Saved!");
    this.reset();
  } catch (err) {
    console.error("❌ Network error:", err);
    alert("❌ Network error. Server not reachable or route missing.");
  }
});

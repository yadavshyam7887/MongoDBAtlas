// public/script.js

document.getElementById("studentForm").addEventListener("submit", async function (e){
  e.preventDefault();

  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());

  
  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Server error");
    }
    
    alert(result.message);
    this.reset();
    
  } catch (err) {
    console.error("❌ Network error:", err);
    alert("❌ Network error. Server not reachable or route missing.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsForm");

  if (!form) {
    console.error("❌ newsForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // basic validation
    if (!formData.get("title")) {
      alert("Title is required");
      return;
    }

    if (!formData.get("category")) {
      alert("Please select a category");
      return;
    }

    try {
      const res = await fetch("https://mediabuzz365.in/api/admin/news", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ News added successfully");
        form.reset();
      } else {
        alert("❌ " + (data.message || "Error"));
      }
    } catch (err) {
      alert("❌ Server error");
      console.error(err);
    }
  });
});

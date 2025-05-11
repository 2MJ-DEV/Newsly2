import "./style.css";

// Interdiction d'inspecter le code
document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});

document.addEventListener("keydown", function (e) {
    // F12
    if (e.key === "F12") {
        e.preventDefault();
    }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+U
    if (
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
        (e.ctrlKey && e.key === "U")
    ) {
        e.preventDefault();
    }
});

// inteégration de l'api smadmail
async function saveEmailToMailingList(email, name = null) {
    const response = await fetch("https://api.smadmail.com/api/v1/email/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            project_id: "d7a763d5-07ed-4d03-a69f-a29fa6d00c8e", // remplace ceci
            private_key: "smad2502241055428a16610a10", // remplace ceci
            name: name,
        }),
    });

    if (!response.ok) {
        throw new Error("Échec de l'inscription à la waitlist");
    }

    return await response.json();
}

document
  .getElementById("waitlist-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // empêche le rechargement de la page

    const emailInput = e.target.elements["email"];
    const email = emailInput.value;
    const submitButton = document.getElementById("submit-button");

    // Optionnel : désactive le bouton pendant l'envoi
    submitButton.disabled = true;
    submitButton.innerHTML = "⏳"; // petit indicateur de chargement

    try {
      await saveEmailToMailingList(email);

      // Affiche juste une icône ✅ après succès
      submitButton.innerHTML = "✅";
      emailInput.value = "";

      // Optionnel : réinitialise après 2 sec
      setTimeout(() => {
        submitButton.innerHTML = "get early access";
        submitButton.disabled = false;
      }, 2000);
    } catch (error) {
      console.error(error);
      submitButton.innerHTML = "❌";
      setTimeout(() => {
        submitButton.innerHTML = "get early access";
        submitButton.disabled = false;
      }, 2000);
    }
  });

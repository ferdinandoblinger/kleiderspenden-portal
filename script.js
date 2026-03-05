$(document).ready(function () {
  function sanitizeInput(input) {
    return input.replace(/[<>]/g, "");
  }

  const officePlz = "12345"; // Postleitzahl der Geschäftsstelle für die Validierung

  // Ein-/Ausblenden der Adressfelder
  $("input[name='delivery']").change(function () {
    if ($(this).val() === "pickup") {
      $("#addressFields").slideDown();
    } else {
      $("#addressFields").slideUp();
    }
  });

  // Warnung bei übereinstimmender Postleitzahl (ersten zwei Ziffern)
  $("#plz").on("input", function () {
    const plz = $(this).val().trim();
    const officePrefix = officePlz.substring(0, 2);

    if (plz.length >= 2 && plz.startsWith(officePrefix)) {
      $("#plzWarning").removeClass("d-none");
    } else {
      $("#plzWarning").addClass("d-none");
    }
  });

  // Formular absenden
  $("#donationForm").submit(function (e) {
    e.preventDefault();

    const delivery = $("input[name='delivery']:checked").val();
    const clothingType = $("#clothingType").val();
    const region = $("#region").val();
    const street = sanitizeInput($("#street").val());
    const city = sanitizeInput($("#city").val());
    const plz = $("#plz").val().trim();

    // Zusätzliche Validierung bei Abholung
    if (delivery === "pickup") {
      if (!street || !plz || !city) {
        alert("Bitte alle Adressfelder ausfüllen.");
        return;
      }

      if (!plz.match(/^[0-9]{5}$/)) {
        alert("Bitte eine gültige 5-stellige Postleitzahl eingeben.");
        return;
      }

      if (!$("#plzWarning").hasClass("d-none")) {
        alert("Bitte geben Sie die Spende direkt in der Geschäftsstelle ab.");
        return;
      }
    }

    // Datum und Uhrzeit erzeugen
    const now = new Date();
    const formattedDate = now.toLocaleDateString("de-DE");
    const formattedTime = now.toLocaleTimeString("de-DE");

    const donationData = {
      delivery,
      clothingType,
      region,
      street,
      plz,
      city,
      date: formattedDate,
      time: formattedTime,
    };

    localStorage.setItem("donation", JSON.stringify(donationData));

    window.location.href = "confirmation.html";
  });
});

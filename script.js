$(document).ready(function () {
    function sanitizeInput(input) {
        return input.replace(/[<>]/g, "");
    }

    const officePLZPrefix = "12"; // Beispiel: Geschäftsstelle beginnt mit 12

    // Ein-/Ausblenden der Adressfelder
    $("input[name='delivery']").change(function () {
        if ($(this).val() === "pickup") {
            $("#addressFields").slideDown();
        } else {
            $("#addressFields").slideUp();
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
        const plz = $("#plz").val();


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

            if (!plz.startsWith(officePLZPrefix)) {
                alert(
                    "Die Abholadresse liegt nicht im Einzugsgebiet der Geschäftsstelle.",
                );
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

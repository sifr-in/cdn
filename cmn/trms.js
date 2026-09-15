(async function () {

    // Get the script that loaded this file
    const script = document.currentScript;

    if (!script) {
        console.error("trms.js: Cannot find current script.");
        return;
    }

    // Read parameters from trms.js?...
    const src = new URL(script.src, document.baseURI);
    const params = src.searchParams;

    const apFl = params.get("apFl");
    const varNm = params.get("var");
    const elId = params.get("elId");

    console.log("apFl:", apFl);
    console.log("var:", varNm);
    console.log("elId:", elId);


    // Validate parameters
    if (!apFl || !varNm || !elId) {
        console.error("trms.js: Required parameters are missing.");
        return;
    }


    // Get object from window using path, e.g. rm.da
    let sourceObj;

  try {
    var resp = await fetch(apFl);
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    var cfg = await resp.json();
    if (!cfg || typeof cfg !== "object") throw new Error("bad config");
    sourceObj = cfg;
  } catch (err) {
    console.error("Failed to load rm.da:", err);
  }


    // Get trms object
    const trms = sourceObj?.[varNm];

    if (!trms) {
        console.error(
            `trms.js: "${varNm}" not found in "${apFl}".`
        );
        return;
    }


    // Get target element
    const targetEl = document.getElementById(elId);

    if (!targetEl) {
        console.error(
            `trms.js: Element "#${elId}" not found.`
        );
        return;
    }


    // Create HTML
    targetEl.innerHTML = `
        <div class="terms-container">

            <h2>Terms & Conditions</h2>

            <p>
                These Terms & Conditions govern the use of services
                provided by <strong>${trms.compNm || ""}</strong>.
            </p>

            <h3>1. Acceptance of Terms</h3>
            <p>
                By accessing or using our services, you agree to be
                bound by these Terms & Conditions.
            </p>

            <h3>2. Services</h3>
            <p>
                ${trms.compNm || ""} provides its services according
                to the applicable service conditions.
            </p>

            <h3>3. User Responsibilities</h3>
            <p>
                Users are responsible for providing accurate information
                and using the services lawfully.
            </p>

            <h3>4. Payments</h3>
            <p>
                All applicable charges must be paid according to the
                payment terms displayed at the time of purchase or booking.
            </p>

            <h3>5. Cancellation & Refunds</h3>
            <p>
                Cancellation and refund conditions applicable to the
                service or product will apply.
            </p>

            <h3>6. Limitation of Liability</h3>
            <p>
                To the extent permitted by applicable law,
                ${trms.compNm || ""} shall not be liable for indirect,
                incidental or consequential losses.
            </p>

            <h3>7. Intellectual Property</h3>
            <p>
                All applicable content, trademarks, designs and software
                belonging to ${trms.compNm || ""} may not be reproduced
                without permission.
            </p>

            <h3>8. Privacy</h3>
            <p>
                Personal information will be handled according to the
                applicable privacy policy and laws.
            </p>

            <h3>9. Changes to Terms</h3>
            <p>
                ${trms.compNm || ""} may update these Terms & Conditions
                when necessary.
            </p>

            <h3>10. Governing Law & Jurisdiction</h3>
            <p>
                These Terms & Conditions shall be governed by applicable
                laws. Any disputes shall be subject to the jurisdiction of
                <strong>${trms.juris || ""}</strong>.
            </p>

            <h3>11. Contact</h3>
            <p>
                <strong>Address:</strong> ${trms.adrs || ""}
            </p>

            ${trms.email ? `
                <p>
                    <strong>Email:</strong> ${trms.email}
                </p>
            ` : ""}

            ${trms.phone ? `
                <p>
                    <strong>Phone:</strong> ${trms.phone}
                </p>
            ` : ""}

            ${trms.website ? `
                <p>
                    <strong>Website:</strong>
                    <a href="${trms.website}" target="_blank">
                        ${trms.website}
                    </a>
                </p>
            ` : ""}

        </div>
    `;
})();
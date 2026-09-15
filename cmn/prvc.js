(async function () {

    // Get the script that loaded this file
    const script = document.currentScript;

    if (!script) {
        console.error("prvc.js: Cannot find current script.");
        return;
    }

    // Read parameters from prvc.js?...
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
        console.error("prvc.js: Required parameters are missing.");
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


    // Get prvc object
    const prvc = sourceObj?.[varNm];

    if (!prvc) {
        console.error(
            `prvc.js: "${varNm}" not found in "${apFl}".`
        );
        return;
    }


    // Get target element
    const targetEl = document.getElementById(elId);

    if (!targetEl) {
        console.error(
            `prvc.js: Element "#${elId}" not found.`
        );
        return;
    }


    // Create HTML
    targetEl.innerHTML = `
        <div class="terms-container">

            <h2>Privacy Policy</h2>

            <p>
                This Privacy Policy explains how
                <strong>${prvc.compNm || ""}</strong> collects, uses,
                protects and discloses your personal information.
            </p>

            <h3>1. Information We Collect</h3>
            <p>
                We may collect personal information you provide directly,
                such as your name, contact details, payment information,
                and information necessary to deliver our services.
            </p>

            <h3>2. How We Use Your Information</h3>
            <p>
                Your information is used to provide and improve our
                services, process transactions, communicate with you,
                and comply with applicable legal obligations.
            </p>

            <h3>3. Cookies & Tracking Technologies</h3>
            <p>
                Our website may use cookies and similar technologies
                to enhance your experience, analyse usage and provide
                relevant content. You may control cookies through your
                browser settings.
            </p>

            <h3>4. Sharing & Disclosure</h3>
            <p>
                ${prvc.compNm || ""} does not sell your personal
                information. We may share it only with trusted partners
                who help us deliver our services, or when required
                by law.
            </p>

            <h3>5. Data Security</h3>
            <p>
                We use reasonable technical and organisational measures
                to safeguard your personal information against
                unauthorised access, loss or alteration.
            </p>

            <h3>6. Your Rights & Choices</h3>
            <p>
                You may request access, correction or deletion of your
                personal information at any time, or object to its
                processing, subject to applicable law.
            </p>

            <h3>7. Data Retention</h3>
            <p>
                We retain your personal information only for as long as
                necessary to fulfil the purposes described in this
                policy and to comply with legal requirements.
            </p>

            <h3>8. Third-Party Links</h3>
            <p>
                Our website may contain links to external sites.
                We are not responsible for the privacy practices or
                content of such third-party websites.
            </p>

            <h3>9. Children's Privacy</h3>
            <p>
                Our services are not directed to children. We do not
                knowingly collect personal information from children
                without appropriate parental consent.
            </p>

            <h3>10. Changes to This Policy</h3>
            <p>
                ${prvc.compNm || ""} may update this Privacy Policy
                when necessary. The updated version will be published
                on this page with a revised date.
            </p>

            <h3>11. Governing Law & Jurisdiction</h3>
            <p>
                This Privacy Policy shall be governed by applicable
                laws. Any disputes shall be subject to the jurisdiction of
                <strong>${prvc.juris || ""}</strong>.
            </p>

            <h3>12. Contact</h3>
            <p>
                For any questions about this Privacy Policy or your
                personal information, you may contact us at:
                <strong>${prvc.adrs || ""}</strong>
            </p>

            ${prvc.email ? `
                <p>
                    <strong>Email:</strong> ${prvc.email}
                </p>
            ` : ""}

            ${prvc.phone ? `
                <p>
                    <strong>Phone:</strong> ${prvc.phone}
                </p>
            ` : ""}

            ${prvc.website ? `
                <p>
                    <strong>Website:</strong>
                    <a href="${prvc.website}" target="_blank">
                        ${prvc.website}
                    </a>
                </p>
            ` : ""}

        </div>
    `;
})();
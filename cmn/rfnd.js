(async function () {

    // Get the script that loaded this file
    const script = document.currentScript;

    if (!script) {
        console.error("rfnd.js: Cannot find current script.");
        return;
    }

    // Read parameters from rfnd.js?...
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
        console.error("rfnd.js: Required parameters are missing.");
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


    // Get rfnd object
    const rfnd = sourceObj?.[varNm];

    if (!rfnd) {
        console.error(
            `rfnd.js: "${varNm}" not found in "${apFl}".`
        );
        return;
    }


    // Get target element
    const targetEl = document.getElementById(elId);

    if (!targetEl) {
        console.error(
            `rfnd.js: Element "#${elId}" not found.`
        );
        return;
    }


    // Create HTML
    targetEl.innerHTML = `
        <div class="terms-container">

            <h2>Refund Policy</h2>

            <p>
                This Refund Policy explains the conditions under which
                <strong>${rfnd.compNm || ""}</strong> will provide a
                refund for its services or products.
            </p>

            <h3>1. Refund Eligibility</h3>
            <p>
                Refunds are available only for eligible transactions
                made directly with ${rfnd.compNm || ""}, subject to
                the conditions mentioned in this policy.
            </p>

            <h3>2. Cancellation & Refund Request</h3>
            <p>
                To request a cancellation or refund, you must contact
                us within the applicable cancellation period. Refund
                eligibility will be determined based on the timing of
                the request and the relevant service conditions.
            </p>

            <h3>3. Refund Process</h3>
            <p>
                Once a refund request is approved, the amount will be
                returned to the original payment method used for the
                transaction.
            </p>

            <h3>4. Refund Timeline</h3>
            <p>
                Approved refunds are generally processed within 7 to 15
                working days, depending on the payment method and
                banking timelines.
            </p>

            <h3>5. Non-Refundable Charges</h3>
            <p>
                Certain charges such as processing fees, taxes, add-on
                services or services already consumed may not be
                refundable.
            </p>

            <h3>6. Payment Method of Refund</h3>
            <p>
                Refunds are issued through the same mode of payment used
                at the time of the original transaction.
            </p>

            <h3>7. Disputes</h3>
            <p>
                Any dispute regarding a refund shall be resolved by
                contacting ${rfnd.compNm || ""} before pursuing any
                other recourse.
            </p>

            <h3>8. Changes to This Policy</h3>
            <p>
                ${rfnd.compNm || ""} may update this Refund Policy when
                necessary. The updated version will be published on this
                page with a revised date.
            </p>

            <h3>9. Governing Law & Jurisdiction</h3>
            <p>
                This Refund Policy shall be governed by applicable
                laws. Any disputes shall be subject to the jurisdiction of
                <strong>${rfnd.juris || ""}</strong>.
            </p>

            <h3>10. Contact</h3>
            <p>
                For any questions regarding this Refund Policy, you may
                contact us at:
                <strong>${rfnd.adrs || ""}</strong>
            </p>

            ${rfnd.email ? `
                <p>
                    <strong>Email:</strong> ${rfnd.email}
                </p>
            ` : ""}

            ${rfnd.phone ? `
                <p>
                    <strong>Phone:</strong> ${rfnd.phone}
                </p>
            ` : ""}

            ${rfnd.website ? `
                <p>
                    <strong>Website:</strong>
                    <a href="${rfnd.website}" target="_blank">
                        ${rfnd.website}
                    </a>
                </p>
            ` : ""}

        </div>
    `;
})();
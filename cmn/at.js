// Constants for element IDs and classes
const number_of_columns = 5;
const curYr = new Date().getFullYear().toString().slice(-2);
const c_lass_active = "active";
const c_lass_glow_effect = "at_glow_effect";
const i_d_header = "at_header";
const i_d_config_modal = "at_config_modal";
const i_d_item_modal = "at_item_modal";
const i_d_crud_modal = "at_crud_modal";
const i_d_toast = "at_toast";
const i_d_custom_alert = "at_custom_alert";
const i_d_volume_control = "at_volume_control";
const a_t_install_PWA = "at_install_PWA";
const i_d_crud_form = "at_crud_form";
const i_d_item_table = "at_item_table";

const i_d_class_modal = "at_class_modal";
const i_d_class_selection_modal = "at_class_selection_modal";
const i_d_subject_selection_modal = "at_subject_selection_modal";

// Variables
let v_olume = 0.5;
let c_urrent_tab = "allItms";
let c_urrent_item_id = null;
let c_urrent_crud_action = "create";
let c_urrent_input_element = null;
let d_ragged_item = null;

// DOM Elements
const e_lements = {
  header: document.getElementById(i_d_header),
  configModal: document.getElementById(i_d_config_modal),
  itemModal: document.getElementById(i_d_item_modal),
  crudModal: document.getElementById(i_d_crud_modal),
  toast: document.getElementById(i_d_toast),
  customAlert: document.getElementById(i_d_custom_alert),
  volumeControl: document.getElementById(i_d_volume_control),
 i_nstall_pwa: document.getElementById(a_t_install_PWA),
  crudForm: document.getElementById(i_d_crud_form),
  itemTable: document.getElementById(i_d_item_table),
};



  // Get saved students from localStorage
  const savedStudents = JSON.parse(localStorage.getItem("studentInfo")) || [];
  if (savedStudents.length > 0) {
    // Load AdSense script only once (if not already loaded)
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5594579046538353';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }
async function shoAppInit(data) {
  // Set initial volume
  if (e_lements.volumeControl) {
    e_lements.volumeControl.value = v_olume * 100;
    e_lements.volumeControl.addEventListener("input", handleVolumeChange);
  }

  e_lements.i_nstall_pwa?.addEventListener("click", () => {
if(typeof f_n_sho_install_modal !== undefined){
window.f_n_sho_install_modal(1);
document.querySelectorAll('.at_modal').forEach(modal => {
    modal.style.display = 'none';
  });
}else
showToast("install function not found");
  });

  // Set up event listeners
  setupEventListeners();

  // Update notification badges
  updateNotificationBadges();
  setupClassModal();

  // Load and display saved students
  await displayClassCards();
}

function setupClassModal() {
  // Class selection
  document.getElementById("at_select_class")?.addEventListener("click", () => {
    playClickSound();
    showClassSelectionModal();
  });

  // Subject selection
  document
    .getElementById("at_select_subject")
    ?.addEventListener("click", () => {
      playClickSound();
      showSubjectSelectionModal();
    });

  // Student count input
  document
    .getElementById("at_student_count")
    ?.addEventListener("input", (e) => {
      const count = parseInt(e.target.value);
      const startRollContainer = document.getElementById(
        "at_start_roll_container"
      );
      const endRollContainer = document.getElementById("at_end_roll_container");

      if (count > 0) {
        startRollContainer.style.display = "block";
      } else {
        startRollContainer.style.display = "none";
        endRollContainer.style.display = "none";
      }
    });

  // Start roll number input
  document.getElementById("at_start_roll")?.addEventListener("input", (e) => {
    const startRoll = e.target.value;
    const studentCount = parseInt(
      document.getElementById("at_student_count").value
    );
    const endRollContainer = document.getElementById("at_end_roll_container");
    const endRollInput = document.getElementById("at_end_roll");

    if (startRoll && studentCount > 0) {
      // Assuming roll numbers are numeric and sequential
      if (/^\d+$/.test(startRoll)) {
        const startNum = parseInt(startRoll);
        const endNum = startNum + studentCount - 1;
        endRollInput.value = endNum.toString();
        endRollContainer.style.display = "block";
      } else {
        // Handle alphanumeric roll numbers if needed
        endRollInput.value = "N/A";
        endRollContainer.style.display = "block";
      }
    } else {
      endRollContainer.style.display = "none";
    }
  });

  document
    .getElementById("at_save_class_info")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      playClickSound();

      // Get all input values
      const classInput = document.getElementById("at_select_class");
      const divisionInput = document.getElementById("at_select_division");
      const rollNumberInput = document.getElementById("at_roll_number");
      const firstNameInput = document.getElementById("at_first_name");
      const lastNameInput = document.getElementById("at_last_name");
      const fathersNameInput = document.getElementById("at_fathers_name");
      const mothersNameInput = document.getElementById("at_mothers_name");
      const firstNameLocalInput = document.getElementById(
        "at_first_name_local"
      );
      const lastNameLocalInput = document.getElementById("at_last_name_local");
      const fathersNameLocalInput = document.getElementById(
        "at_fathers_name_local"
      );
      const mothersNameLocalInput = document.getElementById(
        "at_mothers_name_local"
      );

      // Clear all previous errors
      document
        .querySelectorAll(".at_input_error")
        .forEach((el) => el.classList.remove("at_input_error"));
      document
        .querySelectorAll(".at_validation_error")
        .forEach((el) => el.remove());

      // Validation checks
      let firstErrorElement = null;

      // 1. Check compulsory fields (class, division, roll number)
      if (!classInput.value || !classInput.dataset.id) {
        showValidationError(classInput, "Please select a class");
        firstErrorElement = firstErrorElement || classInput;
      }

      if (!divisionInput.value) {
        showValidationError(divisionInput, "Please enter division");
        firstErrorElement = firstErrorElement || divisionInput;
      }

    if (!rollNumberInput.value) {
      showValidationError(rollNumberInput, "Please enter roll number");
      firstErrorElement = firstErrorElement || rollNumberInput;
    } else if (!/^\d+$/.test(rollNumberInput.value)) {
      showValidationError(rollNumberInput, "Roll number must be a number");
      firstErrorElement = firstErrorElement || rollNumberInput;
    } else if (parseInt(rollNumberInput.value) <= 0) {
      showValidationError(rollNumberInput, "Roll number must be positive");
      firstErrorElement = firstErrorElement || rollNumberInput;
    }

      // 2. Check compulsory English name fields
      const requiredEnglishFields = [
        { input: firstNameInput, name: "First Name (English)" },
        { input: lastNameInput, name: "Last Name (English)" },
        { input: fathersNameInput, name: "Father's Name (English)" },
        { input: mothersNameInput, name: "Mother's Name (English)" },
      ];

      for (const field of requiredEnglishFields) {
        if (!field.input.value.trim()) {
          showValidationError(field.input, `${field.name} is required`);
          firstErrorElement = firstErrorElement || field.input;
          break;
        }

        // Check for non-English characters in English fields
        if (/[^\x00-\x7F]/.test(field.input.value)) {
          showValidationError(
            field.input,
            `${field.name} should contain only English characters`
          );
          firstErrorElement = firstErrorElement || field.input;
          break;
        }
      }

      // 3. Check local fields don't contain English characters
      const localFields = [
        { input: firstNameLocalInput, name: "First Name (Local)" },
        { input: lastNameLocalInput, name: "Last Name (Local)" },
        { input: fathersNameLocalInput, name: "Father's Name (Local)" },
        { input: mothersNameLocalInput, name: "Mother's Name (Local)" },
      ];

      for (const field of localFields) {
        if (field.input.value && /[a-zA-Z]/.test(field.input.value)) {
          showValidationError(
            field.input,
            `${field.name} should not contain English characters`
          );
          firstErrorElement = firstErrorElement || field.input;
          break;
        }
      }

      // If there are errors, focus on the first one and prevent submission
      if (firstErrorElement) {
        firstErrorElement.focus();
        return;
      }

      // If all validations pass, save the data (moved from saveClassInfo)
      const studentInfo = {
        classId: classInput.dataset.id,
        className: classInput.value,
        division: divisionInput.value.toLowerCase(),
        rollNumber: rollNumberInput.value,
        firstName: firstNameInput.value,
        firstNameLocal: firstNameLocalInput.value,
        lastName: lastNameInput.value,
        lastNameLocal: lastNameLocalInput.value,
        fathersName: fathersNameInput.value,
        fathersNameLocal: fathersNameLocalInput.value,
        mothersName: mothersNameInput.value,
        mothersNameLocal: mothersNameLocalInput.value,
        timestamp: new Date().toISOString(),
      };

      const o2 = {
        n: studentInfo.firstName,
        nl: studentInfo.firstNameLocal,
        l: studentInfo.lastName,
        ll: studentInfo.lastNameLocal,
        f: studentInfo.fathersName,
        fl: studentInfo.fathersNameLocal,
        m: studentInfo.mothersName,
        ml: studentInfo.mothersNameLocal
      };  

      // Create payload for database
      const o1 = {
        f: classInput.dataset.id,
        g: divisionInput.value.toLowerCase(),
        i: rollNumberInput.value,
        j: o2
      };

      payload0.vw = 1;
      payload0.fn = 45;
      payload0.o1 = o1;
      payload0.x0 = curYr;

      try {
        const response = await fnj3(
          "https://my1.in/2/3a.php",
          payload0,
          1,
          true,
          "loader",
          20000,
          0,
          2,
          1
        );

        if (response) {
          if (response.su && response.su == 1) {
            
              showToast("Student information added successfully");

              // Get existing saved students or initialize empty array
              const savedStudents =
                JSON.parse(localStorage.getItem("studentInfo")) || [];

              // Check if this student already exists
              const existingIndex = savedStudents.findIndex(
                (s) =>
                  s.classId === studentInfo.classId &&
                  s.division === studentInfo.division &&
                  s.rollNumber === studentInfo.rollNumber
              );

              if (existingIndex >= 0) {
                // Update existing entry
                savedStudents[existingIndex] = studentInfo;
              } else {
                // Add new entry
                savedStudents.push(studentInfo);
              }

              // Save back to localStorage
              localStorage.setItem(
                "studentInfo",
                JSON.stringify(savedStudents)
              );

              document.getElementById(i_d_class_modal).style.display = "none";
              await displayClassCards();
          } else {
              alert(response.ms);
          }
        }
      } catch (error) {
        if (error.message.includes("timed out")) {
          alert("Error: timed out - " + error.message);
        } else {
          alert("Error: " + error.message);
        }
      }
    });

  document
    .getElementById("pull_attendance")
    ?.addEventListener("click", async (e) => {
      e.preventDefault();
      playClickSound();

      payload0.vw = 1;
      payload0.fn = 49;
      payload0.x0 = curYr;

      try {
        const response = await fnj3(
          "https://my1.in/2/3a.php",
          payload0,
          1,
          true,
          "loader",
          20000,
          0,
          2,
          1
        );

        if (response) {
          if (response.su && response.su == 1) {
              if(response.fn49 && response.fn49.l && response.fn49.l.length>0 ){
                let t378mp = convertData(response.fn49.l);
                const t379mp = await dbDexieManager.insertToDexie(dbnm, "fn44", t378mp, true, ["e","f","g","h","i","j"]);
                e_lements.configModal.style.display = "none";
                alert("check your attendance");
              }else{
                alert("you got empty result;");
              }
          } else {
              alert(response.ms);
          }
        }
      } catch (error) {
        if (error.message.includes("timed out")) {
          alert("Error: timed out - " + error.message);
        } else {
          alert("Error: " + error.message);
        }
      }
    });

  // Helper function to show validation errors
  function showValidationError(inputElement, message) {
    const formGroup = inputElement.closest(".at_form_group");
    if (!formGroup) return;

    // Add error message if not already present
    if (!formGroup.querySelector(".at_validation_error")) {
      const errorElement = document.createElement("div");
      errorElement.className = "at_validation_error";
      errorElement.textContent = message;
      formGroup.appendChild(errorElement);
    }

    // Highlight the input
    inputElement.classList.add("at_input_error");
    inputElement.addEventListener(
      "input",
      () => {
        inputElement.classList.remove("at_input_error");
        formGroup.querySelector(".at_validation_error")?.remove();
      },
      { once: true }
    );
  }
}

function showClassSelectionModal() {
  const modal = document.getElementById(i_d_class_selection_modal);
  const tbody = modal.querySelector("tbody");
  tbody.innerHTML = "";

  // Populate classes from appData
  appData.clss.forEach((cls) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${cls.n}</td>`;
    row.dataset.id = cls.a;
    row.dataset.name = cls.n;
    tbody.appendChild(row);
  });

  // Set up click handlers
  tbody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      const classInput = document.getElementById("at_select_class");
      classInput.value = row.dataset.name;
      classInput.dataset.id = row.dataset.id;
      modal.style.display = "none";
    });
  });

  modal.style.display = "flex";
}

function showSubjectSelectionModal() {
  const modal = document.getElementById(i_d_subject_selection_modal);
  const tbody = modal.querySelector("tbody");
  tbody.innerHTML = "";

  // Populate subjects from appData
  appData.subs.forEach((sub) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${sub.n}</td>`;
    row.dataset.id = sub.a;
    row.dataset.name = sub.n;
    tbody.appendChild(row);
  });

  // Set up click handlers
  tbody.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => {
      const subjectInput = document.getElementById("at_select_subject");
      subjectInput.value = row.dataset.name;
      subjectInput.dataset.id = row.dataset.id;
      modal.style.display = "none";
    });
  });

  modal.style.display = "flex";
}

// Variables for roll number tracking
let c_urrent_roll_data = {
  classInfo: null,
  rollStatus: {},
};

async function showRollNumberModal(classInfo) {
  const modal = document.getElementById("at_roll_modal");
  const gridContainer = document.getElementById("at_roll_grid_container");
  const detailsContainer = document.getElementById("at_roll_details_container");

  // Store current class info
  c_urrent_roll_data.classInfo = classInfo;
  c_urrent_roll_data.rollStatus = {};

  try {
    const db = dbDexieManager.dbCache.get(dbnm);
    if (!db) {
      showToast("Database not initialized");
      return;
    }

    // Verify the table exists using Dexie's API
    const tableName = `at${curYr}`;
    const table = db.table(tableName); // This is the correct way to access a table

    if (!table) {
      showToast("Attendance table not found");
      return;
    }

    const startRoll = parseInt(classInfo.startRoll);
    const endRoll = parseInt(classInfo.endRoll);

    let stuLst;
    try {
      stuLst = await table
        .where("f")
        .equals(classInfo.classId.toString())
        .and((item) => item.g.toLowerCase() === classInfo.division.toLowerCase())
        .and((item) => item.h === classInfo.subjectId.toString())
        .and((item) => item.i >= startRoll && item.i <= endRoll)
        .toArray();

      stuLst = stuLst.sort((a, b) => (a.a > b.a ? -1 : a.a < b.a ? 1 : 0));
    } catch (queryError) {
      console.error("Query error:", queryError);
      showToast("Error querying attendance data");
      return;
    }

    // Check if all roll numbers exist in stuLst
    let allRollsExist = true;

    for (let roll = startRoll; roll <= endRoll; roll++) {
      const exists = stuLst.some(
        (s) =>
          s.f.toString() == classInfo.classId.toString() &&
          s.g == classInfo.division &&
          s.h.toString() == classInfo.subjectId.toString() &&
          s.i.toString() == roll.toString()
      );

      if (!exists) {
        allRollsExist = false;
        break;
      }
    }

    if (!allRollsExist) {
      showCustomAlert(
        "Some roll numbers are missing. Please re-create the class.",
        false
      ).then(() => {
        // Close the modal if open
        modal.style.display = "none";
        // Optionally open the class creation modal
        prefillClassModal(classInfo);
        document.getElementById(i_d_class_modal).style.display = "flex";
      });
      return; // Exit the function early
    }

    // Store the student list for later use
    c_urrent_roll_data.stuLst = stuLst;

    detailsContainer.innerHTML = `
        <div><strong>Class:</strong> ${classInfo.className}
        <strong>Division:</strong> ${classInfo.division}
        <strong>Subject:</strong> ${classInfo.subjectName}
        <strong>Roll Range:</strong> ${classInfo.startRoll} to ${classInfo.endRoll}</div>
    `;

    // Add this to the showRollNumberModal function, right after setting up the detailsContainer
    // Add date navigation controls
    const dateNavContainer = document.createElement("div");
    dateNavContainer.className = "at_date_nav_container";
    dateNavContainer.innerHTML = `
    <button class="at_date_nav_arrow" id="at_prev_date">&lt;</button>
    <div class="at_current_date">${formatDate(new Date())}</div>
    <button class="at_date_nav_arrow" id="at_next_date">&gt;</button>
`;
    detailsContainer.appendChild(dateNavContainer);

    // Store current date in our data object
    c_urrent_roll_data.currentDate = new Date();

    // Get current day of year and update display
    const dayOfYear = getDayOfYear(c_urrent_roll_data.currentDate);
    updateRollStatusForDay(dayOfYear);

    // Add event listeners for date navigation
    document.getElementById("at_prev_date").addEventListener("click", () => {
      playClickSound();
      navigateDate(-1); // Previous day
    });

    document.getElementById("at_next_date").addEventListener("click", () => {
      playClickSound();
      navigateDate(1); // Next day
    });

    // Add this helper function to format dates
    function formatDate(date) {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Add this function to handle date navigation
    function navigateDate(days) {
      const newDate = new Date(c_urrent_roll_data.currentDate);
      newDate.setDate(newDate.getDate() + days);
      c_urrent_roll_data.currentDate = newDate;

      // Update the displayed date
      document.querySelector(".at_current_date").textContent =
        formatDate(newDate);

      // Get the day of year (1-366)
      const dayOfYear = getDayOfYear(newDate);

      // Update the roll status display for this day
      updateRollStatusForDay(dayOfYear);
    }

    function updateRollStatusForDay(dayOfYear) {
      const stuLst = c_urrent_roll_data.stuLst || [];
      const classInfo = c_urrent_roll_data.classInfo;

      if (!classInfo || !stuLst.length) return;

      // Clear current status
      c_urrent_roll_data.rollStatus = {};

      // Update each roll number's status
      const startRoll = parseInt(classInfo.startRoll);
      const endRoll = parseInt(classInfo.endRoll);

      for (let roll = startRoll; roll <= endRoll; roll++) {
        const rollCircle = document.querySelector(
          `.at_roll_circle[data-roll="${roll}"]`
        );
        if (!rollCircle) continue;

        // Find the student record for this roll number
        const studentRecord = stuLst.find(
          (s) =>
            s.f == classInfo.classId &&
            s.g == classInfo.division &&
            s.h == classInfo.subjectId &&
            s.i == roll
        );

        let status = "0"; // Default to grey (no data)

        if (studentRecord) {
          // Get the status for this specific day
          const dayStatus = studentRecord[`d${dayOfYear}`];

          if (dayStatus !== undefined) {
            status = dayStatus.toString();
          }
        }

        // Update UI
        rollCircle.dataset.status = status;
        rollCircle.className = `at_roll_circle ${
          status === "0" ? "grey" : status === "1" ? "green" : "orange"
        }`;

        // Update the indicator circle
        const indicator = rollCircle.querySelector(".at_roll_indicator");
        if (indicator) {
          indicator.style.backgroundColor =
            status === "0" ? "grey" : status === "1" ? "green" : "orange";
        }

        // Update our data object
        c_urrent_roll_data.rollStatus[roll] = {
          status: parseInt(status),
          id: studentRecord ? studentRecord.a : null,
          dayOfYear: dayOfYear, // Store which day we're viewing
        };
      }
    }

    // Clear previous grid
    gridContainer.innerHTML = "";

    // Set CSS variable for number of columns
    gridContainer.style.setProperty("--columns", number_of_columns);

    for (let roll = startRoll; roll <= endRoll; roll++) {
      const rollCircle = document.createElement("div");
      rollCircle.className = "at_roll_circle grey";
      rollCircle.textContent = roll;
      rollCircle.dataset.roll = roll;
      rollCircle.dataset.status = "0"; // Default to grey

      // Find matching student record
      const studentRecord = stuLst.find(
        (s) =>
          s.f == classInfo.classId &&
          s.g == classInfo.division &&
          s.h == classInfo.subjectId &&
          s.i == roll
      );

      // If student record found, set initial status
      if (studentRecord) {
        // Determine status based on student record
        // You might need to adjust this based on your actual status indicators
        let status = "0"; // Default
        if (studentRecord.oflDtt) {
          status = "1"; // Present (green)
        } else if (studentRecord.fcmDtt) {
          status = "2"; // Absent (orange)
        }

        rollCircle.dataset.status = status;
        rollCircle.className = `at_roll_circle ${
          status === "0" ? "grey" : status === "1" ? "green" : "orange"
        }`;

        // Store in our data object
        c_urrent_roll_data.rollStatus[roll] = parseInt(status);
      }

      // Create and append the indicator circle
      const indicator = document.createElement("div");
      indicator.className = "at_roll_indicator";
      indicator.style.backgroundColor =
        rollCircle.dataset.status === "0"
          ? "grey"
          : rollCircle.dataset.status === "1"
          ? "green"
          : "orange";
      rollCircle.appendChild(indicator);

      rollCircle.addEventListener("click", () => toggleRollStatus(rollCircle));

      gridContainer.appendChild(rollCircle);
    }

    // Load saved status if available (this will override any DB-loaded status)
    loadRollStatus(classInfo);

    // Set initial date to today
    c_urrent_roll_data.currentDate = new Date();
    document.querySelector(".at_current_date").textContent = formatDate(
      c_urrent_roll_data.currentDate
    );

    // Initialize with current day's data
    updateRollStatusForDay(dayOfYear);

    // Show modal
    modal.style.display = "flex";
  } catch (error) {
    console.error("Database error:", error);
    showToast("Database error occurred");
  }
}

function prefillClassModal(classInfo) {
  // Set class selection
  const classInput = document.getElementById("at_select_class");
  classInput.value = classInfo.className;
  classInput.dataset.id = classInfo.classId;

  // Set division
  const divisionInput = document.getElementById("at_select_division");
  divisionInput.value = classInfo.division;

  // Set subject
  const subjectInput = document.getElementById("at_select_subject");
  subjectInput.value = classInfo.subjectName;
  subjectInput.dataset.id = classInfo.subjectId;

  // Set student count
  const studentCountInput = document.getElementById("at_student_count");
  studentCountInput.value = classInfo.studentCount;

  // Trigger the input event to show the roll number fields
  studentCountInput.dispatchEvent(new Event("input"));

  // Set start roll
  const startRollInput = document.getElementById("at_start_roll");
  startRollInput.value = classInfo.startRoll;

  // Trigger the input event to calculate end roll
  startRollInput.dispatchEvent(new Event("input"));

  // Note: The end roll will be automatically calculated by your existing event listener
}

// Toggle roll number status
function toggleRollStatus(rollCircle) {
  const currentStatus = parseInt(rollCircle.dataset.status);
  let newStatus = (currentStatus + 1) % 3; // Cycle through 0,1,2
  const rollNumber = parseInt(rollCircle.dataset.roll);

  // Get the student record for this roll number
  const stuLst = c_urrent_roll_data.stuLst || [];
  const studentRecord = stuLst.find((s) => s.i === rollNumber);

  // Update UI
  rollCircle.dataset.status = newStatus;
  rollCircle.className =
    "at_roll_circle " +
    (newStatus === 0 ? "grey" : newStatus === 1 ? "green" : "orange");

  // Update the indicator
  // const indicator = rollCircle.querySelector('.at_roll_indicator');
  // if (indicator) {
  //     indicator.style.backgroundColor = newStatus === 0 ? 'grey' :
  //                                     newStatus === 1 ? 'green' : 'orange';
  // }

  // Get current day of year
  const dayOfYear = getDayOfYear(c_urrent_roll_data.currentDate);

  // Update our data object
  c_urrent_roll_data.rollStatus[rollNumber] = {
    status: newStatus,
    id: studentRecord ? studentRecord.a : null,
    dayOfYear: dayOfYear,
    changed: true, // Mark that this status was changed
  };
}

// Load saved roll status
function loadRollStatus(classInfo) {
  const savedData = localStorage.getItem(
    `rollStatus_${classInfo.classId}_${classInfo.division}`
  );
  if (!savedData) return;

  try {
    const parsedData = JSON.parse(savedData);
    Object.entries(parsedData).forEach(([roll, data]) => {
      const rollCircle = document.querySelector(
        `.at_roll_circle[data-roll="${roll}"]`
      );
      if (rollCircle) {
        const status = typeof data === "object" ? data.status : data;
        rollCircle.dataset.status = status;
        rollCircle.className =
          "at_roll_circle " +
          (status === "0" ? "grey" : status === "1" ? "green" : "orange");

        // Update our data object with the full structure
        c_urrent_roll_data.rollStatus[roll] = {
          status: parseInt(status),
          id: typeof data === "object" ? data.id : null,
          d1: parseInt(status),
        };
      }
    });
  } catch (e) {
    console.error("Error loading roll status:", e);
  }
}

async function displayClassCards() {
  const container = document.getElementById("at_class_cards_container");
  container.innerHTML = "";

  if (savedStudents.length === 0) {
    container.innerHTML = `<div class="at_no_students">No students found. Click the + icon to add a student.</div>`;
    return;
  }

  // Group students by class and division for better organization
  const groupedStudents = savedStudents.reduce((groups, student) => {
    const key = `${student.classId}-${student.division}`;
    if (!groups[key]) {
      groups[key] = {
        className: student.className,
        division: student.division,
        students: [],
      };
    }
    groups[key].students.push(student);
    return groups;
  }, {});

  // Create cards for each class group
  for (const [key, group] of Object.entries(groupedStudents)) {
    // Class group header
    const headerCard = document.createElement("div");
    headerCard.className = "at_class_card_header";
    headerCard.innerHTML = `
      <h3>${group.className} - Division ${group.division}</h3>
    `;
    container.appendChild(headerCard);

    // Sort students by roll number
    group.students.sort(
      (a, b) => parseInt(a.rollNumber) - parseInt(b.rollNumber)
    );

    // Create card for each student
    for (const student of group.students) {
      const card = document.createElement("div");
      card.className = "at_class_card";
      card.dataset.student = JSON.stringify(student); // Store student data
      card.innerHTML = `
        <div class="at_class_card_header">
          <h4 class="at_class_card_title">Roll No: ${student.rollNumber}</h4>
          <i class="fas fa-trash at_class_card_delete" data-id="${
            student.classId
          }-${student.division}-${student.rollNumber}"></i>
        </div>
        <div class="at_class_card_body">
          <div class="at_form_row">
            <div>
              <label>Name:</label>
              <p>${student.firstName} ${student.lastName}</p>
            </div>
            <div>
              <label>Local Name:</label>
              <p>${student.firstNameLocal} ${student.lastNameLocal}</p>
            </div>
          </div>
          <div class="at_form_row">
            <div>
              <label>Father's Name:</label>
              <p>${student.fathersName}</p>
            </div>
            <div>
              <label>Father's Local Name:</label>
              <p>${student.fathersNameLocal}</p>
            </div>
          </div>
          <div class="at_form_row">
            <div>
              <label>Mother's Name:</label>
              <p>${student.mothersName}</p>
            </div>
            <div>
              <label>Mother's Local Name:</label>
              <p>${student.mothersNameLocal}</p>
            </div>
          </div>
          <div class="at_class_card_footer">
            <small>Added: ${new Date(
              student.timestamp
            ).toLocaleDateString()}</small>
          </div>
        </div>
      `;
      container.appendChild(card);
      
      // Add click event to show student details
      card.addEventListener('click', async (e) => {
        // Don't open modal if delete button was clicked
        if (e.target.classList.contains('at_class_card_delete')) return;
        
        await showStudentDetailsModal(student);
      });
    }
  }

document.querySelectorAll(".at_class_card_delete").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const id = e.target.dataset.id;
    const [classId, division, rollNumber] = id.split("-");

    showCustomAlert(`Delete student ${rollNumber}?`, true).then(
      async (confirmed) => {
        if (confirmed) {
          const savedStudents =
            JSON.parse(localStorage.getItem("studentInfo")) || [];
          const updatedStudents = savedStudents.filter(
            (s) =>
              !(
                s.classId === classId &&
                s.division === division &&
                s.rollNumber === rollNumber
              )
          );
          localStorage.setItem(
            "studentInfo",
            JSON.stringify(updatedStudents)
          );
          await displayClassCards();
          showToast("Student deleted successfully");
        }
      }
    );
  });
});
}

async function showStudentDetailsModal(student) {
  const modal = document.getElementById('at_student_details_modal');
  const content = document.getElementById('at_student_details_content');

  const db = dbDexieManager.dbCache.get(dbnm);
  if (!db) {
    showToast("Database not initialized");
    return;
  }
  
  const table = db.table(`fn44`);
  if (!table) {
    showToast("Attendance table not found");
    return;
  }

  let a_ttendance_lst;
try {
  a_ttendance_lst = await table
    .filter(item => 
      item.e.toString() === curYr.toString() &&
      item.f.toString() === student.classId.toString() &&
      item.g.toLowerCase() === student.division.toLowerCase() &&
      item.i.toString() == student.rollNumber.toString()
    )
    .toArray();
    
//   a_ttendance_lst = a_ttendance_lst.sort((a, b) => a.j > b.j ? -1 : a.j < b.j ? 1 : 0);
a_ttendance_lst = a_ttendance_lst.sort((a, b) => {
  // First, separate records with j > 7 and j <= 7
  const aIsGreaterThanGvnDay = a.j > 213;//1st Aug 2025
  const bIsGreaterThanGvnDay = b.j > 213;//1st Aug 2025
  
  // If both have j <= 7 or both have j > 7, maintain the original sort order
  if (aIsGreaterThanGvnDay === bIsGreaterThanGvnDay) {
    return a.j > b.j ? -1 : a.j < b.j ? 1 : 0;
  }
  
  // Put records with j > 7 at the end
  return aIsGreaterThanGvnDay ? 1 : -1;
});
} catch (queryError) {
  console.error("Query error:", queryError);
  showToast("Error querying attendance data");
  return;
}

  // Get subject names from appData
  const subjectNames = {};
  appData.subs.forEach(sub => {
    subjectNames[sub.a] = sub.n;
  });

  // Format the attendance data
  let attendanceHTML = `
    <div class="at_student_details">
      <h3>${student.firstName} ${student.lastName} (Roll No: ${student.rollNumber})</h3>
      <p>Class: ${student.className} - Division ${student.division}</p>
      
      <div class="at_attendance_table_container">
        <table class="at_attendance_table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
  `;

  // Counter for tracking records and ad placements
  let recordCount = 0;
  let adCount = 0;
  
  a_ttendance_lst.forEach((record, index) => {
    // Convert day of year to date
    const date = new Date(new Date().getFullYear(), 0);
    date.setDate(parseInt(record.j));
    
    // Get status text
    let statusText = "un-Marked";
    let statusClass = "grey";
    if (record.k === "1") {
      statusText = "Present";
      statusClass = "green";
    } else if (record.k === "2") {
      statusText = "Absent";
      statusClass = "orange";
    }
    
    // Get subject name
    const subjectName = subjectNames[record.h] || `Subject ${record.h}`;
    
    attendanceHTML += `
      <tr>
        <td>${convertDateFormatToIndia(date)}</td>
        <td>${subjectName}</td>
        <td><span class="at_status_badge ${statusClass}">${statusText}</span></td>
      </tr>
    `;
    
    recordCount++;
    
    // Add ad placeholder after every 2 records (but not after the last record)
    if (recordCount % 2 === 0 && index < a_ttendance_lst.length - 1) {
      adCount++;
      attendanceHTML += `
        </tbody>
        </table>
        <!-- Ad Placeholder -->
        <div class="at_ad_banner" id="at_ad_${adCount}">
          <ins class="adsbygoogle"
               style="display:inline-block;width:320px;height:50px"
               data-ad-client="ca-pub-5594579046538353"
               data-ad-slot="1287000278"></ins>
        </div>
        <!-- Continue table -->
        <table class="at_attendance_table">
          <tbody>
      `;
    }
  });

  attendanceHTML += `
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  content.innerHTML = attendanceHTML;
  modal.style.display = 'flex';
  playClickSound();
  
  // Initialize all ads at once after a short delay
  if (adCount > 0) {
    setTimeout(() => {
      if (window.adsbygoogle) {
        // Initialize all ad placeholders
        for (let i = 1; i <= adCount; i++) {
          try {
            (adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.error('Ad initialization error:', e);
          }
        }
      }
    }, 1000); // 1 second delay to ensure DOM is ready
  }
}

function handleFCMtokenChange(objTk) {
  if (!objTk || !objTk.nw) {
    console.error("Invalid token change object");
    return;
  }
  // Initialize tkLst if it doesn't exist
  if (!appData.tkLst) {
    appData.tkLst = [];
  }
  const { old: oldToken, nw: newToken } = objTk;
  // Check if old token exists in the list and remove it
  if (oldToken) {
    appData.tkLst = appData.tkLst.filter((token) => token !== oldToken);
  }
  // Check if new token already exists
  if (appData.tkLst.includes(newToken)) {
    console.log("New token already exists in the list");
    return;
  }
  // Check if we've reached the token limit
//   if (appData.tkLst.length >= at_da_tkLimit) {
//     // Remove the oldest token (first in array)
//     appData.tkLst.shift();
//   }
  // Add the new token
  appData.tkLst.push(newToken);
  console.log("Token list updated:", appData.tkLst);
}
function handleFCMpayloadByfn(payload) {
  if (!payload || !payload.data) {
    console.error("Invalid payload format");
    return;
  }
  const { fn } = payload.data;
  switch (fn) {
    case "38": // Handle favorite/like notification
      incrementLikesBadge();
      break;
    case "42": // Handle app opened
      updateNotificationBadges();
      break;
    default:
      console.log(`Unhandled FCM function type: ${fn}`);
  }
}
// Set up event listeners
function setupEventListeners() {
  document.getElementById("at_plus_icon")?.addEventListener("click", () => {
    playClickSound();
    document.getElementById(i_d_class_modal).style.display = "flex";
  });

  document.getElementById("at_settings_icon").addEventListener("click", () => {
    playClickSound();
    e_lements.configModal.style.display = "flex";
    addGlowEffect(e_lements.configModal);
  });

  // With this more specific version:
  document.querySelectorAll(".at_modal_close").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      playClickSound();
      // Find the closest modal to this close button
      const modal = event.target.closest(".at_modal");
      if (modal) {
        modal.style.display = "none";
      }
    });
  });

  // Custom alert buttons
  document
    .getElementById("at_custom_alert_confirm")
    ?.addEventListener("click", () => {
      playClickSound();
      e_lements.customAlert.style.display = "none";
    });

  document
    .getElementById("at_custom_alert_cancel")
    ?.addEventListener("click", () => {
      playClickSound();
      e_lements.customAlert.style.display = "none";
    });

  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("at_modal")) {
      event.target.style.display = "none";
    }
  });
}

// Save properties
function saveProperties() {
  appData.slideTime =
    parseInt(document.getElementById("at_slide_time").value) || 3;
  appData.offerLine = document.getElementById("at_offer_line").value;
  appData.retToday = document.getElementById("at_ret_today").value;
  appData.shoInDemand = document.getElementById("at_in_demand_toggle").checked
    ? 1
    : 0;

  // Notification settings
  // appData.notification.icon = document.getElementById("at_notification_icon").value;
  // appData.notification.sound = document.getElementById("at_notification_sound").value;
  // appData.notification.badge = document.getElementById("at_notification_badge").value;

  // App settings
  // appData.clickSound = document.getElementById("at_click_sound").value;
  // appData.pwaIco = document.getElementById("at_pwa_ico").value;
  // appData.cacheStrategy = parseInt(document.getElementById("at_cache_strategy").value);

  showToast("Properties saved successfully");
}

// Show loader
function s_howLoader() {
  document.getElementById("loader").style.display = "flex";
}

// Hide loader
function h_ideLoader() {
  document.getElementById("loader").style.display = "none";
}

// Show custom alert
function showCustomAlert(message, showCancel = false) {
  return new Promise((resolve) => {
    document.getElementById("at_custom_alert_message").textContent = message;

    const confirmBtn = document.getElementById("at_custom_alert_confirm");
    const cancelBtn = document.getElementById("at_custom_alert_cancel");

    // Set up event listeners
    const handleConfirm = () => {
      e_lements.customAlert.style.display = "none";
      confirmBtn.removeEventListener("click", handleConfirm);
      if (showCancel) cancelBtn.removeEventListener("click", handleCancel);
      resolve(true);
    };

    const handleCancel = () => {
      e_lements.customAlert.style.display = "none";
      confirmBtn.removeEventListener("click", handleConfirm);
      cancelBtn.removeEventListener("click", handleCancel);
      resolve(false);
    };

    confirmBtn.addEventListener("click", handleConfirm);

    if (showCancel) {
      cancelBtn.style.display = "inline-block";
      cancelBtn.addEventListener("click", handleCancel);
    } else {
      cancelBtn.style.display = "none";
    }

    e_lements.customAlert.style.display = "flex";
  });
}

// Play click sound
function playClickSound() {
  if (!appData.clickSound) return;

  const audio = new Audio(appData.clickSound);
  audio.volume = v_olume;
  audio.play().catch((e) => console.error("Error playing click sound:", e));
}

// Handle volume change
function handleVolumeChange(event) {
  v_olume = event.target.value / 100;
}

// Add glow effect to element
function addGlowEffect(element) {
  element.classList.add(c_lass_glow_effect);
  setTimeout(() => {
    element.classList.remove(c_lass_glow_effect);
  }, 1000);
}

function convertData(input) {
  const result = [];
  
  input.forEach(item => {
    // Extract common properties that remain the same for all days
    // const { e: curYr, f, g, h, i } = input;
    // const commonProps = { e: curYr, f, g, h, i };
    const { f, g, h, i } = item;
    const commonProps = { e: curYr, f, g, h, i }; // Using 25 as default for e
    
    // Find all d* properties (d1 to d366)
    const dayProperties = Object.keys(item)
      .filter(key => key.startsWith('d') && !isNaN(parseInt(key.substring(1))))
      .sort((a, b) => parseInt(a.substring(1)) - parseInt(b.substring(1)));
    
    // Create an entry for each day
    dayProperties.forEach(dayProp => {
      const dayNumber = parseInt(dayProp.substring(1));
      result.push({
        ...commonProps,
        j: dayNumber,
        k: item[dayProp]
      });
    });
  });
  
  return result;
}

// Update notification badges
function updateNotificationBadges() {
  document.getElementById("at_notification_badge_1").textContent = "3";
  document.getElementById("at_notification_badge_3").textContent = "1";
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Initialize when scripts are loaded
if (typeof initApp === "function") {
  initApp();
}

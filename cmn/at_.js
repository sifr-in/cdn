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
 itemTable: document.getElementById(i_d_item_table)
};

// Initialize the app
async function shoAppInit(data) {
 // Set initial volume
 if (e_lements.volumeControl) {
  e_lements.volumeControl.value = v_olume * 100;
  e_lements.volumeControl.addEventListener("input", handleVolumeChange);
 }
 e_lements.i_nstall_pwa?.addEventListener("click", () => {
  if (typeof f_n_sho_install_modal !== undefined) {
   window.f_n_sho_install_modal(1);
   document.querySelectorAll('.at_modal').forEach(modal => {
    modal.style.display = 'none';
   });
  } else
   showToast("install function not found");
 });

 // Set up event listeners
 setupEventListeners();

 // Update notification badges
 updateNotificationBadges();
 await displayClassCards();
 setupClassModal();
 setupRollModalListeners();
}

function setupClassModal() {
 // Class selection
 document.getElementById("at_select_class")?.addEventListener("click", () => {
  playClickSound();
  showClassSelectionModal();
 });

 // Subject selection
 document.getElementById("at_select_subject")?.addEventListener("click", () => {
  playClickSound();
  showSubjectSelectionModal();
 });

 // Student count input
 document.getElementById("at_student_count")?.addEventListener("input", (e) => {
  const count = parseInt(e.target.value);
  const startRollContainer = document.getElementById("at_start_roll_container");
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
  const studentCount = parseInt(document.getElementById("at_student_count").value);
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

 // Save button
 document.getElementById("at_save_class_info")?.addEventListener("click", () => {
  playClickSound();
  saveClassInfo()
   .then(() => console.log(''))
   .catch(err => console.error('Error saving:', err));
 });
}

function showClassSelectionModal() {
 const modal = document.getElementById(i_d_class_selection_modal);
 const tbody = modal.querySelector("tbody");
 tbody.innerHTML = "";

 // Populate classes from appData
 appData.clss.forEach(cls => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${cls.n}</td>`;
  row.dataset.id = cls.a;
  row.dataset.name = cls.n;
  tbody.appendChild(row);
 });

 // Set up click handlers
 tbody.querySelectorAll("tr").forEach(row => {
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
 appData.subs.forEach(sub => {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${sub.n}</td>`;
  row.dataset.id = sub.a;
  row.dataset.name = sub.n;
  tbody.appendChild(row);
 });

 // Set up click handlers
 tbody.querySelectorAll("tr").forEach(row => {
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
 rollStatus: {}
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
    .where('f').equals(classInfo.classId.toString())
    .and(item => item.g === classInfo.division)
    .and(item => item.h === classInfo.subjectId.toString())
    .and(item => item.i >= startRoll && item.i <= endRoll)
    .toArray();

   stuLst = stuLst.sort((a, b) => a.a > b.a ? -1 : a.a < b.a ? 1 : 0);
  } catch (queryError) {
   console.error("Query error:", queryError);
   showToast("Error querying attendance data");
   return;
  }

  // Check if all roll numbers exist in stuLst
  let allRollsExist = true;

  for (let roll = startRoll; roll <= endRoll; roll++) {
   const exists = stuLst.some(s =>
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
   showCustomAlert("Some roll numbers are missing. Please re-create the class.", false)
    .then(() => {
     // Close the modal if open
     modal.style.display = 'none';
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
  const dateNavContainer = document.createElement('div');
  dateNavContainer.className = 'at_date_nav_container';
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
  document.getElementById('at_prev_date').addEventListener('click', () => {
   playClickSound();
   navigateDate(-1); // Previous day
   document.querySelectorAll('input[name="bulk_status"]').forEach(radio => {
    radio.checked = false;
   });
  });

  document.getElementById('at_next_date').addEventListener('click', () => {
   playClickSound();
   navigateDate(1); // Next day
   document.querySelectorAll('input[name="bulk_status"]').forEach(radio => {
    radio.checked = false;
   });
  });

  // Add this helper function to format dates
  function formatDate(date) {
   return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
   });
  }

  // Add this function to handle date navigation
  function navigateDate(days) {
   const newDate = new Date(c_urrent_roll_data.currentDate);
   newDate.setDate(newDate.getDate() + days);
   c_urrent_roll_data.currentDate = newDate;

   // Update the displayed date
   document.querySelector('.at_current_date').textContent = formatDate(newDate);

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
    const rollCircle = document.querySelector(`.at_roll_circle[data-roll="${roll}"]`);
    if (!rollCircle) continue;

    // Find the student record for this roll number
    const studentRecord = stuLst.find(s =>
     s.f == classInfo.classId &&
     s.g == classInfo.division &&
     s.h == classInfo.subjectId &&
     s.i == roll
    );

    let status = '0'; // Default to grey (no data)

    if (studentRecord) {
     // Get the status for this specific day
     const dayStatus = studentRecord[`d${dayOfYear}`];

     if (dayStatus !== undefined) {
      status = dayStatus.toString();
     }
    }

    // Update UI
    rollCircle.dataset.status = status;
    rollCircle.className = `at_roll_circle ${status === '0' ? 'grey' : status === '1' ? 'green' : 'orange'}`;

    // Update the indicator circle
    const indicator = rollCircle.querySelector('.at_roll_indicator');
    if (indicator) {
     indicator.style.backgroundColor = status === '0' ? 'grey' :
      status === '1' ? 'green' : 'orange';
    }

    // Update our data object
    c_urrent_roll_data.rollStatus[roll] = {
     status: parseInt(status),
     id: studentRecord ? studentRecord.a : null,
     dayOfYear: dayOfYear // Store which day we're viewing
    };
   }
  }

  // Clear previous grid
  gridContainer.innerHTML = '';

  // Set CSS variable for number of columns
  gridContainer.style.setProperty('--columns', number_of_columns);

  for (let roll = startRoll; roll <= endRoll; roll++) {
   const rollCircle = document.createElement('div');
   rollCircle.className = 'at_roll_circle grey';
   rollCircle.textContent = roll;
   rollCircle.dataset.roll = roll;
   rollCircle.dataset.status = '0'; // Default to grey

   // Find matching student record
   const studentRecord = stuLst.find(s =>
    s.f == classInfo.classId &&
    s.g == classInfo.division &&
    s.h == classInfo.subjectId &&
    s.i == roll
   );

   // If student record found, set initial status
   if (studentRecord) {
    // Determine status based on student record
    // You might need to adjust this based on your actual status indicators
    let status = '0'; // Default
    if (studentRecord.oflDtt) {
     status = '1'; // Present (green)
    } else if (studentRecord.fcmDtt) {
     status = '2'; // Absent (orange)
    }

    rollCircle.dataset.status = status;
    rollCircle.className = `at_roll_circle ${status === '0' ? 'grey' : status === '1' ? 'green' : 'orange'}`;

    // Store in our data object
    c_urrent_roll_data.rollStatus[roll] = parseInt(status);
   }

   // Create and append the indicator circle
   const indicator = document.createElement('div');
   indicator.className = 'at_roll_indicator';
   indicator.style.backgroundColor = rollCircle.dataset.status === '0' ? 'grey' :
    rollCircle.dataset.status === '1' ? 'green' : 'orange';
   rollCircle.appendChild(indicator);

   rollCircle.addEventListener('click', () => toggleRollStatus(rollCircle));

   gridContainer.appendChild(rollCircle);
  }

  // Load saved status if available (this will override any DB-loaded status)
  loadRollStatus(classInfo);

  // Set initial date to today
  c_urrent_roll_data.currentDate = new Date();
  document.querySelector('.at_current_date').textContent = formatDate(c_urrent_roll_data.currentDate);

  // Initialize with current day's data
  updateRollStatusForDay(dayOfYear);

  // Show modal
  modal.style.display = 'flex';
 } catch (error) {
  console.error("Database error:", error);
  showToast("Database error occurred");
 }

 document.querySelectorAll('input[name="bulk_status"]').forEach(radio => {
  radio.checked = false;
 });
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
 studentCountInput.dispatchEvent(new Event('input'));

 // Set start roll
 const startRollInput = document.getElementById("at_start_roll");
 startRollInput.value = classInfo.startRoll;

 // Trigger the input event to calculate end roll
 startRollInput.dispatchEvent(new Event('input'));

 // Note: The end roll will be automatically calculated by your existing event listener
}

// Toggle roll number status
function toggleRollStatus(rollCircle) {
 const currentStatus = parseInt(rollCircle.dataset.status);
 let newStatus = (currentStatus + 1) % 3; // Cycle through 0,1,2
 const rollNumber = parseInt(rollCircle.dataset.roll);

 // Get the student record for this roll number
 const stuLst = c_urrent_roll_data.stuLst || [];
 const studentRecord = stuLst.find(s => s.i === rollNumber);

 // Update UI
 rollCircle.dataset.status = newStatus;
 rollCircle.className = 'at_roll_circle ' +
  (newStatus === 0 ? 'grey' : newStatus === 1 ? 'green' : 'orange');

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
  changed: true // Mark that this status was changed
 };
}

// Load saved roll status
function loadRollStatus(classInfo) {
 const savedData = localStorage.getItem(`rollStatus_${classInfo.classId}_${classInfo.division}`);
 if (!savedData) return;

 try {
  const parsedData = JSON.parse(savedData);
  Object.entries(parsedData).forEach(([roll, data]) => {
   const rollCircle = document.querySelector(`.at_roll_circle[data-roll="${roll}"]`);
   if (rollCircle) {
    const status = typeof data === 'object' ? data.status : data;
    rollCircle.dataset.status = status;
    rollCircle.className = 'at_roll_circle ' +
     (status === '0' ? 'grey' : status === '1' ? 'green' : 'orange');

    // Update our data object with the full structure
    c_urrent_roll_data.rollStatus[roll] = {
     status: parseInt(status),
     id: typeof data === 'object' ? data.id : null,
     d1: parseInt(status)
    };
   }
  });
 } catch (e) {
  console.error("Error loading roll status:", e);
 }
}

async function saveRollStatus() {
 if (!c_urrent_roll_data.classInfo) return;

 // Get current day of year
 const dayOfYear = getDayOfYear(c_urrent_roll_data.currentDate);
 const stuLst = c_urrent_roll_data.stuLst || [];
 const formattedChangedStatuses = [];

 const dayProperty = `d${dayOfYear}`;
 Object.entries(c_urrent_roll_data.rollStatus).forEach(([roll, data]) => {
  const rollNumber = parseInt(roll);

  // Only process changed statuses for the current day
  if (data.changed && data.dayOfYear === dayOfYear) {
   const studentRecord = stuLst.find(s =>
    s.f.toString() === c_urrent_roll_data.classInfo.classId.toString() &&
    s.g === c_urrent_roll_data.classInfo.division &&
    s.h.toString() === c_urrent_roll_data.classInfo.subjectId.toString() &&
    s.i === rollNumber
   );

   if (studentRecord && studentRecord[`d${dayOfYear}`] !== data.status) {
    formattedChangedStatuses.push({
     a: studentRecord.a,
     i: studentRecord.i,
     xx: data.status
    });
   }
  }
 });

 if (formattedChangedStatuses.length === 0) {
  showToast("No changes to save");
  return;
 }

 payload0.vw = 1;
 payload0.fn = 44;
 payload0.x0 = curYr;
 payload0.x1 = dayOfYear; // Send the day of year we're updating
 payload0.x2 = c_urrent_roll_data.classInfo.classId;
 payload0.x3 = c_urrent_roll_data.classInfo.division.toLowerCase();
 payload0.x4 = c_urrent_roll_data.classInfo.subjectId;
 payload0.l1 = formattedChangedStatuses;

 try {
  const response = await fnj3("https://my1.in/2/a.php", payload0, 1, true, "loader", 20000, 1);

  if (response) {
   if (response.su === 1) {
    let t579mp = "d" + dayOfYear;
    const updatedData = formattedChangedStatuses.map(obj => {
     const { xx, ...rest } = obj;
     return { ...rest, [t579mp]: xx };
    });
    let dbug = "dbug";

    const t635mp = await dbDexieManager.insertToDexie(dbnm, "at~" + curYr, updatedData, true, "a");
    if (t635mp && t635mp.success) {
     showToast("roll numbers added successfully");
     document.getElementById("at_roll_modal").style.display = 'none';
     await displayClassCards();
    } else {
     showToast("error --- adding roll numbers");
     console.error('Failed to add records:', t635mp ? t635mp.error : 'Unknown error');
    }


    /*const result = await dbManager.procssRslt2(dbnm, "at~"+curYr, response.fn44, ["a","f","g","h","i",`d${dayOfYear}`]);
    if (result.success) {
    // Clear the changed flags for saved statuses
    Object.values(c_urrent_roll_data.rollStatus).forEach(data => {
    if (data.dayOfYear === dayOfYear) {
    data.changed = false;
    }
    });
    
    showToast("Attendance saved successfully");
    } else {
    showToast("Error saving attendance");
    console.error('Failed to add records:', result.error);
    }*/
   } else {
    showOKmodal(response.ms);
   }
  }
 } catch (error) {
  showToast("Error: " + error.message);
  console.error("Error saving roll status:", error);
 }
}

// Setup event listeners for roll modal
function setupRollModalListeners() {
 document.getElementById("at_roll_save")?.addEventListener('click', () => {
  playClickSound();
  saveRollStatus();
 });

 document.getElementById("at_roll_cancel")?.addEventListener('click', () => {
  playClickSound();
  document.getElementById("at_roll_modal").style.display = 'none';
 });

 // Add bulk status change functionality
 // document.getElementById("at_apply_bulk_status")?.addEventListener('click', () => {
 //     playClickSound();
 //     const selectedStatus = document.querySelector('input[name="bulk_status"]:checked').value;
 //     applyBulkStatus(parseInt(selectedStatus));
 // });
 document.querySelectorAll('input[name="bulk_status"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
   playClickSound();
   applyBulkStatus(parseInt(e.target.value));
  });
 });
}

function applyBulkStatus(status) {
 const classInfo = c_urrent_roll_data.classInfo;
 if (!classInfo) return;

 const startRoll = parseInt(classInfo.startRoll);
 const endRoll = parseInt(classInfo.endRoll);
 const dayOfYear = getDayOfYear(c_urrent_roll_data.currentDate);

 for (let roll = startRoll; roll <= endRoll; roll++) {
  const rollCircle = document.querySelector(`.at_roll_circle[data-roll="${roll}"]`);
  if (!rollCircle) continue;

  // Update UI
  rollCircle.dataset.status = status;
  rollCircle.className = `at_roll_circle ${status === 0 ? 'grey' : status === 1 ? 'green' : 'orange'}`;

  // Find the student record for this roll number
  const studentRecord = c_urrent_roll_data.stuLst?.find(s =>
   s.f == classInfo.classId &&
   s.g == classInfo.division &&
   s.h == classInfo.subjectId &&
   s.i == roll
  );

  // Update our data object
  c_urrent_roll_data.rollStatus[roll] = {
   status: status,
   id: studentRecord ? studentRecord.a : null,
   dayOfYear: dayOfYear,
   changed: true // Mark that this status was changed
  };
 }
}

function getStatusName(status) {
 switch (status) {
  case 0: return "None";
  case 1: return "Present";
  case 2: return "Absent";
  default: return "Unknown";
 }
}

// Modify the displayClassCards function to add click handlers to cards
async function displayClassCards() {
 const container = document.getElementById('at_class_cards_container');
 if (!container) return;

 // Get saved class info from localStorage
 const savedClasses = JSON.parse(localStorage.getItem('classInfo')) || [];

 // Clear existing cards
 container.innerHTML = '';

 if (savedClasses.length === 0) {
  container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No class information saved yet.</p>';
  return;
 }

 // Create a card for each saved class
 savedClasses.forEach((classInfo, index) => {
  const card = document.createElement('div');
  card.className = 'at_class_card';

  card.innerHTML = `
<div class="at_class_card_header">
<div class="at_class_card_title">${classInfo.className} - ${classInfo.division}</div>
<div class="at_class_card_delete" data-index="${index}">&times;</div>
</div>
<div class="at_class_card_body">
<p><strong>Subject:</strong> ${classInfo.subjectName}</p>
<p><strong>Students:</strong> ${classInfo.studentCount}</p>
<p><strong>Roll Numbers:</strong><br>${classInfo.startRoll} to ${classInfo.endRoll}</p>
</div>
<div class="at_class_card_footer">
<button class="at_report_button" data-index="${index}">Generate Report</button>
<div>Created: ${new Date(classInfo.timestamp).toLocaleString()}</div>
</div>
`;

  const reportBtn = card.querySelector('.at_report_button');
  reportBtn.addEventListener('click', (e) => {
   e.stopPropagation();
   generateAttendanceReport(classInfo); // Use classInfo directly instead of index
  });

  // Add click handler to show roll numbers
  card.addEventListener('click', async (e) => {  // Marked as async here
   // Don't trigger if delete button was clicked
   if (!e.target.classList.contains('at_class_card_delete') &&
    !e.target.classList.contains('at_report_button')) {
    playClickSound();
    await showRollNumberModal(classInfo);
   }
  });

  container.appendChild(card);
 });

 // Add event listeners to delete buttons
 document.querySelectorAll('.at_class_card_delete').forEach(btn => {
  btn.addEventListener('click', (e) => {
   e.stopPropagation();
   deleteClassCard(btn.dataset.index);
  });
 });
}

async function saveClassInfo() {
 const classInput = document.getElementById("at_select_class");
 const divisionInput = document.getElementById("at_select_division");
 const studentCountInput = document.getElementById("at_student_count");
 const startRollInput = document.getElementById("at_start_roll");
 const endRollInput = document.getElementById("at_end_roll");
 const subjectInput = document.getElementById("at_select_subject");

 // Validate inputs
 if (!classInput.value || !classInput.dataset.id) {
  showToast("Please select a class");
  return;
 }

 if (!subjectInput.value || !subjectInput.dataset.id) {
  showToast("Please select a subject");
  return;
 }

 const studentCount = parseInt(studentCountInput.value);
 if (!studentCount || studentCount < 1) {
  showToast("Please enter a valid number of students");
  return;
 }

 if (!startRollInput.value) {
  showToast("Please enter a starting roll number");
  return;
 }

 // Create class info object
 const classInfo = {
  classId: classInput.dataset.id,
  className: classInput.value,
  division: divisionInput.value.toLowerCase(),
  studentCount: studentCount,
  startRoll: startRollInput.value,
  endRoll: endRollInput.value,
  subjectId: subjectInput.dataset.id,
  subjectName: subjectInput.value,
  timestamp: new Date().toISOString()
 };

 // Create class info object
 const o1 = {
  f: classInput.dataset.id,
  g: divisionInput.value.toLowerCase(),
  h: subjectInput.dataset.id,
  cn: studentCount,
  st: startRollInput.value,
  yr: curYr
 };

 payload0.vw = 1;
 payload0.fn = 43;
 payload0.o1 = o1;

 try {
  const response = await fnj3("https://my1.in/2/a.php", payload0, 1, true, "loader", 20000, 0, 1, 1);

  if (response) {
   if (response.su === 1 && response.fn43) {

    for (let i = 0; i < response.fn43.length; i++) {
     response.fn43[i].f = o1.f;
     response.fn43[i].g = o1.g;
     response.fn43[i].h = o1.h;
    }

    // Usage with your existing variables:
    const t635mp = await dbDexieManager.insertToDexie(dbnm, "at~" + curYr, response.fn43, false, "a");
    if (t635mp) {
     showToast("roll numbers added successfully");

     // Get existing saved classes or initialize empty array
     const savedClasses = JSON.parse(localStorage.getItem('classInfo')) || [];

// Check if this class+division+sub+rollStrt+rollEnd combination already exists
const existingIndex = savedClasses.findIndex(c => 
 c.classId.toString() === classInfo.classId.toString() && 
 c.division.toString() === classInfo.division.toString() &&
 c.subjectId.toString() === classInfo.subjectId.toString() &&
 c.startRoll.toString() === classInfo.startRoll.toString() &&
 c.endRoll.toString() === classInfo.endRoll.toString()
);

     if (existingIndex >= 0) {
      // Update existing entry
      savedClasses[existingIndex] = classInfo;
     } else {
      // Add new entry
      savedClasses.push(classInfo);
     }

     // Save back to localStorage
     localStorage.setItem('classInfo', JSON.stringify(savedClasses));

     document.getElementById(i_d_class_modal).style.display = "none";
     await displayClassCards();
    } else {
     showToast("error --- adding roll numbers");
     console.error('Failed to add records:', result.error);
    }

   } else {
    showOKmodal(response.ms);
   }
  }
 } catch (error) {
  if (error.message.includes("timed out")) {
   alert("err: timed out - " + error.message);
  } else {
   alert("err: " + error.message);
  }
 }
}

async function deleteClassCard(index) {
 const savedClasses = JSON.parse(localStorage.getItem('classInfo')) || [];

 if (index >= 0 && index < savedClasses.length) {
  showCustomAlert(`Are you sure you want to delete ${savedClasses[index].className} - ${savedClasses[index].division}?`, true)
   .then(confirmed => {
    if (confirmed) {
     savedClasses.splice(index, 1);
     localStorage.setItem('classInfo', JSON.stringify(savedClasses));
     //await displayClassCards();
     location.reload();
     showToast('Class information deleted successfully');
    }
   });
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
  appData.tkLst = appData.tkLst.filter(token => token !== oldToken);
 }
 // Check if new token already exists
 if (appData.tkLst.includes(newToken)) {
  console.log("New token already exists in the list");
  return;
 }
 // Check if we've reached the token limit
 let tokenLimit = 1;
 if (sho_da_tkLimit !== undefined)
  tokenLimit = sho_da_tkLimit;
 if (appData.tkLst.length >= sho_da_tkLimit) {
  // Remove the oldest token (first in array)
  appData.tkLst.shift();
 }
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
 document.querySelectorAll(".at_modal_close").forEach(btn => {
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
 document.getElementById("at_custom_alert_confirm")?.addEventListener("click", () => {
  playClickSound();
  e_lements.customAlert.style.display = "none";
 });

 document.getElementById("at_custom_alert_cancel")?.addEventListener("click", () => {
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
 appData.slideTime = parseInt(document.getElementById("at_slide_time").value) || 3;
 appData.offerLine = document.getElementById("at_offer_line").value;
 appData.retToday = document.getElementById("at_ret_today").value;
 appData.shoInDemand = document.getElementById("at_in_demand_toggle").checked ? 1 : 0;

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
 audio.play().catch(e => console.error("Error playing click sound:", e));
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

async function generateAttendanceReport(classInfo) {
 playClickSound();

 // Retrieve switch states from localStorage
 const showDetailedColumns = localStorage.getItem('attendanceReport_showDetailedColumns') === 'true';
 const showPercentageSign = localStorage.getItem('attendanceReport_showPercentageSign') !== 'false'; // Default to true

 // Create a modal for date selection
 const modal = document.createElement('div');
 modal.className = 'at_modal';
 modal.id = 'at_report_date_modal';
 modal.style.display = 'flex';

 // Create date selection content
 modal.innerHTML = `
<div class="at_modal_content" style="max-width: 800px; width: 90%; padding: 2%;">
<span class="at_modal_close">&times;</span>
<h3>${classInfo.className} - ${classInfo.division} (${classInfo.subjectName})</h3>
<div class="at_date_selection" style="display: flex; gap: 20px; margin-bottom: 20px;">
<div class="at_date_input" style="flex: 1;">
<label for="at_report_from_date"><i class="fas fa-calendar-alt"></i> From Date:</label>
<input type="date" id="at_report_from_date" class="at_date_picker" style="width: 100%;">
</div>
<div class="at_date_input" style="flex: 1;">
<label for="at_report_to_date"><i class="fas fa-calendar-alt"></i> To Date:</label>
<input type="date" id="at_report_to_date" class="at_date_picker" style="width: 100%;">
</div>
</div>

<div class="at_report_options">
<div class="at_switch_container">
<label class="at_switch">
<input type="checkbox" id="at_detailed_columns" ${showDetailedColumns ? 'checked' : ''}>
<span class="at_slider"></span>
</label>
<span class="at_switch_label"><i class="fas fa-calendar-day"></i> Show daily status columns</span>
</div>

<div class="at_switch_container">
<label class="at_switch">
<input type="checkbox" id="at_show_percentage_sign" ${showPercentageSign ? 'checked' : ''}>
<span class="at_slider"></span>
</label>
<span class="at_switch_label"><i class="fas fa-percent"></i> Show percentage sign</span>
</div>
</div>
<div class="at_report_actions">
settings are saved if generate button is clicked.
</div>
<div class="at_report_actions">
<button id="at_generate_report" class="at_primary_button">
<i class="fas fa-chart-bar"></i> Generate Report
</button>
</div>

<div id="at_report_results_container" style="display: none; margin-top: 20px;">
<div class="at_report_summary"></div>
<div class="at_report_table_container" style="max-height: 44vh; overflow: auto; border: 1px solid #ddd; margin-top: 10px;">
<table class="at_report_table" style="width: 100%; border-collapse: collapse;">
<thead></thead>
<tbody></tbody>
<tfoot></tfoot>
</table>
</div>

<div class="at_report_export_actions" style="position: sticky; bottom: 0; background: white; color:black;border-top: 1px solid #ddd; display: flex; gap: 10px;">
<button id="at_export_pdf" class="at_export_button" title="Export PDF">
<i class="fas fa-file-pdf"></i>
</button>
<button id="at_export_csv" class="at_export_button" title="Export CSV">
<i class="fas fa-file-csv"></i>
</button>
<button id="at_print_report" class="at_export_button" title="Print">
<i class="fas fa-print"></i>
</button>
</div>
</div>
</div>
`;

 // Add to document
 document.body.appendChild(modal);

 // Set default dates (last 30 days)
 const today = new Date();
 const thirtyDaysAgo = new Date();
 thirtyDaysAgo.setDate(today.getDate() - 30);

 modal.querySelector('#at_report_from_date').valueAsDate = thirtyDaysAgo;
 modal.querySelector('#at_report_to_date').valueAsDate = today;

 // Set up event listeners
 modal.querySelector('.at_modal_close').addEventListener('click', () => {
  playClickSound();
  modal.remove();
 });

 modal.querySelector('#at_generate_report').addEventListener('click', async () => {
  playClickSound();
  const fromDate = new Date(modal.querySelector('#at_report_from_date').value);
  const toDate = new Date(modal.querySelector('#at_report_to_date').value);
  const showDetailedColumns = modal.querySelector('#at_detailed_columns').checked;
  const showPercentageSign = modal.querySelector('#at_show_percentage_sign').checked;

  // Save switch states to localStorage
  localStorage.setItem('attendanceReport_showDetailedColumns', showDetailedColumns);
  localStorage.setItem('attendanceReport_showPercentageSign', showPercentageSign);

  if (!fromDate || !toDate) {
   showToast("Please select both dates");
   return;
  }

  if (fromDate > toDate) {
   showToast("From date cannot be after To date");
   return;
  }

  try {
   const db = dbDexieManager.dbCache.get(dbnm);
   if (!db) {
    showToast("Database not initialized");
    return;
   }

   const tableName = `at${curYr}`;
   const table = db.table(tableName);

   if (!table) {
    showToast("Attendance table not found");
    return;
   }

   const startRoll = parseInt(classInfo.startRoll);
   const endRoll = parseInt(classInfo.endRoll);

   // Get all attendance records for this class
   const attendanceRecords = await table
    .where('f').equals(classInfo.classId.toString())
    .and(item => item.g === classInfo.division)
    .and(item => item.h === classInfo.subjectId.toString())
    .and(item => item.i >= startRoll && item.i <= endRoll)
    .toArray();

   if (attendanceRecords.length === 0) {
    showToast("No attendance records found for this class");
    return;
   }

   // Process the data to create a report
   const reportData = processAttendanceData(attendanceRecords, classInfo, fromDate, toDate);

   // Display the report
   displayReportResults(reportData, classInfo, modal, showDetailedColumns, showPercentageSign);

  } catch (error) {
   console.error("Error generating report:", error);
   showToast("Error generating report");
  }
 });

 // Close when clicking outside
 modal.addEventListener('click', (e) => {
  if (e.target === modal) {
   modal.remove();
  }
 });
}
function processAttendanceData(records, classInfo, fromDate, toDate) {
 const report = {
  className: classInfo.className,
  division: classInfo.division,
  subjectName: classInfo.subjectName,
  fromDate: fromDate,
  toDate: toDate,
  students: [],
  summary: {
   totalDays: 0,
   actualDays: 0, // Days excluding Sundays
   presentDays: 0,
   absentDays: 0,
   allDates: [] // Store all dates including Sundays
  }
 };

 // Calculate total days in date range and actual days (excluding Sundays)
 const currentDate = new Date(fromDate);
 const endDate = new Date(toDate);

 while (currentDate <= endDate) {
  report.summary.allDates.push(new Date(currentDate));
  report.summary.totalDays++;

  // Check if it's not Sunday (day 0)
  if (currentDate.getDay() !== 0) {
   report.summary.actualDays++;
  }

  currentDate.setDate(currentDate.getDate() + 1);
 }

 // Process each student
 records.forEach(record => {
  const student = {
   rollNumber: record.i,
   presentCount: 0,
   absentCount: 0,
   dailyStatus: {} // Store status for each day
  };

  // Check each day in the date range
  report.summary.allDates.forEach(date => {
   const dayOfYear = getDayOfYear(date);

   if (date.getDay() !== 0) {
    // Only process weekdays
    const status = record[`d${dayOfYear}`] || 0;
    student.dailyStatus[dayOfYear] = status;

    if (status === 1) student.presentCount++;
    else if (status === 2) student.absentCount++;
   } else {
    // Mark Sunday with special status
    student.dailyStatus[dayOfYear] = -1; // -1 indicates Sunday
   }
  });

  report.students.push(student);

  // Update summary counts (only for non-Sundays)
  report.summary.presentDays += student.presentCount;
  report.summary.absentDays += student.absentCount;
 });

 return report;
}

function displayReportResults(reportData, classInfo, modal, showDetailedColumns, showPercentageSign) {
 const resultsContainer = modal.querySelector('#at_report_results_container');
 const summaryContainer = modal.querySelector('.at_report_summary');
 const tableHead = modal.querySelector('.at_report_table thead');
 const tableBody = modal.querySelector('.at_report_table tbody');
 const tableFoot = modal.querySelector('.at_report_table tfoot');

 // Show results container
 resultsContainer.style.display = 'block';

 // Update summary
 summaryContainer.innerHTML = `
<p><i class="fas fa-calendar-week"></i> <strong>Date Range:</strong> ${reportData.fromDate.toLocaleDateString()} to ${reportData.toDate.toLocaleDateString()}</p>
<p><i class="fas fa-clock"></i> <strong>Total Days:</strong> ${reportData.summary.totalDays}</p>
<p><i class="fas fa-calendar-check"></i> <strong>Actual Days (excl. Sundays):</strong> ${reportData.summary.actualDays}</p>
`;
 // <p><i class="fas fa-check-circle"></i> <strong>Total Present:</strong> ${reportData.summary.presentDays}</p>
 // <p><i class="fas fa-times-circle"></i> <strong>Total Absent:</strong> ${reportData.summary.absentDays}</p>

 // Clear previous results
 tableHead.innerHTML = '';
 tableBody.innerHTML = '';
 tableFoot.innerHTML = '';

 // Create table header
 const headerRow1 = document.createElement('tr');
 const headerRow2 = document.createElement('tr');

 // Always show basic columns
 headerRow1.innerHTML = `
<th rowspan="2" style="border: 1px solid #eee; padding: 8px; position: sticky; top: 0; background: white;color:black"><i class="fas fa-hashtag"></i>Ro.</th>
`;

 if (showDetailedColumns) {
  // Add date columns for all dates, including Sundays
  reportData.summary.allDates.forEach(date => {
   // Day number cell (top row)
   const dayNumCell = document.createElement('th');
   dayNumCell.style.border = '1px solid #eee';
   dayNumCell.style.padding = '8px';
   dayNumCell.style.position = 'sticky';
   dayNumCell.style.top = '0';
   dayNumCell.style.background = date.getDay() === 0 ? '#f9f9f9' : 'white';
   dayNumCell.style.color = 'black';
   dayNumCell.style.whiteSpace = 'nowrap';
   dayNumCell.textContent = date.getDate(); // Just the day number

   // Weekday initial cell (bottom row)
   const weekdayCell = document.createElement('th');
   weekdayCell.style.border = '1px solid #eee';
   weekdayCell.style.padding = '8px';
   weekdayCell.style.position = 'sticky';
   weekdayCell.style.top = '34px'; // Height of first header row
   weekdayCell.style.background = date.getDay() === 0 ? '#f9f9f9' : 'white';
   weekdayCell.style.color = date.getDay() === 0 ? '#999' : 'black';
   weekdayCell.style.whiteSpace = 'nowrap';

   // Get first letter of weekday
   const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })[0];
   weekdayCell.textContent = weekday;

   headerRow1.appendChild(dayNumCell);
   headerRow2.appendChild(weekdayCell);
  });
 }

 // Add summary columns header
 const presentHeader = document.createElement('th');
 presentHeader.rowSpan = 2;
 presentHeader.textContent = 'P';
 presentHeader.style.border = '1px solid #eee';
 presentHeader.style.padding = '8px';
 presentHeader.style.position = 'sticky';
 presentHeader.style.top = '0';
 presentHeader.style.background = 'white';
 presentHeader.style.color = 'black';
 headerRow1.appendChild(presentHeader);

 const absentHeader = document.createElement('th');
 absentHeader.rowSpan = 2;
 absentHeader.textContent = 'A';
 absentHeader.style.border = '1px solid #eee';
 absentHeader.style.padding = '8px';
 absentHeader.style.position = 'sticky';
 absentHeader.style.top = '0';
 absentHeader.style.background = 'white';
 absentHeader.style.color = 'black';
 headerRow1.appendChild(absentHeader);

 const percentHeader = document.createElement('th');
 percentHeader.rowSpan = 2;
 percentHeader.textContent = '%';
 percentHeader.style.border = '1px solid #eee';
 percentHeader.style.padding = '8px';
 percentHeader.style.position = 'sticky';
 percentHeader.style.top = '0';
 percentHeader.style.background = 'white';
 percentHeader.style.color = 'black';
 headerRow1.appendChild(percentHeader);

 tableHead.appendChild(headerRow1);
 // if (showDetailedColumns) {
 tableHead.appendChild(headerRow2);
 // }

 // Add student rows
 reportData.students.forEach(student => {
  const row = document.createElement('tr');

  // Roll number column
  row.innerHTML = `<td style="border: 1px solid #eee; padding: 8px;">${student.rollNumber}</td>`;

  if (showDetailedColumns) {
   // Add daily status cells for all dates
   reportData.summary.allDates.forEach(date => {
    const dayOfYear = getDayOfYear(date);
    const status = student.dailyStatus ? student.dailyStatus[dayOfYear] || 0 : 0;

    const statusCell = document.createElement('td');
    statusCell.style.border = '1px solid #eee';
    statusCell.style.padding = '8px';
    statusCell.style.textAlign = 'center';
    statusCell.style.background = date.getDay() === 0 ? '#f9f9f9' : '';

    if (date.getDay() === 0) {
     statusCell.innerHTML = ''; // Blank for Sunday
    } else if (status === 1) {
     statusCell.innerHTML = 'P';
    } else if (status === 2) {
     statusCell.innerHTML = 'A';
    } else {
     statusCell.innerHTML = '-';
    }

    row.appendChild(statusCell);
   });
  }

  // Add summary columns for each student
  const presentDays = student.presentCount;
  const absentDays = student.absentCount;
  const totalDays = reportData.summary.actualDays;
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  // Present days cell
  const presentCell = document.createElement('td');
  presentCell.style.border = '1px solid #eee';
  presentCell.style.padding = '8px';
  presentCell.style.textAlign = 'center';
  presentCell.textContent = presentDays;
  row.appendChild(presentCell);

  // Absent days cell
  const absentCell = document.createElement('td');
  absentCell.style.border = '1px solid #eee';
  absentCell.style.padding = '8px';
  absentCell.style.textAlign = 'center';
  absentCell.textContent = absentDays;
  row.appendChild(absentCell);

  // Percentage cell
  const percentCell = document.createElement('td');
  percentCell.style.border = '1px solid #eee';
  percentCell.style.padding = '8px';
  percentCell.style.textAlign = 'center';
  percentCell.textContent = `${percentage}${showPercentageSign ? '%' : ''}`;
  row.appendChild(percentCell);

  tableBody.appendChild(row);
 });

 // Add footer with totals
 /*const footerRow = document.createElement('tr');
 footerRow.style.fontWeight = 'bold';
 footerRow.style.backgroundColor = '#f5f5f5';
 
 if (showDetailedColumns) {
 footerRow.innerHTML = `
 <td style="border: 1px solid #eee; padding: 8px;">Total</td>
 <td colspan="${reportData.summary.allDates.length}" style="border: 1px solid #eee; padding: 8px; text-align: center;">
 ${reportData.summary.allDates.length} days
 </td>
 <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
 ${reportData.summary.presentDays}
 </td>
 <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
 ${reportData.summary.absentDays}
 </td>
 <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
 ${Math.round((reportData.summary.presentDays / reportData.summary.actualDays) * 100)}${showPercentageSign ? '%' : ''}
 </td>
 `;
 } else {
 footerRow.innerHTML = `
 <td style="border: 1px solid #eee; padding: 8px;">Total</td>
 <td style="border: 1px solid #eee; padding: 8px;">${reportData.summary.presentDays}</td>
 <td style="border: 1px solid #eee; padding: 8px;">${reportData.summary.absentDays}</td>
 <td style="border: 1px solid #eee; padding: 8px;">
 ${Math.round((reportData.summary.presentDays / reportData.summary.actualDays) * 100)}${showPercentageSign ? '%' : ''}
 </td>
 `;
 }
 
 tableFoot.appendChild(footerRow);*/

 // Set up export buttons
 modal.querySelector('#at_export_pdf').addEventListener('click', () => {
  playClickSound();
  exportToPDF(reportData, classInfo, showDetailedColumns, showPercentageSign);
 });

 modal.querySelector('#at_export_csv').addEventListener('click', () => {
  playClickSound();
  exportToCSV(reportData, classInfo, showDetailedColumns, showPercentageSign);
 });

 modal.querySelector('#at_print_report').addEventListener('click', () => {
  playClickSound();
  printReport(reportData, classInfo, showDetailedColumns, showPercentageSign);
 });
}

function exportToPDF(reportData, classInfo, showDetailedColumns, showPercentageSign) {

 // Get the table element from the modal
 const table = document.querySelector('#at_report_date_modal .at_report_table');

 // Use html2canvas to capture the table as an image
 html2canvas(table).then(canvas => {
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = canvas.height * imgWidth / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  // Add title and class info
  pdf.setFontSize(16);
  pdf.text(`Attendance Report - ${classInfo.className} ${classInfo.division}`, 105, 15, { align: 'center' });
  pdf.setFontSize(12);
  pdf.text(`Subject: ${classInfo.subjectName} | Date Range: ${reportData.fromDate.toLocaleDateString()} to ${reportData.toDate.toLocaleDateString()}`, 105, 22, { align: 'center' });

  // Add the table image
  pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add new pages if the table is longer than one page
  while (heightLeft >= 0) {
   position = heightLeft - imgHeight;
   pdf.addPage();
   pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
   heightLeft -= pageHeight;
  }

  // Save the PDF
  pdf.save(`Attendance_${classInfo.className}_${classInfo.division}_${new Date().toISOString().slice(0, 10)}.pdf`);
 });
}

function exportToCSV(reportData, classInfo, showDetailedColumns, showPercentageSign) {
 // Get the table element from the modal
 const table = document.querySelector('#at_report_date_modal .at_report_table');
 let csv = [];

 // Get all rows
 const rows = table.querySelectorAll('tr');

 for (let i = 0; i < rows.length; i++) {
  const row = [];
  const cols = rows[i].querySelectorAll('td, th');

  // Special handling for header rows
  if (i === 0) {

   // Process date number cells
   for (let j = 0; j < cols.length; j++) {
    let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '')
     .replace(/(\s\s)/gm, ' ');
    data = data.replace(/"/g, '""');
    if (data.indexOf(',') >= 0 || data.indexOf('"') >= 0) {
     data = `"${data}"`;
    }
    row.push(data);
   }

   // Add empty cells for summary columns (P, A, %)
   row.push('', '', '');
  }
  else if (i === 1) {
   // Second header row - include "Roll No." label
   row.push('Roll No.');

   // Process weekday cells
   for (let j = 0; j < cols.length; j++) {
    let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '')
     .replace(/(\s\s)/gm, ' ');
    data = data.replace(/"/g, '""');
    if (data.indexOf(',') >= 0 || data.indexOf('"') >= 0) {
     data = `"${data}"`;
    }
    row.push(data);
   }

   // Add summary column headers
   row.push('P', 'A', '%');
  }
  else {
   // Regular rows (data rows and footer)
   for (let j = 0; j < cols.length; j++) {
    let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '')
     .replace(/(\s\s)/gm, ' ');
    data = data.replace(/"/g, '""');
    if (data.indexOf(',') >= 0 || data.indexOf('"') >= 0) {
     data = `"${data}"`;
    }
    row.push(data);
   }
  }

  csv.push(row.join(','));
 }

 // Download CSV file
 const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement('a');
 link.setAttribute('href', encodedUri);
 link.setAttribute('download', `Attendance_${classInfo.className}_${classInfo.division}_${new Date().toISOString().slice(0, 10)}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
}

function printReport(reportData, classInfo, showDetailedColumns, showPercentageSign) {
 // Get the modal content
 const modalContent = document.querySelector('#at_report_date_modal .at_modal_content').cloneNode(true);

 // Remove buttons we don't want to print
 modalContent.querySelector('.at_report_actions').remove();
 modalContent.querySelector('.at_modal_close').remove();

 // Create a print window
 const printWindow = window.open('', '_blank');
 printWindow.document.write(`
<html>
<head>
<title>Attendance Report</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; }
h2 { color: #333; }
h3 { color: #555; margin-top: 0; }
.at_report_summary { margin-bottom: 20px; }
i { margin-right: 5px; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; position: sticky; top: 0; }
.at_report_table_container { max-height: none !important; overflow: visible !important; }
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
${modalContent.innerHTML}
<script>
setTimeout(() => {
window.print();
window.close();
}, 500);
</script>
</body>
</html>
`);
 printWindow.document.close();
}

// Initialize when scripts are loaded
if (typeof initApp === 'function') {
 initApp();

}

let id_of_dv_to_set_processed_ata_dom_object;
let swh_ata_create_nw_mdl;
let swh_ata_0nothing_1flex_2block;
let swh_ata_0replace_1append;
let current_ata_roll_data={};

async function open_ata(...args) {
    id_of_dv_to_set_processed_ata_dom_object = args[0];
    //set the created DOM HTML to this div.
    swh_ata_create_nw_mdl = args[1] || 0;
    //if 1 create a new modal and set 'id_of_dv_to_set_processed_ata_dom_object' as modal-content;
    swh_ata_0nothing_1flex_2block = args[2] || 0;
    //if 1 display = flex, if 2 display block, else nothing to do
    //if modal apply these property to modal else apply to 'id_of_dv_to_set_processed_ata_dom_object'
    swh_ata_0replace_1append = args[3] || 0;
    //if 1 append the DOM HTML to 'id_of_dv_to_set_processed_ata_dom_object' else replace content of 'id_of_dv_to_set_processed_ata_dom_object'
    
    fn_ata_generateAttendanceReport();
}
async function fn_ata_generateAttendanceReport() {
 playClickSound();

  payload0.vw = 1;
  payload0.fn = 41;
  payload0.la = await dbDexieManager.getMaxDateRecords(dbnm, [{"tb":`at${curYr}`,"col":'b',"cl":"b"}]);
  const response = await fnj3("https://my1.in/2/a.php", payload0, 1, true, "loader", 20000, 0, 1, 1);
  if(response && response.su == 1){
    if(response["41at25"] && response["41at25"].length>0){
       const t635mp = await dbDexieManager.insertToDexie(dbnm, `at${curYr}`, response["41at25"], false, "a");
       await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }else{
    alert(response.ms);
  }

  const classInfo = {
    classId: 0,
    className: "",
    division: "z",
    studentCount: 0,
    startRoll: 0,
    endRoll: 0,
    subjectId: 0,
    subjectName: "",
    timestamp: new Date().toISOString(),
  };

 // Retrieve switch states from localStorage
 const showDetailedColumns = localStorage.getItem('attendanceReport_showDetailedColumns') === 'true';
 const showPercentageSign = localStorage.getItem('attendanceReport_showPercentageSign') !== 'false'; // Default to true

 // Create a modal for date selection
 const modal = document.createElement('div');
 modal.className = 'at_modal';
 modal.id = 'at_report_date_modal';
 modal.style.display = 'flex';

appData.divs = ["a","b","u"];

 // Create date selection content
 modal.innerHTML = `
        <div class="at_modal_content" style="max-width: 95vw; width: 90%; padding: 2%;">
            <span class="at_modal_close">&times;</span>
            
            <!-- New horizontally scrollable div for selects -->
            <div class="at_controls_container" style="overflow-x: auto; white-space: nowrap; padding-bottom: 10px;">
                <div id="dv_ata_selects" style="display: inline-flex; gap: 20px; align-items: center;">
                    <div class="at_select_container" style="display: inline-block;">
                        <label for="at_select_class"><i class="fas fa-graduation-cap"></i> Class:</label>
                        <select id="at_select_class" class="at_select" style="width: 150px;">
                            <option value="0">Select Class</option>
                            ${appData.clss.map(cls => `<option value="${cls.a}">(${cls.a}) ${cls.n}</option>`).join('')}
                        </select>
                    </div>
                    <div class="at_select_container" style="display: inline-block;">
                        <label for="at_select_division"><i class="fas fa-users"></i> Division:</label>
                        <select id="at_select_division" class="at_select" style="width: 100px;">
                            <option value="">Select Division</option>
                            ${appData.divs.map(div => `<option value="${div}">${div.toUpperCase()}</option>`).join('')}
                        </select>
                    </div>
                    <div class="at_select_container" style="display: inline-block;">
                        <label for="at_select_subject"><i class="fas fa-book"></i> Subject:</label>
                        <select id="at_select_subject" class="at_select" style="width: 200px;" multiple>
                            <option value="0">Select Subject</option>
                            ${appData.subs.map(sub => `<option value="${sub.a}">(${sub.a}) ${sub.n}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Horizontal scrollable container for controls -->
            <div class="at_controls_container" style="overflow-x: auto; white-space: nowrap; padding-bottom: 10px;">
                <div id="dv_ata_ctrls" style="display: inline-flex; gap: 20px; align-items: center;">
                    <div class="at_date_input" style="display: inline-block;">
                        <label for="at_report_from_date"><i class="fas fa-calendar-alt"></i>From Date:</label><br>
                        <input type="date" id="at_report_from_date" class="at_date_picker" style="width: 150px;">
                    </div>
                    <div class="at_date_input" style="display: inline-block;">
                        <label for="at_report_to_date"><i class="fas fa-calendar-alt"></i> To Date:</label><br>
                        <input type="date" id="at_report_to_date" class="at_date_picker" style="width: 150px;">
                    </div>
                    
                    <div class="at_switch_container" style="display: inline-block;">
                        <span class="at_switch_label"><i class="fas fa-calendar-day"></i> Daily columns</span>
                        <label class="at_switch">
                            <input type="checkbox" id="at_detailed_columns" ${showDetailedColumns ? 'checked' : ''}>
                            <span class="at_slider"></span>
                        </label>
                    </div>
                    
                    <div class="at_switch_container" style="display: inline-block;">
                        <span class="at_switch_label"><i class="fas fa-percent"></i> Percentage sign</span>
                        <label class="at_switch">
                            <input type="checkbox" id="at_show_percentage_sign" ${showPercentageSign ? 'checked' : ''}>
                            <span class="at_slider"></span>
                        </label>
                    </div>
                    
                    <div class="at_report_actions" style="display: inline-block;">
                        <button id="at_generate_report" class="at_primary_button">
                            <i class="fas fa-chart-bar"></i> Generate
                        </button>
                    </div>
                </div>
            </div>
            
            <div id="at_report_results_container" style="display: none; margin-top: 20px;">
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

// Add this code after the subject select element is created
const subjectSelect = modal.querySelector('#at_select_subject');
const detailedColumnsSwitch = modal.querySelector('#at_detailed_columns');

// Disable detailed columns when multiple subjects are selected
subjectSelect.addEventListener('change', () => {
    const selectedOptions = Array.from(subjectSelect.selectedOptions);
    if (selectedOptions.length > 1) {
        detailedColumnsSwitch.checked = false;
        detailedColumnsSwitch.disabled = true;
    } else {
        detailedColumnsSwitch.disabled = false;
    }
});

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
    const selectedClass = modal.querySelector('#at_select_class').value;
    const selectedDivision = modal.querySelector('#at_select_division').value;
    
    // Get all selected subjects
    const selectedSubjects = Array.from(modal.querySelector('#at_select_subject').selectedOptions)
        .map(option => option.value);
    
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
    
    if (selectedSubjects.length === 0) {
        showToast("Please select at least one subject");
        return;
    }
    
    try {
        const allAttendanceRecords = await dbDexieManager.getAllRecords(dbnm, `at${curYr}`) || [];
        
        // Filter attendance records based on selections
        const attendanceRecords = allAttendanceRecords.filter(record => 
            record.f == selectedClass && 
            record.g == selectedDivision && 
            selectedSubjects.includes(record.h.toString())
        );
        
        if (attendanceRecords.length === 0) {
            showToast("No attendance records found for this class");
            alert("no records");
            return;
        }
        
        // Process the data to create a report
        const reportData = fn_ata_processAttendanceData(attendanceRecords, classInfo, fromDate, toDate, selectedSubjects);
        
        // Display the report
        fn_ata_displayReportResults(reportData, classInfo, modal, showDetailedColumns, showPercentageSign, selectedSubjects);
        
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
function fn_ata_processAttendanceData(records, classInfo, fromDate, toDate, selectedSubjects) {
    const report = {
        className: classInfo.className,
        division: classInfo.division,
        subjectNames: selectedSubjects.map(subId => {
            const subject = appData.subs.find(sub => sub.a == subId);
            return subject ? subject.n : `Subject ${subId}`;
        }),
        fromDate: fromDate,
        toDate: toDate,
        students: [],
        summary: {
            totalDays: 0,
            actualDays: 0, // Days excluding Sundays
            presentDays: Array(selectedSubjects.length).fill(0),
            absentDays: Array(selectedSubjects.length).fill(0),
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
    
    // Group records by student roll number
    const studentsMap = {};
    
    records.forEach(record => {
        const rollNumber = record.i;
        const subjectIndex = selectedSubjects.indexOf(record.h.toString());
        
        if (!studentsMap[rollNumber]) {
            studentsMap[rollNumber] = {
                rollNumber: rollNumber,
                presentCount: Array(selectedSubjects.length).fill(0),
                absentCount: Array(selectedSubjects.length).fill(0),
                dailyStatus: Array(selectedSubjects.length).fill(null).map(() => ({}))
            };
        }
        
        // Check each day in the date range for this subject
        report.summary.allDates.forEach(date => {
            const dayOfYear = getDayOfYear(date);
            
            if (date.getDay() !== 0) {
                // Only process weekdays
                const status = record[`d${dayOfYear}`] || 0;
                studentsMap[rollNumber].dailyStatus[subjectIndex][dayOfYear] = status;
                
                if (status === 1) {
                    studentsMap[rollNumber].presentCount[subjectIndex]++;
                    report.summary.presentDays[subjectIndex]++;
                } else if (status === 2) {
                    studentsMap[rollNumber].absentCount[subjectIndex]++;
                    report.summary.absentDays[subjectIndex]++;
                }
            } else {
                // Mark Sunday with special status
                studentsMap[rollNumber].dailyStatus[subjectIndex][dayOfYear] = -1; // -1 indicates Sunday
            }
        });
    });
    
    // Convert the map to an array
    report.students = Object.values(studentsMap);
    
    return report;
}
function fn_ata_displayReportResults(reportData, classInfo, modal, showDetailedColumns, showPercentageSign, selectedSubjects) {
    const resultsContainer = modal.querySelector('#at_report_results_container');
    const tableHead = modal.querySelector('.at_report_table thead');
    const tableBody = modal.querySelector('.at_report_table tbody');
    const tableFoot = modal.querySelector('.at_report_table tfoot');
    
    // Show results container
    resultsContainer.style.display = 'block';
    
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
    
    // Add subject columns
    selectedSubjects.forEach((subjectId, index) => {
        const subjectName = reportData.subjectNames[index];
        
        // Present header
        const presentHeader = document.createElement('th');
        presentHeader.colSpan = 2;
        presentHeader.textContent = subjectName;
        presentHeader.style.border = '1px solid #eee';
        presentHeader.style.padding = '8px';
        presentHeader.style.position = 'sticky';
        presentHeader.style.top = '0';
        presentHeader.style.background = 'white';
        presentHeader.style.color = 'black';
        headerRow1.appendChild(presentHeader);
        
        // Individual headers for P and A
        const pHeader = document.createElement('th');
        pHeader.textContent = 'P';
        pHeader.style.border = '1px solid #eee';
        pHeader.style.padding = '8px';
        pHeader.style.position = 'sticky';
        pHeader.style.top = '34px';
        pHeader.style.background = 'white';
        pHeader.style.color = 'black';
        headerRow2.appendChild(pHeader);
        
        const aHeader = document.createElement('th');
        aHeader.textContent = 'A';
        aHeader.style.border = '1px solid #eee';
        aHeader.style.padding = '8px';
        aHeader.style.position = 'sticky';
        aHeader.style.top = '34px';
        aHeader.style.background = 'white';
        aHeader.style.color = 'black';
        headerRow2.appendChild(aHeader);
    });
    
    // Add total columns
    const totalHeader = document.createElement('th');
    totalHeader.colSpan = 3;
    totalHeader.textContent = 'Total';
    totalHeader.style.border = '1px solid #eee';
    totalHeader.style.padding = '8px';
    totalHeader.style.position = 'sticky';
    totalHeader.style.top = '0';
    totalHeader.style.background = 'white';
    totalHeader.style.color = 'black';
    headerRow1.appendChild(totalHeader);
    
    // Individual headers for Total P, Total A, and %
    const totalPHeader = document.createElement('th');
    totalPHeader.textContent = 'P';
    totalPHeader.style.border = '1px solid #eee';
    totalPHeader.style.padding = '8px';
    totalPHeader.style.position = 'sticky';
    totalPHeader.style.top = '34px';
    totalPHeader.style.background = 'white';
    totalPHeader.style.color = 'black';
    headerRow2.appendChild(totalPHeader);
    
    const totalAHeader = document.createElement('th');
    totalAHeader.textContent = 'A';
    totalAHeader.style.border = '1px solid #eee';
    totalAHeader.style.padding = '8px';
    totalAHeader.style.position = 'sticky';
    totalAHeader.style.top = '34px';
    totalAHeader.style.background = 'white';
    totalAHeader.style.color = 'black';
    headerRow2.appendChild(totalAHeader);
    
    const percentHeader = document.createElement('th');
    percentHeader.textContent = '%';
    percentHeader.style.border = '1px solid #eee';
    percentHeader.style.padding = '8px';
    percentHeader.style.position = 'sticky';
    percentHeader.style.top = '34px';
    percentHeader.style.background = 'white';
    percentHeader.style.color = 'black';
    headerRow2.appendChild(percentHeader);
    
    tableHead.appendChild(headerRow1);
    tableHead.appendChild(headerRow2);
    
    // Add student rows
    reportData.students.forEach(student => {
        const row = document.createElement('tr');
        
        // Roll number column
        row.innerHTML = `<td style="border: 1px solid #eee; padding: 8px;">${student.rollNumber}</td>`;
        
        if (showDetailedColumns) {
            // Add daily status cells for all dates
            reportData.summary.allDates.forEach(date => {
                const dayOfYear = getDayOfYear(date);
                
                // For multiple subjects, we need to show status for each subject
                selectedSubjects.forEach((subjectId, subjectIndex) => {
                    const status = student.dailyStatus[subjectIndex] ? student.dailyStatus[subjectIndex][dayOfYear] || 0 : 0;
                    
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
            });
        }
        
        // Add subject columns for each student
        let totalPresent = 0;
        let totalAbsent = 0;
        
        selectedSubjects.forEach((subjectId, subjectIndex) => {
            const presentDays = student.presentCount[subjectIndex] || 0;
            const absentDays = student.absentCount[subjectIndex] || 0;
            
            totalPresent += presentDays;
            totalAbsent += absentDays;
            
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
        });
        
        // Add total columns
        const totalDays = reportData.summary.actualDays * selectedSubjects.length;
        const percentage = totalDays > 0 ? Math.round((totalPresent / totalDays) * 100) : 0;
        
        // Total present cell
        const totalPresentCell = document.createElement('td');
        totalPresentCell.style.border = '1px solid #eee';
        totalPresentCell.style.padding = '8px';
        totalPresentCell.style.textAlign = 'center';
        totalPresentCell.textContent = totalPresent;
        row.appendChild(totalPresentCell);
        
        // Total absent cell
        const totalAbsentCell = document.createElement('td');
        totalAbsentCell.style.border = '1px solid #eee';
        totalAbsentCell.style.padding = '8px';
        totalAbsentCell.style.textAlign = 'center';
        totalAbsentCell.textContent = totalAbsent;
        row.appendChild(totalAbsentCell);
        
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
    const footerRow = document.createElement('tr');
    footerRow.style.fontWeight = 'bold';
    footerRow.style.backgroundColor = '#f5f5f5';
    
    // Roll number column
    footerRow.innerHTML = `<td style="border: 1px solid #eee; padding: 8px;">Total</td>`;
    
    if (showDetailedColumns) {
        // Add empty cells for detailed columns
        const colspan = reportData.summary.allDates.length * selectedSubjects.length;
        footerRow.innerHTML += `<td colspan="${colspan}" style="border: 1px solid #eee; padding: 8px; text-align: center;">
            ${reportData.summary.allDates.length} days
        </td>`;
    }
    
    // Add subject totals
    let grandTotalPresent = 0;
    let grandTotalAbsent = 0;
    
    selectedSubjects.forEach((subjectId, subjectIndex) => {
        const subjectPresent = reportData.summary.presentDays[subjectIndex] || 0;
        const subjectAbsent = reportData.summary.absentDays[subjectIndex] || 0;
        
        grandTotalPresent += subjectPresent;
        grandTotalAbsent += subjectAbsent;
        
        footerRow.innerHTML += `
            <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
                ${subjectPresent}
            </td>
            <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
                ${subjectAbsent}
            </td>
        `;
    });
    
    // Add grand totals
    const totalDays = reportData.summary.actualDays * selectedSubjects.length;
    const percentage = totalDays > 0 ? Math.round((grandTotalPresent / totalDays) * 100) : 0;
    
    footerRow.innerHTML += `
        <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
            ${grandTotalPresent}
        </td>
        <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
            ${grandTotalAbsent}
        </td>
        <td style="border: 1px solid #eee; padding: 8px; text-align: center;">
            ${percentage}${showPercentageSign ? '%' : ''}
        </td>
    `;
    
    tableFoot.appendChild(footerRow);
    
    // Set up export buttons
    modal.querySelector('#at_export_pdf').addEventListener('click', () => {
        playClickSound();
        fn_ata_exportToPDF(reportData, classInfo, showDetailedColumns, showPercentageSign, selectedSubjects);
    });
    
    modal.querySelector('#at_export_csv').addEventListener('click', () => {
        playClickSound();
        fn_ata_exportToCSV(reportData, classInfo, showDetailedColumns, showPercentageSign, selectedSubjects);
    });
    
    modal.querySelector('#at_print_report').addEventListener('click', () => {
        playClickSound();
        fn_ata_printReport(reportData, classInfo, showDetailedColumns, showPercentageSign, selectedSubjects);
    });
}
function fn_ata_exportToPDF(reportData, classInfo, showDetailedColumns, showPercentageSign) {

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
function fn_ata_exportToCSV(reportData, classInfo, showDetailedColumns, showPercentageSign) {
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
function fn_ata_printReport(reportData, classInfo, showDetailedColumns, showPercentageSign) {
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

function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${content}
        </div>
    `;
    
    // Close modal functionality
    modal.querySelector('.close').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    return modal;
}
function applyDisplayProperties(element) {
    if (swh_ata_0nothing_1flex_2block === 1) {
        element.style.display = 'flex';
    } else if (swh_ata_0nothing_1flex_2block === 2) {
        element.style.display = 'block';
    }
}
// Add CSS styles
const style = document.createElement('style');
style.textContent = `
    .attendance-container {
        margin: 20px;
        overflow-x: auto;
    }
    
    .date-filters {
        padding: 10px;
        background: #f5f5f5;
        border-radius: 5px;
    }
    
    .date-filters label {
        margin: 0 10px;
    }
    
    .date-filters input {
        margin-right: 20px;
        padding: 5px;
    }
    
    .attendance-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
    }
    
    .attendance-table th,
    .attendance-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
    }
    
    .attendance-table th {
        background-color: #f2f2f2;
        font-weight: bold;
    }
    
    .status-cell {
        width: 40px;
        height: 40px;
    }
    
    .status-present {
        background-color: #4CAF50;
        color: white;
    }
    
    .status-orange {
        background-color: #FF9800;
        color: white;
    }
    
    .status-absent {
        background-color: #e0e0e0;
        color: #666;
    }
    
    .modal {
        display: block;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
    }
    
    .modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 20px;
        color: black;
        border: 1px solid #888;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        position: relative;
    }
    
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        position: absolute;
        right: 20px;
        top: 10px;
    }
    
    .close:hover {
        color: black;
    }
`;
document.head.appendChild(style);
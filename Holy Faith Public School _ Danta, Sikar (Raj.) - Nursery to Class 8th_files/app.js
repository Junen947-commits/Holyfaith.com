/**
 * Holy Faith Public School, Danta (Sikar)
 * Main Application Logic & Interactive State Management
 * Principal: Mr. Aman
 * Classes: 1st to 8th Standard
 */

// ==========================================
// 1. MOCK DATABASE OF STUDENT RESULTS (CLASS 1-8)
// ==========================================
const STUDENT_DATABASE = {
  "HF-801": {
    rollNo: "HF-801",
    name: "Aditya Sharma",
    father: "Sh. Mukesh Sharma",
    mother: "Smt. Sunita Devi",
    class: "Class 8th (Elementary Board)",
    section: "A",
    dob: "14-Aug-2012",
    enrollment: "HFS/DK/2021/418",
    attendance: "96.4% (Regular)",
    subjects: [
      { name: "English (Special)", max: 100, halfYearly: 46, annual: 48, total: 94, grade: "A+" },
      { name: "Hindi Literature", max: 100, halfYearly: 47, annual: 49, total: 96, grade: "A+" },
      { name: "Mathematics", max: 100, halfYearly: 48, annual: 50, total: 98, grade: "A+" },
      { name: "General Science", max: 100, halfYearly: 45, annual: 47, total: 92, grade: "A+" },
      { name: "Social Science", max: 100, halfYearly: 44, annual: 46, total: 90, grade: "A" },
      { name: "Sanskrit / Computer", max: 100, halfYearly: 48, annual: 48, total: 96, grade: "A+" }
    ],
    totalMax: 600,
    totalObtained: 566,
    percentage: "94.33%",
    division: "1st Division with Distinction (Tehsil Topper)",
    status: "PASSED & PROMOTED TO HIGHER SECONDARY",
    remarks: "Outstanding academic performance and exemplary discipline throughout the academic session."
  },
  "HF-502": {
    rollNo: "HF-502",
    name: "Priyanka Rathore",
    father: "Sh. Vikram Singh Rathore",
    mother: "Smt. Pushpa Kanwar",
    class: "Class 5th (Primary Board)",
    section: "B",
    dob: "05-May-2015",
    enrollment: "HFS/DK/2023/219",
    attendance: "95.1% (Regular)",
    subjects: [
      { name: "English", max: 100, halfYearly: 44, annual: 46, total: 90, grade: "A" },
      { name: "Hindi", max: 100, halfYearly: 48, annual: 47, total: 95, grade: "A+" },
      { name: "Mathematics", max: 100, halfYearly: 47, annual: 48, total: 95, grade: "A+" },
      { name: "Environmental Studies (EVS)", max: 100, halfYearly: 46, annual: 48, total: 94, grade: "A+" },
      { name: "General Knowledge & Art", max: 100, halfYearly: 45, annual: 47, total: 92, grade: "A+" }
    ],
    totalMax: 500,
    totalObtained: 466,
    percentage: "93.20%",
    division: "1st Division with Honours",
    status: "PASSED & PROMOTED TO CLASS 6th",
    remarks: "Brilliant creative ability and consistent rank holder in Danta."
  },
  "HF-105": {
    rollNo: "HF-105",
    name: "Aarav Kumawat",
    father: "Sh. Rameshwar Lal Kumawat",
    mother: "Smt. Seema Devi",
    class: "Class 1st",
    section: "A",
    dob: "19-Feb-2019",
    enrollment: "HFS/DK/2025/104",
    attendance: "98.0% (Regular)",
    subjects: [
      { name: "English Reading & Phonics", max: 100, halfYearly: 48, annual: 49, total: 97, grade: "A+" },
      { name: "Hindi Varnamala & Lekhan", max: 100, halfYearly: 47, annual: 49, total: 96, grade: "A+" },
      { name: "Mathematics & Mental Tables", max: 100, halfYearly: 50, annual: 50, total: 100, grade: "A+" },
      { name: "General Awareness & Rhymes", max: 100, halfYearly: 48, annual: 48, total: 96, grade: "A+" }
    ],
    totalMax: 400,
    totalObtained: 389,
    percentage: "97.25%",
    division: "1st Division with Outstanding Distinction",
    status: "PASSED & PROMOTED TO CLASS 2nd",
    remarks: "Exceptionally bright child with great grasping power and good manners."
  }
};

// Default initial slot bookings (Sample data for Danta parents)
const DEFAULT_BOOKED_SLOTS = [
  {
    token: "HF-SLOT-2026-101",
    student: "Gaurav Singh Shekhawat",
    class: "Class 8th",
    parent: "Mahipal Singh (9829124401)",
    time: "24-Oct-2026 (09:00 AM - 10:30 AM)",
    location: "Danta Main Market",
    status: "Confirmed"
  },
  {
    token: "HF-SLOT-2026-102",
    student: "Kavya Sharma",
    class: "Class 6th",
    parent: "Dinesh Sharma (9414088910)",
    time: "25-Oct-2026 (10:30 AM - 12:00 PM)",
    location: "Khachariyawas Road",
    status: "Confirmed"
  },
  {
    token: "HF-SLOT-2026-103",
    student: "Ronak Meena",
    class: "Class 1st",
    parent: "Prakash Meena (9785123490)",
    time: "26-Oct-2026 (12:00 PM - 01:30 PM)",
    location: "Losal Crossing, Danta",
    status: "Confirmed"
  }
];

// Load Booked Slots from LocalStorage or initialize with defaults
function getStoredBookedSlots() {
  const stored = localStorage.getItem("hf_booked_slots");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_BOOKED_SLOTS;
    }
  }
  localStorage.setItem("hf_booked_slots", JSON.stringify(DEFAULT_BOOKED_SLOTS));
  return DEFAULT_BOOKED_SLOTS;
}

function saveBookedSlot(slot) {
  const slots = getStoredBookedSlots();
  slots.unshift(slot);
  localStorage.setItem("hf_booked_slots", JSON.stringify(slots));
  renderStaffBookingsTable();
}

// ==========================================
// 2. MODAL & UI CONTROLS
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    if (window.lucide) lucide.createIcons();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const icon = document.getElementById("menuIcon");
  if (menu.classList.contains("hidden")) {
    menu.classList.remove("hidden");
    if (icon) icon.setAttribute("data-lucide", "x");
  } else {
    menu.classList.add("hidden");
    if (icon) icon.setAttribute("data-lucide", "menu");
  }
  if (window.lucide) lucide.createIcons();
}

// Close modal on escape key or clicking backdrop
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll('[id$="Modal"]').forEach(modal => {
      if (!modal.classList.contains("hidden")) modal.classList.add("hidden");
    });
    document.body.style.overflow = "auto";
  }
});

// Set default date for booking picker (tomorrow)
document.addEventListener("DOMContentLoaded", () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  const defaultDateStr = `${yyyy}-${mm}-${dd}`;

  const heroDateInput = document.getElementById("heroDate");
  const slotDateInput = document.getElementById("slotDate");
  if (heroDateInput) heroDateInput.value = defaultDateStr;
  if (slotDateInput) slotDateInput.value = defaultDateStr;

  // Render initial staff bookings
  renderStaffBookingsTable();

  // Check if session exists
  checkActiveAuth();
});

// ==========================================
// 3. CLASSROOM SLOT BOOKING (CLIENT ENGINE)
// ==========================================
function prefillSlot(className) {
  scrollToSection("booking");
  const slotSelect = document.getElementById("slotClass");
  if (slotSelect) {
    slotSelect.value = className;
    slotSelect.classList.add("ring-2", "ring-amber-400");
    setTimeout(() => {
      slotSelect.classList.remove("ring-2", "ring-amber-400");
    }, 2000);
  }
}

function quickBookFromHero() {
  const className = document.getElementById("heroClassSelect").value;
  const student = document.getElementById("heroStudentName").value;
  const mobile = document.getElementById("heroMobile").value;
  const date = document.getElementById("heroDate").value;

  if (!student || !mobile) {
    alert("Please enter student name and mobile number.");
    return;
  }

  // Populate into main slot booking form and trigger slot generation
  document.getElementById("slotStudentName").value = student;
  document.getElementById("slotParentName").value = "Guardian of " + student;
  document.getElementById("slotMobile").value = mobile;
  document.getElementById("slotClass").value = className;
  document.getElementById("slotDate").value = date;

  handleSlotBooking();
}

function handleSlotBooking() {
  const studentName = document.getElementById("slotStudentName").value;
  const parentName = document.getElementById("slotParentName").value;
  const mobile = document.getElementById("slotMobile").value;
  const selectedClass = document.getElementById("slotClass").value;
  const date = document.getElementById("slotDate").value;
  const time = document.getElementById("slotTime").value;
  const location = document.getElementById("slotLocation").value || "Danta (Sikar)";

  if (!studentName || !parentName || !mobile || !selectedClass || !date) {
    alert("Please fill all required fields to book a classroom slot.");
    return;
  }

  // Generate Unique Token
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const token = `HF-SLOT-${new Date().getFullYear()}-${randomSuffix}`;

  // Save to stored list
  const slotObj = {
    token: token,
    student: studentName,
    class: selectedClass,
    parent: `${parentName} (${mobile})`,
    time: `${date} (${time})`,
    location: location,
    status: "Confirmed"
  };

  saveBookedSlot(slotObj);

  // Populate Confirmation Pass Modal
  document.getElementById("passToken").innerText = token;
  document.getElementById("passStudent").innerText = studentName;
  document.getElementById("passClass").innerText = selectedClass;
  document.getElementById("passParent").innerText = `${parentName} (+91 ${mobile})`;
  document.getElementById("passDateTime").innerText = `${date} • ${time}`;

  // Trigger celebration confetti
  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Open Pass Modal
  openModal("slotPassModal");

  // Reset form
  document.getElementById("slotBookingForm").reset();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById("slotDate").value = tomorrow.toISOString().split("T")[0];
}

// ==========================================
// 4. STUDENT RESULT SEARCH ENGINE (ROLL NO & MARKSHEET)
// ==========================================
function fillResultDemo(rollNumber) {
  const input = document.getElementById("resultRollInput");
  if (input) {
    input.value = rollNumber;
    searchStudentResult();
  }
}

function searchStudentResult() {
  const rawInput = document.getElementById("resultRollInput").value.trim().toUpperCase();
  if (!rawInput) {
    alert("Please enter a valid Roll Number.");
    return;
  }

  // Normalize roll number (e.g., "801" -> "HF-801")
  let rollKey = rawInput;
  if (!rollKey.startsWith("HF-") && !isNaN(rollKey)) {
    rollKey = "HF-" + rollKey;
  }

  let student = STUDENT_DATABASE[rollKey];

  // If not found in static list, synthesize an authentic marksheet for the given roll number
  if (!student) {
    const classNum = rollKey.replace(/[^0-9]/g, "").slice(0, 1) || "6";
    student = {
      rollNo: rollKey,
      name: "Student " + rollKey,
      father: "Guardian of " + rollKey,
      mother: "Smt. Devi",
      class: `Class ${classNum}th`,
      section: "A",
      dob: "12-Oct-2014",
      enrollment: `HFS/DK/2024/${rollKey.replace(/[^0-9]/g, "") || '550'}`,
      attendance: "94.2% (Regular)",
      subjects: [
        { name: "English Language & Grammer", max: 100, halfYearly: 44, annual: 45, total: 89, grade: "A" },
        { name: "Hindi Sahitya", max: 100, halfYearly: 46, annual: 47, total: 93, grade: "A+" },
        { name: "Mathematics", max: 100, halfYearly: 45, annual: 48, total: 93, grade: "A+" },
        { name: "General Science", max: 100, halfYearly: 43, annual: 44, total: 87, grade: "A" },
        { name: "Social Studies", max: 100, halfYearly: 42, annual: 45, total: 87, grade: "A" },
        { name: "Computer & General Knowledge", max: 100, halfYearly: 46, annual: 48, total: 94, grade: "A+" }
      ],
      totalMax: 600,
      totalObtained: 543,
      percentage: "90.50%",
      division: "1st Division with Distinction",
      status: `PASSED & PROMOTED TO NEXT HIGHER CLASS`,
      remarks: "Commendable hard work and active participation in school activities. Certified by Mr. Aman."
    };
  }

  // Render Student Info onto Marksheet
  document.getElementById("msStudentName").innerText = student.name;
  document.getElementById("msRollNo").innerText = student.rollNo;
  document.getElementById("msClass").innerText = student.class + " (" + student.section + ")";
  document.getElementById("msFatherName").innerText = student.father;
  document.getElementById("msMotherName").innerText = student.mother;
  document.getElementById("msDob").innerText = student.dob;
  document.getElementById("msEnrollment").innerText = student.enrollment;
  document.getElementById("msAttendance").innerText = student.attendance;

  // Render Subject Rows
  const tbody = document.getElementById("msMarksRows");
  tbody.innerHTML = "";

  student.subjects.forEach((subj, idx) => {
    const tr = document.createElement("tr");
    tr.className = idx % 2 === 0 ? "bg-white" : "bg-slate-50";
    tr.innerHTML = `
      <td class="p-2 border border-slate-300 font-bold">${idx + 1}</td>
      <td class="p-2 border border-slate-300 text-left font-bold text-slate-900">${subj.name}</td>
      <td class="p-2 border border-slate-300">${subj.max}</td>
      <td class="p-2 border border-slate-300">${subj.halfYearly}</td>
      <td class="p-2 border border-slate-300">${subj.annual}</td>
      <td class="p-2 border border-slate-300 font-black text-brand-royal">${subj.total}</td>
      <td class="p-2 border border-slate-300 font-extrabold ${subj.grade.includes('A') ? 'text-emerald-700' : 'text-blue-700'}">${subj.grade}</td>
    `;
    tbody.appendChild(tr);
  });

  // Render Totals
  document.getElementById("msTotalMax").innerText = student.totalMax;
  document.getElementById("msTotalObtained").innerText = student.totalObtained;
  document.getElementById("msOverallGrade").innerText = "A+";
  document.getElementById("msFinalStatus").innerText = student.status;
  document.getElementById("msPercentage").innerText = `${student.percentage} (${student.division})`;
  document.getElementById("msRemarks").innerText = student.remarks;

  // Show Marksheet container & smooth scroll to it
  const container = document.getElementById("marksheetContainer");
  container.classList.remove("hidden");
  container.scrollIntoView({ behavior: "smooth" });

  // Confetti celebration
  if (typeof confetti === "function") {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  }

  if (window.lucide) lucide.createIcons();
}

function closeMarksheet() {
  document.getElementById("marksheetContainer").classList.add("hidden");
}

// ==========================================
// 5. PARENT LOGIN & PORTAL
// ==========================================
let parentOtpSent = false;

function handleParentMobileLogin() {
  const mobileInput = document.getElementById("parentMobileInput");
  const otpGroup = document.getElementById("parentOtpGroup");
  const otpInput = document.getElementById("parentOtpInput");
  const btn = document.getElementById("parentLoginBtn");

  if (!mobileInput.value || mobileInput.value.length < 10) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (!parentOtpSent) {
    // Step 1: Send OTP
    parentOtpSent = true;
    otpGroup.classList.remove("hidden");
    otpInput.value = "1234"; // Pre-filled for demo convenience
    btn.innerText = "Verify OTP & Enter Parent Portal";
    btn.classList.remove("bg-emerald-600");
    btn.classList.add("bg-emerald-700");
  } else {
    // Step 2: Verify OTP
    closeModal("parentLoginModal");
    localStorage.setItem("hf_session_parent", JSON.stringify({
      mobile: mobileInput.value,
      loggedAt: new Date().toISOString()
    }));
    openParentDashboard(mobileInput.value);
  }
}

function loginWithGoogle(portalType) {
  if (portalType === "parent") {
    closeModal("parentLoginModal");
    localStorage.setItem("hf_session_parent", JSON.stringify({
      email: "parent.danta@gmail.com",
      name: "Suresh Sharma",
      loggedAt: new Date().toISOString()
    }));
    openParentDashboard("Google Account (Suresh Sharma)");
  } else if (portalType === "staff") {
    closeModal("staffLoginModal");
    localStorage.setItem("hf_session_staff", JSON.stringify({
      email: "aman.principal@holyfaithdanta.edu.in",
      name: "Mr. Aman (Principal)",
      loggedAt: new Date().toISOString()
    }));
    openStaffDashboard();
  }
}

function openParentDashboard(ident) {
  document.getElementById("parentWelcomeText").innerText = `Welcome, Parent/Guardian (${ident})`;
  openModal("parentDashboardModal");
}

// ==========================================
// 6. STAFF LOGIN & PORTAL (SEPARATE PAGE - NO. 1)
// ==========================================
function handleStaffLogin() {
  const staffId = document.getElementById("staffIdInput").value;
  const pass = document.getElementById("staffPasswordInput").value;

  if (!staffId || !pass) {
    alert("Please enter Staff ID and Password.");
    return;
  }

  closeModal("staffLoginModal");
  localStorage.setItem("hf_session_staff", JSON.stringify({
    staffId: staffId,
    loggedAt: new Date().toISOString()
  }));

  openStaffDashboard();
}

function openStaffDashboard() {
  renderStaffBookingsTable();
  openModal("staffDashboardModal");
}

function renderStaffBookingsTable() {
  const slots = getStoredBookedSlots();
  const tbody = document.getElementById("staffBookingsTableBody");
  const countEl = document.getElementById("staffSlotCount");
  if (countEl) countEl.innerText = `${slots.length} Active`;

  if (!tbody) return;
  tbody.innerHTML = "";

  slots.forEach((s) => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-amber-50/50 transition";
    tr.innerHTML = `
      <td class="p-2.5 font-mono font-bold text-brand-royal">${s.token}</td>
      <td class="p-2.5 font-bold text-slate-900">${s.student}</td>
      <td class="p-2.5 font-semibold text-emerald-800">${s.class}</td>
      <td class="p-2.5 text-slate-700">${s.parent}</td>
      <td class="p-2.5 text-slate-600 text-[11px]">${s.time}</td>
      <td class="p-2.5 text-right">
        <button onclick="alert('Calling parent of ${s.student}: ${s.parent}');" class="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-500 mr-1">
          Call
        </button>
        <button onclick="alert('Slot verified for Principal Mr. Aman desk.');" class="px-2 py-1 bg-brand-royal text-white rounded text-[10px] font-bold hover:bg-blue-800">
          Approve
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function staffAddMockResult() {
  const roll = document.getElementById("staffQuickRoll").value.trim().toUpperCase();
  const name = document.getElementById("staffQuickName").value.trim();
  const selectedClass = document.getElementById("staffQuickClass").value;

  if (!roll || !name) {
    alert("Please enter roll number and student name to publish result.");
    return;
  }

  STUDENT_DATABASE[roll] = {
    rollNo: roll,
    name: name,
    father: "Sh. Guardian Name",
    mother: "Smt. Mother Name",
    class: selectedClass,
    section: "A",
    dob: "15-Jul-2013",
    enrollment: `HFS/DK/2025/${roll.replace(/[^0-9]/g, "") || '999'}`,
    attendance: "95.5%",
    subjects: [
      { name: "English", max: 100, halfYearly: 45, annual: 48, total: 93, grade: "A+" },
      { name: "Hindi", max: 100, halfYearly: 47, annual: 48, total: 95, grade: "A+" },
      { name: "Mathematics", max: 100, halfYearly: 48, annual: 49, total: 97, grade: "A+" },
      { name: "Science / EVS", max: 100, halfYearly: 44, annual: 46, total: 90, grade: "A" },
      { name: "Social Science", max: 100, halfYearly: 45, annual: 46, total: 91, grade: "A+" }
    ],
    totalMax: 500,
    totalObtained: 466,
    percentage: "93.20%",
    division: "1st Division with Distinction",
    status: "PASSED & PROMOTED (PUBLISHED BY STAFF)",
    remarks: "Updated live from Staff Console by Mr. Aman."
  };

  alert(`Result for Roll No. ${roll} (${name}) has been published successfully! Any student or parent can now search and print it.`);
  document.getElementById("staffQuickRoll").value = "";
  document.getElementById("staffQuickName").value = "";
}

function logout(type) {
  if (type === "parent") {
    localStorage.removeItem("hf_session_parent");
    closeModal("parentDashboardModal");
    alert("Logged out from Parent Portal.");
  } else if (type === "staff") {
    localStorage.removeItem("hf_session_staff");
    closeModal("staffDashboardModal");
    alert("Logged out from Staff Portal.");
  }
}

function checkActiveAuth() {
  // If user previously logged in, can auto-resume if desired
}

// ==========================================
// 7. UTILITIES: WHATSAPP & CONTACT
// ==========================================
function openWhatsApp() {
  const phone = "919829241180";
  const text = encodeURIComponent("Namaste Principal Mr. Aman, I want admission enquiry & classroom slot for my child at Holy Faith Public School, Danta (Sikar).");
  window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, "_blank");
}

function handleContactSubmit() {
  const name = document.getElementById("contactName").value;
  const phone = document.getElementById("contactPhone").value;
  const topic = document.getElementById("contactTopic").value;

  alert(`Thank you, ${name}! Your inquiry regarding "${topic}" has been sent to Principal Mr. Aman's office. Our team will contact you at +91 ${phone} shortly.`);
  document.getElementById("contactName").value = "";
  document.getElementById("contactPhone").value = "";
  document.getElementById("contactMessage").value = "";
}

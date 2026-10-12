const form = document.getElementById("regForm");
const successBox = document.getElementById("successMessage");


const fieldIds = ["studentId", "fullName", "email", "phone", "dob",
                  "program", "yearLevel", "password", "confirmPassword", "address"];



function showError(id, message) {
  const input = document.getElementById(id);
  const msg = document.getElementById(id + "Error");
  msg.textContent = message;
  if (input) {
    input.classList.add("error");        
    input.classList.remove("valid");
  }
}


function clearError(id) {
  const input = document.getElementById(id);
  const msg = document.getElementById(id + "Error");
  msg.textContent = "";
  if (input) {
    input.classList.remove("error");   
  }
}

function markValid(id) {
  clearError(id);
  const input = document.getElementById(id);
  if (input) input.classList.add("valid");
}


function validateStudentId() {
  const el = document.getElementById("studentId");
  const value = el.value.trim();
  el.value = value;

  if (value === "") { showError("studentId", "Student ID is required."); return false; }
  if (!/^\d{4}-\d{5}$/.test(value)) {
    showError("studentId", "Student ID must follow the format " + el.dataset.patternHint + " (e.g. 2024-00123).");
    return false;
  }
  markValid("studentId"); return true;
}

function validateFullName() {
  const el = document.getElementById("fullName");
  const value = el.value.trim().replace(/\s+/g, " ");
  el.value = value;
  if (value === "") { showError("fullName", el.dataset.label + " is required."); return false; }
  if (!/^[A-Za-z][A-Za-z .'-]+$/.test(value) || value.length < 3) {
    showError("fullName", "Enter a valid full name (letters only, at least 3 characters).");
    return false;
  }
  markValid("fullName"); return true;
}

function validateEmail() {
  const el = document.getElementById("email");
  const value = el.value.trim();
  el.value = value;
  if (value === "") { showError("email", "Email is required."); return false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    showError("email", "Enter a valid email address like name@example.com.");
    return false;
  }
  markValid("email"); return true;
}

function validatePhone() {
  const el = document.getElementById("phone");
  const value = el.value.trim();
  el.value = value;
  if (value === "") { showError("phone", "Phone number is required."); return false; }
  if (!/^09\d{9}$/.test(value)) {
    showError("phone", "Phone must start with 09 and have 11 digits total.");
    return false;
  }
  markValid("phone"); return true;
}

function validateDob() {
  const el = document.getElementById("dob");
  const value = el.value;
  if (value === "") { showError("dob", "Date of birth is required."); return false; }
  const dob = new Date(value);
  const today = new Date();
  if (dob > today) { showError("dob", "Date of birth cannot be in the future."); return false; }
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 15) { showError("dob", "You must be at least 15 years old to register."); return false; }
  markValid("dob"); return true;
}

function validateGender() {
  const selected = form.querySelector('input[name="gender"]:checked');
  const group = document.getElementById("genderGroup");
  const msg = document.getElementById("genderError");
  if (!selected) {
    msg.textContent = "Please select a gender.";
    group.classList.add("group-error");
    return false;
  }
  msg.textContent = "";
  group.classList.remove("group-error");
  return true;
}

function validateSelect(id, label) {
  const el = document.getElementById(id);
  if (el.value === "") { showError(id, "Please select a " + label + "."); return false; }
  markValid(id); return true;
}

function validatePassword() {
  const el = document.getElementById("password");
  const value = el.value;                 
  if (value.trim() === "") { showError("password", "Password is required."); return false; }
  if (value.length < 8) { showError("password", "Password must be at least 8 characters."); return false; }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    showError("password", "Password must contain at least one letter and one number.");
    return false;
  }
  markValid("password"); return true;
}

function validateConfirm() {
  const pw = document.getElementById("password").value;
  const cf = document.getElementById("confirmPassword").value;
  if (cf === "") { showError("confirmPassword", "Please confirm your password."); return false; }
  if (pw !== cf) { showError("confirmPassword", "Passwords do not match."); return false; }
  markValid("confirmPassword"); return true;
}

function validateAddress() {
  const el = document.getElementById("address");
  const value = el.value.trim();
  el.value = value;
  if (value === "") { showError("address", "Address is required."); return false; }
  if (value.length < 10) { showError("address", "Please enter a more complete address (at least 10 characters)."); return false; }
  markValid("address"); return true;
}

function validateAgreement() {
  const box = document.getElementById("agreement");
  const msg = document.getElementById("agreementError");
  if (!box.checked) {
    msg.textContent = "You must agree before registering.";
    return false;
  }
  msg.textContent = "";
  return true;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();               
  successBox.classList.add("hidden");

  
  const results = [
    validateStudentId(),
    validateFullName(),
    validateEmail(),
    validatePhone(),
    validateDob(),
    validateGender(),
    validateSelect("program", "program"),
    validateSelect("yearLevel", "year level"),
    validatePassword(),
    validateConfirm(),
    validateAddress(),
    validateAgreement()
  ];

  const allValid = results.every(Boolean);

  if (allValid) {
    const name = document.getElementById("fullName").value;
    successBox.textContent = "Registration successful! Welcome, " + name + ".";
    successBox.classList.remove("hidden");
    // Valid: clear error text and error styling
    fieldIds.forEach(clearError);
    document.getElementById("genderGroup").classList.remove("group-error");
  } else {
    // Move focus to the first invalid field
    const firstBad = form.querySelector(".error");
    if (firstBad) firstBad.focus();
  }
});


const liveValidators = {
  studentId: validateStudentId,
  fullName: validateFullName,
  email: validateEmail,
  phone: validatePhone,
  dob: validateDob,
  password: validatePassword,
  confirmPassword: validateConfirm,
  address: validateAddress
};

Object.keys(liveValidators).forEach(function (id) {
  const el = document.getElementById(id);

  el.addEventListener("input", function (event) {
    if (event.target.classList.contains("error")) liveValidators[id]();

    if (id === "password" && document.getElementById("confirmPassword").classList.contains("error")) validateConfirm();
  });
});

["program", "yearLevel"].forEach(function (id) {
  document.getElementById(id).addEventListener("change", function () {
    validateSelect(id, id === "program" ? "program" : "year level");
  });
});

form.querySelectorAll('input[name="gender"]').forEach(function (r) {
  r.addEventListener("change", validateGender);
});
document.getElementById("agreement").addEventListener("change", validateAgreement);


document.querySelectorAll(".ghost").forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    const target = document.getElementById(event.currentTarget.dataset.target);
    const isHidden = target.getAttribute("type") === "password";
    target.setAttribute("type", isHidden ? "text" : "password");
    event.currentTarget.classList.toggle("active");
    event.currentTarget.textContent = isHidden ? "Hide" : "Show";
  });
});

form.addEventListener("reset", function () {
  fieldIds.forEach(function (id) {
    clearError(id);
    document.getElementById(id).classList.remove("valid");
  });
  document.getElementById("genderError").textContent = "";
  document.getElementById("genderGroup").classList.remove("group-error");
  document.getElementById("agreementError").textContent = "";
  successBox.textContent = "";
  successBox.classList.add("hidden");


  document.querySelectorAll(".ghost").forEach(function (btn) {
    document.getElementById(btn.dataset.target).setAttribute("type", "password");
    btn.classList.remove("active");
    btn.textContent = "Show";
  });
});
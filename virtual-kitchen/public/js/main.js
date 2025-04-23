window.onload = function () {
    console.log("Form verification script loaded!");

    let form = document.getElementById("contactForm");
    if (form) {
        form.onsubmit = function (event) {
            event.preventDefault();
            validateForm();
        };
    }
};

function toggleContactFields() {
    let contactMethod = document.getElementById("contactMethod").value;
    let emailSection = document.getElementById("emailSection");
    let phoneSection = document.getElementById("phoneSection");

    if (contactMethod === "email") {
        emailSection.style.display = "block";
        phoneSection.style.display = "none";
    } else if (contactMethod === "phone") {
        emailSection.style.display = "none";
        phoneSection.style.display = "block";
    } else {
        emailSection.style.display = "none";
        phoneSection.style.display = "none";
    }
}
// Function to verify the form before submission and reset it after submission
function validateForm() {
    let email = document.getElementById("email").value;
    let confirmEmail = document.getElementById("confirmEmail").value;
    let phone = document.getElementById("phone").value;
    let confirmPhone = document.getElementById("confirmPhone").value;
    let contactMethod = document.getElementById("contactMethod").value;
    let appointmentDate = document.getElementById("appointmentDate").value;
    let today = new Date().toISOString().split("T")[0];

    if (contactMethod === "email") {
        if (!checkEmails(email)) return false;
        if (email !== confirmEmail) {
            alert("Email addresses do not match. Please try again.");
            return false;
        }
    }

    if (contactMethod === "phone") {
        if (!checkPhone(phone)) return false;
        if (phone !== confirmPhone) {
            alert("Phone numbers do not match. Please try again.");
            return false;
        }
    }

    if (!checkDate(appointmentDate, today)) return false;

    alert("Your message has been sent successfully!");
    document.getElementById("contactForm").reset();
    toggleContactFields();
    return true;
}

// Function to verify emails are aston emails
function checkEmails(email) {
    if (!email.endsWith("@aston.ac.uk")) {
        alert("Please enter a valid Aston University email address.");
        return false;
    }
    return true;
}

// Function to verify phone numbers are numbers only
function checkPhone(phone) {
    let phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phone)) {
        alert("Please enter a valid phone number.");
        return false;
    }
    return true;
}

function checkDate(date, today) {
    if (date < today) {
        alert("Please select a future appointment date.");
        return false;
    }
    return true;
}


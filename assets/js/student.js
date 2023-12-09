const editButtons = document.querySelectorAll(".edit-student-button");
const saveButtons = document.querySelectorAll(".save-student-button");
const onEditFields = document.querySelectorAll(".onEditFields");
const onSaveFields = document.querySelectorAll(".onSaveFields");


// Function to toggle between Edit and Save buttons within the same form
try {

    function toggleFields(button, onFields, offFields) {
        button.addEventListener("click", function () {
            const form = button.closest('form');

            onFields.forEach(field => {
                if (field.closest('form') === form) {
                    field.style.display = "none";
                }
            });

            offFields.forEach(field => {
                if (field.closest('form') === form) {
                    field.style.display = "inline-block";
                }
            });
        });
    }

    // Attach click event to edit buttons
    editButtons.forEach(button => {
        toggleFields(button, onEditFields, onSaveFields);
    });

    // Attach click event to save buttons
    saveButtons.forEach(button => {
        toggleFields(button, onSaveFields, onEditFields);
    });
} catch (error) {
    console.log(error);
}

// Function to Collapse Not-focused accordions
try {
    function handleAccordion(buttonClass) {
        const buttons = document.querySelectorAll(`.${buttonClass}`);

        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const grandparentAccordion = button.closest('.accordion');

                // Hide all other accordions within the same grandparent div
                const otherButtons = grandparentAccordion.querySelectorAll(`.${buttonClass}`);
                otherButtons.forEach(otherButton => {
                    if (otherButton !== button) {
                        const targetId = otherButton.getAttribute("data-bs-target");
                        const targetAccordion = document.querySelector(targetId);
                        if (targetAccordion && (targetAccordion.classList.contains("collapsing") || targetAccordion.classList.contains("show"))) {
                            const bsCollapseInstance = new bootstrap.Collapse(targetAccordion);
                            bsCollapseInstance.hide();
                        }
                    }
                });
            });
        });
    }

    // Use the function for both student and interview buttons
    handleAccordion("student-button");
    handleAccordion("interview-button");
} catch (error) {
    console.log(error);
}

// function to edit student and update dynamically
try {
    const forms = document.querySelectorAll(".student-form");

    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // Fetch the data-id attribute from the submit button
            const studentId = form.querySelector('.save-student-button').getAttribute('data-id');

            const formData = new FormData(form);
            formData.append('id', studentId);

            fetch("/updateStudent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const updatedStudent = data;
                    console.log('updatedStudent: ', data);

                    // Get the student form by ID
                    const studentForm = document.querySelector(`#student-${updatedStudent.data._id}`);

                    if (studentForm) {
                        const inputFields = studentForm.querySelectorAll('.onSaveFields');

                        // Loop through input-fields/spans and update values
                        inputFields.forEach((inputField, index) => {
                            const adjacentSpan = inputField.previousElementSibling;
                            if (adjacentSpan && adjacentSpan.classList.contains('onEditFields') && adjacentSpan.tagName !== 'BUTTON') {
                                adjacentSpan.textContent = inputField.value;
                            }
                        });
                    }
                })
                .catch(error => {
                    console.log("Error:", error);
                });
        });
    });
} catch (error) {
    console.log('Error: ', error);
}

// student delete
try {

} catch (error) {

}

// interview delete
try {

} catch (error) {

}

// add student to interview
try {

} catch (error) {

}
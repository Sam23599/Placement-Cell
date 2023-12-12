/* STUDENT SECTION */


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


// Toggle between Edit and Save buttons within the same form
try {
    const editButtons = document.querySelectorAll(".edit-student-button");
    const saveButtons = document.querySelectorAll(".save-student-button");
    const onEditFields = document.querySelectorAll(".onEditFields");
    const onSaveFields = document.querySelectorAll(".onSaveFields");

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

                    // Get and update name-headline of Student
                    const studentHead = document.querySelector(`#student-heading-${updatedStudent.data._id}`);
                    studentHead.firstElementChild.innerHTML = `${updatedStudent.data.name} ${updatedStudent.data.gender === 'male' ? '👦' : '👧'}`

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





/* INTERVIEW SECTION */

// delete company's interview from db 
try {
    function handleDeleteInterviewButton(buttonClass) {
        const deleteButtons = document.querySelectorAll(`.${buttonClass}`);

        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const ancestor = button.closest('.interview-accordion-item');
                const companyId = button.getAttribute('data-id');

                fetch('/deleteInterview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ companyId }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Remove the ancestor and its children from the DOM
                        if (ancestor) {
                            ancestor.remove();
                        }
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });
            });
        });
    }

    // Use the function for the delete-interview buttons
    handleDeleteInterviewButton("delete-interview-button");
} catch (error) {
    console.log(error);
}


// toggle between different students in interview list
try {
    const fixedButtons = document.querySelectorAll('.fixed');

    fixedButtons.forEach(fixedButton => {
        fixedButton.addEventListener('click', function () {

            // Toggle hide class for the clicked button's siblings
            const parentElement = fixedButton.parentElement;
            const editButton = parentElement.querySelector('.edit-student-interview');
            const deleteButton = parentElement.querySelector('.delete-student-interview');
            const updateButton = parentElement.querySelector('.update-student-interview');
            const span = fixedButton.lastElementChild.querySelector('span');
            const select = fixedButton.lastElementChild.querySelector('select');

            editButton.classList.toggle('hide');
            deleteButton.classList.toggle('hide');
            span.style.display = 'inline-block';
            select.style.display = 'none';

            if (deleteButton.classList.contains('hide')) {
                updateButton.classList.add('hide');
                editButton.classList.add('hide');
            }

            // Iterate through all fixed buttons to reverse toggle hide for their siblings
            fixedButtons.forEach(otherFixedButton => {
                if (otherFixedButton !== fixedButton) {
                    const otherParentElement = otherFixedButton.parentElement;
                    const otherEditButton = otherParentElement.querySelector('.edit-student-interview');
                    const otherDeleteButton = otherParentElement.querySelector('.delete-student-interview');
                    const otherUpdateButton = otherParentElement.querySelector('.update-student-interview');
                    const otherSpan = otherFixedButton.lastElementChild.querySelector('span');
                    const otherSelect = otherFixedButton.lastElementChild.querySelector('select');

                    otherEditButton.classList.add('hide');
                    otherDeleteButton.classList.add('hide');
                    otherUpdateButton.classList.add('hide');
                    otherSpan.style.display = 'inline-block';
                    otherSelect.style.display = 'none';
                }
            });
        });
    });
} catch (error) {
    console.log(error);
}


// toggle between Edit and Update button for student in interview list
try {
    const editButtons = document.querySelectorAll(".edit-student-interview");
    const updateButtons = document.querySelectorAll('.update-student-interview');

    function toggleButton(button, toHide, toShow) {
        var siblingButton = button.nextElementSibling;
        button.classList.toggle('hide');
        if (siblingButton.classList.contains('delete-student-interview')) {
            siblingButton = button.previousElementSibling;
        }
        siblingButton.classList.toggle('hide');
        toHide.style.display = 'none';
        toShow.style.display = 'inline-block';
    }

    // Attach click event to edit buttons
    editButtons.forEach(button => {
        const fixedDiv = button.parentElement.querySelector('.fixed');
        const resultP = fixedDiv.lastElementChild;
        const resultSpan = resultP.querySelector('span');
        const resultSelect = resultP.querySelector('select');

        button.addEventListener("click", function () {
            toggleButton(button, resultSpan, resultSelect);
        });
    });

    updateButtons.forEach(button => {
        const fixedDiv = button.parentElement.querySelector('.fixed');
        const resultP = fixedDiv.lastElementChild;
        const resultSpan = resultP.querySelector('span');
        const resultSelect = resultP.querySelector('select');

        button.addEventListener("click", function () {
            toggleButton(button, resultSelect, resultSpan);
        });
    });
} catch (error) {
    console.log(error);
}


// add button -> show student's list to add to company's interview 
try {
    const addStudentButtons = document.querySelectorAll('.add-student-BTN');

    function toogleFields(button) {
        const parentElement = button.parentElement;
        const newCandidate = parentElement.previousElementSibling;
        newCandidate.classList.toggle('hide');
        if (button.classList.contains('fa-circle-plus')) {
            button.classList.add('fa-circle-minus');
            button.classList.remove('fa-circle-plus');
        }
        else {
            button.classList.add('fa-circle-plus');
            button.classList.remove('fa-circle-minus');
        }

    }

    addStudentButtons.forEach(addStudentButton => {
        addStudentButton.addEventListener('click', function () {
            toogleFields(addStudentButton);
        });
    });
} catch (error) {
    console.log('Error: ', error);
}






// CREATE NEW STUDENT INTERVIEW()




// create student's new interview for a company
try {

} catch (error) {

}
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
                            console.log(inputField);
                            console.log(adjacentSpan)
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
    function handleDeleteStudentButton(buttonClass) {
        const deleteButtons = document.querySelectorAll(`.${buttonClass}`);

        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const ancestor = button.closest('.student-accordion-item');
                const studentId = button.getAttribute('data-id');

                fetch('/deleteStudent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ studentId }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        // Remove the ancestor and its children from the DOM after successful response
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

    handleDeleteStudentButton("delete-student-button");
} catch (error) {
    console.log(error);
}






/* INTERVIEW SECTION */

// delete company { updates student's interview in student section }
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
                        console.log(data);
                        // Remove the ancestor and its children from the DOM
                        if (ancestor) {
                            ancestor.remove();
                        }
                        const allStudents = document.querySelectorAll(`.accordion-item`);

                        // wokring fine but still showing some error on browser console on sI.remove(): maybe some issue with for loop
                        for (const student of allStudents) {
                            const studentInterviewRow = student.querySelector(`#interview-company-${data.deletedCompanyID}`);
                            studentInterviewRow.remove();
                        }
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });
            });
        });
    }

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


// toggle show/hide add student button for interview
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


// create new interview of a student in a company
try {
    const addStudentButtons = document.querySelectorAll(".add-student-interview");

    addStudentButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const candidateId = button.getAttribute('data-id');
            const form = button.closest('.interview-form');
            const formData = new FormData(form);

            formData.append('candidateId', candidateId);

            fetch("/createInterview", {
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
                    console.log('Interview created successfully:', data);

                    // create new row of interview in student section
                    function createInterviewRow(data) {
                        const newRow = document.createElement('tr');
                        newRow.id = `interview-company-${data.company._id}`;

                        newRow.innerHTML = `
                          <th scope="row">${data.company.companyName}</th>
                          <td>${new Date(data.company.date).toLocaleDateString()}</td>
                          <td>${data.result}</td>
                        `;

                        return newRow;
                    }

                    const student = document.querySelector(`.accordion-item-${data.student._id}`);
                    const tableBody = student.querySelector('tbody');
                    const newTableRow = createInterviewRow(data);
                    tableBody.appendChild(newTableRow);


                    
                    // create new student-interview div in interview section
                    function createInterviewElement(data) {
                        const interviewElement = document.createElement('div');
                        interviewElement.classList.add('student', `student-interview-${data.company._id}`);
                        interviewElement.id = data.company._id;

                        interviewElement.innerHTML = `
                          <div class="fixed">
                            <p>
                              <strong>Name:&ensp;</strong>
                              <span>${data.student.name}</span>
                            </p>
                            <p>
                              <strong>Result:&ensp;</strong>
                              <span class="onEditFields">${data.result}</span>
                              <select class="form-select form-control onSaveFields custom-select" id="result-${data.student._id}-select" name="result" required>
                                <option selected value="${data.result}">${data.result}</option>
                                <option value="pass">Pass</option>
                                <option value="fail">Fail</option>
                                <option value="on hold">On Hold</option>
                                <option value="didn't attempt">Didn't Attempt</option>
                              </select>
                            </p>
                          </div>
                          <button class="edit-student-interview hide" data-id="${data.student._id}" type="button">
                            Edit&ensp;<i class="fa-solid fa-pen-to-square"></i>
                          </button>
                          <button class="update-student-interview hide" data-id="${data.student._id}" type="button">
                            Update Student&ensp;<i class="fa-solid fa-arrow-rotate-left"></i>
                          </button>
                          <button class="delete-student-interview hide" data-id="${data.student._id}" type="button">
                            Delete&ensp;<i class="fa-solid fa-trash"></i>
                          </button>
                        `;

                        return interviewElement;
                    }
                    
                    const interviewForm = document.querySelector(`#company-${data.company._id}-students-form`);
                    const newInterviewElement = createInterviewElement(data);
                    interviewForm.prepend(newInterviewElement);

                })
                .catch(error => {
                    console.log("Error:", error);
                });
        });
    });
} catch (error) {
    console.log('Error: ', error);
}


// update student/interview
try {
    const updateButtons = document.querySelectorAll(".update-student-interview");

    updateButtons.forEach(button => {
        button.addEventListener("click", function () {
            const studentId = button.getAttribute('data-id');
            const parentDiv = button.closest('.student');
            const companyId = parentDiv.getAttribute('id');

            const fixedDiv = parentDiv.querySelector('.fixed');
            const resultSelect = fixedDiv.querySelector('[name="result"]');

            // Create an object with the values
            const requestData = {
                studentId: studentId,
                companyId: companyId,
                result: resultSelect.value
            };
            fetch("/updateStudentInterview", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const updatedData = data;
                    console.log('UpdatedData:', data);

                    // update value dynamically in interview section
                    const studentDiv = document.querySelector(`.student-interview-${updatedData.company._id}`)
                    const selectElement = studentDiv.querySelector('select');
                    const adjacentSpan = selectElement.previousElementSibling;
                    adjacentSpan.textContent = selectElement.value;

                    // update value dynamically in student section
                    const student = document.querySelector(`.accordion-item-${updatedData.student._id}`);
                    const studentInterviewRow = student.querySelector(`#interview-company-${updatedData.company._id}`);
                    const lastElementChildResult = studentInterviewRow.lastElementChild;
                    lastElementChildResult.textContent = selectElement.value;
                })
                .catch(error => {
                    console.log("Error:", error);
                });
        });
    });
} catch (error) {
    console.log('Error: ', error);
}




// delete student interview 
try {
    function handleDeleteInterviewButton(buttonClass) {
        const deleteButtons = document.querySelectorAll(`.${buttonClass}`);

        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const ancestor = button.closest('.student');
                const candidateId = button.getAttribute('data-id');
                const companyId = ancestor.getAttribute('id');

                fetch('/deleteStudentInterview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ candidateId, companyId }),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        // Remove the ancestor and its children from the DOM after a successful response
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

    handleDeleteInterviewButton("delete-student-interview");
} catch (error) {
    console.log(error);
}




// dynamic delete features 
// fix update toggle button in interview
// dynamic status update
// add report download feature
try {

} catch (error) {
    console.log('Error: ', error);
}
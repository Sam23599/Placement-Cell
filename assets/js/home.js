// Collapse Not-focused accordions
function CollapseAccordions() {
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
}
CollapseAccordions();




/***************************************************************************/


/* STUDENT SECTION */

// Toggle between Edit and Save buttons within the same form
function toggleEditSaveStudent() {
    try {

        function toggleFields(onFieldButton, onField, offField, offFieldButton) {
            onFieldButton.addEventListener("click", function () {

                onField.classList.toggle('hide');
                offField.classList.toggle('hide');
                onFieldButton.classList.toggle('hide');
                offFieldButton.classList.toggle('hide');

            });
        }

        const editButtons = document.querySelectorAll(".edit-student-button");
        const saveButtons = document.querySelectorAll(".save-student-button");

        editButtons.forEach(button => {
            const saveButton = button.nextElementSibling;
            const form = button.closest('form');
            const fields = form.querySelectorAll('p');

            fields.forEach((field, index) => {
                const span = field.querySelector('span');
                const input = field.lastElementChild;
                toggleFields(button, span, input, saveButton);
            });
        });

        saveButtons.forEach(button => {
            const editButton = button.previousElementSibling;
            const form = button.closest('form');
            const fields = form.querySelectorAll('p');

            fields.forEach((field, index) => {
                const span = field.querySelector('span');
                const input = field.lastElementChild;
                toggleFields(button, input, span, editButton);
            });
        });

    } catch (error) {
        console.log(error);
    }
}
toggleEditSaveStudent();


// update student
function updateStudent() {
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
                            const fields = studentForm.querySelectorAll('p');

                            // Loop through input-fields/spans and update values
                            fields.forEach((field, index) => {
                                const span = field.querySelector('span');
                                const input = field.lastElementChild;
                                if (span) {
                                    span.textContent = input.value;
                                }
                            })
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
}
updateStudent();


// delete student
function deleteStudent() {
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
                            console.log('Deleted Student update', data);
                            // Remove the ancestor and its children from the DOM after successful response
                            if (ancestor) {
                                ancestor.remove();
                            }

                            for (const oneCompany of data.companies) {
                                const company = document.querySelector(`.accordion-item-${oneCompany._id}`);
                                const studentToRemove = company.querySelector(`.student-${data.removedStudentId}`);
                                studentToRemove.remove();
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
}
deleteStudent();




/***************************************************************************/


/* INTERVIEW SECTION */

// delete company { updates student's interview in student section }
function deleteCompany() {
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

                            for (const student of allStudents) {
                                const studentInterviewRow = student.querySelector(`#interview-company-${data.deletedCompanyID}`);
                                if (studentInterviewRow) {
                                    studentInterviewRow.remove();
                                }
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
}
deleteCompany();


// toggle between different students in interview list
function toggleStudentInterview() {
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

                if(!select.classList.contains('hide')){
                    // needed this coz the 'fixed' element was being clicked again whenever selecting an option in the select field
                    // now, when select is in active state(not hidden), then fixed click eventlistener wont happen 
                    return;
                }
                editButton.classList.toggle('hide');
                deleteButton.classList.toggle('hide');
                span.classList.remove('hide');
                select.classList.add('hide');

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
                        otherSpan.classList.remove('hide');
                        otherSelect.classList.add('hide');
                    }
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}
toggleStudentInterview();


// toggle between Edit and Update button for student in interview list
function toggleEditUpdateInterview() {
    try {
        function toggleFields(onFieldButton, onField, offField, offFieldButton) {
            onFieldButton.addEventListener("click", function () {
                onField.classList.add('hide');
                offField.classList.remove('hide');
                onFieldButton.classList.add('hide');
                offFieldButton.classList.remove('hide');
            });
        }
        
        const editButtons = document.querySelectorAll(".edit-student-interview");
        const updateButtons = document.querySelectorAll(".update-student-interview");
        
        editButtons.forEach(button => {
            const updateButton = button.nextElementSibling;
            const student = button.parentElement;
            const select = student.querySelector('select');
            const span = select.previousElementSibling;
            toggleFields(button, span, select, updateButton);
        });
        
        updateButtons.forEach(button => {
            const editButton = button.previousElementSibling;
            const student = button.parentElement;
            const select = student.querySelector('select');
            const span = select.previousElementSibling;
            toggleFields(button, select, span, editButton);
        });
    } catch (error) {
        console.log(error);
    }
}
toggleEditUpdateInterview();


// update student/interview
function updateInterview() {
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
}
updateInterview();


// delete student interview 
function deleteInterview() {
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
                            // remove from interview section
                            if (ancestor) {
                                ancestor.remove();
                            }

                            // remove from student section
                            const student = document.querySelector(`.accordion-item-${data.student._id}`);
                            const studentInterviewRow = student.querySelector(`#interview-company-${data.company._id}`);
                            studentInterviewRow.remove();

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
}
deleteInterview();


// toggle show/hide add student button for interview
function toggleAddInterviewVisibility() {
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
}
toggleAddInterviewVisibility();


// create new interview of a student in a company
function createInterview() {
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
                                  <span >${data.result}</span>
                                  <select class="form-select form-control custom-select" id="result-${data.student._id}-select" name="result" required>
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
}
createInterview();




/***************************************************************************/


// Special case: update's all students and interviews on any deletion/updation
function executeUpdateStatus() {
    fetch('/updateStatus')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const students = data.students;
            students.forEach(oneStudent => {
                const studentId = oneStudent._id;
                const studentStatusUpdate = document.getElementById(`studentId-${studentId}`);

                let placed = false;

                oneStudent.interviews.forEach(interview => {
                    if (interview.result === 'pass') {
                        placed = true;
                    }
                });

                const statusSpan = studentStatusUpdate.querySelector('.status-span');
                const statusSelect = studentStatusUpdate.querySelector('.status-select');

                if (placed) {
                    statusSpan.textContent = 'Placed';
                    statusSelect.value = 'placed';
                } else {
                    statusSpan.textContent = 'Not Placed';
                    statusSelect.value = 'not placed';
                }
            });
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

try {
    // Execute after 1.2s of page reload
    setTimeout(() => {
        executeUpdateStatus();
    }, 1200);

    // Executes when the buttons are clicked
    const updateStatusButtons = document.querySelectorAll('.add-student-interview, .update-student-interview, .delete-student-interview, .delete-interview-button');

    updateStatusButtons.forEach(button => {
        button.addEventListener('click', function () {
            setTimeout(() => {
                executeUpdateStatus();
            }, 1000);
        });
    });
} catch (error) {
    console.log('Error: ', error);
}



// Feature left out: on New Interview creation, it needs page reload to interact, else it just shows up on DOM and not interactable
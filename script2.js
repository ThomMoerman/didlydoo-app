var dateCount = 1;

function init() {
    const eventListElement = document.querySelector(".container__eventsTable");

    fetch("http://127.0.0.1:3000/api/events")
        .then((response) => response.json())
        .then((events) => {
            renderEventList(events);
        })
        .catch((error) => {
            console.error("Error fetching events:", error);
        });

    function renderEventList(events) {
        // Clear the existing content
        eventListElement.innerHTML = "";

        if (events.length === 0) {
            const noEventsMessage = createNoEventsMessage();
            eventListElement.appendChild(noEventsMessage);
        } else {
            events.forEach((event) => {
                const eventElement = createEventElement(event);
                eventListElement.appendChild(eventElement);
            });
        }
    }

    function createNoEventsMessage() {
        const noEventsMessage = document.createElement("p");
        noEventsMessage.textContent = "No events found.";
        return noEventsMessage;
    }

    function createEventElement(event) {
        const eventContainer = document.createElement("div");
        eventContainer.classList.add("container__eventsTable__event");
        eventContainer.setAttribute('data-event-id', event.id);

        const eventContainerTop = document.createElement("div");
        eventContainerTop.classList.add("container__eventsTable__event__top");

        const eventContainerTopLeft = document.createElement("div");
        eventContainerTopLeft.classList.add(
            "container__eventsTable__event__top__Left"
        );

        const eventContainerTopRight = document.createElement("div");
        eventContainerTopRight.classList.add(
            "container__eventsTable__event__top__Right"
        );

        const eventContainerBottom = document.createElement("div");
        eventContainerBottom.classList.add("container__eventsTable__event__bottom");

        const nameElement = document.createElement("h2");
        nameElement.textContent = event.name;
        eventContainerTopLeft.appendChild(nameElement);

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = event.description;
        eventContainerTopLeft.appendChild(descriptionElement);

        const editEventBtn = document.createElement("button");
        editEventBtn.textContent = "Modify";
        editEventBtn.classList.add(
            "container__eventsTable__event__top__Right__blueBtn"
        );
        eventContainerTopRight.appendChild(editEventBtn);

        const addDatesBtn = document.createElement("button");
        addDatesBtn.textContent = "Add Dates";
        addDatesBtn.classList.add(
            "container__eventsTable__event__top__Right__blueBtn_addDate"
        );
        addDatesBtn.addEventListener("click", () => {
            addDateToEvent(event.id);
        });
        eventContainerTopRight.appendChild(addDatesBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add(
            "container__eventsTable__event__top__Right__redBtn"
        );
        eventContainerTopRight.appendChild(deleteBtn);

        const participantForm = document.createElement("form");

        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Attendee's Name: ";
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameLabel.appendChild(nameInput);
        participantForm.appendChild(nameLabel);

        for (let i = 0; i < event.dates.length; i++) {
            const dateCheckbox = document.createElement("input");
            dateCheckbox.type = "checkbox";
            dateCheckbox.id = `dateCheckbox-${i}`;

            const dateLabel = document.createElement("label");
            console.log(event.dates[i]);
            dateLabel.textContent = event.dates[i].date;
            dateLabel.setAttribute("for", `dateCheckbox-${i}`);

            participantForm.appendChild(dateCheckbox);
            participantForm.appendChild(dateLabel);
        }

        const submitBtn = document.createElement("button");
        submitBtn.textContent = "Add Participant";
        participantForm.appendChild(submitBtn);

        const attendeesTable = createAttendeesTable(event.dates);
        eventContainerBottom.appendChild(attendeesTable);
        eventContainerTop.appendChild(eventContainerTopLeft);
        eventContainerTop.appendChild(eventContainerTopRight);
        eventContainer.appendChild(eventContainerTop);
        eventContainer.appendChild(eventContainerBottom);
        eventContainer.appendChild(participantForm);


        deleteBtn.addEventListener("click", () => {
            deleteEvent(event.id)
                .then((response) => {
                    if (response.status === 200) {
                        eventListElement.removeChild(eventContainer);
                    } else {
                        throw new Error("Error deleting event");
                    }
                })
                .catch((error) => {
                    console.error("Error deleting event", error);
                });
        });

        editEventBtn.addEventListener("click", () => {
            editEvent(event, eventContainer);
        });

        submitBtn.addEventListener("click", () => {
            const participantName = nameInput.value;
            const participantDates = [];
            const dateCheckboxes = participantForm.querySelectorAll("input[type='checkbox']");

            dateCheckboxes.forEach((checkbox, index) => {
                const date = event.dates[index].date;
                const available = checkbox.checked;
                participantDates.push({ date, available });
            });

            const participantData = {
                name: participantName,
                dates: participantDates
            };

            addParticipant(event.id, participantData)
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error("Error adding participant");
                    }
                })
                .then((updatedEvent) => {
                    const updatedAttendeesTable = createAttendeesTable(updatedEvent.dates);
                    eventContainerBottom.innerHTML = "";
                    eventContainerBottom.appendChild(updatedAttendeesTable);
                })
                .catch((error) => {
                    console.error("Error adding participant:", error);
                });
        });

        return eventContainer;
    }

    function addDateToEvent(eventId) {
        const currentDate = new Date().toISOString().split('T')[0]; // Obtient la date actuelle au format YYYY-MM-DD
        const newDate = prompt("Enter the date (YYYY-MM-DD):");

        // Vérifie si la date est valide
        if (newDate && newDate >= currentDate) {
            const dateData = {
                dates: [newDate],
            };

            fetch(`http://127.0.0.1:3000/api/events/${eventId}/add_dates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dateData),
            })
                .then((response) => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        throw new Error("Error adding date to event");
                    }
                })
                .then((updatedEvent) => {
                    const updatedAttendeesTable = createAttendeesTable(updatedEvent.dates);
                    eventContainerBottom.innerHTML = "";
                    eventContainerBottom.appendChild(updatedAttendeesTable);
                })
                .catch((error) => {
                    console.error("Error adding date to event:", error);
                });
        } else {
            alert("Invalid date. Please enter a valid date (YYYY-MM-DD).");
        }
    }


    function deleteEvent(eventId) {
        return fetch(`http://127.0.0.1:3000/api/events/${eventId}`, {
            method: "DELETE",
        });
    }

    function addParticipant(eventId, participantData) {
        return fetch(`http://127.0.0.1:3000/api/events/${eventId}/attend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(participantData),
        });
    }

    function editEvent(event, eventContainer) {
        const dialog = document.getElementById("eventDialog");
        dialog.innerHTML = ""; // Réinitialise le contenu de la fenêtre modale

        const nameInput = document.createElement("input");
        nameInput.value = event.name;

        const authorInput = document.createElement("input");
        authorInput.value = event.author;

        const descriptionInput = document.createElement("input");
        descriptionInput.value = event.description;

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", closeDialog);

        const form = document.createElement("form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const modifiedEvent = {
                name: nameInput.value,
                author: authorInput.value,
                description: descriptionInput.value,
            };

            updateEvent(event.id, modifiedEvent)
                .then((response) => {
                    if (response.status === 200) {
                        updateEventElement(modifiedEvent);
                        dialog.close(); // Ferme la fenêtre modale après la sauvegarde
                    } else {
                        throw new Error("Error updating event");
                    }
                })
                .catch((error) => {
                    console.error("Error updating event", error);
                });
        });

        form.appendChild(nameInput);
        form.appendChild(authorInput);
        form.appendChild(descriptionInput);
        form.appendChild(saveBtn);
        form.appendChild(cancelBtn);

        dialog.appendChild(form);

        dialog.showModal(); // Affiche la fenêtre modale
    }

    function updateEvent(eventId, eventData) {
        return fetch(`http://127.0.0.1:3000/api/events/${eventId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData)
        });
    }

    function closeDialog() {
        document.body.removeChild(dialog);
    }

    function createAttendeesTable(dates) {
        const tableContainer = document.createElement("div");
        tableContainer.classList.add("table-container");
    
        const table = document.createElement("table");
        table.classList.add("attendees-table");
    
        const headerRow = document.createElement("tr");
        const headerCell = document.createElement("th");
        headerCell.textContent = "Dates";
        headerRow.appendChild(headerCell);
    
        dates.forEach((date) => {
        const dateHeaderCell = document.createElement("th");
        dateHeaderCell.textContent = date.date;
        headerRow.appendChild(dateHeaderCell);
        });
    
        table.appendChild(headerRow);
    
        dates[0].attendees.forEach((attendee, index) => {
        const row = document.createElement("tr");
        const attendeeNameCell = createTableCell(attendee.name);
        row.appendChild(attendeeNameCell);
    
        dates.forEach((date) => {
            const availability = date.attendees[index].available;
            const availabilityCell = createTableCell(availability ? "V" : "X");
    
            row.appendChild(availabilityCell);
            makeCellEditable(availabilityCell);
        });
    
        table.appendChild(row);
        });
    
        tableContainer.appendChild(table);
    
        tableContainer.addEventListener("click", (event) => {
        const closestCell = event.target.closest("td");
    
        if (closestCell) {
            makeCellEditable(closestCell);
        }
        });
    
        return tableContainer;
    }
    function createTableCell(text) {
        const cell = document.createElement("td");
        cell.textContent = text;
        return cell;
    }
    function makeCellEditable(cell) {
        cell.contentEditable = true;
        cell.addEventListener("input", handleCellInput);
    }
    function handleCellInput(event) {
        const cell = event.target;
        const cellValue = cell.textContent.trim(); 
        if (cellValue !== "V" && cellValue !== "X") {
            if (cellValue.length > 0) {
                Swal.fire('Please, write "V" or "X"');
                cell.textContent = "";
            }
        }
    }
    const addEventBtn = document.querySelector(".container__eventForm__Add_btn");
    addEventBtn.addEventListener("click", () => {
        const eventNameInput = document.querySelector(
            ".container__eventForm__form_name"
        );
        const eventAuthorInput = document.querySelector(
            ".container__eventForm__form_author"
        );
        const eventDescriptionInput = document.querySelector(
            ".container__eventForm__form_description"
        );

        // Get all the date input
        const eventDateInputs = document.querySelectorAll(
            ".container__eventForm__form_date"
        );
        const eventDates = [];

        // Loop through input to get all the dates and push them into an array
        eventDateInputs.forEach((input) => {
            eventDates.push(input.value);
        });

        const newEvent = {
            name: eventNameInput.value,
            description: eventDescriptionInput.value,
            author: eventAuthorInput.value,
            dates: eventDates,
        };

        saveEvent(newEvent)
            .then((response) => {
                if (response.status === 200) {
                    eventNameInput.value = "";
                    eventDateInput.value = "";
                    eventAuthorInput.value = "";
                    eventDescriptionInput.value = "";

                    return response.json();
                } else {
                    throw new Error("Error creating event");
                }
            })
            .then((event) => {
                const eventElement = createEventElement(event);
                eventListElement.appendChild(eventElement);
            })
            .catch((error) => {
                console.error("Error creating event:", error);
            });
    });

    function saveEvent(event) {
        return fetch("http://127.0.0.1:3000/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(event),
        });
    }
}

const addDateBtn = document.querySelector(
    ".container__eventForm__Add_btnAddDate"
);

addDateBtn.addEventListener("click", () => {
    const datesContainer = document.querySelector(
        ".container__eventForm__form_dates"
    );
    const newDateContainer = document.createElement("div");
    newDateContainer.classList.add("date-container");

    const newDateInput = document.createElement("input");
    newDateInput.type = "date";
    newDateInput.classList.add("container__eventForm__form_date");
    newDateContainer.appendChild(newDateInput);

    const removeDateBtn = document.createElement("button");
    removeDateBtn.textContent = "-";
    removeDateBtn.classList.add("remove-date-btn");
    removeDateBtn.type = "button";
    newDateContainer.appendChild(removeDateBtn);

    datesContainer.appendChild(newDateContainer);
    dateCount++;
});

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-date-btn")) {
        const dateContainer = event.target.parentNode;
        const datesContainer = dateContainer.parentNode;
        const index = parseInt(dateContainer.getAttribute("data-index"));

        // Check if it's the first input date
        if (index === 0) {
            alert(
                "Premier champ de date insuppressible\nVous devez renseigner au moins une date pour l'évènement"
            );
            return;
        }

        datesContainer.removeChild(dateContainer);
        dateCount--;
        console.log(dateCount);
    }
});

init();

function init() {
    const eventListElement = document.querySelector('.container__eventsTable');
  
    fetch('http://127.0.0.1:3000/api/events')
      .then((response) => response.json())
      .then((events) => {
        renderEventList(events);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  
    function renderEventList(events) {
      // Clear the existing content
      eventListElement.innerHTML = '';
  
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
      const noEventsMessage = document.createElement('p');
      noEventsMessage.textContent = 'No events found.';
      return noEventsMessage;
    }
  
    function createEventElement(event) {
      const eventContainer = document.createElement('div');
      eventContainer.classList.add('container__eventsTable__event');
  
      const eventContainerTop = document.createElement('div');
      eventContainerTop.classList.add('container__eventsTable__event__top');

      const eventContainerTopLeft = document.createElement('div');
      eventContainerTopLeft.classList.add('container__eventsTable__event__top__Left');

      const eventContainerTopRight = document.createElement('div');
      eventContainerTopRight.classList.add('container__eventsTable__event__top__Right');
  
      const eventContainerBottom = document.createElement('div');
      eventContainerBottom.classList.add('container__eventsTable__event__bottom');
  
      const nameElement = document.createElement('h2');
      nameElement.textContent = event.name;
      eventContainerTopLeft.appendChild(nameElement);
  
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = event.description;
      eventContainerTopLeft.appendChild(descriptionElement);
  
      const editEventBtn = document.createElement('button');
      editEventBtn.textContent = 'Modify';
      editEventBtn.classList.add('container__eventsTable__event__top__Right__blueBtn');
      eventContainerTopRight.appendChild(editEventBtn);
  
      const addDatesBtn = document.createElement('button');
      addDatesBtn.textContent = 'Add Dates';
      addDatesBtn.classList.add('container__eventsTable__event__top__Right__blueBtn');
      eventContainerTopRight.appendChild(addDatesBtn);
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('container__eventsTable__event__top__Right__redBtn');
      eventContainerTopRight.appendChild(deleteBtn);
  
      const attendeesTable = createAttendeesTable(event.dates);
      eventContainerBottom.appendChild(attendeesTable);
  
      eventContainerTop.appendChild(eventContainerTopLeft);
      eventContainerTop.appendChild(eventContainerTopRight);
      eventContainer.appendChild(eventContainerTop);
      eventContainer.appendChild(eventContainerBottom);
  
      return eventContainer;
    }
  
    function createAttendeesTable(dates) {
      const table = document.createElement('table');
      table.classList.add('attendees-table');
  
      // Create the table header
      const headerRow = document.createElement('tr');
      const headerCell = document.createElement('th');
      headerCell.textContent = 'Dates';
      headerRow.appendChild(headerCell);
  
      dates.forEach((date) => {
        const dateHeaderCell = document.createElement('th');
        dateHeaderCell.textContent = date.date;
        headerRow.appendChild(dateHeaderCell);
      });
  
      table.appendChild(headerRow);
  
      // Create table rows for each attendee
      dates[0].attendees.forEach((attendee, index) => {
        const row = document.createElement('tr');
        const attendeeNameCell = document.createElement('td');
        attendeeNameCell.textContent = attendee.name;
        row.appendChild(attendeeNameCell);
  
        dates.forEach((date) => {
          const availabilityCell = document.createElement('td');
          availabilityCell.textContent = attendee.available ? 'V' : 'X';
          row.appendChild(availabilityCell);
        });
  
        table.appendChild(row);
      });
  
      return table;
    }
  
    const addEventBtn = document.querySelector('.container__eventForm__Add_btn');
    addEventBtn.addEventListener('click', () => {
      const eventNameInput = document.querySelector('.container__eventForm__form_name');
      const eventDateInput = document.querySelector('.container__eventForm__form_date');
      const eventAuthorInput = document.querySelector('.container__eventForm__form_author');
      const eventDescriptionInput = document.querySelector('.container__eventForm__form_description');
  
      console.log(eventDateInput.value);

      const newEvent = {
        name: eventNameInput.value,
        description: eventDescriptionInput.value,
        author: eventAuthorInput.value,
        dates: [eventDateInput.value],
      };
  
      saveEvent(newEvent)
        .then((response) => {
          if (response.status === 200) {
            eventNameInput.value = '';
            eventDateInput.value = '';
            eventAuthorInput.value = '';
            eventDescriptionInput.value = '';
  
            return response.json();
          } else {
            throw new Error('Error creating event');
          }
        })
        .then((event) => {
          const eventElement = createEventElement(event);
          eventListElement.appendChild(eventElement);
        })
        .catch((error) => {
          console.error('Error creating event:', error);
        });
    });
  
    function generateEventId() {
      // Generate a random ID for the new event
      const idLength = 12;
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let id = '';
  
      for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
      }
  
      return id;
    }
  
    function getCurrentDateTime() {
      const currentDateTime = new Date();
      return currentDateTime.toISOString();
    }
  
    function saveEvent(event) {
      return fetch('http://127.0.0.1:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    }
  }
  
  document.addEventListener('DOMContentLoaded', init);
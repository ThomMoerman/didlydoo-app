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
  
    // function fetchEvents() {
    //   return fetch('http://127.0.0.1:3000/api/events')
    //     .then((response) => response.json());
    // }
  
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
      eventContainerTop.classList.add('container__eventsTable__event__top')

      const eventContainerBottom = document.createElement('div');
      eventContainerBottom.classList.add('container__eventsTable__event__bottom')
  
      const nameElement = document.createElement('h2');
      nameElement.textContent = event.name;
      eventContainerTop.appendChild(nameElement);
  
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = event.description;
      eventContainerTop.appendChild(descriptionElement);

      const editEventBtn = document.createElement('button');
      editEventBtn.textContent = "Modify"
      eventContainerTop.appendChild(editEventBtn);

      const addDatesBtn = document.createElement('button');
      addDatesBtn.textContent = "Add Dates"
      eventContainerTop.appendChild(addDatesBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = "Delete"
      eventContainerTop.appendChild(deleteBtn);

      const attendeesTable = createAttendeesTable(event.dates);
      eventContainerBottom.appendChild(attendeesTable);
  
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
  }
  
  document.addEventListener('DOMContentLoaded', init);
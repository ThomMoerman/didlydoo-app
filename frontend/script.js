document.addEventListener('DOMContentLoaded', () => {
    const eventListElement = document.getElementById('eventList');
  
    fetch('http://127.0.0.1:3000/api/events')
      .then((response) => response.json())
      .then((data) => {
        // Render the list of events
        renderEventList(data);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  
    function renderEventList(events) {
      // Clear the existing content
      eventListElement.innerHTML = '';
  
      if (events.length === 0) {
        const noEventsMessage = document.createElement('p');
        noEventsMessage.textContent = 'No events found.';
        eventListElement.appendChild(noEventsMessage);
      } else {
        events.forEach((event) => {
          const eventElement = createEventElement(event);
          eventListElement.appendChild(eventElement);
        });
      }
    }
  
    function createEventElement(event) {
      const eventContainer = document.createElement('div');
      eventContainer.classList.add('event');
  
      const nameElement = document.createElement('h2');
      nameElement.textContent = event.name;
      eventContainer.appendChild(nameElement);
  
      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = event.description;
      eventContainer.appendChild(descriptionElement);
  
      const authorElement = document.createElement('p');
      authorElement.textContent = 'Author: ' + event.author;
      eventContainer.appendChild(authorElement);
  
      const datesElement = document.createElement('div');
      datesElement.classList.add('dates');
      event.dates.forEach((date) => {
        const dateElement = createDateElement(date);
        datesElement.appendChild(dateElement);
      });
      eventContainer.appendChild(datesElement);
  
      return eventContainer;
    }
  
    function createDateElement(date) {
      const dateContainer = document.createElement('div');
      dateContainer.classList.add('date');
  
      const dateLabel = document.createElement('p');
      dateLabel.textContent = 'Date: ' + date.date;
      dateContainer.appendChild(dateLabel);
  
      const attendeesElement = document.createElement('div');
      attendeesElement.classList.add('attendees');
      date.attendees.forEach((attendee) => {
        const attendeeElement = createAttendeeElement(attendee);
        attendeesElement.appendChild(attendeeElement);
      });
      dateContainer.appendChild(attendeesElement);
  
      return dateContainer;
    }
  
    function createAttendeeElement(attendee) {
      const attendeeElement = document.createElement('p');
      attendeeElement.textContent = 'Attendee: ' + attendee.name + ', Availability: ' + (attendee.available ? 'Available' : 'Not Available');
      return attendeeElement;
    }
  });
  
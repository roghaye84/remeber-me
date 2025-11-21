// script.js

document.addEventListener('DOMContentLoaded', function() {
  // Toggle sidebar for mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }

  // Check if on add-task page
  if (document.getElementById('event-form')) {
    const form = document.getElementById('event-form');
    const events = JSON.parse(localStorage.getItem('events')) || [];

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('task-title').value;
      const eventType = document.getElementById('event-type').value;
      const relation = document.getElementById('relation').value;
      const date = document.getElementById('task-date').value;
      
      if (name && eventType && relation && date) {
        const newEvent = { id: Date.now(), name, eventType, relation, date, completed: false };
        events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(events));
        
        alert('Event saved successfully!');
        form.reset();
        // Redirect to home page
        window.location.href = 'index.html';
      } else {
        alert('Please fill in all fields.');
      }
    });
  }

  // Check if on index page
  if (document.querySelector('.task-list')) {
    const taskList = document.querySelector('.task-list');
    let events = JSON.parse(localStorage.getItem('events')) || [];

    // Function to render tasks
    function renderTasks() {
      taskList.innerHTML = '';
      events.forEach(event => {
        const li = document.createElement('li');
        li.className = `task-item task-${getRandomColor()}`;
        li.innerHTML = `
          <input type="checkbox" class="task-checkbox" ${event.completed ? 'checked' : ''} data-id="${event.id}">
          <div class="task-content">
            <div class="task-header">
              <span class="task-title">${event.name}</span>
              <span class="task-duration">${formatDate(event.date)}</span>
            </div>
            <div class="task-extra">
              <span class="task-event">${capitalize(event.eventType)}</span>
              <span class="task-relation">${capitalize(event.relation)}</span>
            </div>
          </div>
          <span class="material-symbols-outlined delete-icon" data-id="${event.id}">delete</span>
        `;
        taskList.appendChild(li);
      });
    }

    // Initial render
    renderTasks();

    // Handle checkbox toggle
    taskList.addEventListener('change', function(e) {
      if (e.target.classList.contains('task-checkbox')) {
        const id = parseInt(e.target.dataset.id);
        const event = events.find(ev => ev.id === id);
        if (event) {
          event.completed = e.target.checked;
          localStorage.setItem('events', JSON.stringify(events));
        }
      }
    });

    // Handle delete
    taskList.addEventListener('click', function(e) {
      if (e.target.classList.contains('delete-icon')) {
        const id = parseInt(e.target.dataset.id);
        events = events.filter(ev => ev.id !== id);
        localStorage.setItem('events', JSON.stringify(events));
        renderTasks();
      }
    });

    // Helper functions
    function getRandomColor() {
      const colors = ['blue', 'green', 'yellow', 'pink'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const today = new Date();
      const diffTime = date - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Due Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === 2) return 'In 2 Days';
      if (diffDays < 7) return `In ${diffDays} Days`;
      return date.toLocaleDateString();
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
});

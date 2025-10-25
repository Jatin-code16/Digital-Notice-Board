// Toggle Admin Mode: Show or hide the admin form
function toggleAdminMode() {
  const adminFormSection = document.getElementById('adminFormSection');
  const toggleButton = document.getElementById('adminToggle');
  if (adminFormSection.classList.contains('hidden')) {
    adminFormSection.classList.remove('hidden');
    toggleButton.innerText = 'Switch to Student Mode';
  } else {
    adminFormSection.classList.add('hidden');
    toggleButton.innerText = 'Switch to Admin Mode';
  }
}

// Post Announcement: Send data to the server
async function postAnnouncement(event) {
  event.preventDefault();
  
  const title = document.getElementById('title').value.trim();
  const category = document.getElementById('category').value;
  const content = document.getElementById('content').value.trim();
  const sender = document.getElementById('sender').value.trim();

  if (!title || !category || !content || !sender) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch('/announce', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, content, sender })
    });
    const data = await response.json();
    document.getElementById('message').innerText = data.message;
    document.getElementById('announcementForm').reset();
    fetchAnnouncements();
  } catch (error) {
    console.error('Error posting announcement:', error);
  }
}

// Fetch Announcements: Retrieve data from the server and display them
async function fetchAnnouncements() {
  const category = document.getElementById('categoryFilter').value;
  const url = category ? `/announcements?category=${encodeURIComponent(category)}` : '/announcements';
  
  try {
    const response = await fetch(url);
    const announcements = await response.json();
    displayAnnouncements(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
}

// Display Announcements: Update the DOM with the announcement list
function displayAnnouncements(announcements) {
  const announcementsDiv = document.getElementById('announcements');
  let html = '<h2>📌 Latest Announcements</h2>';
  
  if (announcements.length === 0) {
    html += '<div class="empty-state"><p>No announcements found.</p></div>';
  } else {
    announcements.forEach(ann => {
      // Add a special class if the priority is high (threshold: 10)
      const priorityClass = ann.priority >= 10 ? 'high-priority' : '';
      
      // Category icons mapping
      const categoryIcon = {
        'Academics': '📚',
        'Clubs': '🎭',
        'Placements': '💼',
        'General': '📋'
      }[ann.category] || '📋';
      
      html += `<div class="announcement ${priorityClass}">
                 <h3>${categoryIcon} ${ann.title}</h3>
                 <p><span class="category-badge category-${ann.category}">${ann.category}</span></p>
                 <p><strong>From:</strong> ${ann.sender}</p>
                 <p>${ann.content}</p>
                 <p class="timestamp">🕐 ${new Date(ann.timestamp).toLocaleString()}</p>
                 <p><span class="priority-indicator">⭐ Priority: ${ann.priority}</span></p>
               </div>`;
    });
  }
  announcementsDiv.innerHTML = html;
}

// Initial fetch of announcements when the page loads
document.addEventListener('DOMContentLoaded', fetchAnnouncements);
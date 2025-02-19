// server/index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files

// In-memory storage for announcements
let announcements = [];

// AI-inspired function to compute priority based on sender and content
function computePriority({ title, content, sender }) {
  // Start with a base priority
  let priority = 1;

  // Heuristic: Prioritize based on sender's importance
  if (sender) {
    const lowerSender = sender.toLowerCase();
    if (lowerSender.includes('hod')) {
      priority += 9;
    } else if (lowerSender.includes('exam')) {
      priority += 7;
    } else if (lowerSender.includes('faculty')) {
      priority += 5;
    } else if (lowerSender.includes('admin')) {
      priority += 6;
    }
  }

  // Heuristic: Analyze title and content for key terms
  if (title && title.toLowerCase().includes('exam')) {
    priority += 2;
  }
  if (content && content.toLowerCase().includes('urgent')) {
    priority += 3;
  }

  return priority;
}

// Endpoint to post an announcement (admin action)
app.post('/announce', (req, res) => {
  const { title, category, content, sender } = req.body;
  if (!title || !category || !content || !sender) {
    return res.status(400).json({ error: 'Title, category, content, and sender are required' });
  }
  const announcement = {
    id: announcements.length + 1,
    title,
    category,
    content,
    sender,
    timestamp: new Date()
  };
  // Compute and attach priority using our heuristic function
  announcement.priority = computePriority(announcement);
  announcements.push(announcement);
  res.json({ message: 'Announcement posted successfully', announcement });
});

// Endpoint to get announcements (with optional category filtering)
app.get('/announcements', (req, res) => {
  const { category } = req.query;
  let result = announcements;
  if (category) {
    result = result.filter(ann => 
      ann.category.toLowerCase() === category.toLowerCase()
    );
  }
  // Sort announcements by priority (highest first)
  result.sort((a, b) => b.priority - a.priority);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

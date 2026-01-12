# 📝 Advanced To-Do List Application

A modern, feature-rich, and beautifully animated task management application built with vanilla HTML, CSS, and JavaScript. Perfect for daily life productivity with an intuitive user interface and smooth animations.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🎯 Core Functionality
- ✅ **Task Management** - Create, edit, delete, and organize tasks effortlessly
- 📂 **Smart Categories** - Work, Personal, Shopping, Health with real-time counters
- 🎨 **Priority Levels** - High, Medium, Low with color-coded visualization
- 📋 **Subtasks** - Break down complex tasks with progress tracking
- 🏷️ **Tags System** - Organize with custom tags for easy filtering
- 📅 **Due Dates & Time** - Set deadlines with visual status indicators (Today, Tomorrow, Overdue)
- 🔔 **Reminders** - Enable notifications for important tasks
- 💾 **Local Storage** - Automatic save - never lose your tasks

### 🔍 Advanced Features
- 🔎 **Powerful Search** - Search by title, description, or tags
- 🎛️ **Smart Filters** - Filter by status: All, Completed, Pending, Overdue
- 🎯 **Priority Filtering** - Quick filter by priority level
- 📊 **Sort Options** - Sort by date, priority, due date, or alphabetically
- 📈 **Statistics Dashboard** - Track completion rates and progress
- 🌓 **Dark Mode** - Eye-friendly dark theme with smooth transitions
- ⏰ **Live Clock** - Real-time date and time display in navbar
- 🎪 **Drag & Drop** - Reorder tasks intuitively (coming soon)

### 🎨 UI/UX Excellence
- ✨ **Smooth Animations** - Professional animations throughout
- 🎭 **Animated Background** - Beautiful floating blob animations
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- 🎨 **Modern Design** - Gradient effects, glassmorphism, and clean layout
- 🔔 **Toast Notifications** - Beautiful feedback messages
- 🎯 **User-Friendly** - Intuitive interface for all skill levels

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or backend required!

### Installation

1. **Download or Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/advanced-todo-list.git
   ```

2. **Navigate to Project Folder**
   ```bash
   cd advanced-todo-list
   ```

3. **Open in Browser**
   - Simply double-click `index.html`
   - Or right-click → Open with → Your Browser
   - Or use Live Server in VS Code

That's it! No build process, no dependencies, just pure vanilla JavaScript.

## 📖 Usage Guide

### Creating a Task

1. Click the **"+ New Task"** button in the sidebar
2. Fill in task details:
   - **Title** (required)
   - **Description** (optional)
   - **Category** (Work, Personal, Shopping, Health)
   - **Priority** (High, Medium, Low)
   - **Due Date & Time** (optional)
   - **Tags** (comma-separated)
   - **Subtasks** (click + to add)
3. Click **"Save Task"**

### Managing Tasks

- ✅ **Complete** - Click the checkbox
- ✏️ **Edit** - Click the edit icon
- 🗑️ **Delete** - Click the trash icon
- 🔍 **Search** - Type in the search bar
- 🎯 **Filter** - Use category, status, or priority filters
- 📊 **Sort** - Choose from dropdown menu

### Viewing Statistics

- Click the **📊 Statistics** button in the header
- View:
  - Total tasks count
  - Completed vs Pending
  - Completion rate percentage
  - Visual progress bar

### Dark Mode

- Click the **🌙 Moon/Sun** icon in the header
- Preference is saved automatically

## 🎨 Customization

### Changing Colors

Edit `style.css` CSS variables:

```css
:root {
    --primary: #6366f1;        /* Main accent color */
    --secondary: #ec4899;      /* Secondary accent */
    --success: #10b981;        /* Success/Low priority */
    --warning: #f59e0b;        /* Warning/Medium priority */
    --danger: #ef4444;         /* Danger/High priority */
}
```

### Adding New Categories

In `index.html`, add to categories list:

```html
<div class="category-item" data-category="fitness">
    <i class="fas fa-dumbbell"></i>
    <span>Fitness</span>
    <span class="category-count">0</span>
</div>
```

In `script.js`, update category arrays:

```javascript
const categories = ['work', 'personal', 'shopping', 'health', 'fitness'];
```

## 🛠️ Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Advanced styling with animations
  - CSS Grid & Flexbox
  - CSS Variables
  - Keyframe Animations
  - Gradient Effects
- **JavaScript (ES6+)** - Application logic
  - Classes & OOP
  - Local Storage API
  - Date/Time Manipulation
  - Event Handling
- **Font Awesome** - Beautiful icons

## 📁 Project Structure

```
advanced-todo-list/
│
├── index.html          # Main HTML file
├── style.css           # Complete stylesheet with animations
├── script.js           # Application logic
└── README.md           # Project documentation
```

## 🎯 Key Components

### HTML Structure
- Semantic HTML5 elements
- Modal dialogs for task creation
- Sidebar with filters and categories
- Main content area for tasks
- Toast notification container

### CSS Architecture
- CSS Variables for theming
- Mobile-first responsive design
- Custom animations and transitions
- Dark mode support
- Glassmorphism effects

### JavaScript Architecture
- `TodoApp` class - Main application controller
- Methods organized by functionality:
  - Task Management
  - Filtering & Searching
  - Rendering
  - Storage
  - Dark Mode
  - Utilities

## 📱 Responsive Design

- **Desktop** (1200px+) - Full 2-column layout
- **Tablet** (768px-1199px) - Adjusted sidebar
- **Mobile** (< 768px) - Single column, stacked layout
- **Small Mobile** (< 480px) - Optimized touch targets

## 🔮 Future Enhancements

- [ ] Recurring tasks (daily, weekly, monthly)
- [ ] Browser notifications
- [ ] Keyboard shortcuts
- [ ] Export to PDF/CSV
- [ ] Calendar view
- [ ] Pomodoro timer
- [ ] Habit tracker
- [ ] Voice input
- [ ] Task templates
- [ ] Collaboration features
- [ ] Cloud sync
- [ ] Task dependencies
- [ ] Location-based reminders

## 🐛 Known Issues

- Drag & Drop reordering needs full implementation
- Browser notifications require user permission
- No data export functionality yet

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Font Awesome for beautiful icons
- Inspiration from modern productivity apps
- Community feedback and suggestions

## 📞 Support

If you encounter any issues or have questions:
- 🐛 [Report a Bug](https://github.com/yourusername/advanced-todo-list/issues)
- 💡 [Request a Feature](https://github.com/yourusername/advanced-todo-list/issues)
- 📧 Email: support@example.com

---

⭐ **Star this repo** if you find it helpful!

Made with ❤️ and ☕ | © 2026

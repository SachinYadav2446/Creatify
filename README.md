# 🎨 Creatify — Modern Creative Design Suite

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![License](https://img.shields.io/badge/license-MIT-green)

**A professional, browser-native creative suite with 9+ fully-functional design tools**

[Features](#-features) • [Demo](#-demo) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 🌟 Overview

Creatify is a comprehensive web-based creative platform that brings professional design tools directly to your browser. No installations, no heavy software—just pure creative power accessible from anywhere.

### ✨ What Makes Creatify Special

- **🎯 All-in-One Platform** - 9+ professional tools in one unified workspace
- **🚀 Browser-Native** - No downloads, works on any device with a browser
- **💾 Cloud Sync** - Your projects automatically save and sync
- **🎨 Modern UI** - Beautiful, intuitive interface with dark mode support
- **🔐 Secure Authentication** - Email/password + Google Sign-In with OTP verification
- **⚡ High Performance** - Optimized for smooth, responsive editing

---

## 🎨 Features

### Creative Tools

#### 1. 🎬 **Video Editor**
Multi-track timeline with advanced editing capabilities
- Drag-and-drop timeline sequencing
- Real-time preview with play/pause controls
- Split, duplicate, and trim clips
- Color filters and effects
- Export to multiple formats

#### 2. 🖼️ **Image Editor**
Professional image editing with layers
- Multi-layer canvas workspace
- Drag-and-drop elements
- Text overlays with custom fonts
- Filters and adjustments
- PNG/JPG export

#### 3. ✏️ **Whiteboard** ⭐ NEW
Advanced collaborative whiteboard
- 10 drawing tools (pen, highlighter, shapes)
- Sticky notes and text annotations
- Undo/redo with full history
- 20-color preset palette
- Zoom and pan navigation
- Real-time collaboration ready
- [Full Feature List →](docs/WHITEBOARD_FEATURES.md)

#### 4. 📐 **Logo Maker**
Vector-based logo design studio
- SVG vector graphics
- Preset shapes and templates
- Custom colors and scaling
- Export as SVG or high-res PNG
- Transparent backgrounds

#### 5. 📱 **Social Studio**
Multi-platform social media content
- Preview in multiple aspect ratios
- Instagram, Stories, YouTube formats
- 3D smartphone mockup simulator
- Campaign scheduler
- Export for all platforms

#### 6. 📝 **Documents**
Rich document editor with collaboration
- Block-based editing (Notion-style)
- Tables and data visualization
- Dynamic charts linked to data
- Export to DOCX/PDF
- Real-time collaboration

#### 7. 🖨️ **Print Design**
Professional print materials
- Business card templates
- A4/Letter formats
- CMYK color profiles
- Bleed and crop guides
- Print-ready exports

#### 8. 📊 **Presentations**
Beautiful slide decks
- Multiple design themes
- Markdown support
- Fullscreen presenter mode
- Smooth transitions
- Export to PPTX/PDF

#### 9. 🤖 **AI Magic**
AI-powered design assistance
- Smart suggestions
- Auto-layouts
- Color palette generation
- Content enhancement

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- PostgreSQL database (optional, uses JSON fallback)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/creatify.git
   cd creatify
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure environment variables**
   
   Create `server/.env`:
   ```env
   PORT=3001
   JWT_SECRET=your_super_secret_jwt_key_change_this
   DATABASE_URL=postgresql://user:password@host:5432/database
   FRONTEND_URL=http://localhost:5173
   
   # SMTP Configuration (for email)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

5. **Start the backend server**
   ```bash
   npm run dev
   ```

6. **Start the frontend (in a new terminal)**
   ```bash
   cd ..
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 🎯 Usage

### Creating Your First Project

1. **Sign Up/Sign In**
   - Use email/password or Google Sign-In
   - Verify your email with OTP code

2. **Choose a Tool**
   - Click on any tool card from the homepage
   - Or access from the navigation menu

3. **Start Creating**
   - Use the intuitive interface to design
   - Auto-saves as you work
   - Click "Save" to sync to cloud

4. **Export Your Work**
   - Click the Export button
   - Choose your format (PNG, JPG, PDF, etc.)
   - Download instantly

---

## 📚 Documentation

Comprehensive guides for setup, features, and deployment:

- **📖 [Documentation Index](docs/README.md)** - Complete documentation hub
- **✏️ [Whiteboard Features](docs/WHITEBOARD_FEATURES.md)** - Whiteboard tool guide
- **🔐 [Authentication Setup](docs/QUICK_GOOGLE_SETUP.md)** - Google Sign-In configuration
- **📧 [SMTP Setup](docs/SMTP_QUICK_REFERENCE.md)** - Email configuration guide
- **🚢 [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment steps
- **✅ [Features List](docs/FEATURES_COMPLETED.md)** - All implemented features

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Hooks
- **Build Tool**: Vite
- **Styling**: Custom CSS with design system
- **Graphics**: HTML5 Canvas, SVG, CSS transforms
- **Icons**: Lucide React
- **State Management**: React Context + Local State

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Authentication**: JWT + bcrypt
- **Database**: PostgreSQL (with JSON fallback)
- **Email**: Nodemailer with SMTP
- **File Storage**: Cloud-ready architecture

### Infrastructure
- **Hosting**: Render (frontend + backend)
- **Database**: Neon Database (PostgreSQL)
- **CDN**: Automatic via Render
- **SSL**: Automatic HTTPS

---

## 🚢 Deployment

### Deploy to Render (Recommended)

1. **Fork this repository**

2. **Connect to Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Click "Apply"

3. **Configure Environment Variables**
   - Add your DATABASE_URL, JWT_SECRET, SMTP credentials
   - Set FRONTEND_URL to your Render frontend URL

4. **Deploy!**
   - Render will automatically build and deploy
   - Frontend: Static Site
   - Backend: Web Service

Detailed deployment instructions: [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Icons by [Lucide](https://lucide.dev)
- Fonts from Google Fonts
- Inspired by professional design tools

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/creatify/issues)
- **Email**: support@creatify.com
- **Documentation**: [docs/](docs/)

---

<div align="center">

**[⬆ Back to Top](#-creatify--modern-creative-design-suite)**

Made with 💖 by the Creatify Team

</div>

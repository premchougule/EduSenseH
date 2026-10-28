# Contributing to EduSenseH

Thank you for your interest in contributing to EduSenseH! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Report issues responsibly

## 🚀 How to Contribute

### 1. Report Bugs
- **Check existing issues** first to avoid duplicates
- **Provide clear reproduction steps**
- **Include your environment** (browser, OS, version)
- **Add error logs** from browser console
- **Describe expected vs actual behavior**

**Example Issue:**
```
Title: Transcription stops when switching languages

Environment:
- Browser: Chrome 131 on Windows 11
- Vite: 7.3.1

Reproduction:
1. Start live class
2. Speak in English (transcription works ✓)
3. Switch language dropdown to हिंदी
4. Speak again (transcription frozen ✗)

Expected: Transcription continues seamlessly
Actual: Frozen screen for 5 seconds, then continues

Error logs:
[See console excerpt...]
```

### 2. Suggest Features
- **Check existing discussions** first
- **Describe the problem** your feature solves
- **Provide use cases** - who benefits?
- **Consider performance impact**
- **Link to similar tools** if applicable

**Example Feature Request:**
```
Title: Add keyboard shortcuts for teacher controls

Problem: Teachers juggling wireless mics and laptops need faster controls
Use case: Teacher wants to launch poll without touching keyboard

Proposed solution:
- Alt+P: Launch poll
- Alt+S: Show confusion meter
- Alt+G: Generate quiz

Keyboard shortcuts vs UI buttons?
- UI buttons still available for all actions
- Shortcuts are optional, not replacement
```

### 3. Submit Code Changes

#### Setup Development Environment
```bash
# Clone repo
git clone https://github.com/your-org/EduSenseH.git
cd EduSenseH

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/awesome-feature

# Start dev server
npm run dev
```

#### Code Style Guidelines
- **Use ESLint** - `npm run lint` must pass
- **React style**:
  - Functional components only
  - Use hooks (useState, useEffect, useContext)
  - Props destructuring
  - Descriptive variable names
  
- **File naming**:
  - Components: PascalCase (Button.jsx)
  - Utilities: camelCase (helper.js)
  - Constants: UPPER_SNAKE_CASE
  
- **Comments**:
  - Explain WHY, not WHAT
  - Use TypeScript-style JSDoc for complex functions
  - Remove console.logs before committing

#### Example: Adding a Feature
```javascript
// ✅ GOOD
const SessionHeader = ({ sessionId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch session details on mount
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSession(sessionId);
        setSession(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, [sessionId]);

  return (
    <header className="...">
      {/* Header content */}
    </header>
  );
};

// ❌ AVOID
const sessionHeader = (props) => {
  let isLoading = false;
  
  // TODO: this might break
  useEffect(() => {
    fetchSession(props.sid).then(d => {
      console.log('got data', d); // Remove this!
      // ... complex logic here
    });
  }, []);
  
  return <header>{/*...*/}</header>;
};
```

#### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code reorganization
- `perf:` - Performance improvement
- `docs:` - Documentation
- `test:` - Test additions
- `chore:` - Maintenance

**Examples:**
```
feat: add transcript translation to Hindi

Students can now view live transcripts in Hindi by selecting
from language dropdown. Translation powered by Groq API.

Fixes #42
```

### 4. Submit Pull Request

1. **Update from main** - Ensure your branch is current
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Test thoroughly**
   ```bash
   npm run lint      # Fix style issues
   npm run dev       # Manual testing
   ```

3. **Write clear PR description**
   ```markdown
   ## What does this PR do?
   Adds real-time confusion detection via student sentiment analysis.

   ## How to test?
   1. Start a live class
   2. Raise a doubt or answer poll negatively
   3. Watch confusion meter increase

   ## Related issues
   Fixes #123
   Related to #456

   ## Screenshots/Videos
   [Before/after, demo GIF, etc.]
   ```

4. **Request review** from maintainers
5. **Respond to feedback** - Be open to suggestions
6. **Merge** - Maintainer will merge after approval

## 📋 Development Checklist

Before submitting:
- [ ] Code follows style guide (ESLint passes)
- [ ] No console.logs or debug code
- [ ] Comments explain complex logic
- [ ] Tests pass (if applicable)
- [ ] README/docs updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main
- [ ] No merge conflicts

## 🎯 Priority Features (Help Wanted!)

These would make great first contributions:

1. **Dark mode toggle** - Add comprehensive dark theme
2. **Accessibility improvements** - ARIA labels, keyboard nav
3. **Mobile responsiveness** - Better tablet/phone UI
4. **Test suite** - Jest/React Testing Library
5. **Performance monitoring** - Add analytics/logging
6. **UI components library** - Extract reusable components
7. **Documentation** - API docs, architecture diagrams
8. **Internationalization** - More language files

## 📚 Project Structure for Contributors

```
src/
├── pages/            # Page components (route-based)
├── components/       # Reusable UI components
├── context/          # Global state (Auth, Theme, etc)
├── lib/              # Utilities & API integrations
├── services/         # Business logic
└── locales/          # i18n translation files
```

### Adding a New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Create context if needed in `src/context/`
4. Add translation keys in `src/locales/*.json`

### Adding a New Component
1. Create file in `src/components/NewComponent.jsx`
2. Export from `src/components/index.js` (if indexing)
3. Add PropTypes or TypeScript comments
4. Document with JSDoc

### Adding a New API Integration
1. Create file in `src/lib/newService.js`
2. Export main function/class
3. Add error handling & logging
4. Document expected inputs/outputs

## 🐛 Debugging Tips

### Console Logging
```javascript
// Use prefixes for easy filtering
console.log('[LiveClass]', 'Starting transcription');
console.error('[Transcription]', 'WebSocket error:', error);
console.warn('[Translation]', 'Slow response:', duration, 'ms');
```

### React DevTools
- Install Chrome/Firefox React DevTools extension
- Inspect component props & state
- Track re-renders with Profiler
- Check context values in real-time

### Browser DevTools
- **Network tab**: Check API calls & WebSocket connections
- **Console tab**: Watch for errors & logs
- **Application tab**: Check localStorage, cookies, IndexedDB
- **Performance tab**: Identify bottlenecks

### VSCode Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- Thunder Client (REST API testing)

## 🚀 Release Process

Maintainers follow this process:

1. **Development** - Features merged to `main`
2. **Version bump** - Update version in package.json
3. **Changelog** - Document changes in CHANGELOG.md
4. **Tag release** - Create Git tag (v1.0.0)
5. **Build** - `npm run build` produces optimized bundle
6. **Deploy** - Push to production

Contributors don't need to worry about this!

## ❓ Getting Help

- **Discord**: Join our community server
- **Discussions**: GitHub Discussions tab
- **Issues**: Search existing issues or open new one
- **Email**: contributors@edusenseH.dev
- **Twitter**: @EduSenseH

## 🏆 Recognition

Contributors are recognized:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- GitHub contribution graph
- Feature credits in app

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make EduSenseH better!** 🎉

Happy coding! 💻

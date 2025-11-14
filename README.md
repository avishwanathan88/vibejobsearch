# VibeJobSearch 🎤💼

An AI-powered job search application with voice input capabilities and intelligent matching using subagents.

## Features

### 🎤 Voice-First Experience
- **Web Speech API Integration**: Real-time voice-to-text transcription
- **Continuous Listening**: Hands-free job searching
- **Natural Language Processing**: Search using conversational queries

### 🤖 AI Subagent Architecture
VibeJobSearch uses multiple specialized AI subagents working together:

1. **Keyword Analysis Agent** 🧠
   - Extracts technical skills from search queries
   - Determines experience level (junior, mid, senior)
   - Identifies job type preferences

2. **Job Matching Agent** 🎯
   - Scores jobs based on multiple criteria
   - Ranks results by relevance
   - Provides match reasoning

3. **Salary Analysis Agent** 💰
   - Analyzes salary ranges across positions
   - Filters by salary expectations
   - Provides market insights

4. **Location Optimizer Agent** 📍
   - Analyzes location distribution
   - Optimizes for remote work preferences
   - Provides geographic insights

### 💼 Smart Job Cards
- **Modern Glassmorphism UI**: Beautiful card-based interface
- **Smooth Animations**: Framer Motion powered transitions
- **Keyboard Navigation**: Arrow keys and spacebar support
- **Detailed Job Information**: Complete job descriptions, requirements, benefits
- **Interactive Elements**: Save, apply, and navigation controls

### 🔍 Advanced Search
- **Intelligent Filters**: Location, remote work, salary, job type
- **Quick Suggestions**: Pre-built search examples
- **Search Refinements**: AI-suggested improvements
- **Real-time Insights**: Live feedback from AI analysis

## Technology Stack

- **Frontend**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Voice Recognition**: Web Speech API
- **AI Architecture**: Custom subagent system
- **Data**: TypeScript interfaces with mock job listings

## Project Structure

```
vibejobsearch/
├── app/
│   ├── components/
│   │   ├── VoiceInput.tsx           # Voice recognition component
│   │   ├── JobCards.tsx             # Job display with navigation
│   │   ├── JobSearchInterface.tsx   # Main search interface
│   ├── page.tsx                     # Main application entry
├── data/
│   ├── jobListings.ts              # 10 realistic tech job listings
├── lib/
│   ├── aiSubagentSystem.ts         # AI subagent architecture
├── types/
│   ├── index.ts                    # TypeScript interfaces
├── hooks/
│   ├── useVoiceRecognition.ts      # Voice recognition hook
```

## Job Listings

The application includes 10 realistic tech job listings:

1. **Senior Full Stack Developer** - TechFlow Solutions (Remote, $140-180k)
2. **Machine Learning Engineer** - AI Innovations Inc. (NYC, $160-220k)
3. **Frontend Developer (React)** - StartupXYZ (Austin, $95-130k)
4. **DevOps Engineer** - CloudScale Systems (Seattle, $130-170k)
5. **Mobile App Developer** - MobileFirst Studios (LA, $110-150k)
6. **Data Scientist** - DataDriven Analytics (Boston, $120-165k)
7. **Backend Engineer (Go)** - MicroServices Corp (Denver, $125-160k)
8. **UI/UX Designer & Developer** - DesignTech Studio (Portland, $105-140k)
9. **Security Engineer** - CyberShield Technologies (DC, $145-190k)
10. **Junior Software Developer** - GrowthPath Technologies (Chicago, $70-90k)

## Usage

### Voice Commands
- **Search**: "Senior React Developer in San Francisco"
- **Filters**: "Remote Python jobs with 120k salary"
- **Navigation**: Use arrow keys or voice commands

### Text Search
- Type queries in natural language
- Use advanced filters for precise results
- Click example searches to get started

### Navigation
- **Keyboard**: Arrow keys ← → or Spacebar
- **Mouse**: Click Previous/Next buttons
- **Dots**: Click pagination dots to jump to specific jobs

## AI Subagent System

The subagent architecture processes searches through multiple stages:

1. **Query Analysis**: Breaks down natural language into searchable parameters
2. **Job Matching**: Scores and ranks jobs based on relevance
3. **Salary Filtering**: Applies salary constraints and market analysis  
4. **Location Optimization**: Handles location and remote work preferences
5. **Result Synthesis**: Combines all subagent outputs into final results

Each subagent operates independently and contributes insights that are combined into the final search experience.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Run development server**: `npm run dev`
4. **Open browser**: Navigate to `http://localhost:3000`

### Browser Compatibility

Voice recognition requires:
- Chrome/Chromium browsers (recommended)
- HTTPS connection (for production)
- Microphone permissions

## Example Searches

Try these voice or text searches:

- "Senior React Developer remote position"
- "Machine Learning Engineer in San Francisco"  
- "DevOps role with Kubernetes experience"
- "Entry level Python developer"
- "Data Scientist with 120k+ salary"
- "UI UX Designer at startup"

## Features in Detail

### Voice Input Component
- Real-time transcription display
- Visual feedback for listening state
- Automatic search triggering
- Error handling for browser compatibility

### Job Cards Interface
- Smooth slide animations between jobs
- Comprehensive job details display
- Interactive tag system
- Application tracking
- Keyboard accessibility

### AI Insights
- Search analysis breakdown
- Match reasoning display
- Salary market insights
- Location distribution data
- Refinement suggestions

## Development

### Key Components

1. **VoiceInput.tsx**: Handles Web Speech API integration
2. **JobCards.tsx**: Displays job listings with navigation
3. **JobSearchInterface.tsx**: Main search and filter interface
4. **aiSubagentSystem.ts**: Core AI logic and subagent coordination

### Type System

Comprehensive TypeScript interfaces for:
- Job postings with full details
- Search queries and filters
- AI subagent tasks and contexts
- Search results and insights

## Contributing

The project uses modern React patterns:
- Functional components with hooks
- TypeScript for type safety
- Tailwind for consistent styling
- Framer Motion for smooth animations

## Future Enhancements

- Real job API integration
- User account system
- Application tracking
- Advanced AI improvements
- Mobile app version
- Resume matching

## License

MIT License - feel free to use this project as a foundation for your own job search applications.

---

**VibeJobSearch** - Where voice meets opportunity! 🎤✨

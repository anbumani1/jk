# Intern Onboarding Management System

A SAP Cloud Application Programming (CAP) model application for managing intern onboarding processes.

## Features

- **Intern Management**: Track intern information, assignments, and progress
- **Mentor Assignment**: Assign mentors to interns and manage relationships
- **Task Management**: Create and track onboarding tasks with priorities and due dates
- **Department Organization**: Organize interns and mentors by departments
- **Status Tracking**: Monitor intern status and task completion

## Project Structure

```
intern-onboarding/
├── db/                     # Data model and sample data
│   ├── schema.cds         # Core data model definitions
│   └── data/              # Sample CSV data files
├── srv/                   # Service layer
│   ├── intern-service.cds # Service definitions
│   └── intern-service.js  # Service implementation
├── app/                   # UI applications (future)
└── package.json           # Project configuration
```

## Data Model

### Entities

- **Interns**: Core intern information with mentor assignments
- **Mentors**: Mentor profiles and their assigned interns
- **Tasks**: Onboarding tasks with status tracking
- **Departments**: Organizational structure

### Key Features

- Managed entities with automatic timestamps
- Association relationships between entities
- Custom actions for status updates and assignments
- Data validation and business logic

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- SAP CDS CLI

### Installation

1. Navigate to the project directory:
   ```bash
   cd intern-onboarding
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy the database:
   ```bash
   npm run deploy
   ```

4. Start the application:
   ```bash
   npm start
   ```

### Development

For development with auto-reload:
```bash
npm run watch
```

## API Endpoints

The service exposes the following main endpoints:

- `/odata/v4/intern-onboarding/Interns` - Intern management
- `/odata/v4/intern-onboarding/Mentors` - Mentor management  
- `/odata/v4/intern-onboarding/Tasks` - Task management
- `/odata/v4/intern-onboarding/Departments` - Department information

### Custom Actions

- `assignMentor(mentorId)` - Assign a mentor to an intern
- `updateStatus(status)` - Update intern status
- `markComplete()` - Mark a task as completed
- `updatePriority(priority)` - Update task priority

## Sample Data

The application includes sample data for:
- 4 Mentors across different departments
- 3 Interns with assigned mentors
- 6 Sample tasks with various statuses
- 5 Department definitions

## License

ISC

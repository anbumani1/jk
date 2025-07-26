namespace intern.onboarding;

using { managed, cuid } from '@sap/cds/common';

// Intern entity - represents an intern in the system
entity Interns : managed, cuid {
  firstName     : String(100) not null;
  lastName      : String(100) not null;
  email         : String(255) not null;
  department    : String(100);
  startDate     : Date not null;
  endDate       : Date;
  status        : String(20) default 'Active'; // Active, Inactive, Completed
  manager       : String(255);
  profilePicture: String(500); // URL to profile picture
  
  // Relationships
  tasks         : Composition of many Tasks on tasks.intern = $self;
  queries       : Composition of many Queries on queries.intern = $self;
}

// Tasks entity - represents onboarding tasks for interns
entity Tasks : managed, cuid {
  title         : String(200) not null;
  description   : String(1000);
  category      : String(50); // Onboarding, Training, Compliance, etc.
  priority      : String(10) default 'Medium'; // High, Medium, Low
  status        : String(20) default 'Pending'; // Pending, In Progress, Completed, Overdue
  dueDate       : Date;
  completedDate : Date;
  estimatedHours: Integer;
  actualHours   : Integer;
  
  // Relationships
  intern        : Association to Interns;
  guide         : Association to Guides;
}

// Guides entity - represents training guides and documentation
entity Guides : managed, cuid {
  title         : String(200) not null;
  description   : String(1000);
  content       : LargeString; // Main content of the guide
  category      : String(50); // SAP, HR, IT, Security, etc.
  difficulty    : String(20) default 'Beginner'; // Beginner, Intermediate, Advanced
  estimatedTime : Integer; // in minutes
  isActive      : Boolean default true;
  version       : String(10) default '1.0';
  
  // Relationships
  tasks         : Association to many Tasks on tasks.guide = $self;
}

// Queries entity - represents chat history and AI interactions
entity Queries : managed, cuid {
  question      : LargeString not null;
  answer        : LargeString;
  category      : String(50); // General, SAP, HR, IT, etc.
  confidence    : Decimal(3,2); // AI confidence score 0.00-1.00
  isResolved    : Boolean default false;
  feedback      : String(20); // Helpful, Not Helpful, Partially Helpful
  sessionId     : String(100); // To group related queries
  
  // Relationships
  intern        : Association to Interns;
}

// Default onboarding checklist items
entity ChecklistTemplates : managed, cuid {
  title         : String(200) not null;
  description   : String(1000);
  category      : String(50);
  isRequired    : Boolean default true;
  order         : Integer;
  department    : String(100); // If specific to a department
  estimatedDays : Integer; // Days from start date
}

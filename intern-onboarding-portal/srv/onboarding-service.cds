using { intern.onboarding as db } from '../db/schema';

service OnboardingService {
  
  // Main entities exposed as OData services
  entity Interns as projection on db.Interns {
    *,
    tasks : redirected to Tasks,
    queries : redirected to Queries
  } actions {
    action createOnboardingTasks() returns String;
  };
  
  entity Tasks as projection on db.Tasks {
    *,
    intern : redirected to Interns,
    guide : redirected to Guides
  } actions {
    action markCompleted() returns String;
    action updateProgress(actualHours: Integer, notes: String) returns String;
  };
  
  entity Guides as projection on db.Guides {
    *,
    tasks : redirected to Tasks
  };
  
  entity Queries as projection on db.Queries {
    *,
    intern : redirected to Interns
  };
  
  entity ChecklistTemplates as projection on db.ChecklistTemplates;
  
  // Views for dashboard
  view InternDashboard as select from db.Interns {
    ID,
    firstName,
    lastName,
    email,
    department,
    startDate,
    status,
    tasks.ID as taskId,
    tasks.title as taskTitle,
    tasks.status as taskStatus,
    tasks.dueDate as taskDueDate,
    tasks.priority as taskPriority
  };
  
  view TaskSummary as select from db.Tasks {
    intern.ID as internId,
    count(*) as totalTasks : Integer,
    count(case when status = 'Completed' then 1 end) as completedTasks : Integer,
    count(case when status = 'Pending' then 1 end) as pendingTasks : Integer,
    count(case when status = 'In Progress' then 1 end) as inProgressTasks : Integer
  } group by intern.ID;
  
  // Functions for analytics
  function getInternProgress(internId: String) returns {
    totalTasks: Integer;
    completedTasks: Integer;
    progressPercentage: Decimal(5,2);
    overdueTasks: Integer;
  };
  
  function getUpcomingDeadlines(internId: String, days: Integer) returns array of {
    taskId: String;
    title: String;
    dueDate: Date;
    priority: String;
  };
}

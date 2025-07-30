using { intern.onboarding as db } from '../db/schema';

service InternOnboardingService {
    
    @odata.draft.enabled
    @cds.redirection.target
    entity Interns as projection on db.Interns {
        *,
        mentor.firstName as mentorFirstName,
        mentor.lastName as mentorLastName
    } actions {
        action assignMentor(mentorId: UUID) returns Interns;
        action updateStatus(status: String) returns Interns;
    };
    
    @odata.draft.enabled
    entity Mentors as projection on db.Mentors {
        *,
        interns.firstName as internFirstName,
        interns.lastName as internLastName
    };
    
    @cds.redirection.target
    entity Tasks as projection on db.Tasks {
        *,
        intern.firstName as internFirstName,
        intern.lastName as internLastName
    } actions {
        action markComplete() returns Tasks;
        action updatePriority(priority: String) returns Tasks;
    };
    
    entity Departments as projection on db.Departments;
    
    // Read-only views
    @readonly
    entity InternOverview as select from db.Interns {
        ID,
        firstName,
        lastName,
        email,
        department,
        startDate,
        status,
        mentor.firstName as mentorFirstName,
        mentor.lastName as mentorLastName
    };
    
    @readonly
    entity TaskSummary as select from db.Tasks {
        status,
        priority,
        count(*) as taskCount : Integer
    } group by status, priority;
}

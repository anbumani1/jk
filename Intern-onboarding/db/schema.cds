namespace intern.onboarding;

using { managed, cuid } from '@sap/cds/common';

entity Interns : managed, cuid {
    firstName     : String(100) not null;
    lastName      : String(100) not null;
    email         : String(255) not null;
    department    : String(100);
    startDate     : Date;
    mentor        : Association to Mentors;
    status        : String(20) default 'Active';
    tasks         : Composition of many Tasks on tasks.intern = $self;
}

entity Mentors : managed, cuid {
    firstName     : String(100) not null;
    lastName      : String(100) not null;
    email         : String(255) not null;
    department    : String(100);
    interns       : Association to many Interns on interns.mentor = $self;
}

entity Tasks : managed, cuid {
    title         : String(200) not null;
    description   : String(1000);
    dueDate       : Date;
    status        : String(20) default 'Pending';
    priority      : String(10) default 'Medium';
    intern        : Association to Interns;
}

entity Departments : cuid {
    name          : String(100) not null;
    description   : String(500);
    head          : String(100);
}

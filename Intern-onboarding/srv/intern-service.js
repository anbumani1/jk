const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    
    const { Interns, Mentors, Tasks } = this.entities;
    
    // Action implementations for Interns
    this.on('assignMentor', Interns, async (req) => {
        const { ID } = req.params[0];
        const { mentorId } = req.data;
        
        await UPDATE(Interns).set({ mentor_ID: mentorId }).where({ ID });
        return await SELECT.one.from(Interns).where({ ID });
    });
    
    this.on('updateStatus', Interns, async (req) => {
        const { ID } = req.params[0];
        const { status } = req.data;
        
        await UPDATE(Interns).set({ status }).where({ ID });
        return await SELECT.one.from(Interns).where({ ID });
    });
    
    // Action implementations for Tasks
    this.on('markComplete', Tasks, async (req) => {
        const { ID } = req.params[0];
        
        await UPDATE(Tasks).set({ 
            status: 'Completed',
            modifiedAt: new Date()
        }).where({ ID });
        
        return await SELECT.one.from(Tasks).where({ ID });
    });
    
    this.on('updatePriority', Tasks, async (req) => {
        const { ID } = req.params[0];
        const { priority } = req.data;
        
        await UPDATE(Tasks).set({ priority }).where({ ID });
        return await SELECT.one.from(Tasks).where({ ID });
    });
    
    // Before create validations
    this.before('CREATE', Interns, async (req) => {
        const { email } = req.data;
        
        // Check for duplicate email
        const existing = await SELECT.one.from(Interns).where({ email });
        if (existing) {
            req.error(400, `Intern with email ${email} already exists`);
        }
    });
    
    this.before('CREATE', Mentors, async (req) => {
        const { email } = req.data;
        
        // Check for duplicate email
        const existing = await SELECT.one.from(Mentors).where({ email });
        if (existing) {
            req.error(400, `Mentor with email ${email} already exists`);
        }
    });
    
    // After read enhancements
    this.after('READ', Interns, (interns) => {
        if (Array.isArray(interns)) {
            interns.forEach(intern => {
                intern.fullName = `${intern.firstName} ${intern.lastName}`;
            });
        } else if (interns) {
            interns.fullName = `${interns.firstName} ${interns.lastName}`;
        }
    });
    
});

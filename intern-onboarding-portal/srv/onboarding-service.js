const cds = require('@sap/cds');

class OnboardingService extends cds.ApplicationService {
  
  async init() {
    
    // Handle intern creation and automatic task generation
    this.on('createOnboardingTasks', 'Interns', async (req) => {
      try {
        const internId = req.params[0];
        const intern = await SELECT.one.from('intern.onboarding.Interns').where({ ID: internId });
        
        if (!intern) {
          throw new Error('Intern not found');
        }
        
        // Get checklist templates for the intern's department
        const templates = await SELECT.from('intern.onboarding.ChecklistTemplates')
          .where({ 
            or: [
              { department: intern.department },
              { department: null }
            ]
          })
          .orderBy('order');
        
        // Create tasks based on templates
        const tasks = templates.map(template => {
          const dueDate = new Date(intern.startDate);
          dueDate.setDate(dueDate.getDate() + (template.estimatedDays || 7));
          
          return {
            title: template.title,
            description: template.description,
            category: template.category,
            priority: template.isRequired ? 'High' : 'Medium',
            status: 'Pending',
            dueDate: dueDate.toISOString().split('T')[0],
            intern_ID: internId
          };
        });
        
        await INSERT.into('intern.onboarding.Tasks').entries(tasks);
        
        return `Created ${tasks.length} onboarding tasks for ${intern.firstName} ${intern.lastName}`;
        
      } catch (error) {
        console.error('Error creating onboarding tasks:', error);
        throw new Error('Failed to create onboarding tasks: ' + error.message);
      }
    });
    
    // Handle task completion
    this.on('markCompleted', 'Tasks', async (req) => {
      try {
        const taskId = req.params[0];
        
        await UPDATE('intern.onboarding.Tasks')
          .set({ 
            status: 'Completed',
            completedDate: new Date().toISOString().split('T')[0]
          })
          .where({ ID: taskId });
        
        return 'Task marked as completed successfully';
        
      } catch (error) {
        console.error('Error marking task as completed:', error);
        throw new Error('Failed to mark task as completed');
      }
    });
    
    // Handle task progress updates
    this.on('updateProgress', 'Tasks', async (req) => {
      try {
        const taskId = req.params[0];
        const { actualHours, notes } = req.data;
        
        await UPDATE('intern.onboarding.Tasks')
          .set({ 
            actualHours: actualHours,
            status: 'In Progress'
          })
          .where({ ID: taskId });
        
        return 'Task progress updated successfully';
        
      } catch (error) {
        console.error('Error updating task progress:', error);
        throw new Error('Failed to update task progress');
      }
    });
    
    // Handle intern progress calculation
    this.on('getInternProgress', async (req) => {
      try {
        const { internId } = req.data;
        
        const tasks = await SELECT.from('intern.onboarding.Tasks')
          .where({ intern_ID: internId });
        
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'Completed').length;
        const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        
        // Calculate overdue tasks
        const today = new Date().toISOString().split('T')[0];
        const overdueTasks = tasks.filter(t => 
          t.status !== 'Completed' && t.dueDate && t.dueDate < today
        ).length;
        
        return {
          totalTasks,
          completedTasks,
          progressPercentage: Math.round(progressPercentage * 100) / 100,
          overdueTasks
        };
        
      } catch (error) {
        console.error('Error calculating intern progress:', error);
        throw new Error('Failed to calculate progress');
      }
    });
    
    // Handle upcoming deadlines
    this.on('getUpcomingDeadlines', async (req) => {
      try {
        const { internId, days } = req.data;
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + (days || 7));
        const futureDateStr = futureDate.toISOString().split('T')[0];
        
        const upcomingTasks = await SELECT.from('intern.onboarding.Tasks')
          .where({ 
            intern_ID: internId,
            status: { '!=': 'Completed' },
            dueDate: { '<=': futureDateStr }
          })
          .orderBy('dueDate');
        
        return upcomingTasks.map(task => ({
          taskId: task.ID,
          title: task.title,
          dueDate: task.dueDate,
          priority: task.priority
        }));
        
      } catch (error) {
        console.error('Error getting upcoming deadlines:', error);
        return [];
      }
    });
    
    // Add validation for intern creation
    this.before('CREATE', 'Interns', async (req) => {
      const { email } = req.data;
      
      // Check if intern with same email already exists
      const existing = await SELECT.one.from('intern.onboarding.Interns').where({ email });
      if (existing) {
        throw new Error(`Intern with email ${email} already exists`);
      }
      
      // Set default values
      if (!req.data.status) {
        req.data.status = 'Active';
      }
    });
    
    // Auto-create tasks when intern is created
    this.after('CREATE', 'Interns', async (data, req) => {
      try {
        // Trigger automatic task creation
        await this.run(SELECT.one.from('intern.onboarding.Interns').where({ ID: data.ID }))
          .then(() => {
            // Note: In a real implementation, you might want to call createOnboardingTasks here
            console.log(`Intern ${data.firstName} ${data.lastName} created successfully`);
          });
      } catch (error) {
        console.error('Error in after CREATE intern:', error);
      }
    });
    
    await super.init();
  }
}

module.exports = OnboardingService;

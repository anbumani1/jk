sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "intern/dashboard/model/models"
], function (Controller, MessageToast, JSONModel, models) {
    "use strict";

    return Controller.extend("intern.dashboard.controller.Dashboard", {

        onInit: function () {
            // Initialize models
            this.getView().setModel(models.createInternModel(), "internModel");
            this.getView().setModel(models.createChatModel(), "chatModel");
            
            // Load initial data
            this._loadInternData();
            this._loadProgressData();
            this._loadUpcomingDeadlines();
        },

        _loadInternData: function () {
            // In a real implementation, this would load from the OData service
            var oInternModel = this.getView().getModel("internModel");
            var sInternId = "1"; // This would come from user context
            
            // Simulate API call
            setTimeout(() => {
                oInternModel.setProperty("/currentIntern", {
                    ID: sInternId,
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@company.com",
                    department: "IT",
                    startDate: "2024-01-15",
                    status: "Active"
                });
            }, 100);
        },

        _loadProgressData: function () {
            var oInternModel = this.getView().getModel("internModel");
            var sInternId = oInternModel.getProperty("/currentIntern/ID");
            
            // Simulate API call to get progress
            setTimeout(() => {
                oInternModel.setProperty("/progress", {
                    totalTasks: 10,
                    completedTasks: 6,
                    progressPercentage: 60,
                    overdueTasks: 1
                });
            }, 200);
        },

        _loadUpcomingDeadlines: function () {
            var oInternModel = this.getView().getModel("internModel");
            
            // Simulate API call
            setTimeout(() => {
                oInternModel.setProperty("/upcomingDeadlines", [
                    {
                        taskId: "1",
                        title: "Complete SAP BTP Training",
                        dueDate: "2024-02-15",
                        priority: "High"
                    },
                    {
                        taskId: "2",
                        title: "Submit Security Training Certificate",
                        dueDate: "2024-02-20",
                        priority: "Medium"
                    }
                ]);
                
                oInternModel.setProperty("/recentActivity", [
                    {
                        title: "Completed HR Documentation",
                        description: "All required forms submitted",
                        timestamp: "2 hours ago"
                    },
                    {
                        title: "Started SAP Fiori Training",
                        description: "Module 1 completed",
                        timestamp: "1 day ago"
                    }
                ]);
            }, 300);
        },

        onOpenChatAssistant: function () {
            if (!this._oChatDialog) {
                this._oChatDialog = sap.ui.xmlfragment("intern.dashboard.view.ChatAssistant", this);
                this.getView().addDependent(this._oChatDialog);
            }
            this._oChatDialog.open();
            this._loadSuggestedQuestions();
        },

        onCloseChatAssistant: function () {
            this._oChatDialog.close();
        },

        onSendMessage: function () {
            var oChatModel = this.getView().getModel("chatModel");
            var sMessage = oChatModel.getProperty("/currentMessage");
            
            if (!sMessage.trim()) {
                return;
            }
            
            // Add user message to chat
            var aMessages = oChatModel.getProperty("/messages") || [];
            aMessages.push({
                text: sMessage,
                sender: "user",
                timestamp: new Date().toLocaleTimeString()
            });
            
            oChatModel.setProperty("/messages", aMessages);
            oChatModel.setProperty("/currentMessage", "");
            oChatModel.setProperty("/isLoading", true);
            
            // Call GenAI API
            this._callGenAIAPI(sMessage);
        },

        _callGenAIAPI: function (sQuestion) {
            var oChatModel = this.getView().getModel("chatModel");
            var oInternModel = this.getView().getModel("internModel");
            var sInternId = oInternModel.getProperty("/currentIntern/ID");
            var sSessionId = oChatModel.getProperty("/sessionId");
            
            // Make REST call to GenAI endpoint
            fetch("/genai/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: sQuestion,
                    internId: sInternId,
                    sessionId: sSessionId
                })
            })
            .then(response => response.json())
            .then(data => {
                var aMessages = oChatModel.getProperty("/messages");
                
                if (data.success) {
                    aMessages.push({
                        text: data.data.answer,
                        sender: "ai",
                        timestamp: new Date().toLocaleTimeString(),
                        confidence: data.data.confidence
                    });
                } else {
                    aMessages.push({
                        text: "I'm sorry, I encountered an error. Please try again.",
                        sender: "ai",
                        timestamp: new Date().toLocaleTimeString(),
                        confidence: 0.1
                    });
                }
                
                oChatModel.setProperty("/messages", aMessages);
                oChatModel.setProperty("/isLoading", false);
            })
            .catch(error => {
                console.error("GenAI API Error:", error);
                var aMessages = oChatModel.getProperty("/messages");
                aMessages.push({
                    text: "I'm sorry, I'm currently unavailable. Please try again later.",
                    sender: "ai",
                    timestamp: new Date().toLocaleTimeString(),
                    confidence: 0.1
                });
                oChatModel.setProperty("/messages", aMessages);
                oChatModel.setProperty("/isLoading", false);
            });
        },

        _loadSuggestedQuestions: function () {
            var oChatModel = this.getView().getModel("chatModel");
            var oInternModel = this.getView().getModel("internModel");
            var sInternId = oInternModel.getProperty("/currentIntern/ID");
            
            fetch(`/genai/suggestions/${sInternId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    oChatModel.setProperty("/suggestions", data.data);
                }
            })
            .catch(error => {
                console.error("Error loading suggestions:", error);
            });
        },

        onSuggestionPress: function (oEvent) {
            var sQuestion = oEvent.getSource().getText();
            var oChatModel = this.getView().getModel("chatModel");
            oChatModel.setProperty("/currentMessage", sQuestion);
            this.onSendMessage();
        },

        onViewTasks: function () {
            MessageToast.show("Navigate to Tasks view");
            // In a real implementation, this would navigate to the tasks view
        },

        onViewGuides: function () {
            MessageToast.show("Navigate to Guides view");
            // In a real implementation, this would navigate to the guides view
        },

        onViewTaskDetails: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("internModel");
            var sTaskId = oContext.getProperty("taskId");
            MessageToast.show("View details for task: " + sTaskId);
        },

        formatPriorityState: function (sPriority) {
            switch (sPriority) {
                case "High":
                    return "Error";
                case "Medium":
                    return "Warning";
                case "Low":
                    return "Success";
                default:
                    return "None";
            }
        }
    });
});

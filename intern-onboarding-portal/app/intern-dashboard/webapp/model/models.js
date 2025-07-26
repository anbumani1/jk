sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], function (JSONModel, Device) {
    "use strict";

    return {
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createInternModel: function () {
            var oModel = new JSONModel({
                currentIntern: {
                    ID: "1",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@company.com",
                    department: "IT",
                    startDate: "2024-01-15",
                    status: "Active"
                },
                progress: {
                    totalTasks: 0,
                    completedTasks: 0,
                    progressPercentage: 0,
                    overdueTasks: 0
                },
                upcomingDeadlines: []
            });
            return oModel;
        },

        createChatModel: function () {
            var oModel = new JSONModel({
                messages: [],
                currentMessage: "",
                isLoading: false,
                sessionId: "session_" + Date.now(),
                suggestions: []
            });
            return oModel;
        }
    };
});

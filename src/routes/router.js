let router = require("express").Router();
let userService = require('../services/user.service')
let rolesProfileService = require('../services/rolesProfiles.service')
let workflowService = require('../services/workflow.service')
let authService = require('../services/auth.service')

module.exports = (app) => {
    router.post("/login", authService.userLogin);
    /**USER ROUTES */
    router.post("/create-user",authService.authorizeRequest, userService.createNewUser);
    router.post("/create-profile", rolesProfileService.addProfiles);
    router.post("/create-workflow",authService.authorizeRequest, workflowService.addWorkflow);
    router.post("/create-workflow-step", workflowService.addWorkflowStep);
    router.post("/create-roles", rolesProfileService.addRoles);
  
    router.post("/get-profiles", rolesProfileService.getAllProfiles);
    router.post("/get-workflows", workflowService.getWorkflows);
    router.post("/get-workflow-steps", workflowService.getWorkflowSteps);
    
    app.use('/api/workflow', router);
}
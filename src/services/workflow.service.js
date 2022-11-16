const db = require('../models');
const sharedResponse = require('../shared/shared.response');
const validators = require('../validators/validate.duplicates');
const authService = require('./auth.service');

const Workflow = db.Workflow;
const Role = db.Role;
const Profile = db.Profile;
const WorkflowStep = db.WorkflowSteps;
const StagingAction = db.stagingActionModel;


exports.addWorkflow = async (req, res) => {
    let createResults
    try {
        let item = req.body;
        let roleExists = !await validators.detectDuplicates(Role, { id: item.role_id });
        let profileExists = !await validators.detectDuplicates(Profile, { id: item.profile_id });
        if (profileExists && roleExists) {
            let model = {
                workflow_name: item.workflow_name,
                role_id: item.role_id,
                profile_id: item.profile_id,
                status: item.status,
                is_system_role: 0,
                remarks: item.description,
                "destination_address": "/",
                "post_data_url": "/",
                "is_pending_approval": 0,
                created_by: authService.getUserTokenDetails()['email']  
            }
            let isDuplicate = (await validators.detectDuplicates(Workflow, { workflow_name: model.workflow_name }));
            if (isDuplicate) {
                console.log("><><><>><>><><<><< WORKFLOW PAYLOAD",model);
                createResults = await Workflow.create(model);
            } else {
                res.send(await sharedResponse.duplicateError({ message: 'Workflow already exists!' }));
            }
            if (createResults) {
                res.send(await sharedResponse.constructSuccessResponse(createResults));
            }
        } else {
            res.send(await sharedResponse.missingParamError({ message: 'Profile or role selected does\t exist' }))
        }
    } catch (error) {
        res.send(await sharedResponse.constructException(error));
    }
}
exports.addWorkflowStep = async (req, res) => {
    try {
        let item = req.body;
        let createResults;
        let roleExists = !await validators.detectDuplicates(Role, { id: item.role_id });
        let theresFinalStep = await WorkflowStep.findOne({ where: { workflow_id: item.workflow_id, is_final: 1 } })
        let roleAlreadyAssigned = await WorkflowStep.findOne({ where: { role_id: item.role_id, } })
        let model = {
            "step_name": item.step_name,
            "step_number": item.step_number,
            "workflow_id": item.workflow_id,
            "role_id": item.role_id,
            "is_final": item.is_final,
            "status": item.status,
            "remarks": item.remarks,
            "created_by": authService.getUserTokenDetails['email']? authService.getUserTokenDetails['email']:'ADMIN'
        }
        let stagingObject = {
            staging_data: JSON.stringify(model),
            is_complete: false,
            is_approved: false,
            is_rejected: false,
            destination_table: 'TB_WORKFLOW_STEPS',
            created_by: "admin",
        }
        if (!await validators.isWorkflowActive('/api/workflow/create-steps') && await validators.detectDuplicates(WorkflowStep, { step_name: item.step_name })) {
            if (!theresFinalStep) {
                if (!roleAlreadyAssigned) {
                    createResults = await WorkflowStep.create(model).catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the User."
                        });
                    });
                    if (createResults) {
                        res.send(await sharedResponse.constructSuccessResponse(createResults))
                    }
                } else {
                    res.status(500).send(await sharedResponse.duplicateError({ message: 'The role id supplied  has been assigned, try another role!' }));
                }
            } else {
                res.status(500).send(await sharedResponse.duplicateError({ message: 'This workflow already has final step!' }));
            }

        } else if (await validators.isWorkflowActive('/api/workflow/create-steps')) {
           
            createResults = await StagingAction.create(stagingObject).catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the User."
                });
            });
            createResults && res.send(await sharedResponse.constructSuccessResponse(createResults))
        } else {
            res.status(500).send({
                error: "Record already exists"
            })
        }
    } catch (error) {
        res.status(500).send(await sharedResponse.constructException(error));
    }

}
exports.getWorkflows = async (req, res) => {
    try {
        let resultData = await Workflow.findAll({
            includes: {
                model: WorkflowStep,
                as: 'workflowsteps'
            }
        });
        console.log(resultData);
        if (resultData) {
            res.send(await sharedResponse.constructSuccessResponse(resultData))
        }
    } catch (error) {
        res.status(500).send(await sharedResponse.constructException(error));
    }
}
exports.getWorkflowSteps = async (req, res) => {
    let params = req.body
    try {
        let resultData = await WorkflowStep.findAll({ where: { workflow_id: params.workflow } });
        console.log(resultData);
        if (resultData) {
            res.send(await sharedResponse.constructSuccessResponse(resultData))
        }
    } catch (error) {
        res.status(500).send(await sharedResponse.constructException(error));
    }
}



const { sequelize } = require('../models');
const db = require('../models');
const sharedResponse = require('../shared/shared.response');
const validators = require('../validators/validate.duplicates');
const authService = require('./auth.service');

const User = db.userModel;
const Staging = db.stagingActionModel;
const Role = db.Role;
const RolesInProfile = db.RolesInProfile;
const WorkflowSteps = db.WorkflowSteps;
exports.getPendingActions = async (req, res) => {
    //GET actions if
    //user feting has the roles associated with the workflow step 
    try {
        let pendingItemList = await Staging.findAll(
            { where: { is_complete: 0, is_rejected: 0, is_approved: 0 } }
        );
        console.log(pendingItemList);
        pendingItemList && res.send(await sharedResponse.constructSuccessResponse(pendingItemList))
    } catch (error) {
        res.send(await sharedResponse.constructException(error));
    }
}
exports.approvePendingAction = async (req, res) => {
    console.log(req);
    let myData = req.body
    let destination_table = myData.destination_table.slice(0, -1) + 's';
    myData.destination_table = destination_table;
    try {
        let stagingRecord = await Staging.findOne({ where: { id: myData.id } });
        let isStepFinal = await WorkflowSteps.findOne({ where: { is_final: 1, id:stagingRecord?.toJSON()['step_id'] } });
        // console.log("%%%%%%%%%%%%%%%%%", isStepFinal);
        if (isStepFinal) {
            try {
                let approveResult = await sequelize
                .query(`INSERT INTO ${myData.destination_table}(${Object.keys(JSON.parse(myData.staging_data))})
        VALUES(${JSON.stringify(Object.values(JSON.parse(myData.staging_data))).replace('[', '').replace(']', '')})`);
            if (approveResult) {
                myData['is_complete'] = 1
                myData['is_rejected'] = 0
                myData['is_approved'] = 1

                let updateStaging = await Staging.update(myData, { where: { id: myData.id } })
                updateStaging && res.send(await sharedResponse.constructSuccessResponse(approveResult))
            }
            } catch (error) {
                res.send(await sharedResponse.constructException(error))
            }
        }else{
            myData['is_complete'] = 0
            myData['is_rejected'] = 0
            myData['is_approved'] = 0

            let updateStaging = await Staging.update(myData, { where: { id: myData.id } })
            updateStaging && res.send(await sharedResponse.constructSuccessResponse({message:"First approval successful, Pending next approval"})) 
        }

    } catch (error) {
        res.send(await sharedResponse.constructException(error))
    }
}
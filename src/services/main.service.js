const { sequelize } = require('../models');
const db = require('../models');
const sharedResponse = require('../shared/shared.response');
const validators = require('../validators/validate.duplicates');
const authService = require('./auth.service');

const User = db.userModel;
const Staging = db.stagingActionModel;
const Role = db.Role;
const RolesInProfile = db.RolesInProfile;



exports.getPendingActions = async (req, res) => {
    //GET aions if
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
    try {
        let approveResult = await sequelize.query(`INSERT INTO ${myData.destination_table}(${Object.keys(JSON.parse(myData.staging_data))}) VALUES(${String(Object.values(JSON.parse(myData.staging_data)))})`);
        console.log(approveResult);
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

}
const db = require('../models');
const sharedResponse = require('../shared/shared.response');
const validators = require('../validators/validate.duplicates');
const authService = require('./auth.service');

const User = db.userModel;
const Staging = db.stagingActionModel;
const Role = db.Role;
const RolesInProfile = db.RolesInProfile;



exports.getPendingActions = (req, res) =>{

}
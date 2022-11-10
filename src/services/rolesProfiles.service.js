const db = require('../models');
const sharedResponse = require('../shared/shared.response');
const validators = require('../validators/validate.duplicates');
const authService = require('./auth.service');
const Profile = db.Profile;
const Role = db.Role;
const RolesInProfile = db.RolesInProfile;
exports.addProfiles = async (req, res) => {
    let createResults
    try {
        let item = req.body;
        let model = {
            profile_name: item.profile_name,
            created_by: authService.getUserTokenDetails()['email'],
            status: item.status,
            remarks: item.description,
        }
        let isDuplicate = (await validators.detectDuplicates(Profile, { profile_name: model.profile_name }));
        if (isDuplicate) {
            createResults = await Profile.create(model);
        } else {
            res.send(await sharedResponse.duplicateError({ message: 'Profile name already exists!' }));
        }
        if (createResults) {
            res.send(await sharedResponse.constructSuccessResponse(createResults));
        }
    } catch (error) {
        res.send(await sharedResponse.constructException(error));
    }
}
exports.getAllProfiles = async (req, res) => {
    let { page, perPage } = req.body
    try {
        let condition = {
            offset: perPage * page,
            limit: perPage
        };
        let profiles = await Profile.findAll(condition).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving data."
            });
        });
        if (profiles) {
            res.send(await sharedResponse.constructSuccessResponse(profiles));
        }
    } catch (error) {
        res.send(await sharedResponse.constructException(error));
    }

};
exports.getProfile = (req, res) => {
    const id = req.params.id;

    Profile.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Product with id=" + id
            });
        });
};
exports.updateProfile = (req, res) => {
    try {
        const id = req.body.id;
        Profile.update(req.body, {
            where: {
                id: id
            }
        }).then(num => {
            if (num == 1) {
                res.status(200).send(sharedResponse.constructFailedResponse());
            } else {
                res.send({
                    message: `Cannot update Profile with id=${id}. Maybe Profile was not found or request is empty!`
                });
            }
        })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating Profile with id=" + id
                });
            });
    } catch (error) {
        res.status(500).send({
            message: "Processing failed while creating Profile",
            resp_code: "02"
        });
    }
};
exports.deleteProfile = (req, res) => {
    const id = req.body.id;
    Profile.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                let message = "Profile was deleted successfully!"
                res.send(sharedResponse.constructFailedResponse(message));
            } else {
                res.send({
                    message: `Cannot delete Profile with id=${id}. Maybe Profile was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Profile with id=" + id
            });
        });
};
exports.deleteAll = async (req, res) => {
    Profile.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} Profile were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Profile."
            });
        });
};
let insertsFunc = (data, res) => {
    RolesInProfile.create(data).then(response => {
        res.send({
            // data: response ? response : null,
            resp_code: "00",
            resp_message: "Successful"
        })
    }).catch((err) => {
        res.send({
            resp_code: "01",
            message: err.message
        })
    })

}
exports.assignRoles = async (req, res) => {
    let item = req.body
    let insertData
    try {

        item.roles.map(element => {
            Role.findOne({ where: { id: element.role_id } }).then(itemD => {
                // console.log('}{}{}{}{}{}{}{}', item);
                insertData = {
                    profile_id: item.profile_id,
                    role_id: element.role_id,
                    role_name: itemD.toJSON()['role_name'],
                    is_pending_approval: 0,
                    // created_by:'',// authService.getUserTokenDetails()['email'],
                    status: 1
                }
                insertsFunc(insertData, res)
            });
        })

    } catch (error) {
        res.send(await sharedResponse.constructException(error))
    }
    // next();
}
exports.addRoles = async (req, res) => {
    let createResults;
    try {
        let item = req.body;
        let model = {
            role_name: item.role_name,
            created_by: "admin", //user['username']
            status: item.status,
            remarks: item.description,
            "is_system_role": 0,
            "destination_address": "/",
            "post_data_url": '/',
            "can_create_workflow": 0,
            "soft_delete": 1
        }
        let isDuplicate = (await validators.detectDuplicates(Role, { role_name: model.role_name }));
        if (isDuplicate) {
            createResults = await Role.create(model);
        } else {
            res.send(await sharedResponse.duplicateError({ message: 'Role name already exists!' }));
        }
        if (createResults) {
            res.send(await sharedResponse.constructSuccessResponse(createResults));
        }
    } catch (error) {
        res.send(await sharedResponse.constructException(error));
    }
}
/**UNTESTED */
exports.assignUserProfile = async (req, res) => {
    try {
        let itemRequest = req.body;
        let model = {
            is_active: itemRequest.status,
            created_by: "admin",
            user_email: itemRequest.user_email,
            profile_id: itemRequest.profile_id
        }
        let assignedProfile = await userProfile.create(model).catch(error => {
            req.send({
                resp_code: '01',
                resp_message: error.message
            })
        })
        if (assignedProfile) {
            res.send(await await sharedResponse.constructSuccessResponse());
        }
    } catch (error) {
        res.send(await sharedResponse.constructException(error))
    }
}
/**tests filed  */
exports.getRolesInProfile = async (req, res) => {
   let rolesInProfile = await RolesInProfile.findAll({where: { profile_id: req.body.profile } })
   .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data"
        });
    });
    rolesInProfile && res.send(await sharedResponse.constructSuccessResponse(rolesInProfile));
}

exports.getUsersInProfile = async (req, res) => {
    try {
        const profileId = req.body.profile_id;
        const result = await sequelize.query(`SELECT U.email,U.username, U.other_names, U.national_id, U.phone_number, U.account_status, PR.profile_name from sys_users U JOIN tb_user_profiles UP ON U.email = UP.user_email JOIN tb_profiles PR  WHERE PR.id=1`) //inner join tb_profiles PR ON UP.profile_id= ${profileId}`);
        if (result) {
            res.send({
                data: result,
                resp_code: '00'
            })
        }
    } catch (error) {
        res.send({
            data: error,
            resp_code: '01'
        })
    }
}
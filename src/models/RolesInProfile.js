module.exports = (sequelize, Sequelize) => {
    const RolesInProfile = sequelize.define("TB_ROLES_IN_PROFILE", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        profile_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false
            // unique: true
        },
        role_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false
            // unique: true
        },
        is_pending_approval:{
         type:Sequelize.TINYINT,
         allowNull: false
        },
        status:{
         type:Sequelize.TINYINT,
         allowNull: false
        },
        remarks:{
            type: Sequelize.TEXT,
        },
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'approved_on'
     });
    return RolesInProfile;
};

module.exports = (sequelize, Sequelize) => {
    const Workflow = sequelize.define("TB_WORKFLOW", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        workflow_name: {
            type: Sequelize.STRING(255),
            allowNull: false
            // unique: true
        },
        destination_address: {
            type: Sequelize.STRING(255),
            allowNull: true
            // unique: true
        },
        role_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false
            // unique: true
        },
        profile_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false
            // unique: true
        },
        is_pending_approval:{
         type:Sequelize.TINYINT,
         allowNull: true
        },
        status:{
         type:Sequelize.TINYINT,
         allowNull: false,
         defaultValue: 0
        },
        is_system_role:{
         type:Sequelize.TINYINT,
         allowNull: false,
         defaultValue: 1
        },
        destination_address:{
            type:Sequelize.STRING(255),
            allowNull: true
            },
        post_data_url:{
            type:Sequelize.STRING(255),
            allowNull: true
            },
        soft_delete: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: 1
            // unique: true
        },
    
        created_by:{
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue:'system'
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
    return Workflow;
};
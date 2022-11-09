module.exports = (sequelize, Sequelize) => {
    const WorkflowSteps = sequelize.define("TB_WORKFLOW_STEPS", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        step_name: {
            type: Sequelize.STRING(255),
            allowNull: false
            // unique: true
        },
        step_number: {
            type: Sequelize.INTEGER(5),
            allowNull: true
            // unique: true
        },
        workflow_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false
            // unique: true
        },
        role_id: {
            type: Sequelize.INTEGER(15),
            allowNull: false
            // unique: true
        },
        is_final:{
         type:Sequelize.TINYINT,
         allowNull: false
        },
        status:{
         type:Sequelize.TINYINT,
         allowNull: false
        },
        soft_delete: {
            type: Sequelize.TEXT,
            allowNull: false,
            defaultValue: 1
            // unique: true
        },
    
        created_by:{
            type: Sequelize.STRING,
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
    return WorkflowSteps;
};
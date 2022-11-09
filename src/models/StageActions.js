module.exports = (sequelize, Sequelize) => {
    const StagingAction = sequelize.define("TB_STAGING_ACTION", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        staging_data: {
            type: Sequelize.TEXT,
            allowNull: false
            // unique: true
        },
        is_approved: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        is_rejected: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        is_complete: {
            type: Sequelize.TINYINT,
            allowNull: false
        },
        created_by:{
            type: Sequelize.STRING,
            allowNull: false
        },
        remarks:{
            type: Sequelize.TEXT,
        },

        staging_id: {
            type: Sequelize.INTEGER(22)
        },
        destination_table: {
            type: Sequelize.STRING(255)
        },
        step_id: {
            type: Sequelize.INTEGER(22)
        }
    },
    {
       sequelize,
       timestamps: true,
       createdAt: true,
       updatedAt: 'approved_on'
     });
    return StagingAction;
};
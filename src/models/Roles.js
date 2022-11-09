module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("TB_ROLES", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        role_name: {
            type: Sequelize.STRING(255),
            allowNull: false
            // unique: true
        },
        can_create_workflow:{
         type:Sequelize.TINYINT,
         allowNull: false
        },
        status:{
         type:Sequelize.TINYINT,
         allowNull: false
        },
        is_system_role:{
         type:Sequelize.TINYINT,
         allowNull: false
        },
        destination_address:{
            type:Sequelize.STRING(255),
            allowNull: false
            },
        post_data_url:{
            type:Sequelize.STRING(255),
            allowNull: false
            },
        soft_delete: {
            type: Sequelize.TEXT,
            allowNull: false
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
    return Role;
};
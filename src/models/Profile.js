module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("TB_PROFILES", {
       id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        profile_name: {
            type: Sequelize.STRING(255),
            // allowNull: false
            // unique: true
        },
        soft_delete: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue:1
            // unique: true
        },
    
        created_by:{
            type: Sequelize.STRING,
            allowNull: false
        },
        status:{
            type: Sequelize.TINYINT,
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

    //  Profile.upsert = (data) => {
    //     return Profile.findOrCreate({where: {profile_name: data.profile_name}, defaults: create});
    //   };
    return Profile;
};
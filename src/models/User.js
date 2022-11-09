module.exports = (sequelize, Sequelize) => {
    // const employeeInstance = require('../controllers/global.controller')
     const User = sequelize.define("TB_USERS", {
        id: {
            
             type: Sequelize.INTEGER,
             allowNull: false,
             autoIncrement: true,
             primaryKey: true
         },
         username: {
             type: Sequelize.STRING,
             allowNull: false
         },
         surname: {
             type: Sequelize.STRING
         },
         first_name: {
             type: Sequelize.STRING
         },
         middle_name: {
             type: Sequelize.STRING
         },
      
         email: {
             type: Sequelize.STRING,
             allowNull: false,
             unique:true
         },
         national_id: {
             type: Sequelize.STRING,
             allowNull: false
         },
         phone_number: {
             type: Sequelize.STRING,
             allowNull: false
         },
         reset_code: {
             type: Sequelize.STRING
         },
         password: {
             type: Sequelize.STRING(64),
             allowNull: false
         },
         activation_code: {
             type: Sequelize.STRING(103)
         },
         account_status: {
             type: Sequelize.INTEGER(2)
         },
         approve_remarks: {
             type: Sequelize.TEXT
         },
         login_trials: {
             type: Sequelize.INTEGER(11)
         },
         active: {
             type: Sequelize.INTEGER(2)
         },
         account_type_id: {
             type: Sequelize.INTEGER(2)
         },
         profile_id: {
             type: Sequelize.INTEGER(11)
         },
         user_type: {
             type: Sequelize.STRING
         },
         last_login: {
             type: Sequelize.DATE
         }
     },
     {
        sequelize,
        timestamps: true,
        createdAt: true,
        updatedAt: 'updateTimestamp'
      } 
     );
    //  employeeInstance(Staff)
     return User;
 };
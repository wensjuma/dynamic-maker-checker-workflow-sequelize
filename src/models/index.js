const dbConfig = require("../../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userModel = require("./User")(sequelize, Sequelize);
db.stagingActionModel = require("./StageActions")(sequelize, Sequelize);

const Workflow = require("./Workflow")(sequelize, Sequelize)
const WorkflowSteps = require("./WorkflowStep")(sequelize, Sequelize)

db.Role = require("./Roles")(sequelize, Sequelize);
db.Profile = require("./Profile")(sequelize, Sequelize);
db.RolesInProfile = require("./RolesInProfile")(sequelize, Sequelize);



Workflow.hasMany(WorkflowSteps, { foreignKey: 'workflow_id', as: 'workflow' })
WorkflowSteps.belongsTo(Workflow, { foreignKey: 'workflow_id', as: 'workflowsteps' })
db.Workflow = Workflow;
db.WorkflowSteps = WorkflowSteps;


module.exports = db;


const { where } = require('sequelize');
const db = require('../models');

const User = db.userModel;
const Staging = db.stagingActionModel;
const Workflow = db.Workflow;
const WorkflowSteps = db.WorkflowSteps;

exports.isDupliteStaging = async (itemValue) => {
  let fetchResult = await Staging.findOne({ where: { staging_data: itemValue } });
  // let checkResult = fetchResult.every(el => JSON.parse(el.staging_data).email !== itemValue['email'] && JSON.parse(el.staging_data).national_id !== itemValue['national_id'])
  console.log(":::::", Boolean(fetchResult?.toJSON()));
  return Boolean(fetchResult)
}
exports.detectDuplicates = async (tableName, items) => {
  let foundDuplicate = await tableName.findOne({ where: items });
  console.log(foundDuplicate?.toJSON());
  return foundDuplicate ? false : true
}
isWorkflowActive = async (details) => {
  let activeWorkflow = await Workflow.findOne({
    where: {
      destination_address: details,
      status: 1
    }
  });
  console.log(activeWorkflow);
  return activeWorkflow
}
exports.isWorkflowActive = async (details) => {
  let activeWorkflow = await Workflow.findOne({
    where: {
      destination_address: details,
      status: 1
    }
  });
  // console.log('>>>>>>>>>>>>>', activeWorkflow?.toJSON());
  return activeWorkflow && true
}
exports.checkFinalSteps = async (workflow) => {
  let fetchedWorkflowSteps
  let myWorkflow = await isWorkflowActive(workflow);
  // console.log('?????????????', myWorkflow?.toJSON());
  if (myWorkflow) {
     fetchedWorkflowSteps = await WorkflowSteps.findOne({
      where: {
        workflow_id: myWorkflow?.['id'],
        is_final: 1
      }
    })
  }
 
  return fetchedWorkflowSteps?.toJSON();
}

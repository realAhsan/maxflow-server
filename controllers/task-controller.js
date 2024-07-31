const Task = require("../models/task");
const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().required(),
  userId: Joi.string().required(),
  priority: Joi.string().required(),
});

async function addNewTask(req, res) {
  const { title, description, status, userId, priority } = req.body;
  console.log(req.body);
  const { error } = taskSchema.validate({
    title,
    description,
    status,
    userId,
    priority,
  });
  if (error) {
    return res
      .status(400)
      .json({ message: "validation error user", success: false });
  }

  try {
    console.log("entered try");
    const newTask = Task.create({
      title,
      description,
      status,
      userId,
      priority,
    });
    console.log("above if");

    if (newTask) {
      console.log("inside if");

      return res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    } else {
      console.log("inside else");

      console.log("req1");
      return res
        .status(400)
        .json({ message: "something went Wrong at else", success: false });
    }
  } catch (error) {
    console.log("req3");
    console.log(error);

    return res
      .status(400)
      .json({ message: "something went Wrong try catch 2", success: false });
  }
}

async function getAllTasks(req, res) {
  const { id } = req.params;
  console.log(id);
  try {
    const allUsertasks = await Task.find({ userId: id });
    if (allUsertasks) {
      return res.status(200).json({
        success: true,
        message: "Tasks retrieved successfully",
        data: allUsertasks,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No tasks found", success: false });
    }
  } catch (error) {
    return res.status(404).json({ message: "No tasks found", success: false });
  }
}

async function updateTask(req, res) {
  const { title, description, status, userId, priority, _id } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(_id, {
      title: title,
      description: description,
      status: status,
      userId: userId,
      priority: priority,
    });
    if (updatedTask) {
      return res.status(200).json({
        success: true,
        message: "Task updated successfully",
      });
    } else {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "something went wrong", success: false });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    if (!id) {
      return res
        .status(400)
        .json({ message: "Task id is required", success: false });
    }
    const response = await Task.findByIdAndDelete(id);
    if (!response) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    return res.status(200).json({
      message: "Task deleted successfully",
      success: false,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "something went wrong", success: false });
  }
}

module.exports = { getAllTasks, addNewTask, deleteTask, updateTask };

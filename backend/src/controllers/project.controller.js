import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject
} from "../services/project.service.js";

export const listProjects = async (req, res) => {
  const data = await getProjects(req.query);
  res.json({ success: true, data });
};

export const getProject = async (req, res) => {
  const data = await getProjectById(req.params.id);
  res.json({ success: true, data });
};

export const storeProject = async (req, res) => {
  const data = await createProject(req.validated.body);
  res.status(201).json({ success: true, message: "Project created", data });
};

export const editProject = async (req, res) => {
  const data = await updateProject(req.params.id, req.validated.body);
  res.json({ success: true, message: "Project updated", data });
};

export const destroyProject = async (req, res) => {
  await deleteProject(req.params.id);
  res.json({ success: true, message: "Project deleted" });
};

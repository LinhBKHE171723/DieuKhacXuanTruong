import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContactStatus
} from "../services/contact.service.js";

export const createPublicContact = async (req, res) => {
  const data = await createContact(req.validated.body);
  res.status(201).json({ success: true, message: "Contact submitted", data });
};

export const listContacts = async (req, res) => {
  const data = await getContacts(req.query);
  res.json({ success: true, data });
};

export const getContact = async (req, res) => {
  const data = await getContactById(req.params.id);
  res.json({ success: true, data });
};

export const editContactStatus = async (req, res) => {
  const data = await updateContactStatus(req.params.id, req.validated.body);
  res.json({ success: true, message: "Contact updated", data });
};

export const destroyContact = async (req, res) => {
  await deleteContact(req.params.id);
  res.json({ success: true, message: "Contact deleted" });
};

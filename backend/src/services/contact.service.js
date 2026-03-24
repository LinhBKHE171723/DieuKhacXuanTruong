import { Contact } from "../models/index.js";
import { ApiError } from "../utils/apiError.js";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";
import { sanitizePlainText } from "../utils/sanitize.js";

const serializeContact = (contact) => contact.toJSON();

export const createContact = async (payload) => {
  const contact = await Contact.create({
    name: sanitizePlainText(payload.name),
    phone: sanitizePlainText(payload.phone || ""),
    email: sanitizePlainText(payload.email || ""),
    subject: sanitizePlainText(payload.subject || ""),
    message: sanitizePlainText(payload.message)
  });

  return serializeContact(contact);
};

export const getContacts = async (query = {}) => {
  const { page, limit, offset } = getPagination(query.page, query.limit || 12);
  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  const [count, rows] = await Promise.all([
    Contact.countDocuments(where),
    Contact.find(where)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
  ]);

  return {
    items: rows.map(serializeContact),
    pagination: buildPaginationMeta(count, page, limit)
  };
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }
  return serializeContact(contact);
};

export const updateContactStatus = async (id, payload) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  contact.set({
    status: payload.status,
    notes: sanitizePlainText(payload.notes || "")
  });
  await contact.save();

  return serializeContact(contact);
};

export const deleteContact = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  await contact.deleteOne();
};

const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact || null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const newContacts = [...contacts.slice(0, index), ...contacts.slice(index + 1)];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    return contacts[index];
}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = { name, email, phone, id: crypto.randomUUID() };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
};

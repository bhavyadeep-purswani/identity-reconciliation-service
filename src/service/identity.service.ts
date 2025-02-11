import { Contact, LinkPrecedence } from "@prisma/client";
import { createContact, findAllSecondaryContacts, findPrimaryContacts, updateContact } from "../repositories/contact.repository";

export const identifyService = async (
    email?: string,
    phoneNumber?: string
): Promise<Contact & { linkedContacts: Contact[] }> => {
    // Fetch all associated primary contacts
    let contacts = await findPrimaryContacts(email, phoneNumber) ?? [];

    // Handle based on the number of primary contacts
    switch (contacts.length) {
        // If no primary contact, create a new one
        case 0:
            return createNewContact(email, phoneNumber);

        // If there is one primary contact, use it to fetch the secondary contacts, add the new contact if required
        case 1:
            return handleSinglePrimaryContact(contacts[0], email, phoneNumber);

        // If two primary contacts exists, convert the one created last to secondary along with its associated secondary contacts
        default:
            return handleMultipePrimaryContact(contacts, email, phoneNumber);
    }
}

const createNewContact = async (
    email?: string,
    phoneNumber?: string
): Promise<Contact & { linkedContacts: Contact[] }> => {
    return { ...await createContact(LinkPrecedence.primary, email, phoneNumber), linkedContacts: [] };
}

const handleSinglePrimaryContact = async (
    primaryContact: Contact,
    email?: string,
    phoneNumber?: string
): Promise<Contact & { linkedContacts: Contact[] }> => {
    // Fetch all secondary contacts associated to the primary account
    let secondaryContacts = await findAllSecondaryContacts(primaryContact.id);

    // Check if phone number and email already exists
    let phoneNumberExists = false, emailExists = false;
    [...(secondaryContacts ?? []), primaryContact].forEach((value) => {
        phoneNumberExists = phoneNumberExists || value.phoneNumber === phoneNumber;
        emailExists = emailExists || value.email === email;
    })

    // If either of them doesn't exists, create the new contact
    if (!phoneNumberExists || !emailExists) {
        let newContact = await createSecondaryContact(primaryContact.id, email, phoneNumber);
        return { ...primaryContact, linkedContacts: [...(secondaryContacts ?? []), newContact] };
    }

    return { ...primaryContact, linkedContacts: [...(secondaryContacts ?? [])] };
}

const handleMultipePrimaryContact = async (
    primaryContacts: Contact[],
    email?: string,
    phoneNumber?: string
): Promise<Contact & { linkedContacts: Contact[] }> => {
    // Use the first contact as primary contact (the list is sorted by create time)
    let primaryContact = primaryContacts[0];

    // Find any secondary contacts pointing to the duplicate primary
    let secondaryContactsOfDuplicatePrimary = await findAllSecondaryContacts(primaryContacts[1].id) ?? [];

    // Update all associated contacts to secondary and link to the new primary
    for (let contact of [...secondaryContactsOfDuplicatePrimary, primaryContacts[1]]) {
        await updateContact(contact.id, LinkPrecedence.secondary, contact.email, contact.phoneNumber, primaryContact.id);
    }

    // Handle it further as if there was only one primary contact
    return handleSinglePrimaryContact(primaryContact, email, phoneNumber);
}

const createSecondaryContact = async (
    linkedContactId: number,
    email?: string,
    phoneNumber?: string
): Promise<Contact> => {
    return createContact(LinkPrecedence.secondary, email, phoneNumber, linkedContactId);
}
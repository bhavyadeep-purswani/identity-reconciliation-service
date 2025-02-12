import { Contact, LinkPrecedence } from "@prisma/client";
import { createContact, findAllSecondaryContacts, findContacts, getContact, updateContact, updateContactToSecondary } from "../repositories/contact.repository";

export const identifyService = async (
    email?: string,
    phoneNumber?: string
): Promise<Contact & { linkedContacts: Contact[] }> => {
    // Fetch all associated contacts
    let contacts = await findContacts(email, phoneNumber) ?? [];

    let contactIds = new Set([...contacts.map(value => value.id)]);

    let remainingPrimaryContactIds = new Set([...contacts.map(value => value.linkedId).filter(value => value && !contactIds.has(value)).filter(value => value != null)]);

    for (let primaryContactId of remainingPrimaryContactIds) {
        let priamryContact = await getContact(primaryContactId);
        if (priamryContact) {
            contacts.push(priamryContact)
        }
    }

    let allPrimaryContacts = contacts.filter((value) => value.linkPrecedence === "primary").sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Handle based on the number of primary contacts
    switch (allPrimaryContacts.length) {
        // If no primary contact, create a new one
        case 0:
            return createNewContact(email, phoneNumber);

        // If there is one primary contact, use it to fetch the secondary contacts, add the new contact if required
        case 1:
            return handleSinglePrimaryContact(allPrimaryContacts[0], email, phoneNumber);

        // If two primary contacts exists, convert the one created last to secondary along with its associated secondary contacts
        default:
            return handleMultipePrimaryContact(allPrimaryContacts, email, phoneNumber);
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

    // Update all associated contacts to secondary and link to the new primary
    // There can be atmost two primary contacts
    await updateContactToSecondary(primaryContacts[1].id, primaryContact.id);

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
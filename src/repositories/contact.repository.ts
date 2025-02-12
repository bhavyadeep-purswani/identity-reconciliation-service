import { Contact, LinkPrecedence } from "@prisma/client";
import { prisma } from "../lib/prisma";

// Create
export const createContact = async (
    linkPrecedence: LinkPrecedence,
    email?: string, phoneNumber?: string,
    linkedId?: number,
): Promise<Contact> => {
    if (!email && !phoneNumber) throw Error("At least one of email or phone must be provided");
    return prisma.contact.create({
        data: {
            email: email,
            phoneNumber: phoneNumber,
            linkPrecedence: linkPrecedence,
            linkedId: linkedId,
        }
    });
}

// Update
export const updateContact = async (
    id: number, linkPrecedence: LinkPrecedence,
    email?: string | null,
    phoneNumber?: string | null,
    linkedId?: number | null,
): Promise<Contact> => {
    if (!email && !phoneNumber) throw Error("At least one of email or phone must be provided");
    return prisma.contact.update({
        where: {
            id: id,
        },
        data: {
            email: email,
            phoneNumber: phoneNumber,
            linkPrecedence: linkPrecedence,
            linkedId: linkedId,
        }
    });
}

export const updateContactToSecondary = async (
    id: number,
    primaryId: number,
): Promise<Contact[]> => {
    return prisma.contact.updateManyAndReturn({
        where: {
            OR: [
                {
                    id: id,
                },
                {
                    linkedId: id,
                }
            ]
        },
        data: {
            linkPrecedence: LinkPrecedence.secondary,
            linkedId: primaryId,
        }
    });
}

// Retrive
export const findContacts = async (
    email?: string,
    phoneNumber?: string
): Promise<Contact[] | null> => {
    return prisma.contact.findMany({
        where: {
            OR: [
                {
                    email: email,
                },
                {
                    phoneNumber: phoneNumber,
                }
            ],


        },
        orderBy: {
            createdAt: 'asc',
        }
    });
}

export const findAllSecondaryContacts = async (
    primaryId: number
): Promise<Contact[] | null> => {
    return prisma.contact.findMany({
        where: {
            linkedId: primaryId,
        },
        orderBy: {
            createdAt: 'asc',
        }
    });
}

export const getContact = async (
    id: number
): Promise<Contact | null> => {
    return prisma.contact.findUnique({
        where: {
            id: id,
        }
    })
}
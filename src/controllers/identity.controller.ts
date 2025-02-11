import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { identifyService } from "../service/identity.service";
export const identify = async (
    req: Request,
    res: Response
) => {
    try {
        let { email, phoneNumber } = req.body;
        let contact = await identifyService(email, phoneNumber);
        res.status(200).json({
            contact: {
                primaryContactId: contact.id,
                emails: [...new Set([contact.email, ...contact.linkedContacts.map(value => value.email)])],
                phoneNumbers: [...new Set([contact.phoneNumber, ...contact.linkedContacts.map(value => value.phoneNumber)])],
                secondaryContactIds: [...contact.linkedContacts.map(value => value.id)],
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Something went wrong" });
    }
}
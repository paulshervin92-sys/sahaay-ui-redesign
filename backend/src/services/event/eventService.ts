import { getFirestore } from "../../config/firebase.js";
import { getUserEmailById } from "../auth/authService.js";
import { sendEventReminder } from "../../utils/email.js";
import { scheduleEmail } from "../../utils/scheduler.js";

export interface EventInput {
    title: string;
    description?: string;
    date: string; // YYYY-MM-DD
    startTime?: string;
    endTime?: string;
}

const collection = () => getFirestore().collection("events");

export const createEvent = async (userId: string, input: EventInput) => {
    const doc = await collection().add({
        userId,
        ...input,
        createdAt: new Date().toISOString(),
    });

    // Schedule email reminder if time is provided
    if (input.date && input.startTime) {
        try {
            // Attempt to parse date and time (Time expected in 24h format or HH:mm)
            const eventDate = new Date(`${input.date}T${input.startTime}`);
            if (!isNaN(eventDate.getTime()) && eventDate > new Date()) {
                const email = await getUserEmailById(userId);
                if (email) {
                    scheduleEmail({
                        id: `event_rem_${doc.id}`,
                        date: eventDate,
                        callback: async () => {
                            await sendEventReminder({
                                to: email,
                                subject: `Sahaay Reminder: ${input.title}`,
                                text: `Your event "${input.title}" is starting now.\n\nDescription: ${input.description || 'No description provided.'}`,
                            });
                        },
                    });
                }
            }
        } catch (err) {
            console.error("Failed to schedule event reminder:", err);
        }
    }

    return { id: doc.id, ...input };
};

export const listEventsByDate = async (userId: string, date: string) => {
    const snapshot = await collection()
        .where("userId", "==", userId)
        .where("date", "==", date)
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEvent = async (userId: string, eventId: string, input: Partial<EventInput>) => {
    const docRef = collection().doc(eventId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.userId !== userId) {
        throw new Error("Event not found or unauthorized");
    }

    await docRef.update(input);
    return { id: eventId, ...doc.data(), ...input };
};

export const deleteEvent = async (userId: string, eventId: string) => {
    const docRef = collection().doc(eventId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.userId !== userId) {
        throw new Error("Event not found or unauthorized");
    }

    await docRef.delete();
};

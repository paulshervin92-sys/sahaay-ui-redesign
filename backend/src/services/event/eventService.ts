import { getFirestore } from "../../config/firebase.js";

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

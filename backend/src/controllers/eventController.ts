import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import * as eventService from "../services/event/eventService.js";

export const getEvents = async (req: AuthRequest, res: Response) => {
    const { date } = req.params;
    const events = await eventService.listEventsByDate(req.userId as string, date);
    return res.json(events);
};

export const createEvent = async (req: AuthRequest, res: Response) => {
    const event = await eventService.createEvent(req.userId as string, req.body);
    return res.json(event);
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const event = await eventService.updateEvent(req.userId as string, id, req.body);
    return res.json(event);
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    await eventService.deleteEvent(req.userId as string, id);
    return res.status(204).send();
};

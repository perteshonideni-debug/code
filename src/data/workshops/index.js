import { emailSimulator } from './email-simulator.js';

export const workshops = [emailSimulator];
export const getWorkshop = id => workshops.find(workshop => workshop.id === id) ?? null;

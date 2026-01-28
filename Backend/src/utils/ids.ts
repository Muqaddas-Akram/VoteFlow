
import { customAlphabet, nanoid } from 'nanoid';

export const createPollID = customAlphabet( 
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    6,
);

export const createUserID = () => nanoid(); // Default length is 21
export const createNominationID = () => nanoid(8);

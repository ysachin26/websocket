import { customAlphabet } from "nanoid";

export function GenerateRoomCode()
{
   const generate = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6);
   return generate();
}
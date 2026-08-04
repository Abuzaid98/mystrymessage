import z from "zod";

export const acceptMesaageSchema = z.object({
    acceptMesaage: z.boolean()
})
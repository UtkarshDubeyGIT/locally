import { z } from "zod";
export const onboardingSteps={
  1:z.object({businessName:z.string().min(2),industry:z.string().min(2),contactName:z.string().min(2),contactEmail:z.email()}),
  2:z.object({branchConfirmation:z.string().min(4),branchNotes:z.string().max(1000)}),
  3:z.object({products:z.string().min(3),audience:z.string().min(3),goals:z.string().min(3),painPoints:z.string().min(3)}),
  4:z.object({competitors:z.string().min(2),marketing:z.string().min(2),reporting:z.enum(["monthly","quarterly"]),communication:z.enum(["email","whatsapp","call"])}),
} as const;

import { describe,expect,it } from "vitest";
import { onboardingSteps } from "./onboarding";
describe("onboarding validation",()=>{it("requires a real business identity",()=>{expect(onboardingSteps[1].safeParse({businessName:"",industry:"Sweets",contactName:"M",contactEmail:"bad"}).success).toBe(false)});it("accepts a complete preference step",()=>{expect(onboardingSteps[4].safeParse({competitors:"Heritage Sweets",marketing:"Local listings",reporting:"monthly",communication:"email"}).success).toBe(true)})});

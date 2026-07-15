import {
  saveOnboardingStepAction,
  submitOnboardingAction,
} from "@/app/actions/onboarding";
import { PendingButton } from "@/components/pending-button";
import { Card, Input, Label, Select, Textarea } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClient } from "@/lib/data";

export default async function Onboarding({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const actor = await requireActor(["client_owner"]);
  if (!actor.client_id) return null;

  const data = await getClient(actor.client_id);
  const { step: requestedStep } = await searchParams;
  const step = Math.min(
    5,
    Math.max(1, Number(requestedStep ?? data.onboarding?.current_step ?? 1)),
  );
  const answers = (
    data.onboarding?.answers_json &&
    typeof data.onboarding.answers_json === "object" &&
    !Array.isArray(data.onboarding.answers_json)
      ? data.onboarding.answers_json
      : {}
  ) as Record<string, Record<string, string>>;
  const pageTitle = {
    1: "Business details",
    2: "Locations",
    3: "Goals and audience",
    4: "Reporting preferences",
    5: "Review and submit",
  }[step];

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">
            {step === 5 ? "Review" : `Step ${step} of 4`}
          </p>
          <h1>{pageTitle}</h1>
          <p>Your answers are saved after each step and can be resumed later.</p>
        </div>
      </div>

      <div
        className="progress"
        aria-label={`Onboarding progress ${Math.min(step, 4)} of 4`}
      >
        <span style={{ width: `${Math.min(step, 4) * 25}%` }} />
      </div>

      <Card style={{ marginTop: "2rem" }}>
        {step === 1 ? (
          <form action={saveOnboardingStepAction} className="form-grid">
            <input type="hidden" name="step" value="1" />
            <Label>
              Business name
              <Input
                name="businessName"
                defaultValue={answers.step1?.businessName ?? data.client.business_name}
                required
              />
            </Label>
            <Label>
              Industry
              <Input
                name="industry"
                defaultValue={answers.step1?.industry ?? data.client.industry}
                required
              />
            </Label>
            <Label>
              Contact name
              <Input
                name="contactName"
                defaultValue={
                  answers.step1?.contactName ?? data.client.primary_contact_name ?? ""
                }
                required
              />
            </Label>
            <Label>
              Contact email
              <Input
                type="email"
                name="contactEmail"
                defaultValue={
                  answers.step1?.contactEmail ?? data.client.primary_contact_email ?? ""
                }
                required
              />
            </Label>
            <div className="full">
              <PendingButton pendingLabel="Saving your details…">
                Save and continue
              </PendingButton>
            </div>
          </form>
        ) : null}

        {step === 2 ? (
          <form action={saveOnboardingStepAction} className="stack">
            <input type="hidden" name="step" value="2" />
            <p className="eyebrow">Confirm four branches</p>
            <div className="grid grid--2">
              {data.locations.map((location) => (
                <div className="card card--white" key={location.id}>
                  <strong>{location.name}</strong>
                  <br />
                  <span className="muted">
                    {location.address}, {location.city}
                  </span>
                </div>
              ))}
            </div>
            <Label>
              Branch confirmation
              <Input
                name="branchConfirmation"
                defaultValue={
                  answers.step2?.branchConfirmation ??
                  "All four branch records are correct"
                }
                required
              />
            </Label>
            <Label>
              Corrections or seasonal-hour notes
              <Textarea
                name="branchNotes"
                defaultValue={answers.step2?.branchNotes ?? ""}
              />
            </Label>
            <PendingButton pendingLabel="Saving branch details…">
              Save and continue
            </PendingButton>
          </form>
        ) : null}

        {step === 3 ? (
          <form action={saveOnboardingStepAction} className="form-grid">
            <input type="hidden" name="step" value="3" />
            <Label>
              Products and services
              <Textarea
                name="products"
                defaultValue={
                  answers.step3?.products ??
                  "Wedding sweets, festive gift boxes, corporate orders"
                }
                required
              />
            </Label>
            <Label>
              Primary audience
              <Textarea
                name="audience"
                defaultValue={
                  answers.step3?.audience ??
                  "Families, wedding planners, and office teams across Delhi NCR"
                }
                required
              />
            </Label>
            <Label>
              Goals
              <Textarea
                name="goals"
                defaultValue={
                  answers.step3?.goals ?? "Increase store visits and festive orders"
                }
                required
              />
            </Label>
            <Label>
              Pain points
              <Textarea
                name="painPoints"
                defaultValue={
                  answers.step3?.painPoints ??
                  "Noida visibility, review response time, branch pages"
                }
                required
              />
            </Label>
            <div className="full">
              <PendingButton pendingLabel="Saving business goals…">
                Save and continue
              </PendingButton>
            </div>
          </form>
        ) : null}

        {step === 4 ? (
          <form action={saveOnboardingStepAction} className="form-grid">
            <input type="hidden" name="step" value="4" />
            <Label>
              Known competitors
              <Textarea
                name="competitors"
                defaultValue={
                  answers.step4?.competitors ??
                  "Heritage Sweets and other nearby sweet shops"
                }
                required
              />
            </Label>
            <Label>
              Current marketing
              <Textarea
                name="marketing"
                defaultValue={
                  answers.step4?.marketing ??
                  "Google profiles, Instagram, WhatsApp and festive campaigns"
                }
                required
              />
            </Label>
            <Label>
              Reporting cadence
              <Select
                name="reporting"
                defaultValue={answers.step4?.reporting ?? "monthly"}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </Select>
            </Label>
            <Label>
              Preferred communication
              <Select
                name="communication"
                defaultValue={answers.step4?.communication ?? "email"}
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="call">Call</option>
              </Select>
            </Label>
            <div className="full">
              <PendingButton pendingLabel="Preparing your review…">
                Save and review
              </PendingButton>
            </div>
          </form>
        ) : null}

        {step === 5 ? (
          <div className="stack">
            <h3>Confirm the information below before submitting it to the agency.</h3>
            {Object.entries(answers).map(([key, value]) => (
              <div key={key}>
                <p className="eyebrow">{key.replace("step", "Step ")}</p>
                <p>{Object.values(value).join(", ")}</p>
              </div>
            ))}
            <form action={submitOnboardingAction}>
              <PendingButton pendingLabel="Submitting onboarding…">
                Submit to the agency
              </PendingButton>
            </form>
          </div>
        ) : null}
      </Card>
    </>
  );
}

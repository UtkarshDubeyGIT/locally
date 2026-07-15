import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

const branches = {
  dwarka: {
    name: "Dwarka",
    address: "Unit 12, Market Arcade, Sector 12, New Delhi",
    hours: "09:00-22:00",
    special: "Wedding assortments",
    image: "/images/branch-dwarka.webp",
  },
  rohini: {
    name: "Rohini",
    address: "Shop 7, Community Plaza, Sector 9, New Delhi",
    hours: "09:00-22:00",
    special: "Festive gift boxes",
    image: "/images/branch-rohini.webp",
  },
  "noida-sector-18": {
    name: "Noida Sector 18",
    address: "Kiosk 4, Central Market Walk, Sector 18, Noida",
    hours: "Weekdays 10:00-21:00. Weekend hours need verification.",
    special: "Corporate gifting",
    image: "/images/branch-noida.webp",
  },
  "lajpat-nagar": {
    name: "Lajpat Nagar",
    address: "18A, Central Market Lane, New Delhi",
    hours: "09:30-22:30",
    special: "Fresh mithai counter",
    image: "/images/branch-lajpat.webp",
  },
} as const;

type BranchSlug = keyof typeof branches;
type BranchPageProps = { params: Promise<{ branch: string }> };

function getBranch(slug: string) {
  return branches[slug as BranchSlug];
}

export function generateStaticParams() {
  return Object.keys(branches).map((branch) => ({ branch }));
}

export async function generateMetadata({
  params,
}: BranchPageProps): Promise<Metadata> {
  const { branch } = await params;
  const location = getBranch(branch);

  if (!location) {
    return { title: "Fictional Madhur Sweets branch" };
  }

  return {
    title: `Madhur Sweets, ${location.name}`,
    description: `Visit information for the fictional Madhur Sweets ${location.name} demo branch.`,
  };
}

export default async function DemoBranch({ params }: BranchPageProps) {
  const { branch } = await params;
  const location = getBranch(branch);
  if (!location) notFound();

  return (
    <main className="demo-site">
      <section
        className="demo-site__hero"
        aria-labelledby="demo-branch-title"
      >
        <Image
          className="demo-site__hero-image"
          src={location.image}
          alt={`Mithai counter at the fictional Madhur Sweets ${location.name} branch`}
          fill
          priority
          sizes="100vw"
        />
        <span className="demo-site__hero-shade" aria-hidden="true" />
        <div className="demo-site__hero-content">
          <p className="demo-site__label">Fictional demo branch</p>
          <h1 id="demo-branch-title">Madhur Sweets, {location.name}</h1>
          <p>
            Mithai and gift assortments from a non-operational storefront built
            for the Locally demo.
          </p>
        </div>
      </section>

      <section className="demo-site__body" aria-labelledby="visit-information">
        <h2 id="visit-information">Visit information</h2>
        <p className="muted demo-site__notice">
          This page is a stable PageSpeed target. The business, location,
          address, hours and offerings are demo content and are not operational.
        </p>

        <dl className="demo-site__facts">
          <div className="demo-site__fact demo-site__fact--address">
            <dt>Address</dt>
            <dd>{location.address}</dd>
          </div>
          <div className="demo-site__fact">
            <dt>Hours</dt>
            <dd>{location.hours}</dd>
          </div>
          <div className="demo-site__fact">
            <dt>Known for</dt>
            <dd>{location.special}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

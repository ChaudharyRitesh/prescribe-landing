import type { Metadata } from "next";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { CareersBoard } from "@/components/careers/careers-board";
import { getJobs, perks, values } from "@/lib/careers-data";
import { careerPrimaryButton } from "@/components/careers/careers-ui";

export const metadata: Metadata = {
  title: "Careers | KaeroPrescribe",
  description:
    "Join KaeroPrescribe and build dependable software for clinics, hospitals, laboratories, and pharmacies.",
};

const process = [
  {
    number: "01",
    title: "Application review",
    description:
      "We review your experience, relevant work, and interest in the role.",
  },
  {
    number: "02",
    title: "Introductory call",
    description:
      "A focused conversation about your background, the team, and the work.",
  },
  {
    number: "03",
    title: "Role discussion",
    description:
      "A practical, role-specific session with people you would work with.",
  },
  {
    number: "04",
    title: "Decision",
    description:
      "Clear feedback and a prompt decision, usually within two to three weeks.",
  },
];

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <>
      <Header />
      <main className="bg-[#f6f7f5] text-[#101820]">
        <section className="border-b border-slate-300 bg-[#eef3f1]">
          <div className="lp-container grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-teal-800">
                Careers at KaeroPrescribe
              </p>
              <h1 className="font-heading mt-5 max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-[#07111f] sm:text-6xl lg:text-[4.5rem]">
                Build dependable software for modern healthcare.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-xl">
                Join a focused team building operational software used across
                clinics, hospitals, laboratories, and pharmacies.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href="#roles"
                  className={careerPrimaryButton}
                >
                  Explore open roles
                </a>
                <a
                  href="mailto:careers@kaerogroup.com"
                  className="text-sm font-semibold text-slate-700 transition-colors hover:text-teal-800"
                >
                  careers@kaerogroup.com
                </a>
              </div>
            </div>

            <dl className="border-t border-slate-400/70 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="border-b border-slate-300 pb-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Open positions
                </dt>
                <dd className="font-heading mt-2 text-3xl font-bold text-[#07111f]">
                  {jobs.length}
                </dd>
              </div>
              <div className="border-b border-slate-300 py-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Locations
                </dt>
                <dd className="mt-2 font-semibold text-slate-800">
                  Kolkata, Bengaluru, Remote India
                </dd>
              </div>
              <div className="pt-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Working style
                </dt>
                <dd className="mt-2 font-semibold text-slate-800">
                  Small, cross-functional teams
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section id="roles" className="scroll-mt-20 bg-white py-16 md:py-24">
          <div className="lp-container">
            <div className="grid gap-6 border-b border-slate-300 pb-9 lg:grid-cols-[1fr_28rem] lg:items-end">
              <div>
                <p className="text-sm font-semibold text-teal-800">
                  Current openings
                </p>
                <h2 className="font-heading mt-3 text-4xl font-bold tracking-tight text-[#07111f] md:text-5xl">
                  Open roles
                </h2>
              </div>
              <p className="text-base leading-relaxed text-slate-600 lg:text-right">
                Search by discipline, location, or employment type. Each role
                includes scope, requirements, and application details.
              </p>
            </div>
            <CareersBoard initialJobs={jobs} />
          </div>
        </section>

        <section className="border-y border-slate-300 bg-[#eef3f1] py-16 md:py-24">
          <div className="lp-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-teal-800">
                Working at KaeroPrescribe
              </p>
              <h2 className="font-heading mt-4 text-4xl font-bold leading-tight text-[#07111f] md:text-5xl">
                Clear standards. Direct ownership.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-700">
                Our teams stay close to users, make decisions with context, and
                remain accountable after release.
              </p>
            </div>

            <div className="border-t border-slate-400">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="grid gap-3 border-b border-slate-300 py-7 sm:grid-cols-[3rem_12rem_1fr] sm:gap-6"
                >
                  <span className="font-heading text-sm font-bold text-slate-500">
                    0{index + 1}
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#07111f]">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-slate-700">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24">
          <div className="lp-container grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <p className="text-sm font-semibold text-teal-800">
                Interview process
              </p>
              <h2 className="font-heading mt-4 text-4xl font-bold tracking-tight text-[#07111f]">
                What to expect
              </h2>
              <div className="mt-9 border-t border-slate-300">
                {process.map((step) => (
                  <div
                    key={step.number}
                    className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-slate-300 py-6"
                  >
                    <span className="font-heading text-sm font-bold text-slate-500">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-[#07111f]">
                        {step.title}
                      </h3>
                      <p className="mt-2 leading-relaxed text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-teal-800">
                Employee benefits
              </p>
              <h2 className="font-heading mt-4 text-4xl font-bold tracking-tight text-[#07111f]">
                Benefits and support
              </h2>
              <div className="mt-9 border-t border-slate-300">
                {perks.map((perk) => (
                  <div
                    key={perk.title}
                    className="grid gap-2 border-b border-slate-300 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
                  >
                    <h3 className="font-heading font-bold text-[#07111f]">
                      {perk.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600">
                      {perk.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#07111f] py-16 text-white md:py-20">
          <div className="lp-container grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="font-heading max-w-3xl text-3xl font-bold leading-tight md:text-4xl">
                Do not see the right opening?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
                Send your profile and a short note about the problems you can
                help us solve.
              </p>
            </div>
            <a
              href="mailto:careers@kaerogroup.com?subject=General%20Application"
              className={careerPrimaryButton}
            >
              Send general application
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

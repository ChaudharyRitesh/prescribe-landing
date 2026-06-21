import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { jobs, type Job } from "@/lib/careers-data";
import {
  careerPrimaryButton,
  careerRowButton,
  careerUtilityButton,
} from "@/components/careers/careers-ui";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = jobs.find((item) => item.slug === slug);

  if (!job) {
    return { title: "Role not found | KaeroPrescribe Careers" };
  }

  return {
    title: `${job.title} | KaeroPrescribe Careers`,
    description: job.summary,
  };
}

function DescriptionSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="border-t border-slate-300 py-9">
      <h2 className="font-heading text-2xl font-bold tracking-tight text-[#07111f]">
        {title}
      </h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="grid grid-cols-[0.75rem_1fr] gap-3 text-[15px] leading-relaxed text-slate-700"
          >
            <span
              aria-hidden="true"
              className="mt-[0.65rem] h-1.5 w-1.5 rounded-full bg-teal-700"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RoleDetails({ job }: { job: Job }) {
  const details = [
    ["Department", job.department],
    ["Location", job.location],
    ["Work model", job.mode],
    ["Employment", job.type],
    ["Experience", job.level],
    ...(job.salary ? [["Compensation", job.salary]] : []),
  ];

  return (
    <dl className="border-t border-slate-300">
      {details.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[7rem_1fr] gap-4 border-b border-slate-300 py-4"
        >
          <dt className="text-sm text-slate-500">{label}</dt>
          <dd className="text-sm font-semibold text-[#07111f]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = jobs.find((item) => item.slug === slug);

  if (!job) notFound();

  const related = jobs
    .filter(
      (item) =>
        item.department === job.department && item.slug !== job.slug
    )
    .slice(0, 3);

  const applyHref = `mailto:careers@kaerogroup.com?subject=${encodeURIComponent(
    `Application: ${job.title}`
  )}`;

  return (
    <>
      <Header />
      <main className="bg-[#f6f7f5] text-[#101820]">
        <section className="border-b border-slate-300 bg-[#eef3f1]">
          <div className="lp-container py-12 md:py-16">
            <Link
              href="/careers#roles"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-teal-800"
            >
              Back to open roles
            </Link>

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-20">
              <div>
                <p className="text-sm font-semibold text-teal-800">
                  {job.department}
                </p>
                <h1 className="font-heading mt-4 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-[#07111f] sm:text-5xl lg:text-6xl">
                  {job.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-700">
                  {job.summary}
                </p>
              </div>

              <div className="border-t border-slate-400 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <p className="text-sm font-semibold text-[#07111f]">
                  {job.location}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {job.mode} / {job.type} / {job.level}
                </p>
                <a
                  href={applyHref}
                  className={`${careerPrimaryButton} mt-6 w-full`}
                >
                  Apply for this role
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-container py-12 md:py-16">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-20">
            <article className="min-w-0">
              <section className="pb-9">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-[#07111f]">
                  About the role
                </h2>
                <p className="mt-5 max-w-3xl text-[16px] leading-8 text-slate-700">
                  {job.about}
                </p>
              </section>

              <DescriptionSection
                title="Responsibilities"
                items={job.responsibilities}
              />
              <DescriptionSection
                title="Requirements"
                items={job.requirements}
              />
              {job.niceToHave && job.niceToHave.length > 0 && (
                <DescriptionSection
                  title="Preferred experience"
                  items={job.niceToHave}
                />
              )}

              <section className="border-t border-slate-300 py-9">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-[#07111f]">
                  Equal opportunity
                </h2>
                <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-700">
                  KaeroPrescribe is an equal-opportunity employer. We welcome
                  applicants from different backgrounds and evaluate
                  candidates on the skills and experience relevant to the role.
                </p>
              </section>
            </article>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-slate-300 bg-white p-6">
                <h2 className="font-heading text-lg font-bold text-[#07111f]">
                  Role details
                </h2>
                <div className="mt-5">
                  <RoleDetails job={job} />
                </div>

                <div className="mt-7 border-t border-slate-300 pt-6">
                  <h3 className="font-heading font-bold text-[#07111f]">
                    How to apply
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Email your resume and links to relevant work. Include the
                    role title in the subject line.
                  </p>
                  <a
                    href={applyHref}
                    className={`${careerPrimaryButton} mt-5 w-full`}
                  >
                    Apply by email
                  </a>
                  <p className="mt-3 break-all text-xs text-slate-500">
                    careers@kaerogroup.com
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <section className="mt-14 border-t border-slate-300 pt-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-teal-800">
                    Related opportunities
                  </p>
                  <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight text-[#07111f]">
                    More roles in {job.department}
                  </h2>
                </div>
                <Link
                  href="/careers#roles"
                  className={careerUtilityButton}
                >
                  View all roles
                </Link>
              </div>

              <div className="mt-7 border-t border-slate-300">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/careers/${item.slug}`}
                    className="group grid gap-3 border-b border-slate-300 py-6 transition-colors hover:bg-white md:grid-cols-[1fr_18rem_auto] md:items-center md:px-4"
                  >
                    <h3 className="font-heading text-lg font-bold text-[#07111f]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {item.location} / {item.type}
                    </p>
                    <span className={careerRowButton}>
                      View role
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

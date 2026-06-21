"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DEPARTMENTS,
  JOB_TYPES,
  LOCATIONS,
  jobs as allJobs,
} from "@/lib/careers-data";
import {
  careerRowButton,
  careerUtilityButton,
} from "@/components/careers/careers-ui";

const ALL = "All";

export function CareersBoard() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [type, setType] = useState(ALL);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allJobs.filter((job) => {
      if (department !== ALL && job.department !== department) return false;
      if (location !== ALL && job.location !== location) return false;
      if (type !== ALL && job.type !== type) return false;

      return (
        !query ||
        `${job.title} ${job.department} ${job.summary}`
          .toLowerCase()
          .includes(query)
      );
    });
  }, [search, department, location, type]);

  const clearAll = () => {
    setSearch("");
    setDepartment(ALL);
    setLocation(ALL);
    setType(ALL);
  };

  const hasFilters =
    Boolean(search) ||
    department !== ALL ||
    location !== ALL ||
    type !== ALL;

  const controlClass =
    "h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-[15px] font-medium text-slate-900 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-[border-color,box-shadow,background-color] duration-200 hover:border-slate-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10";

  const selectClass = `${controlClass} cursor-pointer appearance-none pr-11`;

  return (
    <div className="pt-8">
      <div className="rounded-lg border border-slate-300 bg-[#f7f9f8] p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <label className="block text-[13px] font-semibold text-slate-700">
            Search roles
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title, team, or keyword"
              className={`${controlClass} mt-2 placeholder:font-normal placeholder:text-slate-400`}
            />
          </label>

          <label className="block text-[13px] font-semibold text-slate-700">
            Department
            <span className="relative mt-2 block">
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className={selectClass}
              >
                <option value={ALL}>All departments</option>
                {DEPARTMENTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1.5 rotate-45 border-b-2 border-r-2 border-slate-500"
              />
            </span>
          </label>

          <label className="block text-[13px] font-semibold text-slate-700">
            Location
            <span className="relative mt-2 block">
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className={selectClass}
              >
                <option value={ALL}>All locations</option>
                {LOCATIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1.5 rotate-45 border-b-2 border-r-2 border-slate-500"
              />
            </span>
          </label>

          <label className="block text-[13px] font-semibold text-slate-700">
            Employment type
            <span className="relative mt-2 block">
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className={selectClass}
              >
                <option value={ALL}>All types</option>
                {JOB_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 h-2 w-2 -translate-y-1.5 rotate-45 border-b-2 border-r-2 border-slate-500"
              />
            </span>
          </label>
        </div>

        <div className="mt-5 flex min-h-10 items-center justify-between border-t border-slate-300 pt-4 text-sm">
          <p className="text-slate-600">
            <span className="font-bold text-slate-950">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "position" : "positions"}
          </p>
          {hasFilters && (
            <button
              onClick={clearAll}
              className={`${careerUtilityButton} cursor-pointer`}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border-b border-slate-300 py-16">
          <h3 className="font-heading text-xl font-bold">
            No matching positions
          </h3>
          <p className="mt-2 text-slate-600">
            Change filters or send a general application.
          </p>
          <button
            onClick={clearAll}
            className={`${careerUtilityButton} mt-5 cursor-pointer`}
          >
            Reset search
          </button>
        </div>
      ) : (
        <div>
          {filtered.map((job) => (
            <Link
              key={job.slug}
              href={`/careers/${job.slug}`}
              className="group grid cursor-pointer gap-5 border-b border-slate-300 py-7 transition-colors hover:bg-[#f3faf7] md:grid-cols-[12rem_1fr_auto] md:items-center md:px-4"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-800">
                  {job.department}
                </p>
                {job.postedDaysAgo <= 3 && (
                  <p className="mt-2 text-xs font-bold text-amber-800">
                    Recently posted
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-slate-950">
                  {job.title}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                  {job.summary}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  {job.location} / {job.mode} / {job.type} / {job.level}
                </p>
              </div>

              <span className={careerRowButton}>
                View role
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

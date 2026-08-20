"use client";

import { useMemo, useState } from "react";

import { patentDirectoryRecords } from "@/lib/patent-directory-data";

function getUniqueValues(key: "type" | "status" | "country") {
  return Array.from(new Set(patentDirectoryRecords.map((record) => record[key])))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

const typeOptions = getUniqueValues("type");
const statusOptions = getUniqueValues("status");
const countryOptions = getUniqueValues("country");

export function PatentDirectorySection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const visibleRecords = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return patentDirectoryRecords.filter((record) => {
      const matchesSearch =
        !query ||
        [
          record.title,
          record.type,
          record.status,
          record.applicationNum,
          record.patentNum,
          record.country,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return (
        matchesSearch &&
        (!selectedType || record.type === selectedType) &&
        (!selectedStatus || record.status === selectedStatus) &&
        (!selectedCountry || record.country === selectedCountry)
      );
    });
  }, [searchTerm, selectedType, selectedStatus, selectedCountry]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setSelectedStatus("");
    setSelectedCountry("");
  };

  return (
    <section className="border-y border-slate-200 bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              Patent directory
            </p>
            <h2 className="mt-4 text-[3rem] font-light leading-none tracking-[-0.04em] text-[#25306b] sm:text-[3.35rem]">
              Search PatentZoom application data.
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              Browse patent and application records by invention title, filing
              type, status, application number, patent number, and country.
            </p>
          </div>
          <div className="text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b]">
            {visibleRecords.length} of {patentDirectoryRecords.length} records
          </div>
        </div>

        <div className="mt-8 grid gap-3 rounded-[24px] border border-slate-200 bg-[#f8f9fb] p-4 lg:grid-cols-[1.3fr_0.9fr_0.9fr_0.9fr_auto]">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Search
            </span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Title, application, patent, country..."
              className="mt-2 min-h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#fb4522] focus:ring-4 focus:ring-[#fb4522]/10"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Type
            </span>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="mt-2 min-h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#fb4522] focus:ring-4 focus:ring-[#fb4522]/10"
            >
              <option value="">All types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Status
            </span>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="mt-2 min-h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#fb4522] focus:ring-4 focus:ring-[#fb4522]/10"
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Country
            </span>
            <select
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              className="mt-2 min-h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#fb4522] focus:ring-4 focus:ring-[#fb4522]/10"
            >
              <option value="">All countries</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="self-end border border-slate-300 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#25306b] transition hover:border-[#fb4522] hover:text-[#fb4522]"
          >
            Reset
          </button>
        </div>

        <div className="mt-8 hidden overflow-hidden border border-slate-200 bg-white lg:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[#f8f9fb] text-xs uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-4 py-4 font-semibold">
                  Title
                </th>
                <th className="border-b border-slate-200 px-4 py-4 font-semibold">
                  Type
                </th>
                <th className="border-b border-slate-200 px-4 py-4 font-semibold">
                  Status
                </th>
                <th className="border-b border-slate-200 px-4 py-4 font-semibold">
                  Application
                </th>
                <th className="border-b border-slate-200 px-4 py-4 font-semibold">
                  Patent
                </th>
                <th className="border-b border-slate-200 px-4 py-4 font-semibold">
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record, index) => (
                <tr
                  key={`${record.applicationNum}-${record.patentNum}-${index}`}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="max-w-[24rem] px-4 py-4 font-medium leading-6 text-[#25306b]">
                    {record.title}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{record.type}</td>
                  <td className="px-4 py-4 text-slate-600">{record.status}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {record.applicationNum || "Not listed"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {record.patentNum || "Not issued"}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{record.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid gap-4 lg:hidden">
          {visibleRecords.map((record, index) => (
            <article
              key={`${record.applicationNum}-${record.patentNum}-${index}`}
              className="border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap gap-2">
                <span className="border border-[#fb4522]/20 bg-[#fff1eb] px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#fb4522]">
                  {record.type}
                </span>
                <span className="border border-slate-200 px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
                  {record.status}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-7 text-[#25306b]">
                {record.title}
              </h3>
              <dl className="mt-4 grid gap-3 text-sm text-slate-600">
                <div>
                  <dt className="font-semibold text-slate-900">Application</dt>
                  <dd>{record.applicationNum || "Not listed"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Patent</dt>
                  <dd>{record.patentNum || "Not issued"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-900">Country</dt>
                  <dd>{record.country}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {visibleRecords.length === 0 ? (
          <div className="mt-8 border border-slate-200 bg-[#f8f9fb] p-8 text-center">
            <p className="text-base font-semibold text-[#25306b]">
              No directory records match these filters.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Try a broader search term or reset the filters.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

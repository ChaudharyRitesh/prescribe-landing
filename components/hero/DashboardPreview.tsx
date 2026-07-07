import React from "react";
import { ChevronDown, TrendingDown, TrendingUp, X } from "lucide-react";
import Gauge from "./Gauge";

const ORANGE = "#ef4d23";

function TogglePill({ left, right }: { left: string; right: string }) {
  return (
    <div className="bg-neutral-100 rounded-full p-1 flex text-[12px]">
      <span className="flex-1 text-center bg-white rounded-full shadow py-1.5 font-medium text-neutral-900">
        {left}
      </span>
      <span className="flex-1 text-center py-1.5 text-neutral-500">{right}</span>
    </div>
  );
}

function ClicksCard() {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between text-[13px]">
        <span style={{ color: ORANGE }} className="font-medium">
          Clicks
        </span>
        <span className="text-neutral-500">This Month</span>
      </div>

      <div className="flex items-center gap-2">
        <span style={{ fontSize: 28, fontWeight: 600 }}>6,896</span>
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 rounded-full px-2 py-0.5 text-[11px]">
          <TrendingDown className="w-3 h-3" />
          -3,382 (33%)
        </span>
      </div>
      <p className="text-[11px] text-neutral-500 -mt-2">Compared to yesterday</p>

      <p className="text-center text-[12px] text-neutral-600">
        Month Target achieved
      </p>
      <Gauge value={92} color={ORANGE} showLabels min="389K" max="425K" />

      <TogglePill left="Impressions" right="Clicks" />
    </div>
  );
}

function LabelDropdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-neutral-700">{label}</label>
      <button className="border border-neutral-200 rounded-lg px-3 py-2 flex items-center justify-between text-[13px] text-neutral-900">
        {value}
        <ChevronDown className="w-4 h-4 text-neutral-500" />
      </button>
    </div>
  );
}

function LabelInput({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-neutral-700">{label}</label>
      <div className="border border-neutral-200 rounded-lg px-3 py-2 flex items-center gap-2 text-[13px] text-neutral-900">
        <span className="text-neutral-400">#</span>
        <input
          type="text"
          defaultValue={value}
          className="w-full outline-none bg-transparent"
        />
      </div>
    </div>
  );
}

function FormCard() {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
      <LabelDropdown label="Show figures for" value="This month" />
      <LabelDropdown label="Compare period by" value="Month-to-date (MTD)" />
      <LabelInput label="Ste targets (This month)" value={10} />
      <LabelInput label="Ste targets (This year)" value={100} />

      <div className="flex items-center gap-4 pt-1">
        <button
          className="text-white rounded-lg px-5 py-2 text-[13px]"
          style={{ backgroundColor: ORANGE }}
        >
          Save
        </button>
        <button className="text-[13px] underline text-neutral-700">
          Cancel
        </button>
        <button className="ml-auto text-neutral-400" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function VideoStartsCard() {
  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between text-[13px]">
        <span style={{ color: ORANGE }} className="font-medium">
          Video Starts
        </span>
        <span className="text-neutral-500">today</span>
      </div>

      <div className="flex items-center gap-2">
        <span style={{ fontSize: 28, fontWeight: 600 }}>0</span>
        <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5 text-[11px]">
          <TrendingUp className="w-3 h-3" />
          0
        </span>
      </div>
      <p className="text-[11px] text-neutral-500 -mt-2">Compared to yesterday</p>

      <Gauge value={68} color="#9ca3af" />

      <TogglePill left="Video Clicks" right="Video Starts" />
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <div className="bg-[#f5f2ee] rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <ClicksCard />
        <FormCard />
        <VideoStartsCard />
      </div>
    </div>
  );
}

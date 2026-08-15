import React from "react";
import { Check, Smartphone, Download, ShieldCheck, ArrowRight } from "lucide-react";

import QRCode from "react-qr-code";

const APK_URL = "https://pub-cb9254a2fac64ceb96d2a7118124cd3b.r2.dev/kaero-one-v1.0.2.apk";

const FEATURES = [
    "One app for your role — Pharmacy, Lab, Doctor, Reception, Nursing, OT or Blood Bank",
    "Same login as the web dashboard, no separate setup",
    "Shift updates and tasks reach you in real time",
];

export default function DownloadSection() {
    const stamp = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <section id="download" className="relative w-full bg-[#FAFAFA] py-24 px-6 sm:px-10 lg:px-16 selection:bg-brand-primary-soft">
            <div className="mx-auto max-w-6xl">
                {/* Header Row */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <span
                                style={{ fontFamily: "var(--font-ibm-plex-mono)", letterSpacing: "0.14em" }}
                                className="text-xs font-semibold uppercase text-teal-700"
                            >
                                Kaero · Prescribe
                            </span>
                            <span className="h-1 w-1 rounded-full bg-teal-600" />
                            <span
                                style={{ fontFamily: "var(--font-ibm-plex-mono)", letterSpacing: "0.14em" }}
                                className="text-xs uppercase text-zinc-500"
                            >
                                Internal build · Android
                            </span>
                        </div>
                        <h2
                            style={{ fontFamily: "Space Grotesk", lineHeight: 1.08 }}
                            className="text-4xl font-semibold text-zinc-900 sm:text-5xl tracking-tight"
                        >
                            Your ward, <br className="hidden sm:block" />
                            in your pocket.
                        </h2>
                    </div>
                    <p style={{ fontFamily: "Inter" }} className="max-w-sm text-zinc-500 md:text-right">
                        Scan the code with your work phone to install the Kaero Prescribe staff app directly. 
                        This build is distributed internally.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
                    
                    {/* Block 1: Feature List (Large) */}
                    <div className="col-span-1 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:col-span-7 flex flex-col justify-between">
                        <div>
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 style={{ fontFamily: "Space Grotesk" }} className="mb-6 text-2xl font-semibold text-zinc-900">
                                Seamless staff access
                            </h3>
                            <ul className="space-y-4">
                                {FEATURES.map((t, idx) => (
                                    <li key={idx} className="flex items-start gap-4">
                                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                                            <Check size={12} strokeWidth={3} />
                                        </span>
                                        <span style={{ fontFamily: "Inter" }} className="text-zinc-600">
                                            {t}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Block 2: QR Code (Medium) */}
                    <div className="col-span-1 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:col-span-5 flex flex-col items-center justify-center text-center">
                        <div className="mb-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                            <QRCode
                                value={APK_URL}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                className="h-40 w-40 sm:h-48 sm:w-48"
                            />
                        </div>
                        <p style={{ fontFamily: "var(--font-ibm-plex-mono)", letterSpacing: "0.1em" }} className="mb-2 text-sm font-semibold uppercase text-zinc-900">
                            Scan to install
                        </p>
                        <p style={{ fontFamily: "Inter" }} className="text-sm text-zinc-500 mb-4">
                            Open your camera and point it at the code
                        </p>
                        <div style={{ fontFamily: "var(--font-ibm-plex-mono)" }} className="mt-auto pt-4 border-t border-zinc-100 w-full text-[10px] text-zinc-400">
                            v1.0.2 · {stamp}
                        </div>
                    </div>

                    {/* Block 3: Android Notice (Small) */}
                    <div className="col-span-1 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md md:col-span-5">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-warning/10 text-brand-warning">
                                <Smartphone size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontFamily: "Inter" }} className="mb-2 font-semibold text-zinc-900">
                                    Unknown Apps Prompt
                                </h4>
                                <p style={{ fontFamily: "Inter" }} className="text-sm text-zinc-500 leading-relaxed">
                                    Your phone will ask you to allow "install unknown apps" the first time. That's expected for internal distribution outside the Play Store.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Block 4: Direct Download CTA (Medium) */}
                    <div className="col-span-1 rounded-3xl bg-zinc-900 p-8 text-white shadow-sm transition-all hover:bg-zinc-800 md:col-span-7 flex flex-col justify-center relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-zinc-800 opacity-50 blur-3xl transition-transform group-hover:scale-110" />
                        
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <h4 style={{ fontFamily: "Space Grotesk" }} className="mb-2 text-xl font-semibold">
                                    Viewing on mobile?
                                </h4>
                                <p style={{ fontFamily: "Inter" }} className="text-sm text-zinc-400">
                                    Skip the QR code and download the APK directly.
                                </p>
                            </div>
                            <a href="/download-app" className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-400">
                                <Download size={16} />
                                Download APK
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
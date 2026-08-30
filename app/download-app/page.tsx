import React from "react";
import { Check, Smartphone, ArrowLeft, Download } from "lucide-react";
import { Footer } from "@/components/footer";
import Header from "@/components/header";

const QR_SRC = "/qr-code.png";

const c = {
    ink: "#101E28",
    inkSoft: "#17303C",
    paper: "#F4F6F5",
    teal: "#2E8F82",
    tealSoft: "#C9E6E1",
    muted: "rgba(244,246,245,0.62)",
    mutedFaint: "rgba(244,246,245,0.4)",
    cardHair: "#D8DBD6",
    caption: "#6C7570",
};

const FEATURES = [
    "Sign in with the same Kaero account you already use",
    "Get team updates and tasks in real time",
    "Built for every Kaero employee, on or off the clock",
];

const STEPS = [
    "Scan the QR code with your phone's camera",
    "Allow \"install unknown apps\" when prompted",
    "Open the app and sign in with your Kaero account",
];

const APK_URL = "https://pub-cb9254a2fac64ceb96d2a7118124cd3b.r2.dev/kaero-builds/kaero-one-v1.0.0.5apk";

export default function DownloadPage() {
    const stamp = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    return (
        <><Header /><div style={{ background: c.ink, minHeight: "100vh" }} className="relative w-full overflow-hidden">
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    opacity: 0.05,
                    backgroundImage: `linear-gradient(${c.paper} 1px, transparent 1px), linear-gradient(90deg, ${c.paper} 1px, transparent 1px)`,
                    backgroundSize: "44px 44px",
                }} />


            {/* main */}
            <main className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-6 sm:px-10 lg:flex-row lg:items-center lg:gap-20 lg:px-16 lg:pt-16">
                {/* Left: copy */}
                <div className="w-full max-w-xl lg:w-1/2">
                    <div className="mb-7 flex items-center gap-3">
                        <span
                            style={{ fontFamily: "IBM Plex Mono", color: c.teal, letterSpacing: "0.14em" }}
                            className="text-xs uppercase"
                        >
                            Internal build
                        </span>
                        <span style={{ background: c.teal }} className="h-1 w-1 rounded-full" />
                        <span
                            style={{ fontFamily: "IBM Plex Mono", color: c.muted, letterSpacing: "0.14em" }}
                            className="text-xs uppercase"
                        >
                            Android only
                        </span>
                    </div>

                    <h1
                        style={{ fontFamily: "Space Grotesk", color: c.paper, lineHeight: 1.06 }}
                        className="mb-6 text-4xl font-semibold sm:text-5xl lg:text-6xl"
                    >
                        The Kaero app,
                        <br />
                        on your phone.
                    </h1>

                    <p
                        style={{ fontFamily: "Inter", color: c.muted, lineHeight: 1.7 }}
                        className="mb-10 max-w-md text-base sm:text-lg"
                    >
                        This app is for Kaero employees only. Scan the code to install
                        it directly on your device — it isn\'t listed on the Play
                        Store, so this page is the only way to get it.
                    </p>

                    <ul className="mb-10 space-y-3">
                        {FEATURES.map((t) => (
                            <li key={t} className="flex items-start gap-3">
                                <span
                                    style={{ background: c.tealSoft }}
                                    className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                                >
                                    <Check size={10} color={c.ink} strokeWidth={3} />
                                </span>
                                <span style={{ fontFamily: "Inter", color: c.paper }} className="text-sm sm:text-base">
                                    {t}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* steps */}
                    <div
                        style={{ background: c.inkSoft, borderColor: "rgba(244,246,245,0.08)" }}
                        className="mb-8 rounded-2xl border p-6"
                    >
                        <p
                            style={{ fontFamily: "IBM Plex Mono", color: c.muted, letterSpacing: "0.12em" }}
                            className="mb-4 text-xs uppercase"
                        >
                            How to install
                        </p>
                        <ol className="space-y-3">
                            {STEPS.map((s, i) => (
                                <li key={s} className="flex items-start gap-3">
                                    <span
                                        style={{ fontFamily: "IBM Plex Mono", color: c.teal, borderColor: c.teal }}
                                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-xs"
                                    >
                                        {i + 1}
                                    </span>
                                    <span style={{ fontFamily: "Inter", color: c.muted }} className="text-sm leading-relaxed">
                                        {s}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <a
                        href={APK_URL}
                        style={{ background: c.teal, color: c.ink, fontFamily: "Inter" }}
                        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-105"
                    >
                        <Download size={16} />
                        Or download the APK directly
                    </a>
                </div>

                {/* Right: staff-badge QR card */}
                <div className="mt-16 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
                    <div className="relative" style={{ transform: "rotate(-1.2deg)" }}>
                        {/* lanyard hole */}
                        <div
                            style={{ background: c.ink }}
                            className="absolute left-1/2 top-0 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                        <div
                            style={{ borderColor: c.ink }}
                            className="absolute left-1/2 top-0 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" />

                        {/* access ribbon */}
                        <div
                            style={{
                                background: c.teal,
                                color: c.ink,
                                fontFamily: "IBM Plex Mono",
                                letterSpacing: "0.16em",
                                fontSize: "10px",
                                boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                            }}
                            className="absolute -right-3 -top-3 z-10 rounded-full px-3 py-1 font-semibold uppercase"
                        >
                            Employees only
                        </div>

                        <div
                            style={{ background: c.paper, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}
                            className="flex w-72 flex-col items-center rounded-2xl px-9 pb-8 pt-10 sm:w-80"
                        >
                            <p
                                style={{ fontFamily: "IBM Plex Mono", color: c.caption, letterSpacing: "0.14em" }}
                                className="mb-5 text-xs uppercase"
                            >
                                Kaero — Internal App
                            </p>

                            <img
                                src={QR_SRC}
                                alt="QR code to install the Kaero internal employee app"
                                className="h-48 w-48 sm:h-56 sm:w-56" />

                            <div className="my-6 w-full border-t border-dashed" style={{ borderColor: c.cardHair }} />

                            <p
                                style={{ fontFamily: "IBM Plex Mono", color: c.ink, letterSpacing: "0.16em" }}
                                className="text-xs uppercase"
                            >
                                Scan to install
                            </p>
                            <p style={{ fontFamily: "Inter", color: c.caption }} className="mt-2 text-center text-xs">
                                Open your phone\'s camera and point it at the code
                            </p>
                        </div>

                        <p
                            style={{ fontFamily: "IBM Plex Mono", color: c.muted, letterSpacing: "0.12em" }}
                            className="mt-4 text-center text-xs"
                        >
                            Internal build · {stamp} · v1.0.0.5
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div></>
    );
}
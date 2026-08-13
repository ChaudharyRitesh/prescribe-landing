import React from "react";
import { Check, Smartphone } from "lucide-react";

const QR_SRC = "/qr-code.png";

const c = {
    ink: "#101E28",
    paper: "#F4F6F5",
    teal: "#2E8F82",
    tealSoft: "#C9E6E1",
    amber: "#C98A2E",
    muted: "rgba(244,246,245,0.62)",
    cardHair: "#D8DBD6",
    caption: "#6C7570",
};

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
        <section id="download" style={{ background: c.ink }} className="relative w-full overflow-hidden py-24 px-6 sm:px-10 lg:px-16">
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    opacity: 0.05,
                    backgroundImage: `linear-gradient(${c.paper} 1px, transparent 1px), linear-gradient(90deg, ${c.paper} 1px, transparent 1px)`,
                    backgroundSize: "44px 44px",
                }}
            />

            <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                {/* Left: copy */}
                <div>
                    <div className="mb-7 flex items-center gap-3">
                        <span
                            style={{ fontFamily: "var(--font-ibm-plex-mono)", color: c.teal, letterSpacing: "0.14em" }}
                            className="text-xs uppercase"
                        >
                            Kaero · Prescribe
                        </span>
                        <span style={{ background: c.teal }} className="h-1 w-1 rounded-full" />
                        <span
                            style={{ fontFamily: "var(--font-ibm-plex-mono)", color: c.muted, letterSpacing: "0.14em" }}
                            className="text-xs uppercase"
                        >
                            Internal build · Android
                        </span>
                    </div>

                    <h2
                        style={{ fontFamily: "Space Grotesk", color: c.paper, lineHeight: 1.08 }}
                        className="mb-6 text-4xl font-semibold sm:text-5xl"
                    >
                        Your ward,
                        <br />
                        in your pocket.
                    </h2>

                    <p
                        style={{ fontFamily: "Inter", color: c.muted, lineHeight: 1.7 }}
                        className="mb-9 max-w-md text-base sm:text-lg"
                    >
                        Scan the code with your work phone to install the Kaero
                        Prescribe staff app directly. This build is distributed
                        internally to hospital staff only — it isn't on the Play Store.
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

                    <div className="flex items-start gap-2" style={{ color: c.muted }}>
                        <Smartphone size={15} className="mt-0.5 flex-shrink-0" />
                        <span style={{ fontFamily: "Inter" }} className="text-xs leading-relaxed">
                            Your phone will ask you to allow "install unknown apps" the
                            first time — that's expected for internal distribution
                            outside the Play Store.
                        </span>
                    </div>
                </div>

                {/* Right: staff-badge QR card */}
                <div className="flex justify-center lg:justify-end">
                    <div className="relative" style={{ transform: "rotate(-1.2deg)" }}>
                        {/* lanyard hole */}
                        <div
                            style={{ background: c.ink }}
                            className="absolute left-1/2 top-0 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        />
                        <div
                            style={{ borderColor: c.ink }}
                            className="absolute left-1/2 top-0 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
                        />

                        {/* access ribbon */}
                        <div
                            style={{
                                background: c.teal,
                                color: c.paper,
                                fontFamily: "var(--font-ibm-plex-mono)",
                                letterSpacing: "0.16em",
                                fontSize: "10px",
                                boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
                            }}
                            className="absolute -right-3 -top-3 z-10 rounded-full px-3 py-1 font-semibold uppercase"
                        >
                            Staff access
                        </div>

                        <div
                            style={{ background: c.paper, boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }}
                            className="flex w-72 flex-col items-center rounded-2xl px-9 pb-8 pt-10 sm:w-80"
                        >
                            <p
                                style={{ fontFamily: "var(--font-ibm-plex-mono)", color: c.caption, letterSpacing: "0.14em" }}
                                className="mb-5 text-xs uppercase"
                            >
                                Kaero Prescribe — Employee App
                            </p>

                            <img
                                src={QR_SRC}
                                alt="QR code to install the Kaero Prescribe internal staff app"
                                className="h-48 w-48 sm:h-52 sm:w-52"
                            />

                            <div className="my-6 w-full border-t border-dashed" style={{ borderColor: c.cardHair }} />

                            <p
                                style={{ fontFamily: "var(--font-ibm-plex-mono)", color: c.ink, letterSpacing: "0.16em" }}
                                className="text-xs uppercase"
                            >
                                Scan to install
                            </p>
                            <p style={{ fontFamily: "Inter", color: c.caption }} className="mt-2 text-center text-xs">
                                Open your phone's camera and point it at the code
                            </p>
                        </div>

                        <p
                            style={{ fontFamily: "var(--font-ibm-plex-mono)", color: c.muted, letterSpacing: "0.12em" }}
                            className="mt-4 text-center text-xs"
                        >
                            Internal build · {stamp} · v1.0.2
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
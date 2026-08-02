import React from "react";
import { Check, Smartphone, ArrowLeft, Download } from "lucide-react";
import { Footer } from "@/components/footer";
import Header from "@/components/header";

const QR_SRC = "data:image/png;base64,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I4AAAsUL+FZAePnK0Q8BBBBAoDABwqsweiZGAAEEEPAVILx85ejXVYB7EEAAgUAChFcgaKZBAAEEEMhOgPDKzpKREECgeAEqqIlAL1X3gxdV1YtHVUXV7eZzYKNPcT7zqLqtRVV9SgvWJ4mBvf9SsIKYqDYC9n2V5PvP2vigqGqQf3tU3efxWY9PH1X32szb9RaqNp55+UjTBwEEEECgUIGow6tQGSZHIEeBqVOnytixY+Xss8+Wn/70p7Lhhhs2nhkstNBCYs9CvvWtb0mfPn1kvfXWk80220y22mor2X///eWss86SO+64Q15++eUcq2NoBOIXILzi3yMqrIDABx98IH/+859lxx13lBVXXFFWWWUV2WGHHWT48OFy2WWXycSJExurnDlzprz33nsyffp0eemll2TSpEnyxBNPyIMPPiiXXHKJ/OpXv5Ltt99eVltttUbIfe9735Of/exncu6558qrr77aGIM/EKiDAOFVh11mjSkE0nW999575dBDD5W11167ETK33367TJs2Ld2gc3pbyD300EONUDzssMOkb9++sueeezbC8P3335/Tig8IVFOA8KrmvrKqAgXeffddGTVqlGy++eayzTbbyHnnnSczZszIvaLPPvtMrrvuusaPIS3IDjjgALnpppvkiy++yH1uJkAgtADhFVqc+Sot8Je//EW22GILOeqoo+TRRx8tbK1vv/22XHzxxbLbbrs1npGdcsop8tFHHxVWDxOnE6B3VwHCq6sJ9yDgLGC/l9pjjz1kv/32kylTpjj3z7OD/e7suOOOk/79+8uFF16Y51SMjUAwAcIrGDUTVVHgk08+kRNOOKHxbOv666+PeonPP/+8DBs2TOwiD/vxYtTFUhwCPQgQXj0AZf4wA1ZG4J577pEtt9xSRo4cKf/9739Lsy67yMMu7Nh9993lvvvuK03dFIpAswDh1azB5wgkFBg9erQMGjRInnrqqYQ94mt24403ytZbby0HHnhgfMVREQI9CBBePQDxMAKdBQ4++GD55S9/KZ9//nnnh8ry9Tx1XnTRRWJXJs5zJ18gELkA4RX5BlFeXAIDBgyQ888/P66iMqjGrky0F0BnMBRDIBBEoJfroYsd7YNU5zlJR40uH1WrdWilqvt6PLlr022ZZZaRBx54oLLrtaOnfve731VyfS7/FnS09YHo6Ovy0Wcenz4uNXW09ZlHNeG/PU3tOuZz+cgzL5/doU+tBF588UXZZJNNxF47VfWFn3jiiXLOOedUfZmsrwIChFcFNpEl5CcwefLkxu+3xo8fn98kkY185JFHNl7gHFlZlIPAPAKE1zwcfOEnUM1eb775puy7776N09+rucLuV2UXcPztb3/rvgGPIFCwAOFV8AYwfZwCn376qQwdOlTq9Iyr807Y7784UqqzCl/HIkB4xbIT1BGVgD3zuPPOO4PUZG9vYsdK2QG+48aNk86/tLYT4u31ZPa6LHv/r5/85Cey2GKL5V7bhAkTxAIs94kymoBh6iVAeNVrv1ltAoERI0bIlVdemaClfxN7w0kLrBtuuEHsLES7VN1eP7bpppt2GXTxxRcXe7PKXXfdVY444gi54oor5IMPPhB7exV7K5QVVlihS5+s7jjzzDPF3vwyq/EYB4GsBAivrCQZpxICe+21l5x00km5ruXwww9vnMxhgWWnvs8333xe89mbUv7xj38Ue4Z0xhlnyFprreU1Tk+d7NlXmY6/6mk9PF4NgTjDqxq2rKJkAvZM6Nprr82t6p133rnxOjG7FH3FFVfMbJ6ll15afv3rXzcC8YILLpBFF100s7FtoMcee6xxfqN9zg2BWAQIr1h2gjoKFfjrX/8qU6dOlQEDBmR6swNwf/Ob34gdhmtX79mJ7nktdIEFFpCDDjpIbr75ZlljjTUynebk72Ax2AAAEABJREFUk0/mEN9MRRksrQDhlVaQ/pUQsEvi7YT1plvjH+u0X19zzTVy2mmnNd4yJRTUgNkBbBeb2Mcs56zisVhZ+jBWWAHCK6w3syEQRKB3796N8O3Xr19m89mPVO09wTIbkIEQSCFAeKXAoysCsQvY78CyvBrRnknGvuZK1cdiuhXwDi/VMIcvqrrP0+1q2zzQ+bU1Sb5Wda8tybhZtGmzVB6qkYCdyXjJJZfIIossksmqr7vuukzGSTOIz98PVfe/q6ph+vhY+Bj4zOPTJ1Rt3uHlsyj6IIBAeIGBAweKBVgWMz/33HNiPz7MYizGQCCNAOGVRs+pL40RKE5gjz32kAMPPDCTAgivTBgZJKUA4ZUSkO4IlEXg6KOPluWXXz51uRZeXLiRmpEBUgoQXikB6Y5AWQRWXXVVsQDLol4u3MhCkTHSCBBeafToi0DJBOwUkSxO9/jXv/5VspVTbtUECK+q7SjrcRawc/vs5PbXX39d7M0nn3zySbn//vu9b2PHjpXrr79eLr/8chkzZoz84Q9/EHuh8ogRI2REgtvw4cNlyJAhsuOOO8r3v/992W677cRO6th///0bB/Mef/zxYifMOy90dge76nD33Xef/Vm6/wivdH717p3N6gmvbBwZpWQCF110kWywwQaiqmLHKi2xxBKy0korydprry12sruFhu9thx12ELtAwk7tsOOa7CT4Y445pnHgrx3629PN3vbEjquyU+Pvv/9+ueuuu8QuUbcrBi0I7agmC6ARs4PQh936+vRr7kN4NWvweRECvYqYlDkRKFLA/vG2K++eeeaZIstIPbeF4K233uo8jp2vuM466zj3a+5gb1L5wgsvNN/F5wgEFSC8gnJXbrLSLciexfj+yC3Gxd5yyy1eZfXv39+rX3Mnnn01a/B5aAHCK7Q48xUqMH78+ELnz3py3/XYj0TT1vLPf/4z7RD0R8BbgPDypqNjGQXsmVcZ6+6u5hkzZnT3UNv77Y0s2zZI8GA04ZWgVppUT4Dwqt6esqI2AvamjW0eLt1D06dP96rZLlBJ+6aV/NjQi55OGQlEH14+hzyqhjlQ06c2n31TdV+Pzzxl7TNu3LjGlXxJ6rcrAe1qwiRtq97mG9/4Rqol+v7IMtWkszur8vdhNoPzf6rubqrufZwLm91B1X2eyMJr9ir4DwEHAft//wcccIDYa7OSdrPL5FdfffWkzSvbLm142RWHlcVhYdELEF7RbxEFdicwdepU2XvvvWXSpElil4y/9tpr3TWd5/71119frr766sbruuZ5oGZfpA0v+9FjzchYbkQChFdEm0EpyQXeeOMNGTx4sEyYMGFuJ3tGNfeLHj7ZaKONGi/+XXbZZbu0rMsdL7/8cqqlpg2/VJPTufYChFftvwXKB/Dvf/9bBgwYIPbeUs3V33TTTc1f9vh537595fHHH5eyP4Ow4616XGynBp9//rkkfabaqevcL8vuNnchfFJKAcKrlNtW36I/+OAD6devn7z44otdEJ599lnnM//sSKgpU6bIwgsv3GW8stzh87untM+6zIZnXqaQ141xexIgvHoS4vFoBD755BOxCy2mTZvWbU2HHXaYvPrqq90+3uqBpZdeWt5880356le/2urh6O/zCa8s3o+LZ17Rf2tUukDCq9LbW53F/e9//xP7/dQ7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kEyA8ErmRKscBbp7vyvXKR9++GHpeLdi1755te8uuDrmu+KKK8T1EN+OvnxEIHqBHAskvHLEZehkAgcddJAsv/zyyRr30MquwLMT2ntoFuThnoKrowi7gCOrH592jMlHBKouQHhVfYdLsL7llltODjzwwMwqPeCAA8TeIyuzAT0GShpcHUP/4x//kEGDBnV8ydOk2I4AABAASURBVEcEEOhBIGh4qbof8thD/YU+bC9ydb0VWnAPk7dfyyyxx+0A1R6G8Xo4y2dfVsCOO+4ow4YNs0+D3yZOnCh2VaFdnOEyuR0FNXjwYLn66qtdutE2gYCq+7899v3uektQSpcmqu61qbr36TJxRHe4Olv7oOEVkRWlRCaQ9bMvW96FF14oFmIffvihfRnk9qc//Um23nprcQ2ujuJuu+02sTMN7YR6e0G0nd346aefdjzMRwQQmCNAeM2B4EPxAvbsa+WVV860EPvxoYWJfcx04E6DvfLKK40rB+11Yu+9916nR92/fPLJJ+W0006T7bffXr72ta813ieM14aJuEvSo6oChFdVd7aE67JnX8cff3zmlU+YMKHxDOxHP/qRPPjgg5mOP2PGjMYLju0kDrtyMNPBmwaz0z4IryYQPq29AOFV+2+BuADsYou99947l6KuueYasRM9bA47CirNJC+99FIjtDbZZBOxFxxPnz49zXBt++60006NUz/aNuJBBGomUFx41Qya5SYXsGdfyyyzTPIOji3tUvr+/fvLuuuuK8OHD0/0nlk2xTvvvCMXXXSRWJj06dMn99CyOZdYYgm5+eabxZ6V2tfcEEDg/wUIr/934M+IBNZaay2xAMu7JLuo4uyzzxa7RF1V5etf/7rYobc2/7e//W3ZcsstZb311pMVV1xR7P27ll566cYl/WkOARbH/7377ruOPWiOQD0ECK967HPpVmkH4doznJwLn2d4O4j3jTfekClTpsi4cePETuyYNGmSTJs2TT7++ON52ob4wi4HDjEPcyBQRgHCq4y7VpOa7cdl9qO9mix3nmUSXPNw8AUCXQQIry4k3BGTwLPPPit2pV1MNeVdC8GVt3Bk41OOlwDh5cVGp5AC77//fsjpCpvLznckuArjZ+KSCRBeJduwOpY733zzyQsvvFDppffr10/s922VXiSLQyBDAcIrQ0wRBstLwC5Nt8Nr8xq/yHHtwhQ7UaPIGpgbgbIJeIeX/XgjxC0UqM9aVKt1OKZqz+sp8tJtu3zd5t9ggw1CfVvkPs/Pf/7zxuu4cp+oQhP4/F31Wb5qz38fVOdt41NbqD4+Bj61qc5roprP197h5QNBHwTSCtiLdp9++unG663SjlV0/xNPPFHs8OCs62A8BOogQHjVYZcruMYxY8bIscceW8qV9e/fX+yFzpxVWMrto+hIBAivSDaCMtwFTjnlFLnrrrtk2223de9cQI9evXrJCSecIA888EDjoOACSmBKBAIJ5D8N4ZW/MTPkKGDBZQE2evToxjFOOU6VaujtttuuEVonnXSSzD///KnGojMCCIgQXnwXVELAjpN65JFHxD4uuOCC0azJXrs1atQosTeVtLdNiaYwCkGg5AKEV8k3MED5pZnCDtC1Z2DPPPOM2MUQa6yxRmG1Dxo0qHExxsSJExsn1xdWCBMjUFEBwquiG1vnZa2++uqN99qyELO3Pxk4cGAQjnXWWUeOO+44GT9+vIwdO1bsMvillloqyNxMgkDdBAivuu14jda7wAILyH777Sd33323PP/883LJJZfIsGHDZKONNspMoW/fvjJkyBC56aabxE6gHzlypGy88caZjc9AcwT4gEAnAcKrEwhfVlPA3qNr6NChcv7558uECRPE3ljylltukWOOOUYGDBggdvn6hhtuKGuuuab07t1bll12WVl88cVlwTm/P7P7d911Vzn66KMbIfjYY4+Jnblob59y6aWXyi677FJNOFaFQKQChFekG0NZ+QosueSSMnjwYDn11FPlvvvuEwujp556SiZPniyvvPKKzJgxoxFOM2fOFDtlwO6/8cYb5fe//70MHTq0EXYWbvlWyegIINCdQAHh1V0p3I8AAggggEAyAcIrmROtEEAAAQQiEiC8UmyG/TjJ9ZZiOqeuqiqqbrcka7EftzkVEmljyopLwA5cVk32/epTeZLv7c5tfOZRTbYG1fDtOq8vydc+BknGzaIN4eWzO/RBAAEEEChUgPAqlJ/JEUCgvgKsPI0A4ZVGj74IIIAAAoUIEF6FsDMpAggggEAaAcIrjd6XffkMAQQQQCCgAOEVEJupEEAAAQSyESC8snFkFASKF6ACBGokQHjVaLNZKgIIIFAVAcKrKjvJOhBAAIHiBYJVQHgFo2YiBBBAAIGsBAivrCQZBwEEEEAgmADhFYy6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";

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

const APK_URL = "https://pub-cb9254a2fac64ceb96d2a7118124cd3b.r2.dev/kaero-one.apk";

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
                            Internal build · {stamp} · v1.0.0
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div></>
    );
}
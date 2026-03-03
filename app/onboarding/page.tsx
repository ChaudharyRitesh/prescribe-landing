import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { OnboardingThemeProvider } from "@/components/onboarding/OnboardingThemeProvider";

export default function OnboardingPage() {
  return (
    <OnboardingThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="w-full max-w-5xl animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Kaero Prescribe Setup
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Welcome aboard. Let's get your healthcare facility's digital workspace up and running in just a few steps.
            </p>
          </div>

          <div className="bg-white rounded-[24px] shadow-2xl overflow-hidden border border-slate-100/60 ring-1 ring-slate-900/5">
            <OnboardingWizard />
          </div>
        </div>
      </div>
    </OnboardingThemeProvider>
  );
}

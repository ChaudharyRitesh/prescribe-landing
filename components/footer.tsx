"use client";

import {
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  Stethoscope,
  Building2,
  FlaskConical,
  Pill,
  Users,
  HeartPulse,
} from "lucide-react";

const productLinks = [
  { name: "OPD Management", href: "#modules", icon: Stethoscope },
  { name: "IPD Management", href: "#modules", icon: Building2 },
  { name: "Lab Management", href: "#modules", icon: FlaskConical },
  { name: "Pharmacy", href: "#modules", icon: Pill },
  { name: "Patient Portal", href: "#modules", icon: Users },
];

const solutionsLinks = [
  { name: "For Clinics", href: "#" },
  { name: "For Hospitals", href: "#" },
  { name: "For Diagnostic Labs", href: "#" },
  { name: "For Pharmacy Chains", href: "#" },
  { name: "Enterprise Solutions", href: "#" },
];

const resourcesLinks = [
  { name: "Documentation", href: "#" },
  { name: "API Reference", href: "#" },
  { name: "Case Studies", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Help Center", href: "#" },
];

const companyLinks = [
  { name: "About Us", href: "#" },
  { name: "Careers", href: "#" },
  { name: "Contact", href: "#" },
  { name: "Partners", href: "#" },
];

const legalLinks = [
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "HIPAA Compliance", href: "/compliance" },
  { name: "Security", href: "/compliance#security-controls" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="section-max-width section-padding py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Updated with KaeroPrescribe
              </h3>
              <p className="text-gray-400">
                Get the latest updates on healthcare technology and product
                features.
              </p>
            </div>
            <form
              action="mailto:support@kaerogroup.com"
              method="POST"
              encType="text/plain"
              className="flex w-full lg:w-auto gap-3"
            >
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-80 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Subscribe
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="section-max-width section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Kaero</span>
                <span className="text-xl font-bold text-blue-400">
                  Prescribe
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              The unified healthcare management platform that seamlessly
              integrates hospital operations, pharmacy management, clinical
              workflows, and laboratory systems into one intelligent ecosystem.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@kaerogroup.com"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              >
                <Mail size={16} className="text-blue-400" />
                support@kaerogroup.com
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin
                  size={16}
                  className="text-blue-400 mt-0.5 flex-shrink-0"
                />
                <span>Kolkata, West Bengal</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Modules
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <link.icon
                      size={14}
                      className="text-gray-500 group-hover:text-blue-400 transition-colors"
                    />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-3">
              {solutionsLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3 mb-8">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="section-max-width section-padding py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} KaeroPrescribe by Kaero Group. All
              rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                All Systems Operational
              </div>
              <span className="text-gray-700">|</span>
              <span className="text-xs text-gray-500">
                Made with ❤️ in India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

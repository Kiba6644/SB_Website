import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | BMSCE IEEE Student Branch',
  description: 'Privacy Policy and data protection guidelines for BMSCE IEEE Student Branch members and applicants.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/"
          className="text-xs text-text-muted hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-surface-dark border border-deep-navy/40 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-deep-navy/40">
          <div className="w-10 h-10 rounded-xl bg-primary-navy/40 border border-sky-blue/40 flex items-center justify-center text-sky-blue">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Privacy Policy</h1>
            <p className="text-xs text-text-muted mt-0.5">Last updated: September 2026 &bull; BMSCE IEEE Student Branch (Branch 06261)</p>
          </div>
        </div>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">1. Information We Collect</h2>
          <p>
            When registering for membership or participating in technical chapters at B.M.S. College of Engineering IEEE Student Branch, we collect the following academic and personal information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-text-body">
            <li><strong>Contact details:</strong> Full Name, Institutional Email Address, and Phone Number.</li>
            <li><strong>Academic identifiers:</strong> University Seat Number (USN), Engineering Department, and Year of Study.</li>
            <li><strong>IEEE Information:</strong> Existing IEEE Membership Number (if renewing or transferring).</li>
            <li><strong>Payment Verification:</strong> UPI transaction screenshots and UTR transaction reference numbers uploaded for reconciliation.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">2. How We Use Your Data</h2>
          <p>The information submitted is exclusively used to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-text-body">
            <li>Validate enrollment at B.M.S. College of Engineering.</li>
            <li>Reconcile UPI membership dues against bank account statements.</li>
            <li>Provision student memberships into selected technical chapters (CS, PES, PELS/IES, WIE, SSIT).</li>
            <li>Transmit roster credentials to IEEE Headquarters (IEEE.org) for official member onboarding.</li>
            <li>Dispatch automated confirmation receipts and branch communications.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">3. Data Storage & Security</h2>
          <p>
            All member profiles and uploaded proof documents are securely stored within encrypted database storage (Supabase). Payment verification screenshots are restricted to authorized Executive Committee administrators and are not indexed publicly or shared with commercial third parties.
          </p>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">4. Third-Party Disclosures</h2>
          <p>
            We do not sell, rent, or monetize student personal data. Data is shared strictly with the official IEEE organization (IEEE Region 10 / Bangalore Section) solely for issuing global memberships, access to IEEE Xplore, and credential issuance.
          </p>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">5. Contact & Data Rectification</h2>
          <p>
            Members may request data corrections, update contact numbers, or inquire about their record by emailing the branch executive team at <span className="text-sky-blue font-mono">ieee@bmsce.ac.in</span> or visiting the IEEE Student Branch room on the BMSCE campus.
          </p>
        </section>
      </div>
    </div>
  );
}

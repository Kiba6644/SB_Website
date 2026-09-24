import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | BMSCE IEEE Student Branch',
  description: 'Terms and conditions governing student membership and branch participation at BMSCE IEEE.',
};

export default function TermsPage() {
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Terms of Membership</h1>
            <p className="text-xs text-text-muted mt-0.5">BMSCE IEEE Student Branch (Branch 06261, Region 10)</p>
          </div>
        </div>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">1. Eligibility & Registration</h2>
          <p>
            Membership in the BMSCE IEEE Student Branch is open to currently enrolled undergraduate, postgraduate, and research scholars of B.M.S. College of Engineering, Bengaluru. Applicants must provide accurate institutional identification (USN and college email).
          </p>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">2. Payment & Membership Activation</h2>
          <p>
            Dues consist of a fixed Base Branch Membership plus variable fees for elected technical societies (Computer Society, PES, PELS/IES, WIE, SSIT).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-text-body">
            <li>Payments must be executed to the official branch UPI VPA as presented during checkout.</li>
            <li>Uploading a fraudulent, doctored, or non-matching transaction screenshot constitutes a disciplinary breach and results in immediate application revocation.</li>
            <li>Applications remain in <strong className="text-yellow-400">Pending Verification</strong> status until bank reconciliation by the Executive Committee Treasurer or Chair.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">3. IEEE Code of Ethics</h2>
          <p>
            All registered members pledge to uphold the highest ethical standards of the Institute of Electrical and Electronics Engineers (IEEE), including maintaining academic integrity, treating peers with respect, and fostering an inclusive engineering environment free from harassment.
          </p>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">4. IEEE.org Accounts & Duration</h2>
          <p>
            Local registration grants immediate access to branch activities, hackathons, and internal project mentorship. Official global credentials for IEEE.org and IEEE Xplore are provisioned separately in batches by the branch executive team and are valid for the active academic calendar year.
          </p>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">5. Amendments</h2>
          <p>
            The Executive Committee reserves the right to amend membership guidelines and event schedules in accordance with BMSCE institutional directives and IEEE Region 10 protocols.
          </p>
        </section>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | BMSCE IEEE Student Branch',
  description: 'Policy regarding dues, payment reversals, and cancellations for BMSCE IEEE membership.',
};

export default function RefundPolicyPage() {
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
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Refund &amp; Cancellation Policy</h1>
            <p className="text-xs text-text-muted mt-0.5">BMSCE IEEE Student Branch (Branch 06261, Region 10)</p>
          </div>
        </div>

        <div className="bg-primary-navy/15 border border-primary-navy/30 p-4 rounded-xl flex items-start gap-3 text-xs text-text-muted">
          <AlertCircle className="w-4 h-4 text-sky-blue shrink-0 mt-0.5" />
          <p>
            Please review this policy before making UPI payments. All dues collected directly support student branch operations, technical symposiums, and global IEEE chapter enrollments.
          </p>
        </div>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">1. Non-Refundable Post-Verification</h2>
          <p>
            Once a membership registration is reviewed, validated, and marked as <strong className="text-green-400">Verified</strong> by the branch executive team, dues become <strong>non-refundable</strong>. This is because roster funds are immediately earmarked for student branch kits and processed for international chapter affiliation fees.
          </p>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">2. Duplicate or Erroneous Transactions</h2>
          <p>
            If a student is charged multiple times due to a UPI network timeout, banking glitch, or accidental double submission:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-text-body">
            <li>The student must submit a refund request to <span className="text-sky-blue font-mono">ieee@bmsce.ac.in</span> within <strong>5 calendar days</strong> of the transaction.</li>
            <li>Requests must include the bank statement showing both debits, the order reference number, and corresponding UTRs.</li>
            <li>Verified duplicate charges will be refunded directly to the originating bank account within 5–7 business days after reconciliation.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">3. Rejected Applications</h2>
          <p>
            If an application is marked as <strong className="text-red-400">Rejected</strong> (e.g. illegible screenshot, unverified UTR, or incomplete transfer):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-text-body">
            <li>The student is granted opportunity to <strong>Resubmit Payment Proof</strong> via their member dashboard without incurring any new fee.</li>
            <li>If the student chooses not to continue and the bank confirms funds were received, a full reversal may be authorized upon written request prior to roster submission.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-text-muted leading-relaxed">
          <h2 className="text-base font-bold text-white uppercase tracking-wider text-xs">4. Contact Information</h2>
          <p>
            For all payment inquiries, transaction reconciliation, or reversal disputes, contact:
          </p>
          <div className="bg-bg-dark border border-deep-navy/40 p-4 rounded-xl text-xs space-y-1 font-mono text-text-muted">
            <p className="text-white font-semibold">Treasurer / Executive Committee</p>
            <p>BMSCE IEEE Student Branch (Branch 06261)</p>
            <p>Email: ieee@bmsce.ac.in</p>
            <p>Address: B.M.S. College of Engineering, Bull Temple Road, Bengaluru 560019</p>
          </div>
        </section>
      </div>
    </div>
  );
}

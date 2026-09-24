import Image from "next/image";
import Link from "next/link";
import { Cpu, Zap, Radio, Users, Compass, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

const CHAPTERS_DATA = [
  {
    code: "CS",
    badge: "IEEE CS &middot; CHAPTER 01",
    name: "IEEE Computer Society",
    tagline: "Software Architectures, Algorithms & AI Systems",
    description: "Fostering software engineering, algorithmic design, artificial intelligence, and open systems. Hosts the 24-hour IEEEXtreme hackathons, developer bootcamps, and technical sprints.",
    tracks: "Systems, Web Architectures, AI/ML, Cloud Computing",
    icon: Cpu,
    accent: "border-sky-blue/40 text-sky-blue",
    featured: true,
  },
  {
    code: "PES",
    badge: "IEEE PES &middot; CHAPTER 02",
    name: "Power & Energy Society",
    tagline: "Clean Tech, Smart Grids & Microgeneration",
    description: "Specializing in renewable microgrids, energy storage technology, power distribution systems, electric mobility, and intelligent sensor networks.",
    tracks: "Smart Grids, Clean Tech, EV Powertrains",
    icon: Zap,
    accent: "border-green-500/40 text-green-400",
    featured: false,
  },
  {
    code: "PELS/IES",
    badge: "PELS & IES &middot; JOINT 03",
    name: "Power & Industrial Electronics",
    tagline: "PCB Fabrication, Power Drives & Automation",
    description: "Hands-on electronic prototyping, power converter topologies, semiconductor design, sensor interfacing, and industrial automation controls.",
    tracks: "PCB Design, Embedded Drives, Industrial IoT",
    icon: Radio,
    accent: "border-yellow-500/40 text-yellow-400",
    featured: false,
  },
  {
    code: "WIE",
    badge: "IEEE WIE &middot; AFFINITY 04",
    name: "Women in Engineering",
    tagline: "Mentorship, Leadership & STEM Advancement",
    description: "A globally affiliated community empowering female technologists and leaders through skill intensives, executive mentorship, and research initiatives.",
    tracks: "Executive Mentorship, STEM Outreach, Research Grants",
    icon: Users,
    accent: "border-pink-500/40 text-pink-400",
    featured: false,
  },
  {
    code: "SSIT",
    badge: "IEEE SSIT &middot; CHAPTER 05",
    name: "Social Implications of Tech",
    tagline: "Tech Ethics, Sustainable Policy & Civic Tech",
    description: "Investigating engineering ethics, AI governance, technological sustainability, and civic technology built for humanitarian and social progress.",
    tracks: "AI Ethics, Public Policy, Humanitarian Engineering",
    icon: Compass,
    accent: "border-purple-500/40 text-purple-400",
    featured: false,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative pt-20 pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00377E1a_1px,transparent_1px),linear-gradient(to_bottom,#00377E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative w-44 h-20">
              <Image 
                src="/BMSCE IEEE.png" 
                alt="BMSCE IEEE Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-navy/40 border border-sky-blue/30 text-sky-blue text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-orange animate-ping"></span>
            <span>Annual Membership Drive 2026 is LIVE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
            Innovate. <span className="text-primary-orange">Lead.</span> Inspire.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the premier technical student branch of B.M.S. College of Engineering. 
            Level up your engineering capabilities, build projects in specialized chapters, and gain global IEEE credentials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/membership/register" 
              className="bg-primary-orange hover:bg-orange-accent text-white px-8 py-3.5 rounded-xl text-base font-bold transition-all shadow-[0_0_20px_rgba(242,102,37,0.3)] hover:shadow-[0_0_30px_rgba(255,83,0,0.5)] flex items-center gap-2"
            >
              <span>Become a Member</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#chapters" 
              className="bg-surface-dark hover:bg-primary-navy/40 border border-deep-navy text-white px-7 py-3.5 rounded-xl text-base font-medium transition-colors"
            >
              Explore Chapters
            </a>
          </div>
        </div>
      </section>

      {/* Chapters Bento Section */}
      <section id="chapters" className="py-24 bg-surface-dark/40 border-t border-deep-navy/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-orange">Technical Verticals</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">
              Society Chapters &amp; Affinity Groups
            </h2>
            <p className="text-sm md:text-base text-text-muted leading-relaxed">
              Dedicated engineering verticals providing student developers, hardware designers, and researchers with focused domains, hands-on bootcamps, and international IEEE resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {CHAPTERS_DATA.map((ch) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.code}
                  className={`bg-surface-dark p-7 rounded-2xl border transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl ${
                    ch.featured 
                      ? 'md:col-span-2 bg-gradient-to-br from-surface-dark to-primary-navy/20 border-sky-blue/40 shadow-lg' 
                      : 'border-deep-navy/40 hover:border-deep-navy'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${ch.accent}`}>
                        {ch.code} &bull; Chapter
                      </span>
                      <Icon className="w-6 h-6 text-text-muted" />
                    </div>

                    <h3 className="font-extrabold text-xl text-white mb-1.5">{ch.name}</h3>
                    <p className="text-xs font-medium text-sky-blue mb-3">{ch.tagline}</p>
                    <p className="text-xs text-text-muted leading-relaxed mb-6">{ch.description}</p>
                  </div>

                  <div className="pt-4 border-t border-deep-navy/40">
                    <p className="text-[10px] uppercase font-bold text-text-muted mb-1">Key Focus Tracks</p>
                    <p className="text-xs font-medium text-text-body mb-4">{ch.tracks}</p>
                    
                    <Link
                      href="/membership/register"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-orange hover:text-orange-accent transition-colors"
                    >
                      <span>Join this chapter</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-deep-navy/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-surface-dark border border-deep-navy/40 p-8 md:p-12 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-primary-navy/40 border border-sky-blue/40 flex items-center justify-center mx-auto text-sky-blue">
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">About BMSCE IEEE</h2>
            
            <div className="space-y-4 text-text-muted text-sm md:text-base leading-relaxed text-left max-w-2xl mx-auto">
              <p>
                Founded to cultivate technological excellence and engineering leadership, the <strong className="text-white">BMSCE IEEE Student Branch (Branch 06261, Region 10)</strong> bridges academia with world-class engineering standards.
              </p>
              <p>
                Through our active technical chapters (Computer Society, PES, PELS/IES, WIE, and SSIT), students participate in 24-hour hackathons, publish peer-reviewed papers, organize international symposiums, and build lifelong networks with senior engineering professionals.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-blue" />
                <span>IEEE Region 10 Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-blue" />
                <span>5 Technical Societies</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-blue" />
                <span>Annual Membership Drive</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership CTA Section */}
      <section id="membership" className="py-28 relative overflow-hidden bg-gradient-to-b from-transparent to-primary-navy/10 border-t border-deep-navy/30">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-orange">Membership Drive</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-6">Ready to Build Your Engineering Career?</h2>
          <p className="text-base md:text-lg text-text-muted mb-10 leading-relaxed">
            Create your account today, customize your chapters in the shopping cart, and complete your registration via any UPI app.
          </p>
          <Link 
            href="/membership/register"
            className="inline-flex items-center gap-2.5 bg-primary-orange hover:bg-orange-accent text-white font-bold py-4 px-9 rounded-2xl text-base transition-all shadow-[0_0_25px_rgba(242,102,37,0.35)] hover:shadow-[0_0_35px_rgba(255,83,0,0.5)]"
          >
            <span>Start Registration Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

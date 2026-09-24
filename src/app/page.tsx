import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00377E1a_1px,transparent_1px),linear-gradient(to_bottom,#00377E1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative w-48 h-24">
              <Image 
                src="/BMSCE IEEE.png" 
                alt="BMSCE IEEE Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Innovate. <span className="text-primary-orange">Lead.</span> Inspire.
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10">
            Join the official IEEE student branch of B.M.S. College of Engineering. 
            Advance your technological skills, participate in technical chapters, and build engineering excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/membership/register" className="bg-primary-orange hover:bg-orange-accent text-white px-8 py-3 rounded-md text-lg font-bold transition-all shadow-[0_0_20px_rgba(242,102,37,0.3)] hover:shadow-[0_0_30px_rgba(255,83,0,0.5)]">
              Become a Member
            </a>
            <a href="#chapters" className="bg-surface-dark hover:bg-primary-navy border border-deep-navy text-white px-8 py-3 rounded-md text-lg font-medium transition-colors">
              Our Chapters
            </a>
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section id="chapters" className="py-20 bg-surface-dark/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technical Chapters</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Dive deep into specialized domains through our five technical societies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {['Computer Society', 'Power & Energy', 'PELS & IES', 'Women In Engineering', 'SSIT'].map((chapter) => (
              <div key={chapter} className="bg-surface-dark p-6 rounded-xl border border-deep-navy/30 text-center hover:border-sky-blue transition-colors">
                <div className="w-12 h-12 bg-primary-navy/20 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-blue font-bold text-xl">
                  {chapter.charAt(0)}
                </div>
                <h3 className="font-bold text-lg mb-2">{chapter}</h3>
                <p className="text-sm text-text-muted">Explore the frontiers of {chapter.toLowerCase()}.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-surface-dark/30 border-y border-deep-navy/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About BMSCE IEEE</h2>
            <div className="prose prose-invert mx-auto text-text-muted">
              <p className="mb-4">
                [Placeholder content - Final copy to be supplied by the branch]
              </p>
              <p>
                Since our inception, the BMSCE IEEE Student Branch has been dedicated to fostering technological innovation and excellence for the benefit of humanity. We provide a platform for students to network, learn, and grow as engineers and leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Membership CTA Section */}
      <section id="membership" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-navy/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the Community</h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10">
              Ready to take the next step in your engineering journey? Create an account to select your chapters and join the BMSCE IEEE Student Branch.
            </p>
            <a 
              href="/membership/register"
              className="inline-block bg-primary-orange hover:bg-orange-accent text-white font-bold py-4 px-8 rounded-md transition-all shadow-[0_0_20px_rgba(242,102,37,0.3)] hover:shadow-[0_0_30px_rgba(255,83,0,0.5)]"
            >
              Start Registration
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

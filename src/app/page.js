"use client"
import Link from "next/link"
import { ArrowRight, Copy, BarChart2, ExternalLink, Menu, X } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function Navigation({ mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <nav className="flex items-center justify-between max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-8">nexus</h1>
        <div className="hidden md:flex space-x-6">
          <Link href="#features" className="text-gray-600 hover:text-black">
            Features
          </Link>
          <Link href="#resources" className="text-gray-600 hover:text-black">
            Resources
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-black">
            About
          </Link>
          <Link href="#enterprise" className="text-gray-600 hover:text-black">
            Enterprise
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-black">
            Pricing
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Link href="/access-account" className="text-gray-600 hover:text-black hidden sm:block">
          Log in
        </Link>
        <Link
          href="/access-account"
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hidden sm:block"
        >
          Sign up
        </Link>
        <button className="block md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6 text-black z-10" color="black" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </nav>
  )
}

function MobileMenu({ mobileMenuOpen, setMobileMenuOpen }) {
  if (!mobileMenuOpen) return null

  return (
    <div className="fixed inset-0 bg-white z-50 pt-20 px-4 md:hidden ">
      <div className="flex flex-col space-y-6 text-center relative">
        <button
          className="block md:hidden absolute -top-[10vh] right-0 p-2 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-black z-10" color="black" /> : <Menu className="h-6 w-6" />}
        </button>
        <Link href="#features" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
          Features
        </Link>
        <Link href="#resources" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
          Resources
        </Link>
        <Link href="#about" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
          About
        </Link>
        <Link href="#enterprise" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
          Enterprise
        </Link>
        <Link href="#pricing" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
          Pricing
        </Link>
        <div className="pt-6 border-t border-gray-100">
          <Link href="/login" className="block py-3 text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 inline-block mt-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-16 sm:pt-24 pb-12 sm:pb-20 text-center">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
        Teacher-Student Interaction
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-bl from-orange-300 to-red-400">
          Just Got Better!
        </span>{" "}
      </h2>

      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 sm:mb-10">
        Connect with Students Without Compromising Privacy And Help Students Even on your break!
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 sm:mb-12">
        <Link href="/access-account" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 font-medium">
          Start for free
        </Link>
        <Link
          href="/access-account"
          className="border border-gray-300 px-6 py-3 rounded-md hover:border-gray-500 font-medium"
        >
          Get a demo
        </Link>
      </div>

      <div className="text-sm text-muted-foreground flex justify-center items-center mb-6 sm:mb-8">
        <span className="mr-2">Try Out Our Demo!</span>
      </div>

      <DemoInput />
    </div>
  )
}

function DemoInput() {
  return (
    <div className="max-w-2xl mx-auto mb-16 sm:mb-24 border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-white p-4 flex">
        <input
          type="text"
          placeholder="Enter student question..."
          className="flex-1 outline-none text-base sm:text-lg"
        />
        <button className="bg-black text-white p-2 rounded">
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <Avatar>
              <AvatarImage src="https://thispersondoesnotexist.com/" alt="teacher" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">computer networks subject llm</p>
              <p className="text-xs text-muted-foreground">→ Some computer networks faculty</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-muted-foreground">
              <BarChart2 className="h-4 w-4 mr-1" />
              <span className="text-sm">52K responses</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <Copy className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function UniversityLogos({ universities }) {
  return (
    <div className="border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-sm text-muted-foreground mb-10 sm:mb-20 mx-auto text-center">
          Giving teachers superpowers in world-class institutions
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center">
          {universities.map((university) => (
            <div key={university.name} className="flex flex-col items-center">
              <img
                src={university.logo || "/placeholder.svg"}
                alt={`${university.name} logo`}
                className="h-12 sm:h-16 w-auto mb-3 object-contain"
              />
              <div className="text-gray-400 text-base sm:text-lg font-medium">{university.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeaturesSection() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
          Powerful features for
          <br className="hidden sm:block" />
          modern educators
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Nexus is more than just a communication tool. We've built a suite of powerful features that gives you teaching
          superpowers.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-6 sm:gap-8">
        <FeatureCard
          title="Intelligent Chat Routing"
          description="Set up your availability hours, and let Nexus handle the rest. AI answers when you're unavailable."
          demo={
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-300 rounded-full mr-2 sm:mr-3"></div>
                <div className="text-left">
                  <p className="font-medium text-sm sm:text-base">math.nexus.to</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">42.6K responses</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm">Active</div>
            </div>
          }
        />

        <FeatureCard
          title="Privacy Protection"
          description="Keep your personal contact details private while maintaining open communication with students."
          demo={
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gray-300 rounded-full mr-2 sm:mr-3"></div>
                <p className="font-medium text-sm sm:text-base">science.nexus.to</p>
              </div>
              <div className="flex items-center">
                <p className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Protected</p>
              </div>
            </div>
          }
        />

        <FeatureCard
          title="AI Response Training"
          description="Upload your teaching materials to help Nexus provide accurate responses in your style."
          demo={
            <div className="h-24 sm:h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
              <p className="text-muted-foreground text-sm sm:text-base">Upload lecture notes or syllabus</p>
            </div>
          }
        />

        <FeatureCard
          title="Analytics Dashboard"
          description="Track student engagement, common questions, and AI response quality."
          demo={
            <div className="h-24 sm:h-32 flex items-center justify-center">
              <div className="w-full h-12 sm:h-16 bg-card rounded flex items-end">
                <div className="h-3 sm:h-4 w-1/6 bg-foreground mx-1"></div>
                <div className="h-6 sm:h-8 w-1/6 bg-foreground mx-1"></div>
                <div className="h-8 sm:h-10 w-1/6 bg-foreground mx-1"></div>
                <div className="h-12 sm:h-16 w-1/6 bg-foreground mx-1"></div>
                <div className="h-10 sm:h-12 w-1/6 bg-foreground mx-1"></div>
                <div className="h-5 sm:h-6 w-1/6 bg-foreground mx-1"></div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description, demo }) {
  return (
    <div className="bg-card p-6 sm:p-8 rounded-lg border border-muted">
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="p-4 sm:p-6 rounded border border-muted">{demo}</div>
    </div>
  )
}

function CTASection() {
  return (
    <div className="py-16 sm:py-24 max-w-6xl mx-auto px-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">Ready to transform your student communication?</h2>
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8">
        Start for free and upgrade as your needs grow.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href="/signup" className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 font-medium">
          Get started
        </Link>
        <Link href="/contact" className="border border-gray-300 px-6 py-3 rounded-md hover:border-gray-500 font-medium">
          Contact sales
        </Link>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-foreground-muted py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          <FooterColumn title="Product">
            <FooterLink href="#" text="Features" />
            <FooterLink href="#" text="Pricing" />
            <FooterLink href="#" text="Enterprise" />
          </FooterColumn>

          <FooterColumn title="Company">
            <FooterLink href="#" text="About" />
            <FooterLink href="#" text="Careers" />
            <FooterLink href="#" text="Contact" />
          </FooterColumn>

          <FooterColumn title="Legal" className="sm:col-span-2 md:col-span-1">
            <FooterLink href="/privacy" text="Privacy" />
            <FooterLink href="/tos" text="Terms" />
            <FooterLink href="/security" text="Security" />
          </FooterColumn>

          <div className="col-span-2 sm:col-span-3 md:col-span-1 mt-8 md:mt-0">
            <h3 className="font-bold mb-4">Nexus</h3>
            <p className="text-muted-foreground">© 2025 Nexus, Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children, className = "" }) {
  return (
    <div className={className}>
      <h3 className="font-bold mb-4">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

function FooterLink({ href, text }) {
  return (
    <li>
      <Link href={href} className="text-muted-foreground hover:text-black">
        {text}
      </Link>
    </li>
  )
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const universities = [
    {
      name: "Harvard",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/70/Harvard_University_logo.svg",
    },
    {
      name: "Stanford",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Stanford_plain_block_%22S%22_logo.svg",
    },
    {
      name: "MIT",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg",
    },
    {
      name: "Princeton",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Princeton_seal.svg",
    },
    {
      name: "Yale",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Yale_University_Shield_1.svg",
    },
  ]

  return (
    <main className="font-sans">
      <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <HeroSection />
      <UniversityLogos universities={universities} />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  )
}

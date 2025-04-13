"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <>
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
            </Link>{" "}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/login" className="text-gray-600 hover:text-black hidden sm:block">
            Log in
          </Link>
          <Link href="/signup" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 hidden sm:block">
            Sign up
          </Link>
          <button className="block md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-black z-10" color="black" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
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
      )}
    </>
  )
}

import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="px-6 py-20 md:flex md:items-center md:justify-between">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold mb-6">
            Monetize your mobile game with ease
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            A powerful tool to create customized in-game offer screens,
            schedule campaigns, and A/B test monetization flows — all without
            devs.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
              Book a Demo
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50">
              Join Waitlist
            </button>
          </div>
        </div>
        <div className="mt-12 md:mt-0 md:ml-12">
          <img
            src="/assets/phone-preview.png"
            alt="App Screenshot"
            className="w-[320px] mx-auto"
          />
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-10">
          LiveOps is broken for monetization teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-2">❌ Offers take too long</h3>
            <p>Teams wait weeks for implementation and QA.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">❌ Requires dev time</h3>
            <p>Every change depends on engineers and game updates.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">❌ No visibility</h3>
            <p>A/B tests and campaigns are managed in spreadsheets.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img
              src="/assets/editor-preview.png"
              alt="Design Offers"
              className="rounded-lg shadow mb-4"
            />
            <h3 className="font-bold text-xl mb-2">🎨 Visual Offer Builder</h3>
            <p>Create and preview offers with flexible layouts and design.</p>
          </div>
          <div>
            <img
              src="/assets/calendar-preview.png"
              alt="Schedule Events"
              className="rounded-lg shadow mb-4"
            />
            <h3 className="font-bold text-xl mb-2">📆 Campaign Calendar</h3>
            <p>Plan and manage LiveOps with drag-and-drop scheduling.</p>
          </div>
          <div>
            <img
              src="/assets/ab-preview.png"
              alt="A/B Testing"
              className="rounded-lg shadow mb-4"
            />
            <h3 className="font-bold text-xl mb-2">🧪 A/B Testing</h3>
            <p>Compare variants, segment players, and iterate fast.</p>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="bg-gray-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-12">Built for Every Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-2">🎯 Monetization Leads</h3>
            <p>Launch and optimize offers faster with zero dependency.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">🧠 LiveOps Managers</h3>
            <p>Centralize scheduling, QA, and reporting workflows.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">🧑‍💻 Indie Studios</h3>
            <p>Get AAA-level monetization tools without extra headcount.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to boost your game revenue?
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Join the waitlist or schedule a live walkthrough with our founder.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
            Get Access
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50">
            Book a Demo
          </button>
        </div>
      </section>
    </div>
  );
}


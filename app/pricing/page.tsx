"use client";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        All Features Are Now Free!
      </h1>
      <p className="mb-4 text-center text-lg">
        🎉 All features are now accessible without authentication!
      </p>
      <div className="text-center">
        <div className="border rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-green-600">
            All Features Unlocked!
          </h2>
          <ul className="mb-6 text-left space-y-2">
            <li>✅ Unlimited color palettes</li>
            <li>✅ All export options</li>
            <li>✅ Full feature access</li>
            <li>✅ Edit and save palettes</li>
            <li>✅ Contrast grid access</li>
            <li>✅ Browse community palettes</li>
          </ul>
          <p className="text-2xl font-bold mb-4 text-green-600">
            Free Forever!
          </p>
          <button
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
            disabled
          >
            All Features Active
          </button>
        </div>
      </div>
    </div>
  );
}

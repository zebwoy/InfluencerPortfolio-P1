import ClientPortfolio from "./ClientPortfolio";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">

        {/* Header Section */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            My Work
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Helping brands connect with people through design, storytelling, and interactive experiences.
          </p>
        </div>

        {/* Portfolio Grid */}
        <ClientPortfolio />
      </div>
    </div>

  );
}


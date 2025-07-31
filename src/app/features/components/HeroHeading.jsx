export default function HeroHeading() {
  return (
    <div className="space-y-10">
      <h1 className="text-5xl md:text-6xl font-black text-teal-900 leading-tight max-w-4xl mx-auto">
        Transform Your Workflow
      </h1>
      <div className="flex flex-col items-center space-y-1">
        <span className="text-lg md:text-xl font-normal text-teal-800 tracking-wide mb-1">
          with
        </span>
        <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
          Smart Features
        </span>
      </div>
    </div>
  );
}

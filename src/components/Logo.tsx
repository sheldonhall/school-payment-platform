export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 bg-school-red-600 rounded-lg flex items-center justify-center shadow-md">
        <span className="text-school-gold-400 font-serif font-bold text-sm">MRGS</span>
      </div>
      <div className="flex flex-col">
        <span className="text-school-red-600 font-serif font-bold text-lg leading-none">
          Maria Regina
        </span>
        <span className="text-school-red-600 text-xs font-sans leading-none mt-0.5">
          Grade School
        </span>
      </div>
    </div>
  );
}

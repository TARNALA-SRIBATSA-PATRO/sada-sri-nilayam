import useScrollReveal from "@/hooks/useScrollReveal";

const FamilyMessage = () => {
  const { ref, visible } = useScrollReveal();

  const parentStyle = {
    color: "hsl(345, 72%, 24%)",
    textShadow: "0 1px 3px hsla(345, 70%, 28%, 0.2)",
  };
  const coupleStyle = {
    color: "hsl(345, 72%, 24%)",
    textShadow: "0 1px 3px hsla(345, 70%, 28%, 0.15)",
  };
  const childStyle = {
    color: "hsl(345, 55%, 35%)",
    textShadow: "0 1px 2px hsla(345, 70%, 28%, 0.1)",
  };

  return (
    <section
      ref={ref}
      className="py-6 sm:py-16 md:py-24 px-4 sm:px-6 relative"
      style={{
        background: "linear-gradient(180deg, hsl(40, 33%, 96%) 0%, hsl(38, 30%, 92%) 50%, hsl(40, 33%, 96%) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="section-divider mb-4 sm:mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        />

        <h2
          className="text-display text-base sm:text-2xl md:text-3xl lg:text-4xl text-foreground font-medium italic px-2 sm:px-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            filter: visible ? "blur(0px)" : "blur(4px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            lineHeight: 1.4,
          }}
        >
          "We are not just waiting, we are truly looking forward to welcoming you."
        </h2>

        {/* Elegant Family Signatures Card — Compact & Mobile-First */}
        <div
          className="mt-4 sm:mt-12 py-4 px-4 sm:p-8 md:p-10 relative rounded-xl mx-auto max-w-sm sm:max-w-lg md:max-w-2xl"
          style={{
            background: "linear-gradient(135deg, hsl(40, 45%, 99%), hsl(38, 35%, 95%))",
            border: "1px solid hsla(43, 85%, 52%, 0.5)",
            boxShadow: "0 12px 48px hsla(345, 70%, 28%, 0.14), 0 2px 8px hsla(345, 70%, 28%, 0.08), inset 0 1px 0 hsla(43, 85%, 52%, 0.2)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(15px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
          }}
        >
          {/* Subtle corner flourishes */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 border-t border-l border-[hsla(43,85%,52%,0.5)] rounded-tl-lg sm:rounded-tl-xl" />
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 border-t border-r border-[hsla(43,85%,52%,0.5)] rounded-tr-lg sm:rounded-tr-xl" />
          <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-6 h-6 sm:w-8 sm:h-8 border-b border-l border-[hsla(43,85%,52%,0.5)] rounded-bl-lg sm:rounded-bl-xl" />
          <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-8 sm:h-8 border-b border-r border-[hsla(43,85%,52%,0.5)] rounded-br-lg sm:rounded-br-xl" />

          <p
            className="text-body-serif text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-4 sm:mb-6 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-semibold"
            style={{ color: "hsl(345, 40%, 45%)" }}
          >
            With Warmth & Excitement
          </p>

          {/* Parents — featured prominently */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-5">
            <span
              className="text-script text-[22px] sm:text-3xl md:text-4xl transition-all duration-500 hover:scale-105 drop-shadow-sm cursor-default"
              style={parentStyle}
            >Deenabandhu</span>
            <span className="text-[hsla(43,85%,52%,0.7)] text-[10px] sm:text-xs">&</span>
            <span
              className="text-script text-[22px] sm:text-3xl md:text-4xl transition-all duration-500 hover:scale-105 drop-shadow-sm cursor-default"
              style={parentStyle}
            >Sabita</span>
          </div>

          {/* Gold separator */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="h-px flex-1 max-w-[40px] sm:max-w-[70px]" style={{ background: "linear-gradient(90deg, transparent, hsla(43, 85%, 52%, 0.45))" }} />
            <span className="text-[hsla(43,85%,52%,0.55)] text-[8px] sm:text-[10px]">❖</span>
            <div className="h-px flex-1 max-w-[40px] sm:max-w-[70px]" style={{ background: "linear-gradient(90deg, hsla(43, 85%, 52%, 0.45), transparent)" }} />
          </div>

          {/* Couples — side by side on all screens */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-4 sm:mb-5 flex-wrap">
            {[
              ["Bikrant", "Boobly"],
              ["Rakesh", "Joobly"],
            ].map(([name1, name2], i, arr) => (
              <div key={i} className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="text-script text-base sm:text-xl md:text-2xl transition-all duration-500 hover:scale-105 drop-shadow-sm cursor-default"
                  style={coupleStyle}
                >{name1}</span>
                <span className="text-[hsla(43,85%,52%,0.6)] text-[7px] sm:text-[9px]">✦</span>
                <span
                  className="text-script text-base sm:text-xl md:text-2xl transition-all duration-500 hover:scale-105 drop-shadow-sm cursor-default"
                  style={coupleStyle}
                >{name2}</span>
                {/* Divider dot between couples on larger screens */}
                {i < arr.length - 1 && (
                  <span className="hidden sm:inline text-[hsla(43,85%,52%,0.4)] text-[6px] ml-2 sm:ml-4">●</span>
                )}
              </div>
            ))}
          </div>

          {/* Thin separator */}
          <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
            <div className="h-px flex-1 max-w-[30px] sm:max-w-[50px]" style={{ background: "linear-gradient(90deg, transparent, hsla(43, 85%, 52%, 0.3))" }} />
            <span className="text-[hsla(43,85%,52%,0.4)] text-[6px] sm:text-[8px]">✦</span>
            <div className="h-px flex-1 max-w-[30px] sm:max-w-[50px]" style={{ background: "linear-gradient(90deg, hsla(43, 85%, 52%, 0.3), transparent)" }} />
          </div>

          {/* Children — flowing line with separators */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1.5">
            {["Prisha", "Trisha", "Bibhu", "Aahan"].map((name, i) => (
              <div key={name} className="flex items-center gap-2 sm:gap-3">
                <span
                  className="text-script text-sm sm:text-lg md:text-xl transition-all duration-500 hover:scale-110 drop-shadow-sm cursor-default"
                  style={childStyle}
                >{name}</span>
                {i < 3 && <span className="text-[hsla(43,85%,52%,0.4)] text-[5px] sm:text-[7px]">✦</span>}
              </div>
            ))}
          </div>
        </div>

        <div
          className="section-divider mt-5 sm:mt-16"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.9s",
          }}
        />
      </div>
    </section>
  );
};

export default FamilyMessage;

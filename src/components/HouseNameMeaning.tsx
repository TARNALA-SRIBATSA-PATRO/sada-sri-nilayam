import { useState } from "react";
import useScrollReveal from "@/hooks/useScrollReveal";

const HouseNameMeaning = () => {
  const { ref, visible } = useScrollReveal();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section
      ref={ref}
      className="py-10 sm:py-16 md:py-28 px-3 sm:px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(40, 33%, 96%) 0%, hsl(38, 30%, 92%) 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2
            className="text-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4"
            style={{
              color: "hsl(345, 70%, 28%)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            The Essence of Sada Sri Nilayam
          </h2>
          <div
            className="section-divider"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scaleX(1)" : "scaleX(0)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5 sm:gap-8 lg:gap-12">
          {/* Card 1: The Divine Meaning */}
          <div
            className="card-ornate p-4 sm:p-6 md:p-8 lg:p-10 relative flex flex-col h-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
            }}
          >
            <h3 className="text-display text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 text-foreground text-center border-b border-[hsla(43,85%,52%,0.3)] pb-3 sm:pb-4">
              The Divine Meaning
            </h3>
            
            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-script text-xl sm:text-2xl md:text-3xl text-primary font-bold min-w-[45px] sm:min-w-[60px] md:min-w-[70px]">Sada</span>
                <p className="text-body-serif text-sm sm:text-base md:text-lg text-muted-foreground pt-1.5 sm:pt-2">means <b className="text-foreground tracking-wide font-medium">Always</b> or Eternal</p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-script text-xl sm:text-2xl md:text-3xl text-primary font-bold min-w-[45px] sm:min-w-[60px] md:min-w-[70px]">Sri</span>
                <p className="text-body-serif text-sm sm:text-base md:text-lg text-muted-foreground pt-1.5 sm:pt-2">represents <b className="text-foreground tracking-wide font-medium">Prosperity</b> and Goddess Laxmi</p>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-script text-xl sm:text-2xl md:text-3xl text-primary font-bold min-w-[45px] sm:min-w-[60px] md:min-w-[70px]">Nilayam</span>
                <p className="text-body-serif text-sm sm:text-base md:text-lg text-muted-foreground pt-1.5 sm:pt-2">translates to <b className="text-foreground tracking-wide font-medium">Home</b> or Abode</p>
              </div>
            </div>

            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-[hsla(43,85%,52%,0.3)] text-center">
              <p className="text-body-serif text-base sm:text-lg md:text-xl italic text-foreground gold-text">
                "The Abode of Eternal Prosperity"
              </p>
            </div>
          </div>

          {/* Card 2: The Family Essence */}
          <div
            className="card-ornate p-4 sm:p-6 md:p-8 lg:p-10 relative flex flex-col h-full"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(20px)",
              transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
            }}
          >
            <h3 className="text-display text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 text-foreground text-center border-b border-[hsla(43,85%,52%,0.3)] pb-3 sm:pb-4">
              The Family Essence
            </h3>
            
            <div className="flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-script text-xl sm:text-2xl md:text-3xl text-primary font-bold min-w-[45px] sm:min-w-[60px] md:min-w-[70px]">Sa</span>
                <p className="text-body-serif text-sm sm:text-base md:text-lg text-foreground font-medium pt-1.5 sm:pt-2">Sabita</p>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4 relative">
                <span className="text-script text-xl sm:text-2xl md:text-3xl text-primary font-bold min-w-[45px] sm:min-w-[60px] md:min-w-[70px]">Da</span>
                <div className="flex items-center gap-2 pt-1.5 sm:pt-2">
                  <p className="text-body-serif text-sm sm:text-base md:text-lg text-foreground font-medium">Deenabandhu</p>
                  
                  <div 
                    className="relative flex items-center justify-center cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      style={{
                        border: "1px solid hsl(43, 85%, 52%)",
                        color: "hsl(43, 85%, 52%)",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "hsl(43, 85%, 52%)";
                        e.currentTarget.style.color = "hsl(40, 33%, 96%)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "hsl(43, 85%, 52%)";
                      }}
                    >
                      i
                    </div>
                    {/* Tooltip Content */}
                    <div 
                      className={`absolute bottom-full -right-16 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mb-3 w-56 sm:w-64 p-3 rounded-lg shadow-xl text-sm md:text-base transition-all duration-300 pointer-events-none z-10 ${showTooltip ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                      style={{
                        background: "linear-gradient(135deg, hsl(345, 75%, 22%), hsl(345, 70%, 15%))",
                        color: "hsl(40, 33%, 96%)",
                        border: "1px solid hsla(43, 85%, 52%, 0.4)",
                      }}
                    >
                      <p className="font-body tracking-wide leading-relaxed">
                        Based on the modern Sanskrit first-consonant method: 
                        <br/><span className="text-gold mt-1 block">Deenabandhu → "D" → "<b>Da</b>"</span>
                      </p>
                      {/* Triangle pointer */}
                      <div className="absolute top-full right-20 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 border-8 border-transparent border-t-[hsl(345,70%,15%)]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-script text-xl sm:text-2xl md:text-3xl text-primary font-bold min-w-[45px] sm:min-w-[60px] md:min-w-[70px]">Sri</span>
                <p className="text-body-serif text-sm sm:text-base md:text-lg text-foreground font-medium pt-1.5 sm:pt-2">Srilata, Sripada & Sribatsa</p>
              </div>
              
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-script text-xl sm:text-2xl md:text-3xl text-primary font-bold min-w-[45px] sm:min-w-[60px] md:min-w-[70px]">Nilayam</span>
                <p className="text-body-serif text-sm sm:text-base md:text-lg text-muted-foreground pt-1.5 sm:pt-2 italic">Their loving home</p>
              </div>
            </div>

            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-[hsla(43,85%,52%,0.3)] text-center">
              <p className="text-body-serif text-base sm:text-lg md:text-xl italic text-foreground gold-text">
                "Where Family is the Foundation"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HouseNameMeaning;

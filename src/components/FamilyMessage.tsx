import useScrollReveal from "@/hooks/useScrollReveal";

const FamilyMessage = () => {
  const { ref, visible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-6 relative"
      style={{
        background: "linear-gradient(180deg, hsl(40, 33%, 96%) 0%, hsl(38, 30%, 92%) 50%, hsl(40, 33%, 96%) 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="section-divider mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
          }}
        />

        <p
          className="text-body-serif text-xl sm:text-2xl leading-relaxed text-foreground italic"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            filter: visible ? "blur(0px)" : "blur(4px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
          }}
        >
          We are not just waiting, we are truly looking forward to welcoming you.
        </p>

        <p
          className="text-body-serif text-lg sm:text-xl mt-8 text-muted-foreground"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.5s",
          }}
        >
          With warmth and excitement,
        </p>

        <p
          className="text-script text-xl sm:text-2xl mt-4 gold-text"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
          }}
        >
          Deenabandhu, Sabita, Bikrant, Rakesh, Boobly, Joobly, Bibhu, Prisha, Trisha and Aahan
        </p>

        <div
          className="section-divider mt-10"
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

const InvitationFooter = () => {
  return (
    <footer
      className="py-8 px-6 text-center"
      style={{
        background: "linear-gradient(180deg, hsl(345, 75%, 22%), hsl(345, 80%, 16%))",
      }}
    >
      <a
        href="https://sribatsa.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-body-serif text-sm transition-colors duration-200"
        style={{ color: "hsla(43, 85%, 52%, 0.7)" }}
        onMouseOver={(e) => (e.currentTarget.style.color = "hsl(43, 85%, 52%)")}
        onMouseOut={(e) => (e.currentTarget.style.color = "hsla(43, 85%, 52%, 0.7)")}
      >
        All Rights Reserved by Sribatsa
      </a>
    </footer>
  );
};

export default InvitationFooter;

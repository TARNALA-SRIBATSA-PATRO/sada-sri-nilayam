import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { recordInvitationOpen } from "@/lib/invitations";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
import CountdownTimer from "@/components/CountdownTimer";
import VenueSection from "@/components/VenueSection";
import PhotoGallery from "@/components/PhotoGallery";
import FamilyMessage from "@/components/FamilyMessage";
import ContactSection from "@/components/ContactSection";
import InvitationFooter from "@/components/InvitationFooter";
import MusicToggle from "@/components/MusicToggle";
import CalendarModal from "@/components/CalendarModal";
import SecurityDetails from "@/components/SecurityDetails";

const InvitationPage = () => {
  const { id } = useParams();
  const [showCalendar, setShowCalendar] = useState(false);

  // Extract guest name from URL id (placeholder logic - will use DB later)
  const guestName = id
    ? decodeURIComponent(id).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Dear Guest";

  // Show calendar modal after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowCalendar(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(40, 33%, 96%)" }}>
      <HeroSection />
      <WelcomeSection userName={guestName} />
      <CountdownTimer />
      <VenueSection />
      <PhotoGallery />
      <FamilyMessage />
      <SecurityDetails guestName={guestName} />
      <ContactSection userName={guestName} />
      <InvitationFooter />
      <MusicToggle />

      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}
    </div>
  );
};

export default InvitationPage;

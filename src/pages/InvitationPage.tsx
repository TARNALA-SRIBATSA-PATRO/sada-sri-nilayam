import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { recordInvitationOpen, getInvitationBySlug, getAdmins } from "@/lib/invitations";
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
  const [invData, setInvData] = useState<{ withFamily: boolean; customMessage: string } | null>(null);

  const guestName = id
    ? decodeURIComponent(id).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Dear Guest";

  useEffect(() => {
    if (id) {
      recordInvitationOpen(decodeURIComponent(id));
      const inv = getInvitationBySlug(decodeURIComponent(id));
      if (inv) {
        setInvData({ withFamily: inv.withFamily, customMessage: inv.customMessage });
      }
    }
    const timer = setTimeout(() => setShowCalendar(true), 6000);
    return () => clearTimeout(timer);
  }, [id]);

  const admins = getAdmins().filter((a) => a.phone);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(40, 33%, 96%)" }}>
      <HeroSection />
      <WelcomeSection
        userName={guestName}
        withFamily={invData?.withFamily}
        customMessage={invData?.customMessage}
      />
      <CountdownTimer />
      <VenueSection />
      <PhotoGallery />
      <FamilyMessage />
      <SecurityDetails guestName={guestName} />
      <ContactSection userName={guestName} adminContacts={admins} />
      <InvitationFooter />
      <MusicToggle />

      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)} />}
    </div>
  );
};

export default InvitationPage;

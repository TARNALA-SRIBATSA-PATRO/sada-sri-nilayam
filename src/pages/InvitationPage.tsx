import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { recordInvitationOpenById, getInvitationById, getAdmins, type Invitation, type AdminUser } from "@/lib/invitations";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
import HouseNameMeaning from "@/components/HouseNameMeaning";
import CountdownTimer from "@/components/CountdownTimer";
import VenueSection from "@/components/VenueSection";
import PhotoGallery from "@/components/PhotoGallery";
import FamilyMessage from "@/components/FamilyMessage";
import ContactSection from "@/components/ContactSection";
import MusicToggle from "@/components/MusicToggle";
import CalendarModal from "@/components/CalendarModal";
import SecurityDetails from "@/components/SecurityDetails";

const InvitationPage = () => {
  const { id } = useParams();
  const [showCalendar, setShowCalendar] = useState(false);
  // Track if it's been auto-shown this session — dismissed = never auto-open again until refresh
  const calendarAutoShown = useRef(false);
  const venueSentinelRef = useRef<HTMLDivElement>(null);

  const [inv, setInv] = useState<Invitation | null>(null);
  const [admins, setAdmins] = useState<AdminUser[]>([]);

  const guestId = id ? decodeURIComponent(id) : "";

  const searchParams = new URLSearchParams(window.location.search);
  const isPreview = searchParams.get('preview') === 'true';

  // Show calendar toast the moment the user scrolls to the Venue section
  useEffect(() => {
    const sentinel = venueSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !calendarAutoShown.current) {
          calendarAutoShown.current = true;
          setShowCalendar(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (guestId) {
      getInvitationById(guestId).then(i => {
        if (i && (!i.isDeleted || isPreview)) {
          setInv(i);
          if (!isPreview) recordInvitationOpenById(guestId);
        }
      });
    }
  }, [guestId, isPreview]);

  useEffect(() => {
    getAdmins().then(a => setAdmins(a.filter(ad => ad.phone)));
  }, []);

  const guestName = inv?.personName || "Dear Guest";

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "hsl(40, 33%, 96%)" }}>
      <HeroSection />
      <WelcomeSection
        userName={guestName}
        withFamily={inv?.withFamily}
        customMessage={inv?.customMessage}
      />
      <CountdownTimer />
      <VenueSection onSaveDate={() => setShowCalendar(true)} />
      {/* Sentinel placed right inside the Venue section — fires toast when user sees venue */}
      <div ref={venueSentinelRef} style={{ height: "1px", marginTop: "-1px", pointerEvents: "none" }} />
      <PhotoGallery />
      <FamilyMessage />
      <SecurityDetails guestName={guestName} />
      <HouseNameMeaning />
      <ContactSection userName={guestName} adminContacts={admins} sentBy={inv?.sentBy} invitationUrl={window.location.href} />
      <MusicToggle />

      {showCalendar && (
        <CalendarModal 
          onClose={() => setShowCalendar(false)} 
          guestName={guestName}
          adminContacts={admins}
          invitationUrl={window.location.href}
          sentBy={inv?.sentBy}
          withFamily={inv?.withFamily}
        />
      )}
    </div>
  );
};

export default InvitationPage;

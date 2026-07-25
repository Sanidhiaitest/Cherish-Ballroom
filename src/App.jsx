import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MobileNav from "./components/MobileNav";
import LeadDrawer from "./components/LeadDrawer";
import CallModal from "./components/CallModal";
import WhatsAppModal from "./components/WhatsAppModal";
import CouplePreviewModal from "./components/CouplePreviewModal";
import OverviewView from "./components/views/OverviewView";
import FunnelView from "./components/views/FunnelView";
import QueueView from "./components/views/QueueView";
import ReferralView from "./components/views/ReferralView";
import { LEADS } from "./data/leads";

const VIEWS = {
  overview: OverviewView,
  funnel: FunnelView,
  queue: QueueView,
  referral: ReferralView,
};

const DEFAULT_COUPLE_PREVIEW = LEADS.find((l) => l.name === "Diya & Kabir");

export default function App() {
  const [view, setView] = useState("overview");
  const [selected, setSelected] = useState(null);
  const [callLead, setCallLead] = useState(null);
  const [chatLead, setChatLead] = useState(null);
  const [previewLead, setPreviewLead] = useState(null);
  const ViewComponent = VIEWS[view];

  return (
    <div className="flex min-h-screen bg-noise" style={{ background: "var(--color-ivory)" }}>
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onPreviewCoupleApp={() => setPreviewLead(DEFAULT_COUPLE_PREVIEW)} />
        <div className="flex-1 px-5 md:px-10 pb-24 md:pb-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ViewComponent openLead={setSelected} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <MobileNav view={view} setView={setView} />
      <LeadDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onCall={(l) => setCallLead(l)}
        onWhatsApp={(l) => setChatLead(l)}
        onPreviewCouple={(l) => setPreviewLead(l)}
      />
      <CallModal lead={callLead} onClose={() => setCallLead(null)} />
      <WhatsAppModal lead={chatLead} onClose={() => setChatLead(null)} />
      <CouplePreviewModal lead={previewLead} onClose={() => setPreviewLead(null)} />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MobileNav from "./components/MobileNav";
import LeadDrawer from "./components/LeadDrawer";
import CallModal from "./components/CallModal";
import WhatsAppModal from "./components/WhatsAppModal";
import CouplePreviewModal from "./components/CouplePreviewModal";
import ProposalModal from "./components/ProposalModal";
import AIVoiceCallModal from "./components/AIVoiceCallModal";
import VirtualTourModal from "./components/VirtualTourModal";
import AddLeadModal from "./components/AddLeadModal";
import OverviewView from "./components/views/OverviewView";
import FunnelView from "./components/views/FunnelView";
import AutomationView from "./components/views/AutomationView";
import ReportsView from "./components/views/ReportsView";
import AllLeadsView from "./components/views/AllLeadsView";
import { LEADS } from "./data/leads";

const VIEWS = {
  overview: OverviewView,
  funnel: FunnelView,
  automation: AutomationView,
  reports: ReportsView,
  allLeads: AllLeadsView,
};

const DEFAULT_COUPLE_PREVIEW = LEADS.find((l) => l.name === "Diya & Kabir");

export default function App() {
  const [view, setView] = useState("overview");
  const [viewer, setViewer] = useState("Aman");
  const [selected, setSelected] = useState(null);
  const [callLead, setCallLead] = useState(null);
  const [chatLead, setChatLead] = useState(null);
  const [previewLead, setPreviewLead] = useState(null);
  const [proposalLead, setProposalLead] = useState(null);
  const [aiVoiceCall, setAiVoiceCall] = useState(null);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const ViewComponent = VIEWS[view];
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [view]);

  function openAIVoiceCall(lead, script, outcome, transfer) {
    setAiVoiceCall(lead ? { lead, script, outcome, transfer } : null);
  }

  function handleAddLead(lead) {
    LEADS.unshift(lead);
    setAddLeadOpen(false);
    setView("overview");
    setSelected(lead);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-noise" style={{ background: "var(--color-ivory)" }}>
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar viewer={viewer} setViewer={setViewer} onPreviewCoupleApp={() => setPreviewLead(selected || DEFAULT_COUPLE_PREVIEW)} />
        <div ref={scrollRef} className="flex-1 px-5 md:px-10 pb-24 md:pb-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <ViewComponent
                openLead={setSelected}
                setView={setView}
                onAIVoiceCall={openAIVoiceCall}
                onOpenVirtualTour={() => setVirtualTourOpen(true)}
                onLogLead={() => setAddLeadOpen(true)}
                viewer={viewer}
              />
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
        onViewProposal={(l) => setProposalLead(l)}
        onAIVoiceCall={openAIVoiceCall}
      />
      <CallModal lead={callLead} onClose={() => setCallLead(null)} />
      <WhatsAppModal lead={chatLead} onClose={() => setChatLead(null)} />
      <CouplePreviewModal lead={previewLead} onClose={() => setPreviewLead(null)} />
      <ProposalModal lead={proposalLead} onClose={() => setProposalLead(null)} />
      {aiVoiceCall && (
        <AIVoiceCallModal
          lead={aiVoiceCall.lead}
          script={aiVoiceCall.script}
          outcome={aiVoiceCall.outcome}
          transfer={aiVoiceCall.transfer}
          onClose={() => setAiVoiceCall(null)}
        />
      )}
      <VirtualTourModal open={virtualTourOpen} onClose={() => setVirtualTourOpen(false)} />
      <AddLeadModal open={addLeadOpen} onClose={() => setAddLeadOpen(false)} onAdd={handleAddLead} />
    </div>
  );
}

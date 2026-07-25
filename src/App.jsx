import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import MobileNav from "./components/MobileNav";
import LeadDrawer from "./components/LeadDrawer";
import OverviewView from "./components/views/OverviewView";
import FunnelView from "./components/views/FunnelView";
import QueueView from "./components/views/QueueView";
import ReferralView from "./components/views/ReferralView";

const VIEWS = {
  overview: OverviewView,
  funnel: FunnelView,
  queue: QueueView,
  referral: ReferralView,
};

export default function App() {
  const [view, setView] = useState("overview");
  const [selected, setSelected] = useState(null);
  const ViewComponent = VIEWS[view];

  return (
    <div className="flex min-h-screen bg-noise" style={{ background: "var(--color-ivory)" }}>
      <Sidebar view={view} setView={setView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
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
      <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

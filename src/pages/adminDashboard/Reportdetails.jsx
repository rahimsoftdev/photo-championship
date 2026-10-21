import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiShield,
  FiSlash,
  FiTrash2,
  FiUserX,
} from "react-icons/fi";
// import ArtworkImages from "./ArtworkImages";
// import ArtworkGalleryGrid from "./ArtworkGalleryGrid";
// import ArtworkInfoSection from "./ArtworkInfoSection";
import { getReportById, LIST_PATH, STATUS_STYLES } from "./reportsData";
import ArtworkInfoSection from "../../components/ui/detailsPage/ArtworkInfoSection";
import ArtworkImages from "../../components/ui/detailsPage/ArtworkImages";
import ArtworkGalleryGrid from "../../components/ui/detailsPage/ArtworkGalleryGrid";
// import { LIST_PATH, STATUS_STYLES, getReportById } from "./reportsData";

/* ---------------------------- Admin decision config ---------------------------- */

const ACTIONS = [
  {
    key: "remove",
    label: "Remove Content",
    hint: "Take down this content",
    confirm: "The reported content will be removed from the platform.",
    Icon: FiTrash2,
    style: "border-red-100 bg-red-50 text-red-600 hover:bg-red-100",
  },
  {
    key: "warn",
    label: "Warn User",
    hint: "Send a warning notice",
    confirm: "A warning notice will be sent to the reported user.",
    Icon: FiAlertTriangle,
    style: "border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100",
  },
  {
    key: "suspend",
    label: "Suspend User",
    hint: "Temporarily restrict account",
    confirm: "The reported user's account will be temporarily restricted.",
    Icon: FiUserX,
    style: "border-orange-100 bg-orange-50 text-orange-600 hover:bg-orange-100",
  },
  {
    key: "ban",
    label: "Ban User",
    hint: "Permanently ban account",
    confirm: "The reported user's account will be permanently banned.",
    Icon: FiSlash,
    style: "border-pink-100 bg-pink-50 text-pink-600 hover:bg-pink-100",
  },
  {
    key: "resolve",
    label: "Mark Resolved",
    hint: "No action needed",
    confirm: "This report will be closed without further action.",
    Icon: FiCheckCircle,
    style: "border-green-100 bg-green-50 text-green-600 hover:bg-green-100",
  },
];

/* --------------------------- Small components --------------------------- */

const InfoCard = ({ title, badge, badgeClass, children }) => (
  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400">{title}</p>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${badgeClass}`}>
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const ConfirmDialog = ({ action, userName, onCancel, onConfirm }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={action.label}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"
      >
        <div className="flex items-center gap-2.5">
          <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${action.style}`}>
            <action.Icon className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold text-slate-900">{action.label}?</h2>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-gray-600">{action.confirm}</p>
        <p className="mt-1 text-[11px] text-gray-400">Reported user: {userName}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-200 px-4 py-2 text-[11px] font-medium text-slate-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-slate-900 px-4 py-2 text-[11px] font-medium text-white transition hover:bg-slate-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------- Main page ------------------------------- */

const ReportDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const baseReport = getReportById(id);
  // local overrides so status / action taken update on screen (TODO: replace with API refetch)
  const [override, setOverride] = useState({});
  const [pendingAction, setPendingAction] = useState(null);
  const [toast, setToast] = useState("");

  if (!baseReport) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Report not found.{" "}
        <Link to={LIST_PATH} className="text-blue-600 underline">
          Back to Reports
        </Link>
      </div>
    );
  }

  const report = { ...baseReport, ...override };
  const { item, reportedBy, reportedUser } = report;
  const isResolved = report.status === "Resolved";

  // shape expected by <ArtworkInfoSection />
  const artwork = {
    title: item.title,
    description: item.description,
    category: item.category,
    subCategory: item.subCategory,
    images: item.photos,
    info: { author: item.author, authorAvatar: item.authorAvatar, createdAt: item.createdAt },
    totalReact: item.totalReact,
    viewsCount: item.viewsCount,
    imageDetails: item.imageDetails,
  };

  const applyAction = () => {
    // TODO: call your API here (remove content / warn / suspend / ban / resolve)
    setOverride({ status: "Resolved", actionTaken: pendingAction.label });
    setToast(`${pendingAction.label} applied. Report marked as Resolved.`);
    setPendingAction(null);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-white p-4 font-sans text-slate-800 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back + status */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(LIST_PATH)}
            className="inline-flex items-center gap-1.5 text-[11px] text-gray-600 transition hover:text-slate-900"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            Back to Reports
          </button>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${STATUS_STYLES[report.status].badge}`}
          >
            {report.status}
          </span>
        </div>

        {/* Action taken notice */}
        {report.actionTaken && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-[11px] text-green-700">
            <FiCheckCircle className="h-3.5 w-3.5" />
            Action taken: <span className="font-semibold">{report.actionTaken}</span>
          </div>
        )}

        {/* Reason banner */}
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <FiAlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
              Report Reason: {report.reason}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-amber-800/80">{report.note}</p>
          </div>
        </div>

        {/* Reporter + reported user */}
        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoCard
            title="Reported By Information"
            badge={reportedBy.role}
            badgeClass="bg-blue-50 text-blue-600"
          >
            <div className="flex items-center gap-3">
              <img src={reportedBy.avatar} alt={reportedBy.name} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <p className="text-xs font-semibold text-slate-900">{reportedBy.name}</p>
                <p className="text-[10px] text-gray-500">{reportedBy.location}</p>
              </div>
            </div>
            <button
              type="button"
              // TODO: navigate to the reporter's profile
              className="mt-3 w-full rounded-md border border-blue-200 py-2 text-[10px] font-medium text-blue-600 transition hover:bg-blue-50"
            >
              View Reporter Profile
            </button>
          </InfoCard>

          <InfoCard
            title="Reported User"
            badge={reportedUser.accountStatus}
            badgeClass="bg-green-50 text-green-600"
          >
            <div className="flex items-center gap-3">
              <img src={reportedUser.avatar} alt={reportedUser.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-900">
                  {reportedUser.name}
                  <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[8px] font-medium text-pink-600">
                    {reportedUser.totalReports} Reports
                  </span>
                </p>
                <p className="truncate text-[10px] text-gray-500">{reportedUser.email}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                // TODO: navigate to the reported user's profile
                className="rounded-md border border-gray-200 py-2 text-[10px] font-medium text-slate-700 transition hover:bg-gray-50"
              >
                View Profile
              </button>
              <button
                type="button"
                // TODO: open the user's audit / report history
                className="rounded-md bg-pink-50 py-2 text-[10px] font-medium text-pink-600 transition hover:bg-pink-100"
              >
                Audit History
              </button>
            </div>
          </InfoCard>
        </div>

        {/* Reported content */}
        <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
          Reported Content
        </p>

        <ArtworkImages images={item.photos} />
        <ArtworkGalleryGrid images={item.photos} />

        {item.video && (
          <div className="mt-2 overflow-hidden rounded-2xl bg-black">
            <video
              controls
              preload="metadata"
              poster={item.videoPoster}
              className="aspect-video w-full object-cover"
            >
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Admin view: hide Vote / Download / Share + photographer block (see note on props) */}
        <ArtworkInfoSection
          artwork={artwork}
          onVote={() => {}}
          hasVoted={false}
          showActions={false}
          showPhotographer={false}
        />

        {/* Admin moderation decision actions */}
        <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-700">
              <FiShield className="h-3 w-3 text-blue-600" />
              Admin Moderation Decision Actions
            </p>
            <p className="text-[9px] text-gray-400">
              Choose the appropriate action based on violation severity
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5">
            {ACTIONS.map((a) => (
              <button
                key={a.key}
                type="button"
                disabled={isResolved}
                onClick={() => setPendingAction(a)}
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-4 text-center transition disabled:cursor-not-allowed disabled:opacity-50 ${a.style}`}
              >
                <a.Icon className="h-4 w-4" />
                <span className="text-[10px] font-semibold">{a.label}</span>
                <span className="text-[8px] opacity-70">{a.hint}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {pendingAction && (
        <ConfirmDialog
          action={pendingAction}
          userName={reportedUser.name}
          onCancel={() => setPendingAction(null)}
          onConfirm={applyAction}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-lg">
          <FiCheck className="h-4 w-4 text-green-400" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default ReportDetails;
import { useState } from "react";
import { useLocation } from "react-router";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getSavedUserInfo } from "../../utils/getUserInof";

// ---------- Fake data ----------
const PHOTOGRAPHERS = [
  { id: 1, name: "Alessandro Vieri", avatar: "https://i.pravatar.cc/80?img=12", competitionsWon: 14, totalVotes: 12450 },
  { id: 2, name: "Elena Soros", avatar: "https://i.pravatar.cc/80?img=47", competitionsWon: 11, totalVotes: 11820 },
  { id: 3, name: "Sarah Jenkins", avatar: "https://i.pravatar.cc/80?img=32", competitionsWon: 9, totalVotes: 8940, isCurrentUser: true },
  { id: 4, name: "Julian Thorne", avatar: "https://i.pravatar.cc/80?img=15", competitionsWon: 7, totalVotes: 10910 },
  { id: 5, name: "Marcus Chen", avatar: "https://i.pravatar.cc/80?img=53", competitionsWon: 5, totalVotes: 9420 },
  { id: 6, name: "Priya Nair", avatar: "https://i.pravatar.cc/80?img=45", competitionsWon: 5, totalVotes: 8760 },
  { id: 7, name: "Daniel Okafor", avatar: "https://i.pravatar.cc/80?img=60", competitionsWon: 4, totalVotes: 8120 },
  { id: 8, name: "Sofia Marino", avatar: "https://i.pravatar.cc/80?img=44", competitionsWon: 4, totalVotes: 7685 },
  { id: 9, name: "Liam Fischer", avatar: "https://i.pravatar.cc/80?img=33", competitionsWon: 3, totalVotes: 7240 },
  { id: 10, name: "Aiko Tanaka", avatar: "https://i.pravatar.cc/80?img=49", competitionsWon: 3, totalVotes: 6890 },
];

const TOTAL_PHOTOGRAPHERS = 24802;
const PAGE_SIZE = 5;

// URL er prothom segment match korbe, tai nested route (e.g. /admin-dashboard/competitions/art_001) e o kaj korbe
const ALLOWED_ROUTES = ["user-dashboard", "admin-dashboard"];

const RANK_COLORS = {
  1: "#FFC107",
  2: "#B0B0B0",
  3: "#4C2A9E",
  4: "#B5651D",
};

// ---------- Styles ----------
const s = {
  card: { background: "#F9F9FF", border: "1px solid #E6E6F2", borderRadius: 20, overflow: "hidden", fontFamily: "inherit" },
  title: { margin: 0, padding: "20px 16px", fontSize: 18, fontWeight: 500, color: "#1A1A2E" },
  // responsive: choto screen e table side e scroll hobe
  tableWrap: { width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" },
  table: { width: "100%", minWidth: 560, borderCollapse: "collapse", background: "#fff", whiteSpace: "nowrap" },
  th: { padding: "12px 16px", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: "#55556B", fontWeight: 400, background: "#F9F9FF", borderTop: "1px solid #E1E1EF", borderBottom: "1px solid #E1E1EF" },
  td: { padding: "14px 16px", fontSize: 12, fontWeight: 600, color: "#1A1A2E", borderBottom: "1px solid #EEEEF6" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "#F0F0FD", fontSize: 11, color: "#55556B" },
  navBtn: (disabled) => ({
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid #D5D5E5",
    background: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    marginLeft: 6,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    color: "#1A1A2E",
  }),
};

export default function GlobalRankings() {
  const { pathname } = useLocation();
  const [page, setPage] = useState(0);
  const userinfo = getSavedUserInfo()


  // "/admin-dashboard/competitions/art_001" -> "admin-dashboard"
  const firstSegment = pathname.split("/")[1];
  if (!ALLOWED_ROUTES.includes(firstSegment)) return null;

  const start = page * PAGE_SIZE;
  const rows = PHOTOGRAPHERS.slice(start, start + PAGE_SIZE);
  const maxPage = Math.ceil(PHOTOGRAPHERS.length / PAGE_SIZE) - 1;

  return (
    <div style={s.card} className="mt-10 sm:mt-12  lg:mt-section">
      <h2 style={s.title}>Global Rankings</h2>

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={{ ...s.th, textAlign: "left", width: "20%" }}>Rank</th>
              <th style={{ ...s.th, textAlign: "left" }}>Photographer</th>
              <th style={{ ...s.th, textAlign: "center" }}>Competitions Won</th>
              <th style={{ ...s.th, textAlign: "center" }}>Total Votes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const rank = start + i + 1;
              const me = p.isCurrentUser;
              const badgeBg = RANK_COLORS[rank] ?? "#E8E9F5";
              return (
                <tr
                  key={p.id}
                  style={{
                    background: me ? "#F1ECFB" : "#fff",
                    boxShadow: me ? "inset 3px 0 0 #4C2A9E" : "none",
                  }}
                >
                  <td style={s.td}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: badgeBg,
                        color: rank <= 4 ? "#fff" : "#55556B",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {rank}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img
                        src={p.avatar}
                        alt={p.name}
                        width={26}
                        height={26}
                        style={{ flexShrink: 0, borderRadius: "50%", objectFit: "cover", border: me ? "2px solid #4C2A9E" : "none" }}
                      />
                      <span style={{ color: me ? "#4C2A9E" : "#1A1A2E" }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>{String(p.competitionsWon).padStart(2, "0")}</td>
                  <td style={{ ...s.td, textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: me ? "#4C2A9E" : "#E8E8FA",
                        color: me ? "#fff" : "#4B3B9A",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {p.totalVotes.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={s.footer}>
        <span>
          Showing top {rows.length} of {TOTAL_PHOTOGRAPHERS.toLocaleString()} photographers
        </span>
        <div>
          <button aria-label="Previous" style={s.navBtn(page === 0)} disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            <FiChevronLeft size={14} />
          </button>
          <button aria-label="Next" style={s.navBtn(page === maxPage)} disabled={page === maxPage} onClick={() => setPage((p) => p + 1)}>
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
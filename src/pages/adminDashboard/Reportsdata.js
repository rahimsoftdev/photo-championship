// Shared fake data + helpers for the Reports & Moderation list and details pages.

export const LIST_PATH = "/admin-dashboard/reports-resolved";
export const DETAILS_PATH = "/admin-dashboard/reports-resolved/details";

/* ------------------------------------------------------------------ */
/*  TODO: Add real data                                                */
/*  Replace REPORTS with the data coming from your API.                */
/* ------------------------------------------------------------------ */

const photos = (seed, n) =>
  Array.from({ length: n }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/1200/700`);
const avatar = (n) => `https://i.pravatar.cc/80?img=${(n % 70) + 1}`;

// placeholder video (TODO: use the real reported video URL)
const SAMPLE_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const REASON_NOTES = {
  "Copyright Infringement":
    "This image appears identical to a photograph published by another photographer in 2014. I can provide the original source if needed.",
  "Harmful or Dangerous Content":
    "This content promotes unsafe behavior and could put other users at risk.",
  "Nudity or Sexual Content":
    "This post contains explicit content that is not suitable for the platform.",
  "Stolen Photo":
    "These photos were taken from my portfolio without my permission or credit.",
  "Illegal or Prohibited Content":
    "This post appears to advertise something that is prohibited on the platform.",
  "Offensive or Abusive Content":
    "The caption and comments on this post are abusive towards other members.",
  "Spam or Misleading Content":
    "This account keeps posting misleading links and repeated promotional content.",
  Other: "This content does not fit the standard categories, please review it manually.",
};

// [id, reportedBy, reportedItem, photoCount, reason, reportedUser, userReportCount, status]
const RAW = [
  [1, "Albert Flores", "Dr- Victor Vance Portrait", 1, "Copyright Infringement", "Jerome Bell", 5, "Resolved"],
  [2, "Marvin McKinney", "Does anyone have a source for this?", 6, "Harmful or Dangerous Content", "Eleanor Pena", 6, "Pending"],
  [3, "Dianne Russell", "Does anyone have the original?", 12, "Nudity or Sexual Content", "Savannah Nguyen", 7, "Under Review"],
  [4, "Cameron Williamson", "Does anyone have this print?", 1, "Stolen Photo", "Floyd Miles", 8, "Under Review"],
  [5, "Cameron Williamson", "Does anyone have this album?", 6, "Illegal or Prohibited Content", "Floyd Miles", 8, "Pending"],
  [6, "Jane Cooper", "Marcus Bell Studio Session", 12, "Offensive or Abusive Content", "Brooklyn Simmons", 8, "Pending"],
  [7, "Brooklyn Simmons", "Does anyone have a discount code?", 6, "Spam or Misleading Content", "Bessie Cooper", 9, "Resolved"],
  [8, "Wade Warren", "Dr- Victor Vance Gallery", 6, "Other", "Darrell Steward", 8, "Under Review"],
  [9, "Jerome Bell", "Your research is incredible", 6, "Offensive or Abusive Content", "Albert Flores", 8, "Under Review"],
  [10, "Jacob Jones", "Guaranteed non-FDA approved pills", 6, "Offensive or Abusive Content", "Ronald Richards", 8, "Under Review"],
];

export const REPORTS = RAW.map(
  ([id, reportedBy, title, photoCount, reason, userName, userReports, status]) => ({
    id,
    reportedBy: {
      name: reportedBy,
      role: "Photographer",
      location: "Dhaka, Bangladesh",
      avatar: avatar(id * 3),
    },
    reason,
    note: REASON_NOTES[reason],
    date: "2026-02-01",
    status,
    reportedUser: {
      name: userName,
      email: `${userName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      avatar: avatar(id * 5 + 2),
      accountStatus: "Active",
      totalReports: userReports,
    },
    item: {
      title,
      description:
        "A young man walking confidently along a quiet city street during golden hour, wearing a casual white t-shirt, black jeans, and clean white sneakers. His hands are relaxed by his sides, with a natural walking posture and a calm expression. Soft sunlight creates warm highlights and long shadows on the pavement. Modern buildings, green trees, and a slightly blurred urban background add depth to the scene. Captured in a cinematic, photorealistic style with shallow depth of field, ultra-realistic, high detail, 8K quality.",
      category: "Nature",
      subCategory: "",
      photos: photos(`report-${id}`, photoCount),
      video: photoCount > 1 ? SAMPLE_VIDEO : "",
      videoPoster: `https://picsum.photos/seed/report-${id}-poster/1200/700`,
      author: userName,
      authorAvatar: avatar(id * 5 + 2),
      createdAt: "2026-06-01",
      creativeNo: `22785${String(id).padStart(5, "0")}`,
      imageDetails: {
        creativeNo: `22785${String(id).padStart(5, "0")}`,
        width: 1200,
        height: 800,
        quality: "4K",
        format: "jpeg",
        size: "125 KB",
      },
      totalReact: 2158,
      viewsCount: 12683,
    },
  })
);

/* ------------------------------- Helpers ------------------------------- */

export const getReportById = (id) => REPORTS.find((r) => String(r.id) === String(id));

export const getReportType = (photoCount) => {
  if (photoCount <= 1) return "Single photo";
  if (photoCount === 12) return "12 photos zodiac story";
  return `${photoCount} photos`;
};

export const formatReportDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB");

export const STATUS_STYLES = {
  Resolved: { badge: "bg-green-100 text-green-700" },
  Pending: { badge: "bg-amber-100 text-amber-700" },
  "Under Review": { badge: "bg-blue-100 text-blue-700" },
};
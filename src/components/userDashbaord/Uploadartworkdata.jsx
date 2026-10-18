/* ---------- Album config ---------- */
export const ALBUM_CONFIG = {
    single: { count: 1, label: "Single Photo" },
    six: { count: 6, label: "6 Photos Story" },
    twelve: { count: 12, label: "12 Photos - Full Zodiac Story" },
};

/* ---------- Limits ---------- */
export const MAX_PHOTO_SIZE_MB = 30;
export const MAX_VIDEO_SIZE_MB = 100;

/* ---------- Zodiac signs (\uFE0E forces text style instead of emoji) ---------- */
export const ZODIACS = [
    { id: 1, name: "Aries", symbol: "\u2648\uFE0E", element: "Fire", dates: "March 21 - April 20", short: "Mar 21 - Apr 20" },
    { id: 2, name: "Taurus", symbol: "\u2649\uFE0E", element: "Earth", dates: "April 21 - May 20", short: "Apr 21 - May 20" },
    { id: 3, name: "Gemini", symbol: "\u264A\uFE0E", element: "Air", dates: "May 21 - June 20", short: "May 21 - Jun 20" },
    { id: 4, name: "Cancer", symbol: "\u264B\uFE0E", element: "Water", dates: "June 21 - July 22", short: "Jun 21 - Jul 22" },
    { id: 5, name: "Leo", symbol: "\u264C\uFE0E", element: "Fire", dates: "July 23 - August 22", short: "Jul 23 - Aug 22" },
    { id: 6, name: "Virgo", symbol: "\u264D\uFE0E", element: "Earth", dates: "August 23 - September 22", short: "Aug 23 - Sep 22" },
    { id: 7, name: "Libra", symbol: "\u264E\uFE0E", element: "Air", dates: "September 23 - October 22", short: "Sep 23 - Oct 22" },
    { id: 8, name: "Scorpio", symbol: "\u264F\uFE0E", element: "Water", dates: "October 23 - November 21", short: "Oct 23 - Nov 21" },
    { id: 9, name: "Sagittarius", symbol: "\u2650\uFE0E", element: "Fire", dates: "November 22 - December 21", short: "Nov 22 - Dec 21" },
    { id: 10, name: "Capricorn", symbol: "\u2651\uFE0E", element: "Earth", dates: "December 22 - January 19", short: "Dec 22 - Jan 19" },
    { id: 11, name: "Aquarius", symbol: "\u2652\uFE0E", element: "Air", dates: "January 20 - February 18", short: "Jan 20 - Feb 18" },
    { id: 12, name: "Pisces", symbol: "\u2653\uFE0E", element: "Water", dates: "February 19 - March 20", short: "Feb 19 - Mar 20" },
];

/* ---------- Themes (used by the "six" album) ---------- */
export const THEMES = {
    red: {
        key: "red",
        title: "Spring and Summer - Red Photo Story",
        description: "Passionate, energetic, active. Covers signs 1-6 (Aries to Virgo)",
        signIds: [1, 2, 3, 4, 5, 6],
    },
    blue: {
        key: "blue",
        title: "Autumn and Winter - Blue Photo Story",
        description: "Deep, intuitive, serene. Covers signs 7-12 (Libra to Pisces)",
        signIds: [7, 8, 9, 10, 11, 12],
    },
};

// Full class names are written out so Tailwind can detect them
export const THEME_STYLES = {
    red: {
        hex: "#EE1C25",
        text: "text-[#EE1C25]",
        border: "border-[#F8B4B8]",
        borderStrong: "border-[#EE1C25]",
        iconBg: "bg-[#FDE8E9]",
        button: "border-[#EE1C25] text-[#EE1C25] hover:bg-[#FFF1F1]",
    },
    blue: {
        hex: "#4048CD",
        text: "text-[#4048CD]",
        border: "border-[#C7CAF2]",
        borderStrong: "border-[#4048CD]",
        iconBg: "bg-[#E8EAFB]",
        button: "border-[#4048CD] text-[#4048CD] hover:bg-[#F0F1FD]",
    },
};

export const getThemeKeyBySignId = (id) => (id <= 6 ? "red" : "blue");

// Visual order of the 12 slots: row 1 = 1,2,3 (red) + 7,8,9 (blue), row 2 = 4,5,6 (red) + 10,11,12 (blue)
export const TWELVE_DISPLAY_ORDER = [1, 2, 3, 7, 8, 9, 4, 5, 6, 10, 11, 12];

/* ---------- Form data ---------- */
export const CATEGORIES = {
    Astrophotography: ["Milky Way", "Star Trails", "Moon & Planets", "Deep Sky", "Aurora"],
    Landscape: ["Mountains", "Countryside", "Oceans & Beaches", "Forests", "Deserts"],
    Portrait: ["Individual Portraits", "Family", "Black & White", "Fashion"],
    "Street Photography": ["Street Life", "Markets", "Urban Architecture"],
    "Nature & Wildlife": ["Wildlife", "Flowers & Plants", "Macro", "Birds"],
    "Fine Art": ["Abstract", "Minimalism", "Surrealism"],
};

// TODO: replace with real current-competition data from the API
export const COMPETITION_INFO = {
    name: "August Photography Competition",
    votingPeriod: "Aug 1 - Aug 31, 2026",
    prizePool: "$10,000",
};

/* ---------- Helpers ---------- */
export const formatBytes = (bytes = 0) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const getQualityLabel = (width, height) => {
    const pixels = width * height;
    if (pixels >= 3840 * 2160) return "4K";
    if (pixels >= 1920 * 1080) return "Full HD";
    if (pixels >= 1280 * 720) return "HD";
    return "SD";
};
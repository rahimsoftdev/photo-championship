// import { STATUS_BADGE } from "../../utils/orderUtils";

import { STATUS_BADGE } from "../../components/userDashbaord/Orderutils";

// import { STATUS_BADGE } from "../../components/userDashbaord/Orderutils";

const StatusBadge = ({ status }) => {
    const s = STATUS_BADGE[status] ?? STATUS_BADGE.processing;
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${s.cls}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
};

export default StatusBadge;
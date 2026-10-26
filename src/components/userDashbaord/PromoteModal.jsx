import { useEffect, useRef, useState } from "react";
import ModalShell, { SuccessView } from "./ModalShell";

const PLANS = [
  { price: 40, days: 7 },
  { price: 60, days: 15 },
  { price: 100, days: 30 },
];

/**
 * Promote (Sponsored Photo) modal
 * - Plan select kore Confirm korle success feedback dekhay, tarpor bondho hoy
 */
const PromoteModal = ({ open, onClose, onPromoted }) => {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].price);
  const [done, setDone] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (open) {
      setSelectedPlan(PLANS[0].price);
      setDone(false);
    }
  }, [open]);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => onCloseRef.current?.(), 1600);
    return () => clearTimeout(timer);
  }, [done]);

  const handleConfirm = () => {
    const plan = PLANS.find((p) => p.price === selectedPlan);
    onPromoted?.(plan);
    setDone(true);
  };

  const chosen = PLANS.find((p) => p.price === selectedPlan);

  return (
    <ModalShell open={open} onClose={onClose} maxWidth="sm:max-w-md">
      {done ? (
        <SuccessView
          title="Photo Promoted!"
          text={`Your photo will be promoted for ${chosen?.days} days.`}
          onDone={onClose}
        />
      ) : (
        <>
          <h3 className="mb-4 pr-10 text-base font-bold text-gray-900 sm:text-lg">
            Sponsored Photo
          </h3>

          <p className="mb-3 text-xs font-semibold text-gray-800">Price</p>

          <div role="radiogroup" className="mb-6 space-y-2.5 sm:space-y-3">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.price;
              return (
                <button
                  key={plan.price}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedPlan(plan.price)}
                  className={`flex w-full items-center rounded-2xl border p-3 text-left transition sm:p-4 ${
                    isSelected
                      ? "border-red-500 bg-red-50/40"
                      : "border-gray-200 bg-red-50/20 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected ? "border-red-600" : "border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">${plan.price}</p>
                      <p className="text-xs text-gray-500">For {plan.days} days</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full rounded-xl bg-secondary py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Confirm Promotion
          </button>
        </>
      )}
    </ModalShell>
  );
};

export default PromoteModal;
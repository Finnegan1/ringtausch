const statusConfig = {
  finished: {
    label: "Zurückgegeben",
    className: "bg-green-200 hover:bg-green-200 text-green-800",
  },
  borrowed: {
    label: "Ausgeliehen",
    className: "bg-yellow-200 hover:bg-yellow-200 text-yellow-800",
  },
  approved: {
    label: "Angenommen",
    className: "bg-blue-200 hover:bg-blue-200 text-blue-800",
  },
  inContact: {
    label: "In Kontakt",
    className: "bg-purple-200 hover:bg-purple-200 text-purple-800",
  },
  default: {
    label: "Angefragt",
    className: "bg-gray-200 text-gray-800",
  },
};

export function StatusBadge({
  isFinished,
  isBorrowed,
  isApproved,
  isInContact,
}: {
  isFinished: boolean;
  isBorrowed: boolean;
  isApproved: boolean;
  isInContact: boolean;
}) {
  let statusKey: keyof typeof statusConfig = "default";

  if (isFinished) {
    statusKey = "finished";
  } else if (isBorrowed) {
    statusKey = "borrowed";
  } else if (isApproved) {
    statusKey = "approved";
  } else if (isInContact) {
    statusKey = "inContact";
  }

  const { label, className } = statusConfig[statusKey];

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${className}`}>{label}</span>
  );
}

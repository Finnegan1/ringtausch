const statusConfig = {
  finished: {
    label: "Zurückgegeben",
    className: "bg-green-200 hover:bg-green-200 text-green-800",
  },
  borrowed: {
    label: "Ausgeliehen",
    className: "bg-yellow-200 hover:bg-yellow-200 text-yellow-800",
  },
  contactExchanged: {
    label: "Kontakt ausgetauscht",
    className: "bg-blue-200 hover:bg-blue-200 text-blue-800",
  },
  borrowerConfirmed: {
    label: "Übergabe bestätigt",
    className: "bg-indigo-200 hover:bg-indigo-200 text-indigo-800",
  },
  approved: {
    label: "Angenommen",
    className: "bg-blue-200 hover:bg-blue-200 text-blue-800",
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
  isBorrowerConfirmed,
}: {
  isFinished: boolean;
  isBorrowed: boolean;
  isApproved: boolean;
  isInContact: boolean;
  isBorrowerConfirmed?: boolean;
}) {
  let statusKey: keyof typeof statusConfig = "default";

  if (isFinished) {
    statusKey = "finished";
  } else if (isBorrowed) {
    statusKey = "borrowed";
  } else if (isApproved && isInContact && isBorrowerConfirmed) {
    statusKey = "borrowerConfirmed";
  } else if (isApproved && isInContact) {
    statusKey = "contactExchanged";
  } else if (isApproved) {
    statusKey = "approved";
  }

  const { label, className } = statusConfig[statusKey];

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${className}`}>{label}</span>
  );
}

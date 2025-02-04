import { getItem } from "@/actions/items";

import { UpdateForm } from "./update-form";

interface Props {
  params: {
    id: string;
  };
}

export default async function Bearbeiten({ params }: Props) {
  const item = await getItem(parseInt(params.id, 10));

  if (!item) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <UpdateForm initialData={item} />
    </div>
  );
}

import { X } from "lucide-react";
import Image from "next/image";

import {
  FileListAction,
  FileListDescription,
  FileListHeader,
  FileListIcon,
  FileListInfo,
  FileListItem,
  FileListName,
  FileListSize,
} from "@/components/ui/file-list";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface FileListEntryProps {
  key: string;
  name: string;
  size?: number;
  objectUrl: string;
  onRemove: () => void;
}

export function FileListEntry({ key, name, size, objectUrl, onRemove }: FileListEntryProps) {
  const onImageClick = () => {
    window.open(objectUrl, "_blank");
  };

  return (
    <HoverCard key={key}>
      <HoverCardTrigger>
        <FileListItem>
          <FileListHeader>
            <FileListIcon />
            <FileListInfo>
              <FileListName>{name}</FileListName>
              {!!size && (
                <FileListDescription>
                  <FileListSize>{size}</FileListSize>
                </FileListDescription>
              )}
            </FileListInfo>
            <FileListAction onClick={onRemove}>
              <X />
              <span className="sr-only">Entfernen</span>
            </FileListAction>
          </FileListHeader>
        </FileListItem>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto">
        <Image
          src={objectUrl}
          alt={name}
          width={100}
          height={100}
          onClick={onImageClick}
          className="cursor-pointer"
        />
      </HoverCardContent>
    </HoverCard>
  );
}

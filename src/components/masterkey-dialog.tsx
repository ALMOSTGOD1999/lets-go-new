import { TriangleAlertIcon } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Input } from "#/components/ui/input";

type MasterkeyDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
};

const MASTER_KEY = "reallydelete";

export function MasterkeyDialog({
  open,
  title,
  description,
  onConfirm,
  onOpenChange,
}: MasterkeyDialogProps) {
  const [value, setValue] = useState("");
  const isMatch = value === MASTER_KEY;

  const handleConfirm = () => {
    if (!isMatch) return;
    onConfirm();
    setValue("");
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setValue("");
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TriangleAlertIcon className="text-destructive" />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-2">
          <Input
            placeholder="Enter the master key"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isMatch) handleConfirm();
            }}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={!isMatch} onClick={handleConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

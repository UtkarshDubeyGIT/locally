"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui";

export function PrintReportButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      className="print-report-button"
      onClick={() => window.print()}
    >
      <Printer aria-hidden />
      Print report
    </Button>
  );
}

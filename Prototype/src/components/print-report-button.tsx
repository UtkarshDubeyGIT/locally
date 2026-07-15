"use client";

import { Button } from "@/components/ui";

export function PrintReportButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      className="print-report-button"
      onClick={() => window.print()}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
        <path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
        <path d="M7 14h10v6H7z" />
      </svg>
      Print report
    </Button>
  );
}

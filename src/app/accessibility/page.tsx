import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getLegalDoc } from "@/lib/legal";
import { LegalPage } from "@/components/content/LegalPage";

const doc = getLegalDoc("accessibility");

export const metadata: Metadata = buildMetadata({
  title: doc.title,
  description: doc.description,
  path: "/accessibility/",
});

export default function AccessibilityPage() {
  return <LegalPage doc={doc} />;
}

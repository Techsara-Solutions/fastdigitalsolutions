import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getLegalDoc } from "@/lib/legal";
import { LegalPage } from "@/components/content/LegalPage";

const doc = getLegalDoc("terms");

export const metadata: Metadata = buildMetadata({
  title: doc.title,
  description: doc.description,
  path: "/terms/",
});

export default function TermsPage() {
  return <LegalPage doc={doc} />;
}

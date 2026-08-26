import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getLegalDoc } from "@/lib/legal";
import { LegalPage } from "@/components/content/LegalPage";

const doc = getLegalDoc("privacy");

export const metadata: Metadata = buildMetadata({
  title: doc.title,
  description: doc.description,
  path: "/privacy/",
});

export default function PrivacyPage() {
  return <LegalPage doc={doc} />;
}

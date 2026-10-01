import type { Metadata } from "next";
import { about, profile } from "@/content";
import { AssistantProvider } from "./components/assistant/AssistantProvider";
import { AssistantPanel } from "./components/assistant/AssistantPanel";
import { AskPortfolioFab } from "./components/assistant/AskPortfolioFab";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { PageOpenTracker } from "./components/PageOpenTracker";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `zachGPT — ${profile.name}, Analytics & Business Intelligence`,
    template: `%s — zachGPT`,
  },
  description: profile.shortBio,
  keywords: profile.targetRoles,
  authors: [{ name: profile.name }],
  openGraph: {
    title: `zachGPT — ${profile.name}`,
    description: profile.headline,
    url: siteUrl,
    siteName: "zachGPT",
    type: "profile",
  },
  twitter: { card: "summary_large_image", title: profile.name, description: profile.headline },
  robots: { index: true, follow: true },
};

/** JSON-LD so the portfolio is machine-readable as well as crawlable. */
function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: "Associate Director, Data Platforms",
    description: about.paragraphs[0],
    email: `mailto:${profile.email}`,
    url: siteUrl,
    knowsAbout: [
      "Business Intelligence",
      "Data Analytics",
      "SQL",
      "Tableau",
      "Power BI",
      "Data Governance",
      "KPI Governance",
      "Healthcare Analytics",
      "Digital Analytics",
    ],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema()) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <AssistantProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <AskPortfolioFab />
          <AssistantPanel />
          <PageOpenTracker />
        </AssistantProvider>
      </body>
    </html>
  );
}

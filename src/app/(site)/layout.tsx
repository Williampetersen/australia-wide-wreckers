import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyCallBar } from "@/components/StickyCallBar";
import { JsonLd } from "@/components/JsonLd";
import { MetaPixel } from "@/components/MetaPixel";
import { organizationSchema } from "@/lib/schema";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <StickyCallBar />
      <MetaPixel />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  );
}

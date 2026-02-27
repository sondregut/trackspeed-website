"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import ScrollReveal from "@/components/ScrollReveal";

export default function Comparison() {
  const t = useTranslations("home");

  const featureKeys = ["price", "accuracy", "chestDetection", "setupTime", "hardware", "splitTimes", "photoFinish", "portability"] as const;
  const competitorKeys = ["freelap", "brower", "dashr", "stopwatch"] as const;

  const features = featureKeys.map((key) => {
    if (key === "splitTimes") {
      return {
        name: t(`comparison.features.${key}`),
        trackspeed: true as string | boolean,
        freelap: true as string | boolean,
        brower: true as string | boolean,
        dashr: true as string | boolean,
        stopwatch: false as string | boolean,
        highlight: false,
      };
    }
    if (key === "photoFinish") {
      return {
        name: t(`comparison.features.${key}`),
        trackspeed: true as string | boolean,
        freelap: false as string | boolean,
        brower: false as string | boolean,
        dashr: false as string | boolean,
        stopwatch: false as string | boolean,
        highlight: true,
      };
    }
    return {
      name: t(`comparison.features.${key}`),
      trackspeed: t(`comparison.trackspeed.${key}`) as string | boolean,
      freelap: t(`comparison.freelap.${key}`) as string | boolean,
      brower: t(`comparison.brower.${key}`) as string | boolean,
      dashr: t(`comparison.dashr.${key}`) as string | boolean,
      stopwatch: t(`comparison.stopwatch.${key}`) as string | boolean,
      highlight: ["price", "accuracy", "chestDetection", "setupTime", "hardware", "portability"].includes(key),
    };
  });

  const renderValue = (value: string | boolean) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D1FAE5]">
          <svg className="w-4 h-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-border">
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      );
    }
    return value;
  };

  return (
    <section id="comparison" className="section-padding px-6 bg-mint-wash">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-section mb-4">
              {t("comparison.title")}
            </h2>
            <p className="text-body">
              {t("comparison.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop Table */}
        <ScrollReveal>
          <div className="hidden lg:block">
            <Card className="overflow-hidden p-0 border-[var(--border-light)] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-0 bg-bg-mint">
                    <TableHead className="text-left py-5 px-6 font-medium text-sm uppercase tracking-wider h-auto text-muted border-b border-border">
                      {t("comparison.feature")}
                    </TableHead>
                    <TableHead className="py-5 px-4 text-center h-auto border-b border-border">
                      <div className="inline-flex flex-col items-center gap-1">
                        <span className="font-bold text-foreground">TrackSpeed</span>
                        <Badge className="text-[10px] px-2 py-0.5 bg-[#D1FAE5] border-transparent text-accent-green">
                          {t("comparison.youAreHere")}
                        </Badge>
                      </div>
                    </TableHead>
                    <TableHead className="py-5 px-4 text-center font-medium h-auto text-muted border-b border-border">Freelap</TableHead>
                    <TableHead className="py-5 px-4 text-center font-medium h-auto text-muted border-b border-border">Brower</TableHead>
                    <TableHead className="py-5 px-4 text-center font-medium h-auto text-muted border-b border-border">DASHR</TableHead>
                    <TableHead className="py-5 px-4 text-center font-medium h-auto text-muted border-b border-border">Stopwatch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((feature, index) => (
                    <TableRow
                      key={index}
                      className={`border-b-0 border-t border-border ${feature.highlight ? 'bg-[var(--bg-sky)]' : 'bg-white'}`}
                    >
                      <TableCell className="py-4 px-6 font-medium text-foreground">{feature.name}</TableCell>
                      <TableCell className="py-4 px-4 text-center">
                        <span className="font-semibold text-foreground">
                          {renderValue(feature.trackspeed)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-muted">
                        {renderValue(feature.freelap)}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-muted">
                        {renderValue(feature.brower)}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-muted">
                        {renderValue(feature.dashr)}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-muted">
                        {renderValue(feature.stopwatch)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ScrollReveal>

        {/* Mobile View */}
        <ScrollReveal>
          <div className="lg:hidden">
            <Card className="p-6 mb-4 border-[var(--border-light)] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <CardHeader className="p-0 pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-foreground">TrackSpeed</span>
                  <Badge className="text-[10px] px-2 py-1 bg-[#D1FAE5] border-transparent text-accent-green">
                    {t("comparison.youAreHere")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className={`flex justify-between items-center py-2 ${index < features.length - 1 ? 'border-b border-border' : ''}`}>
                      <span className="text-muted">{feature.name}</span>
                      <span className="font-medium text-foreground">{renderValue(feature.trackspeed)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {["Freelap", "Brower", "DASHR", "Stopwatch"].map((competitor) => (
                <Card key={competitor} className="p-4 border-[var(--border-light)] rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <CardContent className="p-0">
                    <h4 className="font-medium text-sm mb-3 text-muted">{competitor}</h4>
                    <div className="space-y-2 text-sm">
                      {features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-muted">{feature.name}</span>
                          <span className="text-text-secondary">
                            {renderValue(feature[competitor.toLowerCase() as keyof typeof feature] as string | boolean)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="text-center text-xs mt-8 space-y-1 text-muted">
          <p>{t("comparison.footnotes.pricing")}</p>
          <p>{t.rich("comparison.footnotes.browerStudy", {
            link: (chunks) => <a key="brower-link" href="https://www.researchgate.net/publication/266796025" className="underline hover:no-underline text-text-secondary" target="_blank" rel="noopener">{chunks}</a>,
          })}</p>
          <p>{t("comparison.footnotes.beamNote")}</p>
        </div>

        <div className="text-center mt-10">
          <a
            href="https://apps.apple.com/app/trackspeed/id6757509163"
            className="btn-primary inline-flex items-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Try TrackSpeed Free
          </a>
        </div>
      </div>
    </section>
  );
}

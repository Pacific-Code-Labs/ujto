import { Badge, Button, Card, CardContent, RichText, resolveIcon, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { Download } from "lucide-react";
import { getDownload } from "@/repositories/content.repository";
import { downloadUrl, isDownloadAvailable, splitPlatforms } from "@/services/download.service";

/** "Download the Ujtö̀ app": the visitor's installer first, the other platforms below. */
export function DownloadSection() {
  const { t } = useLanguage();
  const L = useLocalized();
  const content = getDownload();
  const available = isDownloadAvailable();
  const { primary, others } = splitPlatforms();
  const featured = primary ?? others[0];
  const rest = primary ? others : others.slice(1);
  const PrimaryIcon = resolveIcon(featured?.iconName);

  return (
    <section id="download" className="bg-card py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{L(content.title)}</h2>
        <p className="mx-auto mb-10 max-w-3xl text-lg text-muted-foreground">
          <RichText>{L(content.description)}</RichText>
        </p>

        {featured && (
          <div className="mb-8 flex flex-col items-center gap-2">
            {available ? (
              <Button asChild size="lg" className="h-14 px-8 text-lg">
                <a href={downloadUrl(featured)}>
                  <PrimaryIcon className="mr-2 h-5 w-5" />
                  {t("download.button")} · {L(featured.label)}
                </a>
              </Button>
            ) : (
              <Button size="lg" className="h-14 px-8 text-lg" disabled>
                <PrimaryIcon className="mr-2 h-5 w-5" />
                {t("common.comingSoon")} · {L(featured.label)}
              </Button>
            )}
            {primary && <span className="text-sm text-muted-foreground">{t("download.yourSystem")}</span>}
          </div>
        )}

        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("download.otherPlatforms")}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {rest.map((p) => {
            const Icon = resolveIcon(p.iconName);
            return (
              <Card key={p.file}>
                <CardContent className="flex items-center gap-3 p-4 text-left">
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <span className="flex-1 font-medium">{L(p.label)}</span>
                  {available ? (
                    <Button asChild size="sm" variant="outline" aria-label={`${t("download.button")} ${L(p.label)}`}>
                      <a href={downloadUrl(p)}>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Badge variant="secondary">{t("common.comingSoon")}</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{L(content.requirements)}</p>
      </div>
    </section>
  );
}

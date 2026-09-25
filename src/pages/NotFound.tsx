import { Button, useLanguage } from "@pacific-code-labs/ujto-ds";
import { useEffect } from "react";

export default function NotFound() {
  const { t, language } = useLanguage();
  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex";
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);
  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="mb-2 text-3xl font-bold">{t("notFound.title")}</h1>
        <p className="mb-6 text-muted-foreground">{t("notFound.description")}</p>
        <Button asChild>
          <a href={`/${language}`}>{t("notFound.goHome")}</a>
        </Button>
      </div>
    </div>
  );
}

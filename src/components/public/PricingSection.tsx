import { Badge, Button, Card, CardContent, cn, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { Check, Lock } from "lucide-react";
import { appHref, newTab } from "@/lib/links";
import { getPricing } from "@/repositories/content.repository";

export function PricingSection() {
  const { t, language } = useLanguage();
  const L = useLocalized();
  const pricing = getPricing();
  return (
    <section id="pricing" className="bg-muted py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{L(pricing.title)}</h2>
          <p className="text-xl text-muted-foreground">{L(pricing.subtitle)}</p>
        </div>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {pricing.plans.map((plan) => {
            const soon = plan.status === "coming-soon";
            return (
              <Card key={plan.code} className={cn("relative flex flex-col", plan.highlighted && "border-2 border-primary", soon && "opacity-80")}>
                {(soon || plan.highlighted) && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant={soon ? "secondary" : "default"}>
                    {soon ? t("common.comingSoon") : t("pricing.popular")}
                  </Badge>
                )}
                <CardContent className="flex flex-1 flex-col p-8">
                  <div className="mb-8 text-center">
                    <h3 className="mb-2 text-2xl font-bold">{L(plan.name)}</h3>
                    <div className="mb-2 text-4xl font-bold">{plan.price}</div>
                    <p className="text-muted-foreground">{L(plan.period)}</p>
                  </div>
                  <ul className="mb-8 flex-1 space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={cn("flex items-center gap-3", soon && "opacity-60")}>
                        {soon ? <Lock className="h-5 w-5 shrink-0 text-muted-foreground" /> : <Check className="h-5 w-5 shrink-0 text-success" />}
                        <span>{L(feature)}</span>
                      </li>
                    ))}
                  </ul>
                  {soon ? (
                    <Button disabled className="w-full">
                      {t("common.comingSoon")}
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <a href={appHref(language, "/register")} {...newTab}>
                        {t("pricing.startFree")}
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

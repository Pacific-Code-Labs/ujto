import { Card, CardContent, RichText, resolveIcon, useLocalized } from "@pacific-code-labs/ujto-ds";
import { getFeatures } from "@/repositories/content.repository";

export function FeaturesSection() {
  const L = useLocalized();
  const features = getFeatures();
  return (
    <section id="features" className="bg-card py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{L(features.title)}</h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">{L(features.subtitle)}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item) => {
            const Icon = resolveIcon(item.iconName);
            return (
              <Card key={item.id} className="transition-shadow hover:shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-semibold">{L(item.title)}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    <RichText>{L(item.description)}</RichText>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

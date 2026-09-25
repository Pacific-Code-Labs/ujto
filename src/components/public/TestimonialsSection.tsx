import { Card, CardContent, useLanguage, useLocalized } from "@pacific-code-labs/ujto-ds";
import { Star } from "lucide-react";
import { getTestimonials } from "@/repositories/content.repository";

const AVATAR_GRADIENTS = ["from-primary to-secondary", "from-accent to-primary", "from-secondary to-accent"];

export function TestimonialsSection() {
  const { t } = useLanguage();
  const L = useLocalized();
  const content = getTestimonials();
  return (
    <section id="testimonials" className="bg-muted py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">{L(content.title)}</h2>
          <p className="text-xl text-muted-foreground">{L(content.subtitle)}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {content.items.map((item, i) => (
            <Card key={item.id} className="flex flex-col transition-transform hover:-translate-y-1">
              <CardContent className="flex flex-1 flex-col p-8">
                <div className="mb-4 flex text-warning" role="img" aria-label={t("testimonials.rating", { count: item.rating })}>
                  {Array.from({ length: item.rating }, (_, s) => (
                    <Star key={s} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <blockquote className="mb-6 flex-1">“{L(item.quote)}”</blockquote>
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r font-bold text-white ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}`}
                    aria-hidden
                  >
                    {item.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{L(item.role)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Container } from "../Container";
import { Star } from "../Icons";
import { site } from "@/lib/site";

export function GoogleReviews() {
  const hasRating = site.googleRating !== null && site.googleReviewCount !== null;

  return (
    <section className="border-b border-ink/5 bg-white py-8">
      <Container className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/15 text-ink">
            <Star className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink">
              {hasRating
                ? `${site.googleRating} / 5 from ${site.googleReviewCount}+ Google reviews`
                : "Rated by real customers on Google"}
            </p>
            <p className="text-xs text-zinc-500">
              See what locals say about our service.
            </p>
          </div>
        </div>
        <a
          href={site.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-brand-dark transition-colors hover:text-ink"
        >
          Read our Google reviews →
        </a>
      </Container>
    </section>
  );
}

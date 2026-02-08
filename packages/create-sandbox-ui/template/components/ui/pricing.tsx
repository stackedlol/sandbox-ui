import { cn } from "@/lib/cn";
import { Card } from "./card";
import { Button } from "./button";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  pastel: string;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    period: "free forever",
    description: "For individuals exploring the platform.",
    pastel: "var(--pastel-green)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18M8 7l4-4 4 4" strokeOpacity="0.6" />
        <circle cx="12" cy="15" r="3" strokeOpacity="0.4" />
      </svg>
    ),
    features: [
      "Up to 3 projects",
      "Basic analytics",
      "Community support",
      "1 GB storage",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing teams that need more power.",
    pastel: "var(--pastel-blue)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "50 GB storage",
      "Custom domains",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For organizations with advanced needs.",
    pastel: "var(--pastel-purple)",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" strokeOpacity="0.4" />
        <path d="M2 12l10 5 10-5" strokeOpacity="0.6" />
      </svg>
    ),
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Dedicated account manager",
      "Unlimited storage",
      "SLA guarantee",
      "Custom integrations",
    ],
  },
];

export function PricingTable() {
  return (
    <section id="pricing" className="w-full">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">
          simple, transparent pricing
        </h2>
        <p className="mt-4 text-fg/30 text-lg max-w-xl mx-auto leading-relaxed">
          choose the plan that fits your needs. upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {plans.map((plan, index) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col justify-between animate-fade-up overflow-hidden",
              plan.popular && [
                "glass-strong",
                "border-[var(--glass-border-strong)]",
                "md:[scale:1.03]",
              ],
            )}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Top accent glow */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent 5%, ${plan.pastel} 50%, transparent 95%)`,
                opacity: plan.popular ? 0.6 : 0.3,
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-[40px] pointer-events-none"
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${plan.pastel} ${plan.popular ? 6 : 3}%, transparent) 0%, transparent 100%)`,
              }}
            />

            <div>
              {/* Icon + badge row */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center relative z-10"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, ${plan.pastel} 14%, transparent), color-mix(in srgb, ${plan.pastel} 6%, transparent))`,
                      color: plan.pastel,
                      border: `1px solid color-mix(in srgb, ${plan.pastel} 18%, transparent)`,
                      boxShadow: `0 0 20px color-mix(in srgb, ${plan.pastel} 8%, transparent), inset 0 1px 0 color-mix(in srgb, ${plan.pastel} 10%, transparent)`,
                    }}
                  >
                    {plan.icon}
                  </div>
                  {/* Icon ambient glow */}
                  <div className="absolute -inset-2 rounded-2xl pointer-events-none" style={{ background: plan.pastel, opacity: 0.04, filter: "blur(10px)" }} />
                </div>
                {plan.popular && (
                  <span
                    className="px-3 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in srgb, ${plan.pastel} 14%, transparent), color-mix(in srgb, ${plan.pastel} 8%, transparent))`,
                      color: plan.pastel,
                      border: `1px solid color-mix(in srgb, ${plan.pastel} 20%, transparent)`,
                      boxShadow: `0 0 12px color-mix(in srgb, ${plan.pastel} 6%, transparent)`,
                    }}
                  >
                    popular
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-fg">{plan.name}</h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1.5">
                <span
                  className="text-4xl font-bold tracking-tight"
                  style={{
                    color: plan.pastel,
                    textShadow: `0 0 30px color-mix(in srgb, ${plan.pastel} 20%, transparent)`,
                  }}
                >
                  {plan.price}
                </span>
                <span className="text-fg/20 text-sm">{plan.period}</span>
              </div>

              <p className="mt-3 text-sm text-fg/30 leading-relaxed">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="my-6 h-px relative">
                <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${plan.pastel} 15%, transparent) 30%, color-mix(in srgb, ${plan.pastel} 15%, transparent) 70%, transparent)` }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent 20%, ${plan.pastel} 50%, transparent 80%)`, opacity: 0.08, filter: "blur(2px)" }} />
              </div>

              <ul className="space-y-3.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-fg/50"
                  >
                    <div className="relative shrink-0">
                      <svg className="h-4 w-4 relative z-10" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke={plan.pastel} strokeWidth="1" strokeOpacity={0.15} />
                        <path
                          d="M4.5 8.5L7 11L11.5 5.5"
                          stroke={plan.pastel}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeOpacity="0.7"
                        />
                      </svg>
                      <div className="absolute inset-0 rounded-full" style={{ background: plan.pastel, opacity: 0.06, filter: "blur(4px)" }} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 relative">
              {plan.popular && (
                <div className="absolute -inset-1 rounded-xl pointer-events-none" style={{ background: plan.pastel, opacity: 0.06, filter: "blur(8px)" }} />
              )}
              <Button
                variant={plan.popular ? "primary" : "secondary"}
                size="md"
                className="w-full relative z-10"
              >
                {plan.price === "$0" ? "get started" : "start free trial"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

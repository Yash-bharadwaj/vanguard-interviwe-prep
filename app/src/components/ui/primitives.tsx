import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Progress from "@radix-ui/react-progress";
import * as Dialog from "@radix-ui/react-dialog";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonV = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:opacity-90",
        outline: "border border-line bg-card hover:bg-soft",
        ghost: "hover:bg-soft",
        ok: "bg-ok text-white hover:opacity-90",
      },
      size: { sm: "h-8 px-3", md: "h-9 px-4", lg: "h-11 px-5 text-base", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonV> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...p }, ref) => {
  const C = asChild ? Slot : "button";
  return <C ref={ref} className={cn(buttonV({ variant, size }), className)} {...p} />;
});
Button.displayName = "Button";

const badgeV = cva("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap", {
  variants: {
    tone: {
      neutral: "border-line text-muted bg-card",
      hi: "border-hi/40 text-hi bg-hi/10",
      med: "border-med/40 text-med bg-med/10",
      lo: "border-line text-lo",
      ok: "border-ok/40 text-ok bg-ok/10",
      warn: "border-warn/40 text-warn bg-warn/10",
      solid: "border-transparent bg-accent text-accent-fg",
    },
  },
  defaultVariants: { tone: "neutral" },
});
export const Badge = ({ className, tone, ...p }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeV>) => (
  <span className={cn(badgeV({ tone }), className)} {...p} />
);

export const Card = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-lg border border-line bg-card", className)} {...p} />
);
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn("h-9 w-full rounded-md border border-line bg-card px-3 text-sm outline-none focus:border-fg placeholder:text-muted", className)} {...p} />
));
Input.displayName = "Input";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...p }, ref) => (
  <textarea ref={ref} className={cn("w-full rounded-md border border-line bg-card px-3 py-2 text-sm outline-none focus:border-fg placeholder:text-muted", className)} {...p} />
));
Textarea.displayName = "Textarea";

export const ProgressBar = ({ value, className }: { value: number; className?: string }) => (
  <Progress.Root className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-soft", className)} value={value}>
    <Progress.Indicator className="h-full bg-fg transition-all" style={{ width: `${value}%` }} />
  </Progress.Root>
);

export const TabsRoot = Tabs.Root;
export const TabsList = ({ className, ...p }: React.ComponentProps<typeof Tabs.List>) => (
  <Tabs.List className={cn("flex gap-1 overflow-x-auto border-b border-line pb-px [scrollbar-width:none]", className)} {...p} />
);
export const TabsTrigger = ({ className, ...p }: React.ComponentProps<typeof Tabs.Trigger>) => (
  <Tabs.Trigger className={cn("shrink-0 cursor-pointer border-b-2 border-transparent px-3 py-2 text-sm text-muted hover:text-fg data-[state=active]:border-fg data-[state=active]:text-fg", className)} {...p} />
);
export const TabsContent = ({ className, ...p }: React.ComponentProps<typeof Tabs.Content>) => (
  <Tabs.Content className={cn("pt-4 outline-none", className)} {...p} />
);

/** Collapsible section used everywhere (mobile-friendly). */
export function Section({ title, badge, defaultOpen = false, children, className, tone }: { title: React.ReactNode; badge?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode; className?: string; tone?: "warn" | "ok" }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={cn("rounded-md border border-line", tone === "warn" && "border-warn/40", className)}>
      <Collapsible.Trigger className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left text-sm font-medium">
        <span className="flex min-w-0 items-center gap-2">{title}{badge}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
      </Collapsible.Trigger>
      <Collapsible.Content className="border-t border-line px-3 py-3 text-sm">{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}

export const Sheet = ({ open, onOpenChange, title, children, actions }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; children: React.ReactNode; actions?: React.ReactNode }) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
      <Dialog.Content className="fixed inset-0 z-50 flex flex-col bg-bg md:inset-y-4 md:left-1/2 md:w-[min(900px,92vw)] md:-translate-x-1/2 md:rounded-xl md:border md:border-line">
        <div className="flex items-center justify-between border-b border-line px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Dialog.Title className="min-w-0 flex-1 truncate text-sm font-semibold">{title}</Dialog.Title>
          <div className="flex shrink-0 items-center gap-1">{actions}<Dialog.Close className="cursor-pointer rounded p-1 hover:bg-soft" aria-label="Close"><X className="h-5 w-5" /></Dialog.Close></div>
        </div>
        <Dialog.Description className="sr-only">{title}</Dialog.Description>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const H = ({ children, sub }: { children: React.ReactNode; sub?: React.ReactNode }) => (
  <div className="mb-5">
    <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{children}</h1>
    {sub && <p className="mt-1 max-w-3xl text-sm text-muted">{sub}</p>}
  </div>
);
export const Label = ({ children, tone }: { children: React.ReactNode; tone?: "warn" | "ok" }) => (
  <div className={cn("mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted", tone === "warn" && "text-warn", tone === "ok" && "text-ok")}>{children}</div>
);
export const P = ({ children, className }: { children: React.ReactNode; className?: string }) => <p className={cn("leading-relaxed", className)}>{children}</p>;
export const Bullets = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="list-disc space-y-1 pl-5 leading-relaxed">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
);

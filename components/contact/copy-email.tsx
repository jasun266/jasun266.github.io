"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Magnetic } from "@/components/motion/magnetic";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <Magnetic strength={0.12} className="block">
      <button
        type="button"
        onClick={copy}
        data-cursor="Copy"
        className="group glass flex w-full items-center justify-between gap-4 rounded-[1.75rem] p-5 text-left transition-colors hover:border-primary/40 sm:p-6"
      >
        <span>
          <span className="block font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {copied ? "Copied" : "Email — click to copy"}
          </span>
          <span className="mt-2 block font-display text-xl font-semibold tracking-tight break-all sm:text-3xl">
            {email}
          </span>
        </span>
        <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 ease-out-expo group-hover:rotate-12">
          {copied ? <Check className="size-5" /> : <Copy className="size-5" />}
        </span>
      </button>
    </Magnetic>
  );
}

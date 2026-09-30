"use client";

import { useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { site } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Please tell me your name."),
  email: z.email("That email doesn't look right."),
  message: z.string().trim().min(10, "A few more words, please.").max(5000, "Please keep it under 5000 characters."),
});
type Field = keyof z.infer<typeof schema>;

// Static hosting has no server, so the form posts to Formspree (the endpoint the old site used).
// Honeypot field `_gotcha` is Formspree's built-in spam trap.
export function ContactForm({ className }: { className?: string }) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const parsed = schema.safeParse(Object.fromEntries(data));
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    if (data.get("_gotcha")) return;
    setSending(true);
    try {
      const res = await fetch(site.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      toast.success("Message sent. I'll get back to you soon.");
    } catch {
      toast.error("Couldn't send that right now.", {
        action: { label: "Email instead", onClick: () => (window.location.href = `mailto:${site.email}`) },
      });
    } finally {
      setSending(false);
    }
  };

  const field = (name: Field) => ({
    id: `contact-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });
  const error = (name: Field) =>
    errors[name] && (
      <p id={`contact-${name}-error`} className="text-sm text-destructive">
        {errors[name]}
      </p>
    );

  return (
    <form noValidate onSubmit={onSubmit} className={cn("glass space-y-5 rounded-[2rem] p-6 sm:p-8", className)}>
      <input type="hidden" name="_subject" value={`New message from ${new URL(site.url).host}`} />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Name</Label>
          <Input {...field("name")} autoComplete="name" className="h-12 rounded-xl px-4" />
          {error("name")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Email</Label>
          <Input {...field("email")} type="email" autoComplete="email" className="h-12 rounded-xl px-4" />
          {error("email")}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          {...field("message")}
          rows={6}
          className="min-h-40 rounded-xl px-4 py-3"
          placeholder="What are you building?"
        />
        {error("message")}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="btn-fill inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground disabled:opacity-70 sm:w-auto"
      >
        {sending ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

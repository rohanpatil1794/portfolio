import Link from "next/link";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

const socials = [
  {
    href: "https://github.com/rohanpatil1794",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://linkedin.com/in/rohanpatil1794",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  {
    href: "mailto:rohanpatil1794@gmail.com",
    label: "Email",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <p className="text-sm text-[var(--muted-foreground)]">
          © {new Date().getFullYear()} Rohan Patil
        </p>
        <div className="flex items-center gap-4">
          {socials.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              <Icon size={18} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

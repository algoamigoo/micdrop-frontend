import { FaGithub, FaInstagram, FaYoutube } from "react-icons/fa";
import { Globe } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { Link, LinkType } from "@/types/domain";

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.554V9h3.565v11.452z" />
    </svg>
  );
}

// Use a more flexible component type signature that satisfies both Lucide, React-Icons, and SVGs
type IconComponent = ComponentType<{ className?: string; [key: string]: any }>;

function iconFor(type: LinkType): IconComponent {
  switch (type) {
    case "github":
      return FaGithub;
    case "youtube":
      return FaYoutube;
    case "instagram":
      return FaInstagram;
    case "twitter":
      return XIcon;
    case "linkedin":
      return LinkedInIcon;
    default:
      return Globe;
  }
}

export function UserLink({ link }: { link: Link }) {
  const Icon = iconFor(link.type);
  const label = link.type.charAt(0).toUpperCase() + link.type.slice(1);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={link.url}
      className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
    >
      <Icon className="size-3.5" />
      {label}
    </a>
  );
}
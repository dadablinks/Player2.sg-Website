import {
  Bot,
  Camera,
  Clapperboard,
  Film,
  Globe2,
  MessageCircle,
  Quote,
  Sparkles,
  Video,
} from "lucide-react";
import type { ComponentType } from "react";

export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  promise: string;
  bullets: string[];
  image: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  accent: string;
};

export const whatsappUrl =
  "https://wa.me/6581168100?text=Hi%20Player2%2C%20I%27d%20like%20to%20ask%20about%20your%20property%20media%20services.";

export const services: Service[] = [
  {
    slug: "listing-media",
    title: "Listing Media",
    eyebrow: "Photography plus launch assets",
    intro:
      "Clean interior property photography and listing-ready visuals for agents who need the home to feel credible before the first viewing.",
    promise:
      "A focused media set that makes your listing look prepared, current and easy to market.",
    bullets: [
      "Interior photography for resale, rental and new launch listings",
      "Exterior, lifestyle and detail shots where the space needs context",
      "Edited image selections sized for portals and social posts",
      "Optional launch frames for reels, ads and WhatsApp sharing",
    ],
    image: "/assets/listing.jpg",
    icon: Camera,
    accent: "#f7c948",
  },
  {
    slug: "walkthrough-videos",
    title: "Video Walkthroughs",
    eyebrow: "Movement through the property",
    intro:
      "Visual walkthrough videos that help buyers understand flow, room relationships and the feeling of moving through the home.",
    promise:
      "A listing video that does more than show rooms; it gives prospects a reason to book the viewing.",
    bullets: [
      "Vertical walkthroughs for Instagram, TikTok and WhatsApp",
      "Horizontal property tours for listings and presentations",
      "Opening hooks, room sequencing and caption-ready structure",
      "Optional voiceover or agent-on-camera introduction",
    ],
    image: "/assets/listing.jpg",
    icon: Video,
    accent: "#3dd6d0",
  },
  {
    slug: "reel-explainers",
    title: "Reel Explainers",
    eyebrow: "Short-form content for visibility",
    intro:
      "Reel explainers turn your property knowledge into sharp, useful clips that keep you visible between listings.",
    promise:
      "Regular educational content that positions you as helpful before the lead is ready to talk.",
    bullets: [
      "Buyer and seller FAQ reels",
      "Market updates, price-point explainers and neighborhood angles",
      "Script support, hooks, captions and editing",
      "Raw idea to finished Instagram or TikTok-ready video",
    ],
    image: "/assets/social.jpg",
    icon: Clapperboard,
    accent: "#ff6b6b",
  },
  {
    slug: "ai-augmented-videos",
    title: "AI Augmented Videos",
    eyebrow: "Faster concepts and smarter variants",
    intro:
      "AI-assisted production for agents who want stronger visuals, quicker variants and modern presenter options without turning the brand generic.",
    promise:
      "AI is used as a production multiplier: scripts, visuals, captions, generated b-roll, presenter formats and campaign variations.",
    bullets: [
      "AI-assisted scripts, hooks and caption versions",
      "Generated visual concepts, b-roll and graphic sequences",
      "AI presenter or narrator options when suitable",
      "Multiple platform variants from one core message",
    ],
    image: "/assets/ai.jpg",
    icon: Bot,
    accent: "#8b5cf6",
  },
  {
    slug: "branding-content",
    title: "Branding Content",
    eyebrow: "Trust-building stories",
    intro:
      "Profile videos, testimonials and client-story content that help prospects feel who they are dealing with before they send the first message.",
    promise:
      "A stronger agent brand with proof, warmth and consistency beyond one listing campaign.",
    bullets: [
      "Agent profile videos and introduction reels",
      "Client testimonial videos and story-led edits",
      "Recurring mini-series for credibility and recall",
      "Long-form interviews repurposed into short clips",
    ],
    image: "/assets/social.jpg",
    icon: Quote,
    accent: "#4ade80",
  },
  {
    slug: "website-starter",
    title: "Website Starter",
    eyebrow: "A credible home base",
    intro:
      "A compact, polished starter website for agents or small brands who need a real web presence without a drawn-out build.",
    promise:
      "Profile, services, proof, gallery and WhatsApp contact in a fast static site that is ready for Cloudflare.",
    bullets: [
      "Personal agent or small-brand landing site",
      "Service sections, gallery, proof slots and enquiry CTA",
      "Mobile-first design with Cloudflare Pages deployment",
      "Built so content can grow later without restarting",
    ],
    image: "/assets/website-starter.jpg",
    icon: Globe2,
    accent: "#60a5fa",
  },
];

export const proofCards = [
  {
    title: "Listing Launch Kit",
    tag: "Placeholder case study",
    copy: "Photography, vertical walkthrough and WhatsApp-ready launch frames for a new listing.",
  },
  {
    title: "Agent Visibility Series",
    tag: "Placeholder case study",
    copy: "Monthly reel explainers built from market questions, listing angles and agent commentary.",
  },
  {
    title: "Starter Website Build",
    tag: "Placeholder case study",
    copy: "A compact brand site with services, proof slots and direct WhatsApp enquiry flow.",
  },
];

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/listing-media", label: "Listing Media" },
  { href: "/walkthrough-videos", label: "Walkthroughs" },
  { href: "/reel-explainers", label: "Reels" },
  { href: "/ai-augmented-videos", label: "AI Video" },
  { href: "/website-starter", label: "Website Starter" },
];

export const process = [
  {
    title: "Plan the move",
    copy: "Clarify the listing, agent voice or campaign goal before filming starts.",
    icon: Sparkles,
  },
  {
    title: "Capture the assets",
    copy: "Shoot the space, message or proof in the format the final content actually needs.",
    icon: Film,
  },
  {
    title: "Package for action",
    copy: "Deliver edits, frames and CTA-ready versions that can go straight into your channels.",
    icon: MessageCircle,
  },
];

import { MinimalistHero } from "@/components/MinimalistHero";
import { Twitter, Github, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <MinimalistHero
        logoText="MINI-SDM"
        navLinks={[
          { label: "ABOUT", href: "#about" },
          { label: "WORK", href: "#work" },
          { label: "CONTACT", href: "#contact" },
        ]}
        mainText="Why don't you pre-experience your wedding? It it because no such service exsits."
        readMoreLink="#more"
        imageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
        imageAlt="Abstract Minimalist Art"
        overlayText={{
          part1: "PREPARE",
          part2: "FOR",
          part3: "YOUR",
          part4: "WEDDING",
        }}
        socialLinks={[
        ]}
        locationText=""
      />
    </main>
  );
}
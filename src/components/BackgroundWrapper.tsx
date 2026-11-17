"use client";
import { useEffect, useState } from "react";

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/background")
      .then((r) => r.json())
      .then((d) => {
        if (d.backgroundImage) setBgImage(d.backgroundImage);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-background text-foreground bg-animated">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" } : {}}>
      <div className={bgImage ? "" : "bg-animated"}>
        {children}
      </div>
    </div>
  );
}
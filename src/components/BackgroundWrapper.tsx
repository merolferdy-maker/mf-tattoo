"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  let session: any = { status: "unauthenticated", data: null };
  try {
    session = useSession();
  } catch {
    // SessionProvider not available during static generation
  }
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    if (session?.data?.user?.backgroundImage) {
      setBgImage(session.data.user.backgroundImage);
    }
  }, [session?.data?.user?.backgroundImage]);

  if (!session || session.status === "loading") {
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
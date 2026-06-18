import { useCallback, useEffect, useRef, useState } from "react";

interface IntroVideoProps {
  onComplete: () => void;
}

const IntroVideo = ({ onComplete }: IntroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasCompletedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const completeIntro = useCallback(() => {
    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    try {
      window.sessionStorage.setItem("punto-sport-intro-seen", "true");
    } catch {
      // Algunos navegadores privados bloquean el almacenamiento.
    }
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      if (window.sessionStorage.getItem("punto-sport-intro-seen") === "true") {
        completeIntro();
        return;
      }
    } catch {
      // Si no hay almacenamiento disponible, la intro continúa normalmente.
    }

    const isAndroid = /Android/i.test(window.navigator.userAgent);
    const safetyTimeout = window.setTimeout(completeIntro, isAndroid ? 4500 : 8000);

    const tryAutoplay = async () => {
      video.muted = isAndroid;
      video.volume = 1;

      try {
        await video.play();
      } catch {
        video.muted = true;

        try {
          await video.play();
        } catch {
          completeIntro();
          return;
        }
      }

      requestAnimationFrame(() => setIsVisible(true));
    };

    void tryAutoplay();

    return () => window.clearTimeout(safetyTimeout);
  }, [completeIntro]);

  const finishIntro = () => {
    setIsFinishing(true);
    window.setTimeout(completeIntro, 300);
  };

  return (
    <main
      className={`fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black transition-opacity duration-500 ${
        isVisible && !isFinishing ? "opacity-100" : "opacity-0"
      }`}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        preload="metadata"
        onCanPlay={() => setIsVisible(true)}
        onStalled={completeIntro}
        onAbort={completeIntro}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (video.duration && video.duration - video.currentTime <= 0.5) {
            setIsFinishing(true);
          }
        }}
        onEnded={finishIntro}
        onError={completeIntro}
        className="h-full w-full object-cover"
      >
        <source src="/intro-punto-sport.mp4" type="video/mp4" />
      </video>
    </main>
  );
};

export default IntroVideo;

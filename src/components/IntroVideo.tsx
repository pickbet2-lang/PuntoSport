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
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const safetyTimeout = window.setTimeout(completeIntro, 15_000);

    const tryAutoplay = async () => {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;

      try {
        await video.play();
      } catch {
        // Safari puede rechazar play() mientras todavía está cargando.
        // El atributo autoPlay y onCanPlay vuelven a intentarlo al estar listo.
      }

      requestAnimationFrame(() => setIsVisible(true));
    };

    void tryAutoplay();

    const resumeAutoplay = () => {
      if (!video.ended && video.paused && document.visibilityState === "visible") {
        void tryAutoplay();
      }
    };

    window.addEventListener("pageshow", resumeAutoplay);
    document.addEventListener("visibilitychange", resumeAutoplay);

    return () => {
      window.clearTimeout(safetyTimeout);
      window.removeEventListener("pageshow", resumeAutoplay);
      document.removeEventListener("visibilitychange", resumeAutoplay);
    };
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
        autoPlay
        playsInline
        muted
        preload="auto"
        onCanPlay={(event) => {
          setIsVisible(true);
          if (event.currentTarget.paused) {
            void event.currentTarget.play().catch(() => undefined);
          }
        }}
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

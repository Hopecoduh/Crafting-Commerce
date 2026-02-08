import { useEffect, useState } from "react";

export function useActionTimer() {
  const [endsAt, setEndsAt] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!endsAt) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [endsAt]);

  const remainingMs = endsAt ? Math.max(0, endsAt - now) : 0;
  const remainingSec = Math.ceil(remainingMs / 1000);
  const running = !!endsAt && remainingMs > 0;

  function start(seconds) {
    setEndsAt(Date.now() + seconds * 1000);
  }

  function stop() {
    setEndsAt(null);
  }

  return { running, remainingSec, start, stop };
}

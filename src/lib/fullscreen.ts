/** Open an element fullscreen and try to lock landscape on phones. */
export async function openFullscreen(element: HTMLElement | null) {
  if (!element) return;
  try {
    const anyElement = element as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void> | void;
      webkitEnterFullscreen?: () => Promise<void> | void;
    };
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }
    if (element.requestFullscreen) await element.requestFullscreen();
    else if (anyElement.webkitRequestFullscreen) await anyElement.webkitRequestFullscreen();
    else if (anyElement.webkitEnterFullscreen) await anyElement.webkitEnterFullscreen();
  } catch {
    /* Fullscreen may be blocked; keep the inline view. */
  }
  try {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (value: string) => Promise<void>;
    };
    if (window.innerWidth < 900) await orientation.lock?.("landscape");
  } catch {
    /* iOS Safari does not support orientation locking. */
  }
}

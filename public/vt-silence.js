/* Runs before pagereveal, so it must stay an early classic script rather than
   joining the deferred module bundle.

   Cross-document view transitions expose ready/finished promises. When the
   browser skips a transition (page not compositing, navigation superseded,
   timeout) those reject, and with nothing subscribed it surfaces as an
   unhandled AbortError. The transition is CSS-driven and nothing depends on
   the result, so no-op handlers just keep the console honest. */
(function () {
  function silence(event) {
    var vt = event && event.viewTransition;
    if (!vt) return;
    ["ready", "finished", "updateCallbackDone"].forEach(function (key) {
      var p = vt[key];
      if (p && typeof p.catch === "function") p.catch(function () {});
    });
  }
  window.addEventListener("pagereveal", silence);
  window.addEventListener("pageswap", silence);

  /* A skipped transition can reject after its document is being torn down, so
     the per-promise handlers above do not always get the chance to mark it
     handled. Swallow only this exact benign rejection and let every other
     error through untouched. */
  window.addEventListener("unhandledrejection", function (event) {
    var reason = event && event.reason;
    if (!reason) return;
    if (reason.name === "AbortError" && /Transition was skipped/i.test(reason.message || "")) {
      event.preventDefault();
    }
  });
})();

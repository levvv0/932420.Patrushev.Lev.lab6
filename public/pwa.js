if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").catch(function (error) {
      console.error("Не удалось зарегистрировать service worker:", error);
    });
  });
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (!GA_ID) return;

  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
};

export const trackPageView = (path: string) => {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", "page_view", { page_path: path });
};

export const trackEvent = (action: string, category: string, label?: string) => {
  if (!GA_ID || !window.gtag) return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
  });
};

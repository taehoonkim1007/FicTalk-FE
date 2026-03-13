import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { trackPageView } from "@/lib/analytics";

export const AnalyticsLayout = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return <Outlet />;
};

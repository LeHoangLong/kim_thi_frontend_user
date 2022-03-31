import { GOOGLE_ANALYTICS_TRACKING_ID } from "../config/GoogleAnalytics";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (GOOGLE_ANALYTICS_TRACKING_ID) {
    window.gtag("config", GOOGLE_ANALYTICS_TRACKING_ID, {
      page_path: url
    });
  }
};


type GTagEvent = {
    eventName: string;
    action: string,
    category: string;
    label: string;
    value: number;
};

declare global {
    var gtag: any;
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const sendGoogleAnalyticsEvent = ({ eventName, action, category, label, value }: GTagEvent) => {
  console.log('window.location.hostname')
  console.log(window.location.hostname)
  console.log(GOOGLE_ANALYTICS_TRACKING_ID)
  if (GOOGLE_ANALYTICS_TRACKING_ID) {
    console.log('send ga event')
    gtag('event', eventName, {
      action: action,
      event_category: category,
      event_label: label,
      value: value
    })
  }  
};
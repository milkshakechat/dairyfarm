
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "NotificationsPage";
  const phrases: PhraseSet[] = [
  { key: "_txt_notifications_fbe", text: "Notifications" },
{ key: "_txt_markAllAsRead_ad4", text: "Mark all as read?" },
{ key: "_txt_yes_5d1", text: "Yes" },
{ key: "_txt_no_d16", text: "No" },
{ key: "_txt_loadMore_b63", text: "Load More" },
{ key: "_txt_endOfList_fbd", text: "End of List" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
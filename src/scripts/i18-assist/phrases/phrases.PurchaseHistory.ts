
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "PurchaseHistory";
  const phrases: PhraseSet[] = [
  { key: "_txt_stopped_53c", text: "Stopped" },
{ key: "_txt_stop_1be", text: "Stop" },
{ key: "_txt_searchTransactions_cf3", text: "Search transactions" },
{ key: "_txt_loadMore_512", text: "Load More" },
{ key: "_txt_endOfList_34c", text: "End of List" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
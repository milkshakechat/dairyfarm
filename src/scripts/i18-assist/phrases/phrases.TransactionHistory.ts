
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "TransactionHistory";
  const phrases: PhraseSet[] = [
  { key: "_txt_pending_827", text: "Pending" },
{ key: "_txt_recalled_d98", text: "Recalled" },
{ key: "_txt_returned_6bc", text: "Returned" },
{ key: "_txt_withdrawn_f58", text: "Withdrawn" },
{ key: "_txt_recall_23f", text: "Recall" },
{ key: "_txt_return_76f", text: "Return" },
{ key: "_txt_withdraw_d19", text: "Withdraw" },
{ key: "_txt_loadMore_799", text: "Load More" },
{ key: "_txt_endOfList_577", text: "End of List" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
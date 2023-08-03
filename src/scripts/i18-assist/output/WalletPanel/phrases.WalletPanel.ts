
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "WalletPanel";
  const phrases: PhraseSet[] = [
  { key: "_txt_transactions_615", text: "Transactions" },
{ key: "_txt_sales_c93", text: "Sales" },
{ key: "_txt_purchases_efc", text: "Purchases" },
{ key: "_txt_okay_1d3", text: "Okay" },
{ key: "_txt_transactionPending_8c7", text: "Transaction Pending" },
{ key: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_be6", text: "Check your notifications in a minute to see confirmation of your transaction." },
{ key: "_txt_cookieBalance_731", text: "COOKIE BALANCE" },
{ key: "_txt_recharge_f7c", text: "Recharge" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
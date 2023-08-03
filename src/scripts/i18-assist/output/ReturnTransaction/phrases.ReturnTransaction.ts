
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "ReturnTransaction";
  const phrases: PhraseSet[] = [
  { key: "_txt_pastProtection_f2a", text: "Past Protection" },
{ key: "_txt_final_49e", text: "Final" },
{ key: "_txt_okay_608", text: "Okay" },
{ key: "_txt_transactionPending_b02", text: "Transaction Pending" },
{ key: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d68", text: "Check your notifications in a minute to see confirmation of your transaction." },
{ key: "_txt_finalized_a86", text: "Finalized" },
{ key: "_txt_returnCookies_988", text: "Return Cookies?" },
{ key: "_txt_cancel_cc8", text: "Cancel" },
{ key: "_txt_returnCookies_edf", text: "Return Cookies" },
{ key: "_txt_note_2b3", text: "Note" },
{ key: "_txt_addANoteToYourReturn_2f8", text: "Add a note to your return" },
{ key: "_txt_save_be5", text: "Save" },
{ key: "_txt_youCanNoLongerReturnThese_f5e", text: "You can no longer return these " },
{ key: "_txt_CookiesAsTheTransactionIsFinalizedAfterDays_bc0", text: " cookies as the transaction is finalized after 90 days." },
{ key: "_txt_areYouSureYouWantToReturn_ebc", text: "Are you sure you want to return " },
{ key: "_txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieReturn_e22", text: " cookies? The other person will be notified of your cookie return." },
{ key: "_txt_transactionIsFinal_c86", text: "Transaction is final " },
{ key: "_txt_newAccountBalance_bb2", text: "New Account Balance" },
{ key: "_txt_returnCookies_658", text: "RETURN COOKIES" },
{ key: "_txt_pastProtection_d33", text: "Past Protection" },
{ key: "_txt_cancel_22e", text: "Cancel" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
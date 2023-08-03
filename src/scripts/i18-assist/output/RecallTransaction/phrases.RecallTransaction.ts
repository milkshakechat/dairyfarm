
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "RecallTransaction";
  const phrases: PhraseSet[] = [
  { key: "_txt_pastProtection_3d2", text: "Past Protection" },
{ key: "_txt_final_f24", text: "Final" },
{ key: "_txt_okay_797", text: "Okay" },
{ key: "_txt_transactionPending_5dc", text: "Transaction Pending" },
{ key: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d2c", text: "Check your notifications in a minute to see confirmation of your transaction." },
{ key: "_txt_finalized_a27", text: "Finalized" },
{ key: "_txt_recallCookies_208", text: "Recall Cookies?" },
{ key: "_txt_cancel_5ae", text: "Cancel" },
{ key: "_txt_recallCookies_d45", text: "Recall Cookies" },
{ key: "_txt_note_71e", text: "Note" },
{ key: "_txt_addANoteToYourRecall_233", text: "Add a note to your recall" },
{ key: "_txt_save_be9", text: "Save" },
{ key: "_txt_youCanNoLongerRecallThese_c05", text: "You can no longer recall these " },
{ key: "_txt_CookiesAsYouAreAlreadyPastTheDaysOfRefundProtection_e94", text: " cookies as you are already past the 90 days of refund protection" },
{ key: "_txt_areYouSureYouWantToRecall_f37", text: "Are you sure you want to recall " },
{ key: "_txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieRecall_c1b", text: " cookies? The other person will be notified of your cookie recall." },
{ key: "_txt_milkshakeProtectsYouWithRefundsWithinDaysOfOnlineDatingProtectionEnds_7f1", text: "Milkshake protects you with 100% refunds within 90 days of online dating. Protection ends: " },
{ key: "_txt_newAccountBalance_185", text: "New Account Balance" },
{ key: "_txt_final_6bb", text: "Final" },
{ key: "_txt_recallCookies_f4d", text: "RECALL COOKIES" },
{ key: "_txt_pastProtection_392", text: "Past Protection" },
{ key: "_txt_cancel_31b", text: "Cancel" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
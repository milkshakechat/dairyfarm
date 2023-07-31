
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "WalletPage";
  const phrases: PhraseSet[] = [
  { key: "_txt_mainWallet_a49", text: "Main Wallet" },
{ key: "_txt_holdingWallet_f7e", text: "Holding Wallet" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
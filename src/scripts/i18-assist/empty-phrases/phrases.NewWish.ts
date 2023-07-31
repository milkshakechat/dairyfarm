export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}

const componentName = "NewWishPage";
const phrases: PhraseSet[] = [
  { key: "_txt_wishCreated_cbc", text: "Wish created!" },
  { key: "_txt_wishUpdated_b02", text: "Wish updated!" },
  { key: "_txt_isNotAnImageFile_67c", text: "is not an image file" },
  { key: "_txt_updateWish_c8a", text: "Update Wish" },
  { key: "_txt_createWish_bd8", text: "Create Wish" },
  {
    key: "_txt_wishNameMustBeLessThan_ef8",
    text: "Wish name must be less than ",
  },
  { key: "_txt_charactersLength_c6d", text: "characters length" },
  {
    key: "_txt_wishDescriptionMustBeLessThan_982",
    text: "Wish description must be less than ",
  },
  { key: "_txt_mustBeAValidUrl_e12", text: "Must be a valid URL" },
  { key: "_txt_createdWish_619", text: "Created Wish" },
  { key: "_txt_createAnother_e15", text: "Create Another" },
  { key: "_txt_viewWish_6a8", text: "View Wish" },
  { key: "_txt_uploading_586", text: "Uploading.." },
  { key: "_txt_images_330", text: "images" },
  { key: "_txt_event_31e", text: "Event" },
  { key: "_txt_gift_b3b", text: "Gift" },
  { key: "_txt_removeGraphic_b15", text: "Remove graphic?" },
  {
    key: "_txt_areYouSureToRemoveImage_395",
    text: "Are you sure to remove image #",
  },
  { key: "_txt_yes_361", text: "Yes" },
  { key: "_txt_no_574", text: "No" },
  { key: "_txt_wishName_556", text: "Wish Name" },
  { key: "_txt_whatDoYouWishFor_ad7", text: "What do you wish for?" },
  { key: "_txt_about_692", text: "About" },
  {
    key: "_txt_whyYouLikeThisWishOptional_b7f",
    text: "Why you like this wish (optional)",
  },
  { key: "_txt_externalLink_ceb", text: "External link" },
  {
    key: "_txt_linkToEventOrShoppingPage_716",
    text: "Link to event or shopping page",
  },
  { key: "_txt_priceInCookies_ea9", text: "Price in Cookies" },
  {
    key: "_txt_wishlistsArePurchasedWithCookiesTheInappCurrencyOfMilkshakeChatYouCanRedeemCookiesForCash_7b1",
    text: "Wishlists are purchased with COOKIES, the in-app currency of Milkshake Chat. You can redeem COOKIES for cash.",
  },
  {
    key: "_txt_howOftenThisWishPriceWillBeChargedToTheCustomerFan_3f2",
    text: "How often this wish price will be charged to the customer fan.",
  },
  { key: "_txt_frequency_fa1", text: "Frequency" },
  { key: "_txt_onceTimePayment_7f8", text: "Once Time Payment" },
  { key: "_txt_dailyRecurring_dd1", text: "Daily Recurring" },
  { key: "_txt_weeklyRecurring_d51", text: "Weekly Recurring" },
  { key: "_txt_monthlyRecurring_5da", text: "Monthly Recurring" },
  {
    key: "_txt_doYouWantToAllowAnyoneToBuyThisWishOrFriendsOnly_a9e",
    text: "Do you want to allow anyone to buy this wish, or friends only?",
  },
  { key: "_txt_friendsOnly_6c8", text: "Friends Only" },
  { key: "_txt_publicMarketplace_433", text: "Public Marketplace" },
  {
    key: "_txt_optionalCountdownTimerForYourEventOrWish_5cc",
    text: "Optional countdown timer for your event or wish.",
  },
  { key: "_txt_countdown_fae", text: "Countdown" },
  { key: "_txt_favorite_317", text: "Favorite" },
  {
    key: "_txt_isThisAFavoritedWishlistItem_cc3",
    text: "Is this a favorited wishlist item?",
  },
  { key: "_txt_regular_a2d", text: "Regular" },
  { key: "_txt_stickerGraphic_30e", text: "Sticker Graphic" },
  {
    key: "_txt_anyoneWhoBuysYourWishlistItemWillGetAnExclusiveStickerForChat_502",
    text: "Anyone who buys your wishlist item will get an exclusive sticker for chat",
  },
  { key: "_txt_uploading_eb6", text: "Uploading..." },
  { key: "_txt_changeSticker_a62", text: "Change Sticker" },
  { key: "_txt_stickerName_265", text: "Sticker Name" },
  {
    key: "_txt_theNameOfTheStickerThatBuyersWillSeeInTheirChats_9bc",
    text: "The name of the sticker that buyers will see in their chats.",
  },
  { key: "_txt_stickerNameOptional_24e", text: "Sticker Name (optional)" },
  { key: "_txt_simple_24g", text: "Simple" },
  { key: "_txt_advanced_24g", text: "Advanced" },
  { key: "_txt_newWish_24g", text: "New Wish" },
  { key: "_txt_editWish_24g", text: "Edit Wish" },
  { key: "_txt_uploadImages_24g", text: "Upload Images" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

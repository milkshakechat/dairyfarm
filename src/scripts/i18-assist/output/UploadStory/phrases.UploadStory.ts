
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "UploadStory";
  const phrases: PhraseSet[] = [
  { key: "_txt_swipe_159", text: "Swipe" },
{ key: "_txt_noSwipe_5b0", text: "No Swipe" },
{ key: "_txt_fileIsNotAnPngjpegImageOrAMpmovVideoFile_57c", text: "File is not an PNG/JPEG image or a MP4/MOV video file" },
{ key: "_txt_videoMustBeUnderSeconds_d2d", text: "Video must be under 60 seconds" },
{ key: "_txt_videoMustBeUnderMb_89f", text: "Video must be under 200MB" },
{ key: "_txt_clickToUpload_c96", text: "Click to Upload" },
{ key: "_txt_uploadStory_199", text: "Upload Story" },
{ key: "_txt_attachWishOptional_c35", text: "Attach Wish (Optional)" },
{ key: "_txt_location_a83", text: "Location" },
{ key: "_txt_postStory_8a6", text: "Post Story" },
{ key: "_txt_caption_269", text: "Caption" },
{ key: "_txt_captionMustBeLessThanCharacters_775", text: "Caption must be less than 240 characters" },
{ key: "_txt_successfulPost_b9d", text: "Successful Post" },
{ key: "_txt_postAnother_7a4", text: "Post Another" },
{ key: "_txt_viewStory_fbb", text: "View Story" },
{ key: "_txt_uploadStory_70c", text: "Upload Story" },
{ key: "_txt_clickToUpload_777", text: "Click to Upload" },
{ key: "_txt_attachWishOptional_e62", text: "Attach Wish (Optional)" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
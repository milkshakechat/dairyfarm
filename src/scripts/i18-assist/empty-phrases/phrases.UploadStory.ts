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
  { key: "____", text: "Swipe" },
  { key: "____", text: "No Swipe" },
  {
    key: "____",
    text: "File is not an PNG/JPEG image or a MP4/MOV video file",
  },
  { key: "____", text: "Video must be under 60 seconds" },
  { key: "____", text: "Video must be under 200MB" },
  { key: "____", text: "Click to Upload" },
  { key: "____", text: "Upload Story" },
  { key: "____", text: "Attach Wish (Optional)" },
  { key: "____", text: "Location" },
  { key: "____", text: "Post Story" },
  { key: "____", text: "Caption" },
  { key: "____", text: "Caption must be less than 240 characters" },
  { key: "____", text: "Successful Post" },
  { key: "____", text: "Post Another" },
  { key: "____", text: "View Story" },
  { key: "____", text: "Upload Story" },
  { key: "____", text: "Click to Upload" },
  { key: "____", text: "Attach Wish (Optional)" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/barbie-sandbox.ts

import {
  SeedStory,
  SeedUser,
  bulkDownloadInstagramStories,
  bulkDownloadInstagramUsers,
  fixMockUsers,
  seedLore,
  seedPopulation,
  seedUniverse,
  testDownloadRemoteMedia,
} from "@/services/barbie";
import { initFirebase } from "@/services/firebase";
import { initStorageBucket_GCP } from "@/services/private-bucket";
import {
  UserID,
  Username,
  genderEnum,
  placeholderImageThumbnail,
  privacyModeEnum,
} from "@milkshakechat/helpers";

const seedUsernames = [
  "trinhcherrybaby",
  "th.nhan.ng",
  // "mannarintangon",
] as Username[];
const seedUsers: SeedUser[] = [
  {
    displayName: "John Doe",
    username: "johndoe3",
    genesisID: "genesis-000001",
    avatar: placeholderImageThumbnail,
    biography: "",
    gender: genderEnum.male,
    interestedIn: [genderEnum.female],
  },
  {
    displayName: "Miss Barbaie",
    username: "barabie",
    genesisID: "genesis-000002",
    avatar:
      "https://instagram.frix9-1.fna.fbcdn.net/v/t51.2885-19/314081186_1811675859169267_848484281343758056_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.frix9-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=koiAQR2KXJgAX-Xclku&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfBgsfWfOGpSLWbFtik_6vAPigaGTof4jnrs1GMQTGopUg&oe=64C83AFB&_nc_sid=1e20d2",
    biography: "",
    gender: genderEnum.female,
    interestedIn: [genderEnum.male],
  },
  {
    displayName: "Lady Barbaie",
    username: "labarabie",
    genesisID: "genesis-000003",
    avatar:
      "https://instagram.frix9-1.fna.fbcdn.net/v/t51.2885-19/314081186_1811675859169267_848484281343758056_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.frix9-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=koiAQR2KXJgAX-Xclku&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfBgsfWfOGpSLWbFtik_6vAPigaGTof4jnrs1GMQTGopUg&oe=64C83AFB&_nc_sid=1e20d2",
    biography: "",
    gender: genderEnum.female,
    interestedIn: [genderEnum.male, genderEnum.female, genderEnum.other],
  },
  {
    displayName: "Jeed",
    username: "jirapat_jeed",
    genesisID: "genesis-000004",
    avatar:
      "https://instagram.frix9-1.fna.fbcdn.net/v/t51.2885-19/341322745_617317429918359_4302554461054556253_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.frix9-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=rtYmytbNOUUAX9TX-wh&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfDslP7jTCrEkdgyHgYiyAshUXjChLjb3V_lL18F97NjJw&oe=64C8BFBB&_nc_sid=1e20d2",
    biography: "เรื่องราวของฉัน🥰",
    gender: genderEnum.female,
    interestedIn: [genderEnum.male],
  },
  {
    displayName: "Tàng trữ nhan sắc",
    username: "_bhagg",
    genesisID: "genesis-seed-user-1690518790232",
    avatar:
      "https://instagram.fkun2-1.fna.fbcdn.net/v/t51.2885-19/362046963_6414699978649389_8518505279183583252_n.jpg?stp=dst-jpg_s150x150&_nc_ht=instagram.fkun2-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=uXAOZ6G-jpoAX__cseR&edm=AEF8tYYBAAAA&ccb=7-5&oh=00_AfBPBq6GDvDRseuFt3IrZOs6RVAQAYPeWLsjqX447KMCoQ&oe=64C8F883&_nc_sid=1e20d2",
    biography: "🥀🥀🥀",
    gender: "female",
    interestedIn: ["male"],
  },
];
const seedStories = [
  {
    url: "https://instagram.fkun2-1.fna.fbcdn.net/v/t51.2885-15/359537425_809562547272587_6050656237367079997_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fkun2-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=ZfSFjkodUAgAX9Rp0nS&edm=APU89FABAAAA&ccb=7-5&ig_cache_key=MzE0NTk3OTY3Nzc0ODIzOTM1NQ%3D%3D.2-ccb7-5&oh=00_AfAXp1046oD9kS6TSad5_EzLMs78sICkwi3X9PEK3hjrGg&oe=64C87AEC&_nc_sid=bc0c2c",
    mediaType: "IMAGE",
    username: "_bhagg",
    caption:
      " Đang ước mình xinh gái mà soi gương xong nhận ra mình phí 1 điều ước 😵‍💫",
  },
  {
    url: "https://instagram.fkun2-1.fna.fbcdn.net/v/t51.2885-15/360005150_646919024036426_6315210454657230837_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fkun2-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=HOwwDMHXf14AX9aDe6t&edm=APU89FABAAAA&ccb=7-5&ig_cache_key=MzE0NzQzMDk1NDkyMzYzNzUxMA%3D%3D.2-ccb7-5&oh=00_AfAxDlpKljyI0jz1Afct0dVolSambUQwW6UDyiPWNzV5cA&oe=64C7BA74&_nc_sid=bc0c2c",
    mediaType: "IMAGE",
    username: "_bhagg",
    caption:
      " Mỗi khi chán nản muốn bỏ cuộc tôi lại soi gương và tự nhủ phải cố lên để sau này không bị ai nói vào mặt là cô bé này chả có gì ngoài xinh gái 😵‍💫",
  },
  {
    url: "https://instagram.fkun2-1.fna.fbcdn.net/v/t51.2885-15/317623922_8394840440591294_3630009119841489861_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fkun2-1.fna.fbcdn.net&_nc_cat=102&_nc_ohc=xGHnDByHqBoAX8U3lM2&edm=APU89FABAAAA&ccb=7-5&ig_cache_key=Mjk4NDUxNTE2NTY0MDAzNjM0Nw%3D%3D.2-ccb7-5&oh=00_AfAj23SpsHwyy-dzLNqIWV5qK_ZCJ4L8PP3vAZ3v052IFw&oe=64C88DAB&_nc_sid=bc0c2c",
    mediaType: "IMAGE",
    username: "_bhagg",
    caption: " 18+",
  },
  {
    url: "https://instagram.fkun2-1.fna.fbcdn.net/v/t51.2885-15/361339112_304583868803179_3664990292124845473_n.jpg?stp=dst-jpg_e35_s1080x1080&_nc_ht=instagram.fkun2-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=MYP13G63jSAAX-fkmi2&edm=APU89FABAAAA&ccb=7-5&ig_cache_key=MzE0OTU4MzkwNDA1MTY2NDQ0Ng%3D%3D.2-ccb7-5&oh=00_AfCIrcwmxWi4H2fvdrPvfsofKzDThhn64CjDaFVlONbn9Q&oe=64C80B3E&_nc_sid=bc0c2c",
    mediaType: "IMAGE",
    username: "_bhagg",
    caption: " Just in case you need a new wallpaper :|",
  },
  {
    url: "https://instagram.fkun2-1.fna.fbcdn.net/v/t51.2885-15/351846294_249944704323123_8164456590452506603_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=instagram.fkun2-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=wh1Qcs8zMgsAX9rIYgK&edm=APU89FABAAAA&ccb=7-5&ig_cache_key=MzExOTkwMTY0NjY1OTQwNjc0MA%3D%3D.2-ccb7-5&oh=00_AfDNEYWN2tc_5RP8bSgg64gzkz1X3RDq0Ephz_eGeY3l2A&oe=64C77A50&_nc_sid=bc0c2c",
    mediaType: "IMAGE",
    username: "_bhagg",
    caption: " 🌝",
  },
] as SeedStory[];

const run = async () => {
  console.log(`Running script Barbie World...`);
  await initFirebase();

  const women = [
    // "lovelynnboo",
    // "trinhcherrybaby",
    // "knhs2",
    // "mariona.roma",
    // "dabechen",
    // "ayda.ekr",
    // "mathildeleite",
    // "militsa_borisova",
    // "emmaaurora",
    // "linda.sza",
    // "rebeancer",
    // "andreallavero",
    // "martasilvagonz",
    // "elliemwhitehead",
    // "melody_pin23",
    // "yonyonyxx",
    // "bouvaanx_",
    // "nanczhang",
    // "neneci.ci",
    // "thinkaboutzu",
    // "leidysandoval3629",
    // "taliana_r5",
    // "sami_to8",
    // "cestvrai_",
    // "clararline",
    // "kelly.kiko",
    // "vsdo_",
    // "cassandrequan",
    // "alice77wang",
    // "goodshing",
    // "lady_nneka_",
    // "glontee",
    // "nabilahkariem",
    // "jo_annstrauss",
    // "moghelingz",
    // "teresa5598",
    // "tommygenesis",
    // "gabbriette",
    // "pb.lngttttt",
    // "matcha_cha",
    // "chennn_en",
    // "yueyuwsan",
    // "yuan_sayuki",
    // "christinnazhou",
    // "losangelless",
    // "keng_kim",
    // "alexis_talia",
    // "ulzzanggirlth",
    // "anna.demina",
    // "moshamalpartida",
    // "kellylin_1105",
    // "emilyskyefit",
    // "kaisafit",
    // "hannaheden_fitness",
    // "massy.arias",
    // "charleeatkins",
    // "alexia_clark",
    // "jenwiderstrom",
    // "karinaelle",
    // "paigehathaway",
    // "followthelita",
    // "kelseywells",
    // "angelicaht",
    // "jenselter",
    // "michelle_lewin",
    // "kayla_itsines",
    // "katyaelisehenry",
    // "msjeanettejenkins",
    // "valentinalequeux",
    // "anadeliafitness",
    // "noelarevalo_",
    // "amandaeliselee",
    // "emilyschromm",
    // "kaliburns",
    // "hunnybunsfit",
    // "tanaashleee",
    // "brittanyperilleee",
    // "laurensimpson",
    // "ashley.horner",
    // "jennamyersfit",
    // "kira.fitness",
    // "niaisazaoficial",
    // "myaspenrae",
    // "anniethorisdottir",
    // "rosanna_cordoba",
    // "amandabisk",
    // "eva_andressa",
    // "bruluccas",
    // "fit.with.iulia",
    // "misscarriejune",
    // "britt_lucio",
    // "agostinafitness",
    // "casidavis",
    // "whitneyjohns",
    // "feliceherrig",
    // "nikizager",
    // "genevieveava",
    // "juliagilas",
    // "mistyonpointe",
    // "asiyami_gold",
    // "koolkelsey",
    // "the_real_chi",
    // "katiesturino",
    // "iamdodos",
    // "byaimeekelly",
    // "iambeauticurve",
    // "iamtarahlynn",
    // "nisshee_stylealbum",
    // "coco_floflo",
    // "cmariekwarteng",
    // "amaka.hamelijnck",
    // "itsreallynana",
    // "jennymwalton",
    // "meccajw",
    // "theserenagoh",
    // "double3xposure",
    // "accidentalinfluencer",
    // "monroesteele",
    // "tatianaelizabethh",
    // "pocketsandbows",
    // "sandralambeck",
    // "xoxotsumi",
    // "findingpaola",
    // "emilisindlev",
    // "lunamodela",
    // "devonleecarlson",
    // "devynistyles",
    // "chaileeson",
    // "sincerelyjules",
    // "alysilverio",
    // "daynabolden",
    // "fashncurious",
    // "simplycyn",
    // "aimeesong",
    // "olivialazuardy",
    // "imjennim",
    // "santoshishetty",
    // "jillianmercado",
    // "colormecourtney",
    // "slipintostyle",
    // "curvygirlchic",
    // "francislola",
    // "ellenvlora",
    // "piashah_",
    // "camilacoelho",
    // "lovemicorazon",
    // "ayladimitri",
    // "juhigodambe",
    // "essiegolden",
    // "alealimay",
    // "marie_mag_",
    // "glamazondiaries",
    // "lefevrediary",
    // "natalieoffduty",
    // "dylanasuarez",
    // "juliaadang",
    // "kahlanabarfield",
    // "jeneenaylor",
    // "nycxclothes",
    // "karenbritchick",
    // "astyledmind",
    // "clairesulmers",
    // "paolaalberdi",
    // "vbiancav",
    // "thisisjessicatorres",
    // "koleendz",
    // "cassandradelav",
    // "pamarias",
    // "annaluizavasconcellos",
    // "wuzg00d",

    // -------------------------------
    "charlyjordan",
    "waifubaobei",
    "lenajerabkova",
    "fari_hunny",
    "lizdidathang",
    "petiteblondeangel",
    "peachinikki",
    "defiantpanda",
    "thedejababee",
    "jessiebuns",
    "rosannavoorwald",
    "brookeshowsxx",
  ] as Username[];
  await seedUniverse({
    usernames: women,
    gender: genderEnum.female,
    interestedIn: [genderEnum.male],
    saveLocal: true,
  });

  const men = [
    // "mannarintangon",
    // "jab.panithan",
    // "jun___san___",
    // "noe_ledee",
    // "niklinio",
    // "arc_shonyboi",
    // "raulcasanas",
    // "sarbojitpal",
    // "alejandrocano334",
    // "ravi_somani",
    // "negimohit07",
    // "jephphrey_",
    // "dr4483854",
    // "sarahbnashkar",
    // "yon.eia",
    // "mpethanation",
    // "mr.anderssons",
    // "brandonbalfourr",
    // "ryonsu24",
    // "chayannemunoz",
    // "monsieurcoupet",
    // "timdessaint",
    // "david_swing",
    // "mr_andy_thomas",
    // "happy___david",
    // "juanyanesgb",
    // "climmens",
    // "superherointraining",
    // "danielhug",
    // "rofhiwamaneta",
    // "noam_pereg",
    // "timtalkthai",
    // "elsyahrial27",
    // "cog.j_92",
    // "d.of.j.c",
    // "chang._.a",
    // "dntlrdl",
    // "tenlee_1001",
    // "henryl89",
    // "jichangwook",
    // "khaby00",
    // "danieletoretto",
    // "_dnyaneshwar_1818",
    // "lucas_mk",
    // "want.zamora",
    // "noe_ledee",
    // "theyluvv_shawny",
    // "nkhanhm",
    // "ricodwichyy",
    // "moutsiakk",
    // "nwieherbert",
    // "therock",
    // "menshealthmag",
    // "thorbjornsson",
    // "athleanx",
    // "ebenezersamuel23",
    // "marcusfilly",
    // "donsaladino",
    // "kevinhart4real",
    // "primal.swoledier",
    // "bobbymaximus",
    // "getfitwithgiddy",
    // "dylanwerneryoga",
    // "mathewfras",
    // "justtrain",
    // "evolve.nation",
    // "realworld_tactical",
    // "andyspeer",
    // "kettlebellexercises",
    // "richfroning",
    // "benbrunotraining",
    // "kenneth.gallarzo",
    // "jeremyscottfitness",
    // "corygfitness",
    // "gunnarfitness",
    // "bretcontreras1",
    // "jtm_fit",
    // "michaeleckert_fit",
    // "diamondcut_fitness",
    // "da_rulk",
    // "weatherford5",
    // "paulsklarxfit",
    // "nodonutshere",
    // "austincurrent_",
    // "davedurante",
    // "zocobodypro",
    // "alexfine44",
    // "ashleyguarrasi",
    // "tanyapoppett",
    // "mikefitch.af",
    // "seangarner",
    // "michaelcvazquez",
    // "drjohnrusin",
    // "gainsbygaines",
    // "iamjavonterose",
    // "toddanderson42_",
    // "augustobartelle",
    // "craigcapurso",
    // "chaseweber",
    // "henryporterpolo",
    // "andrecarofutsal",
    // -------------------------------
  ] as Username[];
  // await seedUniverse({
  //   usernames: men,
  //   gender: genderEnum.male,
  //   interestedIn: [genderEnum.female],
  //   saveLocal: true,
  // });

  // await seedUniverse({
  //   usernames: seedUsernames,
  //   gender: genderEnum.female,
  //   interestedIn: [genderEnum.male],
  //   // saveLocal: true,
  // });
  // await bulkDownloadInstagramUsers({
  //   usernames: seedUsernames,
  //   gender: genderEnum.female,
  //   interestedIn: [genderEnum.male],
  //   saveLocal: true,
  // });
  // await bulkDownloadInstagramStories({
  //   username: "reinine9" as Username,
  //   saveLocal: true,
  // });

  // await seedPopulation(seedUsers);
  // await seedLore(seedStories, "JXdK54MpK3hr16BCgnlbKDjSekw1" as UserID);

  // await testDownloadRemoteMedia();

  // const seedStories = await bulkDownloadInstagramStories({
  //   username: "reinine9" as Username,
  //   saveLocal: true,
  // });
  // console.log(`got ${seedStories.length} stories`);
  // const _lore = await seedLore(
  //   seedStories,
  //   "c8aCgynFCCVfAiJNwuDJXe3RTBC2" as UserID
  // );

  // await fixMockUsers(men, {
  //   gender: genderEnum.male,
  //   interestedIn: [genderEnum.female],
  // });
  // await fixMockUsers(women, {
  //   privacyMode: privacyModeEnum.public,
  // });
};
run();

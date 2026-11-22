// Curated Ilaiyaraaja Tamil songs.
// Format: "Song title | Film | Year | singer codes (comma separated) | moods (comma separated)"
// Add your own favourites by appending lines — the whole app (years, singers,
// moods, films, playlists) updates automatically.

export const SINGERS: Record<string, string> = {
  SPB: "S. P. Balasubrahmanyam",
  SJ: "S. Janaki",
  KJY: "K. J. Yesudas",
  IR: "Ilaiyaraaja",
  KSC: "K. S. Chithra",
  MV: "Malaysia Vasudevan",
  PS: "P. Susheela",
  MANO: "Mano",
  SW: "Swarnalatha",
  UR: "Uma Ramanan",
  PJ: "P. Jayachandran",
  JEN: "Jency",
  SPS: "S. P. Sailaja",
  VJ: "Vani Jairam",
  KH: "Kamal Haasan",
  DC: "Deepan Chakravarthy",
  SUJ: "Sujatha",
  HH: "Hariharan",
  BHA: "Bhavatharini",
  SG: "Shreya Ghoshal",
  LM: "Lata Mangeshkar",
  AB: "Asha Bhosle",
  TMS: "T. M. Soundararajan",
  MIN: "Minmini",
  MB: "Mitali Banerjee",
  SAS: "Sasirekha",
  LR: "Latha Rajinikanth",
  HR: "Harish Raghavendra",
  KAR: "Karthik",
  SRP: "Sriram Parthasarathy",
  VP: "Vijay Prakash",
  MBK: "Madhu Balakrishnan",
  YSR: "Yuvan Shankar Raja",
  RN: "Ramya NSK",
  BS: "Bela Shende",
  SID: "Sid Sriram",
  AN: "Ananya Bhat",
  DH: "Dhanush",
  AC: "Ajoy Chakrabarty",
};

export const MOODS: Record<string, { label: string; tamil: string; color: string; emoji: string }> = {
  romantic: { label: "Romantic", tamil: "காதல்", color: "#ff3d7f", emoji: "💗" },
  sad: { label: "Melancholy", tamil: "சோகம்", color: "#5b7cff", emoji: "🌧️" },
  folk: { label: "Folk / Village", tamil: "நாட்டுப்புறம்", color: "#ff9f1c", emoji: "🌾" },
  celebration: { label: "Celebration", tamil: "கொண்டாட்டம்", color: "#ffd23f", emoji: "🎉" },
  philosophical: { label: "Philosophical", tamil: "தத்துவம்", color: "#2ec4b6", emoji: "🪷" },
  lullaby: { label: "Lullaby / Thaalaattu", tamil: "தாலாட்டு", color: "#c77dff", emoji: "🌙" },
  devotional: { label: "Devotional", tamil: "பக்தி", color: "#ff6b35", emoji: "🪔" },
  classical: { label: "Carnatic / Classical", tamil: "கர்நாடக", color: "#06d6a0", emoji: "🎻" },
  motivational: { label: "Motivational", tamil: "உத்வேகம்", color: "#ef476f", emoji: "🔥" },
};

export const RAW_SONGS = `
Annakili Unnai Thedudhe | Annakili | 1976 | SJ | folk,sad
Machana Paatheengala | Annakili | 1976 | SJ | folk,romantic
Kannan Oru Kai Kuzhandhai | Bhadrakali | 1976 | KJY,PS | lullaby,romantic
Sendhoora Poove | 16 Vayathinile | 1977 | SJ | romantic,folk
Manjakulichu Allimudichu | 16 Vayathinile | 1977 | SJ | folk,celebration
Senthazham Poovil | Mullum Malarum | 1978 | KJY | romantic,philosophical
Ninaivo Oru Paravai | Sigappu Rojakkal | 1978 | KH,SJ | romantic
Indha Minminikku | Sigappu Rojakkal | 1978 | MV,SJ | romantic
Akkarai Cheemai Azhaginile | Priya | 1978 | KJY | celebration
Uravugal Thodarkathai | Aval Appadithan | 1978 | KJY | philosophical,sad
Poovarasampoo Poothachu | Kizhakke Pogum Rail | 1978 | SJ | folk,romantic
Ennadi Meenakshi | Ilamai Oonjal Aadukirathu | 1978 | SPB | romantic,celebration
Oru Vaanavil Pole | Kaatrinile Varum Geetham | 1978 | PJ,SJ | romantic
Azhagiya Kanne | Uthiripookkal | 1979 | SJ | lullaby,sad
Aayiram Malargale | Niram Maaratha Pookkal | 1979 | MV,SPS,JEN | romantic
Ennulil Engo | Rosappu Ravikkaikari | 1979 | VJ | romantic,sad
Ilamai Ennum Poongaatru | Pagalil Oru Iravu | 1979 | SPB | romantic,philosophical
Vaa Ponmayile | Poonthalir | 1979 | SPB | romantic
Kanmaniye Kadhal Enbathu | Aarilirunthu Arubathu Varai | 1979 | SPB,SJ | romantic
Kaatril Endhan Geetham | Johnny | 1980 | SJ | romantic,sad
Senorita I Love You | Johnny | 1980 | SPB | romantic,celebration
Oru Iniya Manathu | Johnny | 1980 | SUJ | romantic
Aasaiya Kaathula Thoodhu Vittu | Johnny | 1980 | SPS | romantic,folk
Idhu Oru Pon Maalai Pozhudhu | Nizhalgal | 1980 | SPB | philosophical,romantic
Poongathave Thaal Thiravai | Nizhalgal | 1980 | DC,UR | romantic
Madai Thiranthu | Nizhalgal | 1980 | SPB | celebration,motivational
En Iniya Pon Nilave | Moodu Pani | 1980 | KJY | romantic
Podhuvaga En Manasu Thangam | Murattu Kaalai | 1980 | MV | folk,celebration
Paruvame Pudhiya Paadal Paadu | Nenjathai Killathe | 1980 | SPB,SJ | romantic,celebration
Kodai Kaala Kaatre | Panneer Pushpangal | 1981 | MV | romantic,celebration
Ananda Raagam | Panneer Pushpangal | 1981 | UR | romantic,classical
Putham Puthu Kaalai | Alaigal Oivathillai | 1981 | SJ | romantic
Kadhal Oviyam Paadum | Alaigal Oivathillai | 1981 | IR,JEN | romantic
Vizhiyil Vizhundhu | Alaigal Oivathillai | 1981 | IR,SAS | romantic
Aayiram Thamarai Mottukkale | Alaigal Oivathillai | 1981 | SPB,SJ | romantic
Andhi Mazhai Pozhigiradhu | Raja Paarvai | 1981 | SPB,SJ | romantic
Poo Malarnthida | Tik Tik Tik | 1981 | KJY,JEN | romantic
Kanne Kalaimaane | Moondram Pirai | 1982 | KJY | lullaby,sad
Poongatru Puthithanathu | Moondram Pirai | 1982 | KJY | romantic
Vaanengum Thanga Vinmeengal | Moondram Pirai | 1982 | IR,SJ | romantic
Ilaya Nila Pozhigiradhe | Payanangal Mudivathillai | 1982 | SPB | romantic
Vaigaraiyil Vaigai Karaiyil | Payanangal Mudivathillai | 1982 | SPB | romantic
Ilamai Itho Itho | Sakalakala Vallavan | 1982 | SPB | celebration
Nila Kaayudhu | Sakalakala Vallavan | 1982 | MV,SJ | romantic
Sangeetha Jathi Mullai | Kadhal Oviyam | 1982 | SPB | sad,classical
Poove Ilaya Poove | Kozhi Koovuthu | 1982 | MV | romantic
Pani Vizhum Malar Vanam | Ninaivellam Nithya | 1982 | SPB | romantic
Rojavai Thalattum Thendral | Ninaivellam Nithya | 1982 | SPB,SJ | romantic
Vellai Pura Ondru | Pudhu Kavithai | 1982 | KJY,SJ | romantic
Janani Janani | Thaai Mookaambikai | 1982 | IR | devotional
Sangathil Paadatha Kavithai | Auto Raja | 1982 | IR,SJ | romantic
Pothi Vacha Malliga Mottu | Mann Vasanai | 1983 | SPB,SJ | romantic,folk
Naanaga Naan Illai Thaaye | Thoongathey Thambi Thoongathey | 1983 | SPB | sad,philosophical
Aadi Maasam Kaathadikka | Paayum Puli | 1983 | SPB,SJ | romantic,celebration
Mounamana Neram | Salangai Oli | 1983 | SPB,SJ | romantic,classical
Pon Vaanam Panneer Thoovudhu | Indru Nee Naalai Naan | 1983 | SJ | romantic
Rasathi Unna Kaanatha Nenju | Vaidehi Kathirunthal | 1984 | PJ | sad,folk
Kaathirundhu Kaathirundhu | Vaidehi Kathirunthal | 1984 | PJ | sad
Inraiku Yen Indha Anandame | Vaidehi Kathirunthal | 1984 | PJ,VJ | romantic
Kadhalin Deepam Ondru | Thambikku Entha Ooru | 1984 | SPB | romantic
En Vaazhvile Varum Anbe Vaa | Thambikku Entha Ooru | 1984 | SPB | romantic
Kasthuri Maane | Pudhumai Penn | 1984 | KJY,UR | romantic
Kadavul Ullame | Anbulla Rajinikanth | 1984 | LR | devotional,lullaby
Poongaatru Thirumbuma | Muthal Mariyathai | 1985 | MV,SJ | sad,romantic
Antha Nilava Thaan | Muthal Mariyathai | 1985 | IR,KSC | romantic,folk
Idhayam Oru Kovil | Idhaya Kovil | 1985 | IR,SJ | romantic
Naan Paadum Mouna Raagam | Idhaya Kovil | 1985 | SPB | sad
Sangeetha Megam | Udhaya Geetham | 1985 | SPB | celebration
Thene Thenpaandi Meene | Udhaya Geetham | 1985 | SPB | lullaby
Paadariyen Padippariyen | Sindhu Bhairavi | 1985 | KSC | classical,folk
Kalaivaaniye | Sindhu Bhairavi | 1985 | KJY | classical,devotional
Poove Poochooda Vaa | Poove Poochudava | 1985 | KSC | sad
Chinna Kuyil Paadum | Poove Poochudava | 1985 | KSC | celebration
Kanmaniye Pesu | Kakki Sattai | 1985 | SPB,SJ | romantic
Poomaalaiye Thol Seravaa | Pagal Nilavu | 1985 | IR,SJ | romantic
Mayanginen Solla Thayanginen | Naane Raja Naane Mandhiri | 1985 | PS | romantic
Ponmaane Kobam Yeno | Oru Kaidhiyin Diary | 1985 | SPB,UR | romantic
Mandram Vandha Thendralukku | Mouna Ragam | 1986 | SPB | sad,romantic
Nilaave Vaa | Mouna Ragam | 1986 | SPB | romantic,sad
Chinna Chinna Vanna Kuyil | Mouna Ragam | 1986 | SJ | romantic,celebration
Oho Megam Vandhadho | Mouna Ragam | 1986 | SJ | celebration
Panivizhum Iravu | Mouna Ragam | 1986 | SPB,SJ | romantic
Enna Satham Indha Neram | Punnagai Mannan | 1986 | SPB | romantic,sad
Kavithai Kelungal | Punnagai Mannan | 1986 | VJ | classical
Vaan Megam | Punnagai Mannan | 1986 | KSC | celebration
Kuzhaloodhum Kannanukku | Mella Thirandhathu Kadhavu | 1986 | KSC | folk,devotional
Vaa Vennila | Mella Thirandhathu Kadhavu | 1986 | SPB,SJ | romantic
Ooru Sanam Thoongiruchu | Mella Thirandhathu Kadhavu | 1986 | SJ | sad
Adi Aathadi | Kadalora Kavithaigal | 1986 | IR,SJ | romantic,folk
Chinna Mani Kuyile | Amman Kovil Kizhakale | 1986 | SPB | romantic
Naan Thedum Sevvandhi Poovidhu | Dharma Pathini | 1986 | IR,SJ | romantic
Thenpandi Cheemayile | Nayakan | 1987 | IR | lullaby,sad
Nee Oru Kadhal Sangeetham | Nayakan | 1987 | MANO,KSC | romantic
Raja Raja Chozhan Naan | Rettai Vaal Kuruvi | 1987 | KJY | romantic
Shenbagame Shenbagame | Enga Ooru Pattukaran | 1987 | MANO,AB | romantic,folk
Madura Marikozhundhu Vaasam | Enga Ooru Pattukaran | 1987 | MANO,KSC | romantic,folk
Ninnukori Varanam | Agni Natchathiram | 1988 | KSC | classical,celebration
Thoongatha Vizhigal Rendu | Agni Natchathiram | 1988 | KJY,SJ | romantic
Idhazhil Kadhai Ezhudhum | Unnal Mudiyum Thambi | 1988 | SPB,KSC | romantic
Valaiyosai Kalakalavena | Sathya | 1988 | SPB,LM | romantic
Unna Nenachen Paattu Padichen | Apoorva Sagodharargal | 1989 | SPB | sad
Pazhamudhir Cholai | Varusham 16 | 1989 | KJY | romantic,celebration
Maanguyile Poonguyile | Karagattakaran | 1989 | MV,SJ | folk,romantic
Indha Maan Undhan Sondha Maan | Karagattakaran | 1989 | IR,KSC | romantic,folk
Meenamma Meenamma | Rajadhi Raja | 1989 | MANO,KSC | romantic,celebration
Kalyana Maalai | Pudhu Pudhu Arthangal | 1989 | SPB | philosophical
Guruvayurappa | Pudhu Pudhu Arthangal | 1989 | SPB,KSC | romantic
Ennoda Raasi Nalla Raasi | Mappillai | 1989 | MANO | celebration
Sundari Neeyum Sundaran Naanum | Michael Madana Kama Rajan | 1990 | KH,SJ | romantic
Siva Rathiri | Michael Madana Kama Rajan | 1990 | SPB,SJ | romantic
Mannil Indha Kadhal | Keladi Kanmani | 1990 | SPB | romantic
Karpoora Bommai Ondru | Keladi Kanmani | 1990 | PS | lullaby,sad
Kalyana Then Nila | Mounam Sammadham | 1990 | KJY,KSC | romantic
Sorgame Endralum | Ooru Vittu Ooru Vanthu | 1990 | IR | philosophical,folk
Rakkamma Kaiya Thattu | Thalapathi | 1991 | SPB,SW | folk,celebration
Sundari Kannal Oru Sethi | Thalapathi | 1991 | SPB,SJ | romantic
Kaattukuyilu Manasukulla | Thalapathi | 1991 | SPB,KJY | celebration
Yamunai Aatrile | Thalapathi | 1991 | MB | romantic,devotional
Chinna Thaayaval | Thalapathi | 1991 | SJ | lullaby,sad
Kanmani Anbodu Kadhalan | Guna | 1991 | KH,SJ | romantic
Paartha Vizhi Paartha Padi | Guna | 1991 | KJY | devotional,romantic
Thooliyile Aada Vandha | Chinna Thambi | 1991 | MANO | lullaby,sad
Poovoma Oorgolam | Chinna Thambi | 1991 | SPB,SW | celebration,folk
Nee Engey En Anbe | Chinna Thambi | 1991 | SW | sad
Arachcha Santhanam | Chinna Thambi | 1991 | SPB | romantic,folk
Idhayame Idhayame | Idhayam | 1991 | SPB | sad
Kaadhal Kavithaigal | Gopura Vasalile | 1991 | SPB,KSC | romantic
Thaalaattum Poongaatru | Gopura Vasalile | 1991 | SJ | romantic
Maasi Maasam Aalana Ponnu | Dharma Durai | 1991 | KJY,SW | romantic
Kuyil Paattu | En Rasavin Manasile | 1991 | SW | folk,sad
Inji Iduppazhagi | Thevar Magan | 1992 | KH,SJ | romantic
Potri Paadadi Ponne | Thevar Magan | 1992 | TMS,MV | celebration,folk
Maasaru Ponne Varuga | Thevar Magan | 1992 | MIN | devotional,celebration
Muthu Mani Maalai | Chinna Gounder | 1992 | SPB,PS | romantic,folk
Amma Endrazhaikkatha | Mannan | 1992 | KJY | devotional,sad
Naan Erikarai Mel Irundhu | Chinna Thaayee | 1992 | KJY,SW | romantic,folk
Chinna Raasave Chitterumbu | Walter Vetrivel | 1993 | SPB,SJ | romantic
Oru Naalum Unnai Maravatha | Ejamaan | 1993 | SPB,SJ | romantic
Endhan Nenjil Neengaatha | Kalaignan | 1993 | KJY | romantic
Anbe Vaa Arugile | Kilipetchu Ketkava | 1993 | KJY | romantic,sad
Thendral Vandhu Theendum Bodhu | Avathaaram | 1995 | IR,SJ | romantic,philosophical
Ennai Thaalatta Varuvaalo | Kadhalukku Mariyadhai | 1997 | HH | romantic,sad
Enge Sellum Indha Paadhai | Sethu | 1999 | IR | sad,philosophical
Nirpathuve Nadappathuve | Bharathi | 2000 | HR | philosophical
Mayil Pola Ponnu Onnu | Bharathi | 2000 | BHA | romantic,folk
Nee Partha Paarvai | Hey Ram | 2000 | KH,AB | romantic
Isaiyil Thodangudhamma | Hey Ram | 2000 | AC | classical
Oliyile Therivathu Devathaiya | Azhagi | 2002 | KAR,BHA | romantic
Elangaathu Veesudhey | Pithamagan | 2003 | SRP,SG | romantic,folk
Unna Vida | Virumaandi | 2004 | KH,SG | romantic,folk
Om Sivoham | Naan Kadavul | 2009 | VP | devotional
Pitchai Paathiram | Naan Kadavul | 2009 | MBK | devotional,philosophical
Saayndhu Saayndhu | Neethaane En Ponvasantham | 2012 | YSR,RN | romantic
Kaatrai Konjam | Neethaane En Ponvasantham | 2012 | KAR | romantic
Vaanam Mella | Neethaane En Ponvasantham | 2012 | IR,BS | romantic
Unna Nenachu | Psycho | 2020 | SID | romantic,sad
Kaattu Malli | Viduthalai Part 1 | 2023 | IR,AN | romantic,folk
Onnoda Nadandhaa | Viduthalai Part 1 | 2023 | DH,AN | romantic
Dhinam Dhinamum | Viduthalai Part 2 | 2024 | IR,AN | romantic
`;

// Background scores, instrumental albums & non-film works
export const BGM_WORKS: { title: string; year: number; kind: string; note: string }[] = [
  { title: "How to Name It?", year: 1986, kind: "Instrumental album", note: "Fusion of Carnatic and Western classical — a tribute to Thyagaraja and J. S. Bach." },
  { title: "Nothing But Wind", year: 1988, kind: "Instrumental album", note: "Flute-led fusion album with Hariprasad Chaurasia." },
  { title: "Thiruvasagam in Symphony", year: 2005, kind: "Oratorio", note: "Manikkavasagar's Thiruvasagam set to symphonic orchestra (Budapest Symphony)." },
  { title: "Valiant — Symphony No. 1", year: 2025, kind: "Symphony", note: "His first full symphony, premiered in London with the Royal Philharmonic Orchestra." },
  { title: "Mouna Ragam — Theme & BGM", year: 1986, kind: "Film score", note: "The iconic violin theme that defined a generation." },
  { title: "Nayakan — Background Score", year: 1987, kind: "Film score", note: "Epic, operatic score for Mani Ratnam's gangster saga." },
  { title: "Thalapathi — Background Score", year: 1991, kind: "Film score", note: "Hungarian orchestra-recorded score; the 'Chinna Thaayaval' motif." },
  { title: "Punnagai Mannan — Theme Music", year: 1986, kind: "Film score", note: "The dance theme and the haunting cliff-top motif." },
  { title: "Moondram Pirai — Background Score", year: 1982, kind: "Film score", note: "Tender, devastating score for Balu Mahendra's classic." },
  { title: "Muthal Mariyathai — Background Score", year: 1985, kind: "Film score", note: "Rustic flute and strings for Bharathiraja's masterpiece." },
  { title: "Sindhu Bhairavi — Background Score", year: 1985, kind: "Film score", note: "Carnatic music at the heart of K. Balachander's drama." },
  { title: "Guna — Background Score", year: 1991, kind: "Film score", note: "Mystic, choral textures for the Abirami theme." },
  { title: "Thevar Magan — Background Score", year: 1992, kind: "Film score", note: "Grand rural drama score." },
  { title: "Hey Ram — Background Score", year: 2000, kind: "Film score", note: "Hindustani and orchestral fusion for Kamal Haasan's epic." },
  { title: "Pithamagan — Background Score", year: 2003, kind: "Film score", note: "Raw, earthy score for Bala's film." },
  { title: "Naan Kadavul — Background Score", year: 2009, kind: "Film score", note: "Dark, spiritual score set in Kashi." },
  { title: "Onaayum Aattukuttiyum — Background Score", year: 2013, kind: "Film score", note: "A film carried almost entirely by its score — released as a full BGM album." },
  { title: "Viduthalai — Background Score", year: 2023, kind: "Film score", note: "Vetrimaaran's forest-set saga." },
];

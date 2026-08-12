import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// No bundled seed data: all snapshots live in shared blob storage, so the
// dashboard never shows stale numbers when the API is unavailable.

const NAMES = {"04QkAvOjyjVQoJJ4YRodYg":"Acoustic Pop Covers - soft guitar & piano versions of your favorite chart hits","0IVfm1dyu4h8rTJmdDUMjo":"Neoclassical Calm \ud83c\udfbb \u2013 modern piano and strings for peaceful moments","0KWNDmgdm1qpjkFR5Afc9B":"Percussive Rhythms \u2013 Indian ambient sounds for yoga, reiki & healing","0LdsXxmrGpxJV7rpwsHgKd":"Zen Flute \ud83e\ude88 - ambient tunes for meditation, relaxation and inner peace","0LqAOilr2am1uzcPFpLZuq":"Solfeggio Sleep (528Hz) - attract love, restore health, reduce stress","0OBSi7nderWhiyVIN3nQNw":"Bedtime Fairytales","0TQYko7naQAlnllbtxlCaY":"Power Workout Anthems for Intense Training","0WTzMv843tOnMvq5jixkmg":"Low Light Jazz - soft jazz in dim spaces","0Z6hz35c8tkW9DyTRpc0jS":"Lofi Garden \ud83c\udf38\ud83e\udebb\ud83c\udf3a - chill beats and nature sounds for relaxation","0aZeIH2WrCqAOgOwqRUyIc":"After Hours Jazz - slow jazz for late nights","0g2H6dNe86WT25EvSRuTnx":"Deep House - late nights, steady pulse","0pQus2qwWo0mBQ3kJYQzWs":"Guitar Study - focused listening without distraction","0q63eXTs60hXalSzQ3mJYL":"Naptime Guitar - gentle lullabies for sleepy babies","0u5dM74plIjBzX0zZ6Q4df":"Lover Boy Lofi \ud83d\udc8c - soft confidence, steady feelings","0yQ6AqQTIo9rEqxEhQEgnn":"8 Hour Insomnia Relief - Binaural Sleep","0yoQoIGnCTqXp0C4TPoJ1O":"Sleep Sounds \ud83d\udca4 - calming ambient music for insomnia, adhd and anxiety","0z3RkWPJaw2VcwN56TFUSi":"Lofi Bath \ud83d\udec1 - soothing beats for relaxation","0zrc9507yJkRV6ruNgcoSM":"Tranquil Guitar - relaxing ambient guitar music for peace and mindfulness","15wOEDPlVknsviEiybfP5i":"Anxiety & Stress Relief - ambient music that holds you steady","1Fiab2KqYZhOVpRpFIKeVu":"Manifest Love: Solfeggio Frequencies\u2728\ud83d\udc96","1NBU7r2Ay6cDC8d6HHe4Un":"Piano Covers - peaceful and calming music for relaxing moments \ud83c\udfb9","1fCJhxgowgHq9OBGvuREWi":"Acoustic Love Songs \ud83d\udc9c \ud83d\udcbf - romantic covers for heartfelt moments","1mXjVANI52YlC9p8ezrQOi":"Electric Guitar Focus - deep work, no distractions","1t124T9H0R7ccf4aMgtRug":"Still Piano \ud83c\udfb9 \u2013 peaceful piano for sleep, focus & calm moments","1tLQXlG5x9AoNZ5NoGIDmI":"Run, Row, Roar - Electronic Cardio Workout","1u5T2GRBXJ8t41t0ux3PrC":"Electronic Study \ud83c\udfa7 - focused beats for creativity","1vhosmBpb9SHRoHvCXoqzp":"Soothing Meditation\u2728\ud83c\udfde\ufe0f - ambient sounds for spa, yoga and wellness","20bFT8C1d7DjZWBW2yIanh":"Rainy Night Jazz - warm jazz for drizzly nights","221BvLFcVoeOzqSawbT1eA":"Lofi Meditation \ud83e\uddd8\u200d\u2640\ufe0f - calming beats for mindfulness","22PfLqpnmkC2vmnSfeJLAW":"Paris Jazz - charming caf\u00e9 vibes from France","29lHhcNGMfklsttXimjGqZ":"Quiet Hours Jazz - minimal jazz for late nights","2ClTRLxqCo0XLWM0i5emPj":"Soft Instrumental Guitar for Babies (12H)","2PAnDP8a3QaK9jqMEdGOfQ":"Lofi Sleep \ud83d\udca4 - mellow beats for a restful night","2QdwrCBPnkzLQdT8MG4N7s":"Sleepy Jazz with Rain - 8 hours rest","2T6OYYXolbGW5al7CN9pyQ":"Breathing Meditation - slow, steady, guided calm","2i7K8ZvdvaexHQ89acqwai":"Piano Healing (Slowed & Reverbed) - slow keys in open space","2iTqioIuus769rvcqm34pm":"Gentle Guitar - soothing melodies for relaxation and mindfulness","2mFVTsr2oxQKChKY4b8Ov5":"Lofi Latin \ud83d\udc83 - tropical beats with a bossa twist","2nxDM4Ta6zLDnB2yo0AyXm":"Guitar Therapy - soothing acoustic melodies to unwind to \ud83d\udc86\ud83c\udffd","2o0iDBT6JdzLoMEKEH9t09":"Sleep All Night - Binaural Atmospheres","2oYnQqYNtVntgFmQzJ8w9e":"Christian Piano Hymns - worship without words","2p4oGGcZOmVVW9WIa5G6PK":"Lofi Study Beats To Pass The Midterm","2pUNMj1WLtYKmmMvkaNhQD":"Cozy Piano for Deep Sleep (8+ Hours)","2tJpwAKOc3f4ibtfQ2fHN1":"Plant Frequencies - where sound takes root","2uDnTHTi1p3wfaUJiuqiy1":"Sleeping for Hours \ud83d\udca4","2w2J0f3Fuorw01qDoqGPRQ":"Background Jazz - chill and sophisticated lounge tunes","2xjUohMRmALykvtyWO9RgC":"Sunset House - light rhythms, easy energy","30z2Uvti6avpIBjJjSzOJ4":"Pregnancy Meditation & Relaxation - calm for you, and the life inside","34RGdLe7N46QKey8oPGHMQ":"Water Soundscapes for Deep Relaxation","35OuNZzN4A85soW2WJhmUG":"Late Night Smooth Jazz - soft, romantic background","3CugtnMUzjkXX1H7fWJw67":"Lofi Gaming \ud83d\udd79\ufe0f - chill beats for epic sessions","3D8QbyTorKcBXs0VhOI29g":"Soft Piano Sweetheart \ud83c\udf39\ud83c\udfb9 - warmth in every key","3JmB7vnFNavW3LsUXDaclM":"Lover Girl Lofi \u2763\ufe0f - pink skies and late-night feelings","3JsH1Y3OYCliIgCGJaI2QT":"Calm Cat \ud83d\udc31 \u2013 relaxing music for sleeping, anxiety relief & peace","3Op4ute4JuhDUtM7FoQBId":"ADHD Focus Music  \ud83d\udc69\ud83c\udffb\u200d\ud83d\udcbb - cut out the noise","3P0nl9KBO9VRWiZGqKgkwk":"Feel-Good Lofi - good energy, no effort","3SAvQjFcM8UhWBsYkmI8Et":"Instrumental Love Songs  \ud83c\udf88 - romance without words","3VRWOYBfdnm0C978OKa0uv":"Broken Heart Jazz \ud83d\udc94\ud83c\udfba - soft music for hard moments","3XXQroAuQgewKG0fLXEOzf":"Upbeat Happy Hits for Positive Energy","3c4DYqXIQdWRzS3JwVFlBG":"Ambient Guitar for Sleep - gentle strums for 8 hours of rest","3iHDLAN1n6oGFJ3RiU0h65":"Ambient Energy Cleanse - sounds for emotional restoration","3j3d3essIaiBhSVNKmWkJp":"Jazz Snooze - sleepy swing and candlelight calm","3jmdfJOlbtBuJjTZu2dt9n":"Soft Guitar Sleep - ambient & subtle beats","3miFpeJ6w5fiOe7SPaMjng":"Atmospheric Sleep - drift into stillness","3nLPQFAL8GqBtjLMJBQLrs":"Christian Lullabies - soft songs of comfort and faith","3oSth5cpzQFIDtFz3tktLX":"Evening Jazz - smooth tunes for warm, late-night vibes","3pBoRgk1pGsz82vDvbUYMP":"Rainy Jazz  \u2614\ufe0f \ud83c\udfba - smooth rainy jazz for reading and studying","3sEuLRU3oaS1QPyjCiNAq4":"Moonlit Jazz Caf\u00e9 - soft jazz under city lights","3tIgSaR1F86qWnVK1FBFEI":"Healing 528Hz - deep ambient sleep","3yvyOHGzWsfZ01aiPIdobz":"Frequency Therapy \ud83e\uddd8\u200d\u2640\ufe0f\u2728 - solfeggio, singing bowls & 432Hz","47Mfwi75aw9a0vUbwMjGgo":"Deep Sleep Piano (Felted & Soft)","47T8hdxgku2lJhnim37Pxy":"High Intensity Training - nonstop pace, zero mercy","4DfIxfW4dYEA2bESKkXybL":"Sunset Lounge \ud83c\udfd6\ufe0f - house and dance music for vacation mode \ud83c\udf34 ","4JfWAUpt3f3qjOjtztCEwF":"Rainy Day Romance \ud83c\udf27\ufe0f\ud83d\udc98 - soft moments behind the glass","4OQ4PWetEWFEUGGQynrNmV":"Late Night Lounge Jazz - smooth sax past midnight","4S5A1kgdCyAr4h87AZNzRh":"Study Beats \ud83c\udfa7 - lofi beats and ambient chillhop to relax to \ud83d\udcda","4SS97ZLuDKfAkNYYudsORc":"Wind-Down Jazz - mellow sax for late nights","4XbhZYcauSlivp9Zpii3ZM":"Jazz Yoga - serene and soulful flow vibes","4ZmvSRxuOTrDCpHVibgm7k":"Ambient Piano - slow notes, open space","4aQngEW0tSiOvgVNq4RY5Q":"Pomodoro Lofi 25/5 - let time do the thinking","4hDlt9QKqa74xTSRRPD8Rk":"Piano Dreams - soft and peaceful night melodies","4hIYkLlyd0X9Ca99kVCklD":"2010s Throwback Workout Hits","4nh0PsP96jdArU3QGK7c8g":"Celestial Ambience & Relaxation - slow atmospheres, endless space","4okxpsvl9zGntySwuPZlSF":"Sleepy Jazz - relaxing jazz tunes for a good night's sleep","4rot8gbt6BPixLmVhFqSA2":"Lofi Love Lounge \ud83d\udc9e - a quiet kind of romance","4vdIdiOa3FxhyHdGKqUc2F":"Morning Jazz - gentle vibes to start your day","4w2aPNOCvQdmgAOgDPCn7m":"Coffee Break Jazz - slow, easy background flow","4wia2rYQB1CM6CmPHNJb0V":"Lo-Fi Lounge\ud83c\udfb7 \ud83c\udfa7 - chill beats to focus and study to","4yVeDrE7KNJi0JbOdkmoqp":"Spiritual Healing Soundscapes - let the vibrations flow","50B2IPVcRzADb3vG9xaVMq":"Calm Piano for Babies \ud83c\udf19 \u2013 soothing lullabies for sleep, naps, newborns & toddlers","50cnwTxU70x8zEBI8QroFp":"Jazz Brunch - smooth morning jazz for cozy starts & easy days","51fPIwhXwsKtpLAMo41G3L":"Heavy Weights - heavy bass for heavy lifts","5AtiqHgg1KJ3abdZ4LBcWx":"Romantic Jazz - soft, intimate, late-night mood","5ExpyVP5vNtYbQIBtuMwXm":"EDM Bass Boost for High-Energy Training","5JWuIssnwfNGNkyTf6LwLs":"Jazz House - timeless jazz energy, modern flow","5NmwqEGuab0J3ZJj4I1vMz":"Bossa Nova - cozy and relaxing Brazilian vibes","5U1ku6iIUmYzRYHxcPheGt":"Calming Music for Dogs \ud83d\udc3e \u2013 anxiety relief, sleep, stress & barking control","5ZnWndwVB9iEkzvnSOkik3":"Instrumental Guitar Covers - acoustic pop covers of your favorite hit songs","5k340LuMAtVb5hIKLqwtvO":"Baby Sleep - soothing piano lullabies for sweet dreams","5n0u1OnGs3Ni1yJlxBe7Sq":"Binaural Beats: Anxiety Relief","5oAWnWPPZn8rRg05OwLJK9":"A Full Night's Sleep - harp & flute atmospheres","5sAL7yLEDEbH7HZsjoCe6T":"Cocktail Piano - elegance without effort","624rLjogC1EJkNOZCqU6Qr":"Candlelight Jazz Club - intimate low-lit jazz","64TdxsdAWzmF293K9dlxG2":"Deep Sleep Sounds - gentle, uninterrupted rest","65PEB2FbkIrvwjbKdObvhJ":"Bossa Nova Breeze \ud83d\udc83\ud83d\udd76\ufe0f - chill Brazilian jazz for relaxing & focus","6DhZCUtkY85kvF6GtTIh2a":"Date Night Jazz \u2665\ufe0f  \u2728 - warm melodies for close company","6Drs3IryMIG7fJS09fVJuU":"Tropical House \ud83c\udfdd\ufe0f \u2013 summer vibes, melodic beats & beach escapes","6GP5sIYGMknGhENeUpThVV":"Baby Music Box - gentle melodies for little dreams","6L5ZlqyFluhvZbgNIm14dh":"Deep Sleep Nature & Ambient Sounds","6LFVGq9wTRub6zjwqHpgVx":"Serene Harp & Flute - sleep through the night","6ON2RtcJj1NDtnq8Pr2EOD":"Sleepy Ambient Guitar - soft strings all night","6UYXSXrfs0VNY1Goza3QZv":"Midnight Rain Jazz - sleepy jazz with rainy backgrounds","6W6rS6bVorkt905sVKIy1K":"Calisthenics - deep bass for full-body control","6dHQ58lU9R9g74zG6vBfW9":"Overnight Soft Lofi Sleep (8 Hours)","6fIQBFxAOqpM5gOUWiJx6l":"Lofi Japan \ud83c\uddef\ud83c\uddf5 - anime-inspired chill beats","6pfKBpeErmqUcpynIzdmYk":"Twilight Jazz Bar - mellow jazz into the night","6tN90yxVHxbPn21gj84KiU":"Easygoing Workout Music for Steady Training","6yeCm2murxH0cwGVFzjN6B":"Electric Guitar Focus - concentrate at work","7FGQEc5uHWaNO9de8ukfnP":"Morning Calm - gentle piano for a soft start","7KG8SOcTA7DuFrpDsx5qAD":"Calm Music for Plants \ud83c\udf3f \u2013 growth, healing & relaxation","7MNOymkoG2Oqr1oeBJ27P7":"Calm Guitar Sleep - Electroacoustic Atmospheres","7autxavukBbD6EHLBxk344":"The New York Jazz Bar - late-night, dim-lit atmosphere","7i4KRmS48nvafSjmGpMMOJ":"Chill House Vibes \ud83c\udf05 \u2013 smooth beats for summer days","7oWiDbWFTYQ0IKINm5kdS5":"Quiet Lofi Sleep Music (8 Hour Mix)","7uguXkNbx0QrPd3hzUbhoS":"Background Guitar for ADHD - let the noise organise itself"};

// The 125 tracked playlists — same list the names map is keyed by.
const ALL_IDS = Object.keys(NAMES);

// Weekly new-listener figures per playlist: { pid: [[weekKey, total, daysReported], ...] }
// Bundled fallback; /api/listeners overrides this when LISTENER_CSV_URL is configured.
const LISTENERS_BUNDLED = {"metric":"New listeners per day","sourceNote":"Source column header reads 'Average streams per track'; confirmed to contain new-listener counts.","dateRange":["2026-02-14","2026-08-10"],"weeks":{"0KWNDmgdm1qpjkFR5Afc9B":[["2026-W07",5,2],["2026-W08",15,7],["2026-W09",21,7],["2026-W10",19,7],["2026-W11",15,7],["2026-W12",16,7],["2026-W13",17,7],["2026-W14",16,7],["2026-W15",19,7],["2026-W16",17,7],["2026-W17",19,7],["2026-W18",17,7],["2026-W19",18,7],["2026-W20",21,7],["2026-W21",20,7],["2026-W22",20,7],["2026-W23",16,7],["2026-W24",21,7],["2026-W25",12,6],["2026-W26",15,7],["2026-W27",16,7],["2026-W28",19,7],["2026-W29",20,7],["2026-W30",15,7],["2026-W31",16,7],["2026-W32",15,7],["2026-W33",3,1]],"0LqAOilr2am1uzcPFpLZuq":[["2026-W13",3,2],["2026-W14",14,2],["2026-W15",19,7],["2026-W16",1,1]],"0pQus2qwWo0mBQ3kJYQzWs":[["2026-W12",16,4],["2026-W13",10,4]],"0yQ6AqQTIo9rEqxEhQEgnn":[["2026-W13",3,1],["2026-W18",10,5],["2026-W19",2,1]],"1mXjVANI52YlC9p8ezrQOi":[["2026-W18",26,7],["2026-W19",16,6],["2026-W24",4,2],["2026-W25",14,6],["2026-W26",2,1],["2026-W27",9,4]],"2ClTRLxqCo0XLWM0i5emPj":[["2026-W13",6,2],["2026-W14",4,1]],"2o0iDBT6JdzLoMEKEH9t09":[["2026-W13",5,2],["2026-W14",20,5],["2026-W15",29,7],["2026-W16",2,2],["2026-W18",19,7]],"2oYnQqYNtVntgFmQzJ8w9e":[["2026-W12",14,4],["2026-W13",1,1],["2026-W18",36,6],["2026-W19",6,2]],"2QdwrCBPnkzLQdT8MG4N7s":[["2026-W13",13,4],["2026-W14",47,7],["2026-W15",43,7],["2026-W16",30,7],["2026-W17",30,7],["2026-W18",28,7],["2026-W19",34,7],["2026-W20",43,7],["2026-W21",41,7],["2026-W22",27,7],["2026-W23",33,7],["2026-W24",24,7],["2026-W25",25,6],["2026-W26",33,7],["2026-W27",29,7],["2026-W28",34,7],["2026-W29",41,7],["2026-W30",35,7],["2026-W31",53,7],["2026-W32",60,7],["2026-W33",9,1]],"2T6OYYXolbGW5al7CN9pyQ":[["2026-W18",10,5],["2026-W19",2,2]],"2w2J0f3Fuorw01qDoqGPRQ":[["2026-W07",53,2],["2026-W08",137,7],["2026-W09",133,7],["2026-W10",160,7],["2026-W11",159,7],["2026-W12",246,7],["2026-W13",217,7],["2026-W14",237,7],["2026-W15",312,7],["2026-W16",281,7],["2026-W17",222,7],["2026-W18",203,7],["2026-W19",143,7],["2026-W20",153,7],["2026-W21",147,7],["2026-W22",171,7],["2026-W23",152,7],["2026-W24",165,7],["2026-W25",125,6],["2026-W26",151,7],["2026-W27",147,7],["2026-W28",160,7],["2026-W29",178,7],["2026-W30",188,7],["2026-W31",161,7],["2026-W32",156,7],["2026-W33",25,1]],"2xjUohMRmALykvtyWO9RgC":[["2026-W18",20,6],["2026-W19",25,7],["2026-W20",25,7],["2026-W21",30,7],["2026-W22",52,7],["2026-W23",27,7],["2026-W24",29,7],["2026-W25",30,6],["2026-W26",30,7],["2026-W27",30,7],["2026-W28",35,7],["2026-W29",27,7],["2026-W30",22,7],["2026-W31",23,7],["2026-W32",26,7],["2026-W33",2,1]],"30z2Uvti6avpIBjJjSzOJ4":[["2026-W12",12,4],["2026-W13",18,6],["2026-W14",13,5],["2026-W15",2,1],["2026-W16",6,2],["2026-W17",14,7],["2026-W18",12,5],["2026-W19",9,4],["2026-W20",9,4],["2026-W21",17,7],["2026-W22",16,7],["2026-W23",19,7],["2026-W24",19,7],["2026-W25",15,6],["2026-W26",17,7],["2026-W27",13,7],["2026-W28",17,7],["2026-W29",16,7],["2026-W30",18,7],["2026-W31",16,7],["2026-W32",16,7],["2026-W33",2,1]],"34RGdLe7N46QKey8oPGHMQ":[["2026-W12",14,4],["2026-W13",6,4],["2026-W14",26,7],["2026-W15",19,7],["2026-W16",11,5],["2026-W17",13,5],["2026-W18",21,7],["2026-W19",19,7],["2026-W20",17,7],["2026-W21",19,7],["2026-W22",16,7],["2026-W23",19,7],["2026-W24",31,7],["2026-W25",30,6],["2026-W26",27,7],["2026-W27",29,7],["2026-W28",22,7],["2026-W29",24,7],["2026-W30",20,7],["2026-W31",20,7],["2026-W32",20,7],["2026-W33",2,1]],"3HbIIQmDmeWSfAC0c8Mdib":[["2026-W07",8,2],["2026-W08",26,7],["2026-W09",28,7],["2026-W10",30,7],["2026-W11",30,7],["2026-W12",33,7],["2026-W13",33,7],["2026-W14",37,7],["2026-W15",42,7],["2026-W16",28,7],["2026-W17",38,7],["2026-W18",46,7],["2026-W19",35,7],["2026-W20",33,7],["2026-W21",33,7],["2026-W22",32,7],["2026-W23",37,7],["2026-W24",37,7],["2026-W25",26,6],["2026-W26",39,7],["2026-W27",36,7],["2026-W28",41,7],["2026-W29",35,7],["2026-W30",39,7],["2026-W31",47,7],["2026-W32",42,7],["2026-W33",5,1]],"3j3d3essIaiBhSVNKmWkJp":[["2026-W12",20,7],["2026-W13",17,7],["2026-W14",38,7],["2026-W15",21,7],["2026-W16",59,7],["2026-W17",100,7],["2026-W18",80,7],["2026-W19",52,7],["2026-W20",62,7],["2026-W21",81,7],["2026-W22",69,7],["2026-W23",58,7],["2026-W24",74,7],["2026-W25",50,6],["2026-W26",56,7],["2026-W27",49,7],["2026-W28",41,7],["2026-W29",35,7],["2026-W30",48,7],["2026-W31",37,7],["2026-W32",33,7],["2026-W33",5,1]],"3jmdfJOlbtBuJjTZu2dt9n":[["2026-W13",6,3],["2026-W14",1,1]],"3oSth5cpzQFIDtFz3tktLX":[["2026-W07",55,2],["2026-W08",128,7],["2026-W09",121,7],["2026-W10",102,7],["2026-W11",98,7],["2026-W12",111,7],["2026-W13",102,7],["2026-W14",94,7],["2026-W15",96,7],["2026-W16",80,7],["2026-W17",71,7],["2026-W18",68,7],["2026-W19",61,7],["2026-W20",77,7],["2026-W21",70,7],["2026-W22",57,7],["2026-W23",66,7],["2026-W24",75,7],["2026-W25",61,6],["2026-W26",58,7],["2026-W27",63,7],["2026-W28",81,7],["2026-W29",76,7],["2026-W30",63,7],["2026-W31",55,7],["2026-W32",56,7],["2026-W33",8,1]],"3tIgSaR1F86qWnVK1FBFEI":[["2026-W13",7,3],["2026-W14",32,7],["2026-W15",26,7],["2026-W16",2,2],["2026-W17",8,3],["2026-W20",7,4],["2026-W32",2,2]],"3yvyOHGzWsfZ01aiPIdobz":[["2026-W07",31,2],["2026-W08",70,7],["2026-W09",34,7],["2026-W10",26,7],["2026-W11",28,7],["2026-W12",28,7],["2026-W13",23,7],["2026-W14",15,7],["2026-W15",20,7],["2026-W16",16,7],["2026-W17",31,7],["2026-W18",31,7],["2026-W19",23,7],["2026-W20",20,7],["2026-W21",17,7],["2026-W22",15,7],["2026-W23",15,7],["2026-W24",15,7],["2026-W25",11,6],["2026-W26",13,7],["2026-W27",15,7],["2026-W28",14,7],["2026-W29",15,7],["2026-W30",12,7],["2026-W31",12,7],["2026-W32",11,7],["2026-W33",1,1]],"4DfIxfW4dYEA2bESKkXybL":[["2026-W07",13,2],["2026-W08",35,7],["2026-W09",26,7],["2026-W10",27,7],["2026-W11",42,7],["2026-W12",94,7],["2026-W13",74,7],["2026-W14",60,7],["2026-W15",56,7],["2026-W16",81,7],["2026-W17",100,7],["2026-W18",84,7],["2026-W19",66,7],["2026-W20",84,7],["2026-W21",113,7],["2026-W22",96,7],["2026-W23",94,7],["2026-W24",100,7],["2026-W25",94,6],["2026-W26",97,7],["2026-W27",122,7],["2026-W28",169,7],["2026-W29",171,7],["2026-W30",148,7],["2026-W31",103,7],["2026-W32",99,7],["2026-W33",11,1]],"4okxpsvl9zGntySwuPZlSF":[["2026-W07",9,2],["2026-W08",36,7],["2026-W09",27,7],["2026-W10",35,7],["2026-W11",39,7],["2026-W12",47,7],["2026-W13",49,7],["2026-W14",54,7],["2026-W15",51,7],["2026-W16",44,7],["2026-W17",37,7],["2026-W18",40,7],["2026-W19",35,7],["2026-W20",37,7],["2026-W21",33,7],["2026-W22",30,7],["2026-W23",29,7],["2026-W24",31,7],["2026-W25",21,6],["2026-W26",25,7],["2026-W27",30,7],["2026-W28",30,7],["2026-W29",31,7],["2026-W30",29,7],["2026-W31",33,7],["2026-W32",36,7],["2026-W33",5,1]],"4SS97ZLuDKfAkNYYudsORc":[["2026-W18",20,7],["2026-W19",19,7],["2026-W20",18,7],["2026-W21",12,7],["2026-W22",12,7],["2026-W23",18,7],["2026-W24",21,7],["2026-W25",20,6],["2026-W26",25,7],["2026-W27",22,7],["2026-W28",22,7],["2026-W29",18,7],["2026-W30",18,7],["2026-W31",19,7],["2026-W32",29,7],["2026-W33",5,1]],"50cnwTxU70x8zEBI8QroFp":[["2026-W07",10,2],["2026-W08",13,7],["2026-W09",2,2],["2026-W10",17,7],["2026-W11",19,7],["2026-W12",17,7],["2026-W13",20,7],["2026-W14",28,7],["2026-W15",12,7],["2026-W16",7,5],["2026-W17",13,7],["2026-W20",9,5],["2026-W21",2,2],["2026-W27",2,1],["2026-W30",2,2]],"5AtiqHgg1KJ3abdZ4LBcWx":[["2026-W08",7,5],["2026-W17",3,1],["2026-W18",19,7],["2026-W19",22,7],["2026-W20",22,7],["2026-W21",21,7],["2026-W22",17,7],["2026-W23",16,7],["2026-W24",17,7],["2026-W25",10,6],["2026-W26",15,7],["2026-W27",17,7],["2026-W28",14,7],["2026-W29",13,7],["2026-W30",17,7],["2026-W31",21,7],["2026-W32",19,7],["2026-W33",2,1]],"5tgRcUIenRLzNHuAT4Udhu":[["2026-W07",5,2],["2026-W08",21,7],["2026-W09",32,7],["2026-W10",30,7],["2026-W11",34,7],["2026-W12",26,7],["2026-W13",25,7],["2026-W14",26,7],["2026-W15",24,7],["2026-W16",22,7],["2026-W17",24,7],["2026-W18",28,7],["2026-W19",21,7],["2026-W20",27,7],["2026-W21",24,7],["2026-W22",21,7],["2026-W23",20,7],["2026-W24",18,7],["2026-W25",18,6],["2026-W26",17,7],["2026-W27",19,7],["2026-W28",20,7],["2026-W29",16,7],["2026-W30",21,7],["2026-W31",22,7],["2026-W32",20,7],["2026-W33",3,1]],"64TdxsdAWzmF293K9dlxG2":[["2026-W18",13,6],["2026-W19",2,2]],"6UYXSXrfs0VNY1Goza3QZv":[["2026-W13",9,3],["2026-W14",26,7],["2026-W15",19,7],["2026-W16",4,2]],"7autxavukBbD6EHLBxk344":[["2026-W18",34,7],["2026-W19",119,7],["2026-W20",114,7],["2026-W21",105,7],["2026-W22",92,7],["2026-W23",78,7],["2026-W24",75,7],["2026-W25",66,6],["2026-W26",59,7],["2026-W27",75,7],["2026-W28",74,7],["2026-W29",57,7],["2026-W30",61,7],["2026-W31",63,7],["2026-W32",70,7],["2026-W33",9,1]],"7FGQEc5uHWaNO9de8ukfnP":[["2026-W12",15,5],["2026-W13",5,3],["2026-W14",18,6],["2026-W15",5,2],["2026-W18",17,6],["2026-W19",9,3],["2026-W27",11,5],["2026-W28",4,1],["2026-W29",32,7],["2026-W30",31,7],["2026-W31",40,7],["2026-W32",37,7],["2026-W33",10,1]]},"reliability":{"0KWNDmgdm1qpjkFR5Afc9B":{"weeks":27,"fullWeeks":24,"signal":0.56},"0LqAOilr2am1uzcPFpLZuq":{"weeks":4,"fullWeeks":1,"signal":null},"0pQus2qwWo0mBQ3kJYQzWs":{"weeks":2,"fullWeeks":0,"signal":0.87},"0yQ6AqQTIo9rEqxEhQEgnn":{"weeks":3,"fullWeeks":0,"signal":null},"1mXjVANI52YlC9p8ezrQOi":{"weeks":6,"fullWeeks":1,"signal":0.62},"2ClTRLxqCo0XLWM0i5emPj":{"weeks":2,"fullWeeks":0,"signal":null},"2o0iDBT6JdzLoMEKEH9t09":{"weeks":5,"fullWeeks":2,"signal":0.31},"2oYnQqYNtVntgFmQzJ8w9e":{"weeks":4,"fullWeeks":0,"signal":0.43},"2QdwrCBPnkzLQdT8MG4N7s":{"weeks":21,"fullWeeks":18,"signal":1.0},"2T6OYYXolbGW5al7CN9pyQ":{"weeks":2,"fullWeeks":0,"signal":null},"2w2J0f3Fuorw01qDoqGPRQ":{"weeks":27,"fullWeeks":24,"signal":2.24},"2xjUohMRmALykvtyWO9RgC":{"weeks":16,"fullWeeks":13,"signal":0.76},"30z2Uvti6avpIBjJjSzOJ4":{"weeks":22,"fullWeeks":12,"signal":0.41},"34RGdLe7N46QKey8oPGHMQ":{"weeks":22,"fullWeeks":16,"signal":0.89},"3HbIIQmDmeWSfAC0c8Mdib":{"weeks":27,"fullWeeks":24,"signal":0.6},"3j3d3essIaiBhSVNKmWkJp":{"weeks":22,"fullWeeks":20,"signal":1.81},"3jmdfJOlbtBuJjTZu2dt9n":{"weeks":2,"fullWeeks":0,"signal":null},"3oSth5cpzQFIDtFz3tktLX":{"weeks":27,"fullWeeks":24,"signal":2.08},"3tIgSaR1F86qWnVK1FBFEI":{"weeks":7,"fullWeeks":2,"signal":0.6},"3yvyOHGzWsfZ01aiPIdobz":{"weeks":27,"fullWeeks":24,"signal":2.0},"4DfIxfW4dYEA2bESKkXybL":{"weeks":27,"fullWeeks":24,"signal":1.78},"4okxpsvl9zGntySwuPZlSF":{"weeks":27,"fullWeeks":24,"signal":1.12},"4SS97ZLuDKfAkNYYudsORc":{"weeks":16,"fullWeeks":14,"signal":0.89},"50cnwTxU70x8zEBI8QroFp":{"weeks":15,"fullWeeks":8,"signal":0.47},"5AtiqHgg1KJ3abdZ4LBcWx":{"weeks":18,"fullWeeks":14,"signal":1.08},"5tgRcUIenRLzNHuAT4Udhu":{"weeks":27,"fullWeeks":24,"signal":0.72},"64TdxsdAWzmF293K9dlxG2":{"weeks":2,"fullWeeks":0,"signal":null},"6UYXSXrfs0VNY1Goza3QZv":{"weeks":4,"fullWeeks":2,"signal":0.35},"7autxavukBbD6EHLBxk344":{"weeks":16,"fullWeeks":14,"signal":1.87},"7FGQEc5uHWaNO9de8ukfnP":{"weeks":13,"fullWeeks":4,"signal":1.23}}};

// Spike/dip sensitivity. A flag must clear all three tests:
//   z      - deviation from the playlist's own trailing median, in robust (MAD) units
//   minAbs - minimum change in listeners/day, so tiny counts can't produce huge z
//   minPct - minimum relative change
// The absolute floor matters because a 3.0 -> 2.2 move scores z=-10 on these volumes.
const SENSITIVITY = {
  conservative: { label: "Conservative", z: 3.5, minAbs: 1.5, minPct: 30 },
  balanced:     { label: "Balanced",     z: 3.0, minAbs: 1.0, minPct: 25 },
  sensitive:    { label: "Sensitive",    z: 2.5, minAbs: 0.75, minPct: 20 },
};
const MIN_DAYS = 4;      // a week needs this many reported days to be comparable
const MIN_HISTORY = 3;   // and this many prior comparable weeks to have a baseline

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

// Flag weeks that deviate from each playlist's own recent norm.
function detectFlags(weeksByPid, cfg) {
  const out = [];
  for (const [pid, series] of Object.entries(weeksByPid)) {
    const usable = series.filter(r => r[2] >= MIN_DAYS);
    for (let i = 0; i < usable.length; i++) {
      const hist = usable.slice(Math.max(0, i - 8), i).map(r => r[1] / r[2]);
      if (hist.length < MIN_HISTORY) continue;
      const base = median(hist);
      if (!base) continue;
      const mad = median(hist.map(v => Math.abs(v - base)));
      let scale = mad > 0 ? mad * 1.4826 : null;
      if (scale === null) {
        const mean = hist.reduce((a, b) => a + b, 0) / hist.length;
        scale = Math.sqrt(hist.reduce((s, v) => s + (v - mean) ** 2, 0) / hist.length);
      }
      if (!scale || !isFinite(scale) || scale === 0) continue;

      const perDay = usable[i][1] / usable[i][2];
      const z = (perDay - base) / scale;
      const absChg = perDay - base;
      const pctChg = (absChg / base) * 100;
      if (Math.abs(z) < cfg.z || Math.abs(absChg) < cfg.minAbs || Math.abs(pctChg) < cfg.minPct) continue;

      out.push({
        pid, week: usable[i][0], perDay, baseline: base, total: usable[i][1],
        days: usable[i][2], z, absChg, pctChg,
      });
    }
  }
  return out.sort((a, b) => b.week.localeCompare(a.week) || Math.abs(b.z) - Math.abs(a.z));
}

const VOL_ORDER = { very_high: 5, high: 4, medium: 3, low: 2, very_low: 1 };
const VOL_LABEL = { very_high: "Very High", high: "High", medium: "Medium", low: "Low", very_low: "Very Low" };
const VOL_CLR = { very_high: "#22c55e", high: "#4ade80", medium: "#facc15", low: "#f97316", very_low: "#94a3b8" };

const API_BASE = "https://playlist-seo-dashboard.vercel.app";

const getWeekKey = () => {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
};

export default function Dashboard() {
  const [archives, setArchives] = useState([]);
  const [viewWeek, setViewWeek] = useState(null);
  const [compareWeek, setCompareWeek] = useState(null);
  const [data, setData] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [tab, setTab] = useState("overview");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [filterVolume, setFilterVolume] = useState("ALL");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(null);
  const [listeners, setListeners] = useState(LISTENERS_BUNDLED);
  const [listenerSource, setListenerSource] = useState("bundled");
  const [sensitivity, setSensitivity] = useState("balanced");
  const cache = useRef(new Map());
  const PAGE_SIZE = 30;

  // Fetch one week's full snapshot, memoised so switching back is instant.
  const loadSnapshot = useCallback(async (weekKey) => {
    if (!weekKey || weekKey === "NONE") return null;
    if (cache.current.has(weekKey)) return cache.current.get(weekKey);
    const resp = await fetch(`/api/snapshot?week=${encodeURIComponent(weekKey)}`);
    if (!resp.ok) throw new Error(`Could not load ${weekKey}`);
    const { snapshot } = await resp.json();
    cache.current.set(weekKey, snapshot);
    return snapshot;
  }, []);

  // On mount: get the list of available weeks, default to newest vs the one before.
  const loadArchives = useCallback(async () => {
    const resp = await fetch("/api/snapshot");
    if (!resp.ok) throw new Error("Could not list snapshots");
    const { archives: list } = await resp.json();
    setArchives(list || []);
    return list || [];
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("/api/listeners");
        if (resp.ok) {
          const live = await resp.json();
          if (live && live.weeks && Object.keys(live.weeks).length) {
            setListeners(live);
            setListenerSource("live");
          }
        }
      } catch {
        // keep the bundled copy
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const list = await loadArchives();
        if (list.length > 0) {
          setViewWeek(list[0].weekKey);
          setCompareWeek(list[1] ? list[1].weekKey : "NONE");
          return;
        }
      } catch (err) {
        console.log("No shared snapshots available, using seed data");
      }
      setArchives([]);
    })();
  }, [loadArchives]);

  // Load whichever week is selected for viewing.
  useEffect(() => {
    if (!viewWeek) return;
    let cancelled = false;
    (async () => {
      setLoadingWeek(true);
      try {
        const snap = await loadSnapshot(viewWeek);
        if (!cancelled && snap) setData(snap);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingWeek(false);
      }
    })();
    return () => { cancelled = true; };
  }, [viewWeek, loadSnapshot]);

  // Load whichever week is selected for comparison.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!compareWeek || compareWeek === "NONE") {
        setPrevData(null);
        return;
      }
      try {
        const snap = await loadSnapshot(compareWeek);
        if (!cancelled) setPrevData(snap);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { cancelled = true; };
  }, [compareWeek, loadSnapshot]);

  // Refresh: pull every playlist, save as this week's snapshot, then view it.
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setRefreshProgress({ done: 0, total: ALL_IDS.length });

    const allPlaylists = {};

    for (let i = 0; i < ALL_IDS.length; i++) {
      const id = ALL_IDS[i];
      try {
        const resp = await fetch(`/api/rankings?id=${id}`);
        if (resp.status === 429) {
          await new Promise(r => setTimeout(r, 10000));
          const retry = await fetch(`/api/rankings?id=${id}`);
          allPlaylists[id] = retry.ok ? await retry.json() : [];
        } else if (resp.ok) {
          allPlaylists[id] = await resp.json();
        } else {
          allPlaylists[id] = [];
        }
      } catch {
        allPlaylists[id] = [];
      }
      setRefreshProgress({ done: i + 1, total: ALL_IDS.length });
      await new Promise(r => setTimeout(r, 1500));
    }

    const weekKey = getWeekKey();
    const snapshot = { weekKey, fetchedAt: new Date().toISOString(), playlists: allPlaylists };

    // Save for the whole team, then point the view at it.
    try {
      const saveResp = await fetch("/api/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!saveResp.ok) throw new Error(await saveResp.text());

      cache.current.set(weekKey, snapshot);
      const list = await loadArchives();
      setViewWeek(weekKey);
      // Compare against the most recent week that isn't the one we just saved.
      const earlier = list.find(a => a.weekKey !== weekKey);
      setCompareWeek(earlier ? earlier.weekKey : "NONE");
    } catch (err) {
      console.error("Failed to save shared snapshot:", err);
      // Still show what we just pulled, even if the save failed.
      setData(snapshot);
    }

    setRefreshing(false);
    setRefreshProgress(null);
  }, [loadArchives]);

  const analytics = useMemo(() => {
    if (!data) return null;

    const passesFilters = (r) => {
      if (filterCountry !== "ALL" && r.country !== filterCountry) return false;
      if (filterVolume !== "ALL" && r.volume_estimation !== filterVolume) return false;
      if (search && !r.keyword.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    };

    // Same computation for any snapshot, so current and comparison weeks are
    // measured identically and their headline figures can be diffed directly.
    const summarise = (snapshot) => {
      const all = [];
      const stats = {};
      Object.entries(snapshot.playlists).forEach(([pid, rankings]) => {
        if (!rankings || !rankings.length) return;
        const filtered = rankings.filter(passesFilters);
        if (!filtered.length) return;
        filtered.forEach(r => all.push({ ...r, playlistId: pid }));
        const avg = filtered.reduce((s, r) => s + r.position, 0) / filtered.length;
        const top = [...filtered].sort((a, b) => {
          const vd = (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0);
          return vd !== 0 ? vd : a.position - b.position;
        })[0] || null;
        stats[pid] = { total: filtered.length, avg, top, rankings: filtered };
      });

      const strike = all
        .filter(r => r.position >= 2 && r.position <= 5 && (VOL_ORDER[r.volume_estimation] || 0) >= 3)
        .sort((a, b) => {
          const vd = (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0);
          return vd !== 0 ? vd : a.position - b.position;
        });

      const ones = all.filter(r => r.position === 1)
        .sort((a, b) => (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0));

      const topPlaylists = Object.entries(stats)
        .filter(([, s]) => s.total > 0)
        .sort((a, b) => b[1].total - a[1].total);

      return {
        all, stats, strike, ones, topPlaylists,
        totals: {
          activePlaylists: topPlaylists.length,
          rankings: all.length,
          numberOnes: ones.length,
          strikeDistance: strike.length,
        },
      };
    };

    const cur = summarise(data);
    const prev = prevData ? summarise(prevData) : null;

    // Country list stays unfiltered so the dropdown never shrinks to its own selection.
    const allCountries = new Set();
    Object.values(data.playlists).forEach(rankings => {
      if (rankings) rankings.forEach(r => allCountries.add(r.country));
    });

    let movers = [];
    if (prevData) {
      const pm = {};
      Object.entries(prevData.playlists).forEach(([pid, rankings]) => {
        if (rankings) rankings.forEach(r => { pm[`${pid}::${r.keyword}::${r.country}`] = r.position; });
      });
      cur.all.forEach(r => {
        const k = `${r.playlistId}::${r.keyword}::${r.country}`;
        if (pm[k] !== undefined) {
          const ch = pm[k] - r.position;
          if (ch !== 0) movers.push({ ...r, prev: pm[k], change: ch });
        }
      });
      movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    }

    // Keywords held at #1 last week but not this week, and vice versa.
    let onesGained = [], onesLost = [];
    if (prev) {
      const key = r => `${r.playlistId}::${r.keyword}::${r.country}`;
      const curOnes = new Set(cur.ones.map(key));
      const prevOnes = new Set(prev.ones.map(key));
      onesGained = cur.ones.filter(r => !prevOnes.has(key(r)));
      onesLost = prev.ones.filter(r => !curOnes.has(key(r)));
    }

    return {
      all: cur.all,
      stats: cur.stats,
      strike: cur.strike,
      ones: cur.ones,
      topPlaylists: cur.topPlaylists,
      totals: cur.totals,
      prevTotals: prev ? prev.totals : null,
      prevStats: prev ? prev.stats : null,
      onesGained,
      onesLost,
      countries: allCountries,
      movers,
    };
  }, [data, prevData, filterCountry, filterVolume, search]);

  // Listener flags, plus the ranking movement for the weeks currently selected,
  // so a spike can be read against what happened to that playlist's rankings.
  const listenerView = useMemo(() => {
    if (!listeners || !listeners.weeks) return null;
    const cfg = SENSITIVITY[sensitivity];
    const flags = detectFlags(listeners.weeks, cfg);

    const allWeeks = [...new Set(
      Object.values(listeners.weeks).flat().map(r => r[0])
    )].sort();

    // Portfolio-wide weekly totals, restricted to fully-reported weeks so a
    // partial week doesn't look like a collapse.
    const totalsByWeek = {};
    for (const series of Object.values(listeners.weeks)) {
      for (const [wk, total, days] of series) {
        if (days < 7) continue;
        totalsByWeek[wk] = (totalsByWeek[wk] || 0) + total;
      }
    }

    const rankDelta = {};
    if (analytics && analytics.prevStats) {
      for (const [pid, s] of Object.entries(analytics.stats)) {
        const p = analytics.prevStats[pid];
        if (!p) continue;
        rankDelta[pid] = { dAvg: s.avg - p.avg, dCount: s.total - p.total };
      }
    }

    const covered = Object.keys(listeners.weeks).length;
    const lowSignal = Object.values(listeners.reliability || {})
      .filter(r => r.signal !== null && r.signal < 1).length;

    return {
      flags,
      spikes: flags.filter(f => f.z > 0),
      dips: flags.filter(f => f.z < 0),
      allWeeks,
      totalsByWeek,
      rankDelta,
      covered,
      lowSignal,
      cfg,
    };
  }, [listeners, sensitivity, analytics]);

  useEffect(() => { setPage(0); }, [tab, filterCountry, filterVolume, search]);

  if (!data || !analytics) {
    const nothingArchived = archives.length === 0 && !loadingWeek;
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#1DB954", marginBottom: 8, fontWeight: 600 }}>PLAYLIST RANKINGS</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px" }}>
            {nothingArchived ? "No snapshots yet" : "Loading\u2026"}
          </h1>
          {nothingArchived ? (
            <>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 28 }}>
                Nothing has been archived to shared storage yet. Pull the first snapshot and
                everyone on the team will see it here.
              </p>
              <button onClick={refreshData} disabled={refreshing} style={{
                padding: "12px 24px", background: refreshing ? "rgba(255,255,255,0.06)" : "#1DB954",
                color: refreshing ? "#888" : "#000", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: refreshing ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}>
                {refreshing
                  ? `Pulling\u2026 ${refreshProgress?.done || 0}/${refreshProgress?.total || 125}`
                  : "Pull first snapshot"}
              </button>
            </>
          ) : (
            <p style={{ fontSize: 13, color: "#555" }}>Fetching shared data\u2026</p>
          )}
        </div>
      </div>
    );
  }

  const totalP1 = analytics.ones.length;
  const totalStrike = analytics.strike.length;
  const activeCount = analytics.topPlaylists.length;
  const totalRankings = analytics.all.length;
  const emptyCount = ALL_IDS.length - Object.keys(data.playlists).length;

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => setTab(key)} style={{
      padding: "10px 20px", background: tab === key ? "#1DB954" : "transparent",
      color: tab === key ? "#000" : "#b3b3b3", border: "none", borderRadius: 8,
      cursor: "pointer", fontSize: 13, fontWeight: tab === key ? 700 : 500,
      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap"
    }}>{label}</button>
  );

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20 };
  const statCard = { ...card, textAlign: "center", flex: 1, minWidth: 130 };

  const Paginator = ({ total }) => {
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) return null;
    return (
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "16px 0", alignItems: "center" }}>
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
          style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: page === 0 ? "#444" : "#ccc", cursor: page === 0 ? "default" : "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Prev</button>
        <span style={{ fontSize: 12, color: "#666" }}>{page + 1} / {pages}</span>
        <button onClick={() => setPage(Math.min(pages - 1, page + 1))} disabled={page >= pages - 1}
          style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: page >= pages - 1 ? "#444" : "#ccc", cursor: page >= pages - 1 ? "default" : "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Next</button>
      </div>
    );
  };

  // Week-over-week change shown under a headline figure.
  // higherIsBetter=false for metrics where a lower number is an improvement.
  const Delta = ({ now, then, higherIsBetter = true, suffix = "" }) => {
    if (then === null || then === undefined) return null;
    const d = now - then;
    if (d === 0) return <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>no change vs {prevData.weekKey}</div>;
    const good = higherIsBetter ? d > 0 : d < 0;
    return (
      <div style={{ fontSize: 10, marginTop: 3, color: good ? "#1DB954" : "#ef4444", fontWeight: 600 }}>
        {d > 0 ? "+" : "\u2212"}{Math.abs(d).toLocaleString()}{suffix} vs {prevData.weekKey}
      </div>
    );
  };

  const VolBadge = ({ vol }) => (
    <span style={{ color: VOL_CLR[vol] || "#888", fontSize: 11, fontWeight: 500 }}>{VOL_LABEL[vol] || vol || "—"}</span>
  );

  const PosBadge = ({ pos }) => (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4, fontWeight: 600, fontSize: 12,
      background: pos === 1 ? "rgba(250,204,21,0.15)" : pos <= 3 ? "rgba(29,185,84,0.12)" : pos <= 5 ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.05)",
      color: pos === 1 ? "#facc15" : pos <= 3 ? "#1DB954" : pos <= 5 ? "#f97316" : "#aaa"
    }}>#{pos}</span>
  );

  const SpotifyLink = ({ pid }) => (
    <a href={`https://open.spotify.com/playlist/${pid}`} target="_blank" rel="noopener noreferrer"
      title={pid}
      style={{ fontSize: 12, color: "#ccc", textDecoration: "none", fontWeight: 500 }}
      onMouseEnter={e => e.target.style.color = "#1DB954"} onMouseLeave={e => e.target.style.color = "#ccc"}>
      {NAMES[pid] ? (NAMES[pid].length > 45 ? NAMES[pid].slice(0, 45) + "…" : NAMES[pid]) : pid.slice(0, 8) + "..."}
    </a>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'DM Sans', sans-serif", padding: 24, boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#1DB954", marginBottom: 4, fontWeight: 600 }}>PLAYLIST RANKINGS</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>SEO Command Center</h1>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            {new Date(data.fetchedAt).toLocaleDateString()} · {activeCount} active / {ALL_IDS.length} total
            {archives.length > 0 && <span> · {archives.length} week{archives.length !== 1 ? "s" : ""} archived</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <button onClick={refreshData} disabled={refreshing} style={{
            padding: "10px 20px", background: refreshing ? "rgba(255,255,255,0.06)" : "#1DB954",
            color: refreshing ? "#888" : "#000", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 700, cursor: refreshing ? "default" : "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
          }}>
            {refreshing ? `Refreshing… ${refreshProgress?.done || 0}/${refreshProgress?.total || 125}` : "↻ Refresh Data"}
          </button>
          {refreshing && (
            <div style={{ width: 160, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#1DB954", borderRadius: 4, width: `${((refreshProgress?.done || 0) / (refreshProgress?.total || 125)) * 100}%`, transition: "width 0.3s" }} />
            </div>
          )}
        </div>
      </div>

      {/* Week picker — choose which snapshot to view and which to compare against */}
      <div style={{
        ...card, padding: "14px 18px", marginBottom: 20, display: "flex",
        alignItems: "center", gap: 18, flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em", fontWeight: 600 }}>VIEWING</label>
          <select
            value={viewWeek || ""}
            onChange={e => setViewWeek(e.target.value)}
            disabled={archives.length === 0 || refreshing}
            style={{
              padding: "7px 12px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(29,185,84,0.35)", borderRadius: 8, color: "#fff",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", fontWeight: 600
            }}>
            {archives.length === 0 && <option value="">Seed data</option>}
            {archives.map(a => (
              <option key={a.weekKey} value={a.weekKey}>
                {a.weekKey} — {new Date(a.uploadedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em", fontWeight: 600 }}>COMPARE TO</label>
          <select
            value={compareWeek || "NONE"}
            onChange={e => setCompareWeek(e.target.value)}
            disabled={archives.length === 0 || refreshing}
            style={{
              padding: "7px 12px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none"
            }}>
            <option value="NONE">Nothing</option>
            {archives.filter(a => a.weekKey !== viewWeek).map(a => (
              <option key={a.weekKey} value={a.weekKey}>
                {a.weekKey} — {new Date(a.uploadedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {loadingWeek && <span style={{ fontSize: 12, color: "#1DB954" }}>Loading week…</span>}
        {archives.length === 0 && (
          <span style={{ fontSize: 12, color: "#666" }}>
            No archived weeks yet — hit Refresh to save your first.
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1DB954" }}>{activeCount}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>ACTIVE PLAYLISTS</div>
          <Delta now={analytics.totals.activePlaylists} then={analytics.prevTotals?.activePlaylists} />
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalRankings.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>TOTAL RANKINGS</div>
          <Delta now={analytics.totals.rankings} then={analytics.prevTotals?.rankings} />
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#facc15" }}>{totalP1}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>#1 POSITIONS</div>
          <Delta now={analytics.totals.numberOnes} then={analytics.prevTotals?.numberOnes} />
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#f97316" }}>{totalStrike}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>STRIKE DISTANCE</div>
          <Delta now={analytics.totals.strikeDistance} then={analytics.prevTotals?.strikeDistance} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by keyword…"
          style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", minWidth: 180 }} />
        <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
          style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
          <option value="ALL">All Countries</option>
          {[...analytics.countries].sort().map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterVolume} onChange={e => setFilterVolume(e.target.value)}
          style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
          <option value="ALL">All Volumes</option>
          {Object.entries(VOL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {tabBtn("overview", "Portfolio Overview")}
        {tabBtn("strike", `Strike Distance (${analytics.strike.length})`)}
        {tabBtn("movers", "Biggest Movers")}
        {tabBtn("number1", `#1 Rankings (${analytics.ones.length})`)}
        {tabBtn("listeners", `Listeners${listenerView ? ` (${listenerView.flags.length})` : ""}`)}
      </div>

      {tab === "overview" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            {activeCount} playlists with rankings, sorted by keyword count. Tap to expand.
            {emptyCount > 0 && ` ${emptyCount} playlists have no keywords tracked yet.`}
          </p>
          {analytics.topPlaylists.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(([pid, s]) => (
            <div key={pid} style={{ marginBottom: 4 }}>
              <div onClick={() => setExpanded(expanded === pid ? null : pid)} style={{
                ...card, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                background: expanded === pid ? "rgba(29,185,84,0.08)" : "rgba(255,255,255,0.04)",
                borderColor: expanded === pid ? "rgba(29,185,84,0.3)" : "rgba(255,255,255,0.08)", transition: "all 0.15s"
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={`https://open.spotify.com/playlist/${pid}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: "#e8e8e8", textDecoration: "none", fontWeight: 600, lineHeight: 1.3, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.target.style.color = "#1DB954"} onMouseLeave={e => e.target.style.color = "#e8e8e8"}>
                    {NAMES[pid] || pid}
                  </a>
                  {s.top && <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>
                    Best: "<span style={{ color: "#1DB954" }}>{s.top.keyword}</span>" #{s.top.position} in {s.top.country}
                  </div>}
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{s.total}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>keywords</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#facc15" }}>{s.avg.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>avg pos</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#555", transform: expanded === pid ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
                </div>
              </div>
              {expanded === pid && (
                <div style={{ padding: "8px 0 0 16px", maxHeight: 400, overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr style={{ color: "#666", textAlign: "left" }}>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Keyword</th>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Country</th>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Pos</th>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Volume</th>
                    </tr></thead>
                    <tbody>
                      {[...s.rankings].sort((a, b) => {
                        const vd = (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0);
                        return vd !== 0 ? vd : a.position - b.position;
                      }).map((r, i) => (
                        <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "8px 10px", color: "#ddd" }}>{r.keyword}</td>
                          <td style={{ padding: "8px 10px", color: "#888" }}>{r.country}</td>
                          <td style={{ padding: "8px 10px" }}><PosBadge pos={r.position} /></td>
                          <td style={{ padding: "8px 10px" }}><VolBadge vol={r.volume_estimation} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          <Paginator total={analytics.topPlaylists.length} />
        </div>
      )}

      {tab === "strike" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            Positions #2–5 with Medium+ volume — tweak the title or description to push for #1.
          </p>
          {analytics.strike.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 40, color: "#555" }}>No strike-distance opportunities with current filters.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Keyword</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Playlist</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Country</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Pos</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Volume</th>
              </tr></thead>
              <tbody>
                {analytics.strike.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", color: "#f97316", fontWeight: 600 }}>{r.keyword}</td>
                    <td style={{ padding: "10px 12px" }}><SpotifyLink pid={r.playlistId} /></td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{r.country}</td>
                    <td style={{ padding: "10px 12px" }}><PosBadge pos={r.position} /></td>
                    <td style={{ padding: "10px 12px" }}><VolBadge vol={r.volume_estimation} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Paginator total={analytics.strike.length} />
        </div>
      )}

      {tab === "movers" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            {prevData
              ? `${data.weekKey} vs ${prevData.weekKey}, sorted by biggest position change. Green means the playlist climbed.`
              : archives.length > 1
                ? "Pick a week under \u201cCompare to\u201d above to see movement between any two snapshots."
                : "Only one week archived so far. Refresh again next week and this tab will fill in."}
          </p>
          {analytics.movers.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 40, color: "#555" }}>
              {prevData ? "No position changes detected." : "Your snapshot is saved. Come back next week to see movers."}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Keyword</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Playlist</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Country</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Change</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Now</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Was</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Volume</th>
              </tr></thead>
              <tbody>
                {analytics.movers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", color: "#ddd", fontWeight: 500 }}>{r.keyword}</td>
                    <td style={{ padding: "10px 12px" }}><SpotifyLink pid={r.playlistId} /></td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{r.country}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        padding: "2px 10px", borderRadius: 4, fontWeight: 700, fontSize: 13,
                        background: r.change > 0 ? "rgba(29,185,84,0.15)" : "rgba(239,68,68,0.15)",
                        color: r.change > 0 ? "#1DB954" : "#ef4444"
                      }}>{r.change > 0 ? "▲" : "▼"} {Math.abs(r.change)}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>#{r.position}</td>
                    <td style={{ padding: "10px 12px", color: "#666" }}>#{r.prev}</td>
                    <td style={{ padding: "10px 12px" }}><VolBadge vol={r.volume_estimation} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Paginator total={analytics.movers.length} />
        </div>
      )}

      {tab === "number1" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            All keywords where your playlists hold #1. Protect these.
          </p>

          {prevData && (analytics.onesGained.length > 0 || analytics.onesLost.length > 0) && (
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ ...card, padding: "12px 16px", flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 11, color: "#1DB954", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 6 }}>
                  GAINED SINCE {prevData.weekKey} · {analytics.onesGained.length}
                </div>
                {analytics.onesGained.length === 0
                  ? <div style={{ fontSize: 12, color: "#555" }}>None</div>
                  : analytics.onesGained.slice(0, 5).map((r, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#ccc", marginTop: 2 }}>
                        {r.keyword} <span style={{ color: "#666" }}>{r.country}</span>
                      </div>
                    ))}
                {analytics.onesGained.length > 5 && (
                  <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                    +{analytics.onesGained.length - 5} more
                  </div>
                )}
              </div>

              <div style={{ ...card, padding: "12px 16px", flex: 1, minWidth: 240, borderColor: analytics.onesLost.length ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 6 }}>
                  LOST SINCE {prevData.weekKey} · {analytics.onesLost.length}
                </div>
                {analytics.onesLost.length === 0
                  ? <div style={{ fontSize: 12, color: "#555" }}>None — nothing slipped</div>
                  : analytics.onesLost.slice(0, 5).map((r, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#ccc", marginTop: 2 }}>
                        {r.keyword} <span style={{ color: "#666" }}>{r.country}</span>
                        <span style={{ color: VOL_CLR[r.volume_estimation], fontSize: 10, marginLeft: 6 }}>
                          {VOL_LABEL[r.volume_estimation]}
                        </span>
                      </div>
                    ))}
                {analytics.onesLost.length > 5 && (
                  <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>
                    +{analytics.onesLost.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}
          {analytics.ones.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 40, color: "#555" }}>No #1 positions with current filters.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Keyword</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Playlist</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Country</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Volume</th>
              </tr></thead>
              <tbody>
                {analytics.ones.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", color: "#facc15", fontWeight: 600 }}>{r.keyword}</td>
                    <td style={{ padding: "10px 12px" }}><SpotifyLink pid={r.playlistId} /></td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{r.country}</td>
                    <td style={{ padding: "10px 12px" }}><VolBadge vol={r.volume_estimation} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Paginator total={analytics.ones.length} />
        </div>
      )}

      {tab === "listeners" && listenerView && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 6, lineHeight: 1.5 }}>
            New listeners per playlist per day, aggregated weekly. A week is flagged when it
            departs from that playlist{"\u2019"}s own recent norm \u2014 not against a portfolio-wide
            threshold, since these playlists differ hugely in size.
          </p>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 18, lineHeight: 1.5 }}>
            Covers {listenerView.covered} of {ALL_IDS.length} playlists
            {listeners.dateRange && <> \u00b7 {listeners.dateRange[0]} to {listeners.dateRange[1]}</>}
            {" \u00b7 "}source: {listenerSource === "live" ? "live sheet" : "bundled snapshot"}
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em", fontWeight: 600 }}>SENSITIVITY</label>
            <select value={sensitivity} onChange={e => setSensitivity(e.target.value)}
              style={{ padding: "7px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                       borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
              {Object.entries(SENSITIVITY).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <span style={{ fontSize: 11, color: "#555" }}>
              needs |z| \u2265 {listenerView.cfg.z}, \u2265 {listenerView.cfg.minAbs}/day and \u2265 {listenerView.cfg.minPct}% change
            </span>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ ...card, textAlign: "center", flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#1DB954" }}>{listenerView.spikes.length}</div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.05em" }}>SPIKES</div>
            </div>
            <div style={{ ...card, textAlign: "center", flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{listenerView.dips.length}</div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.05em" }}>DIPS</div>
            </div>
            <div style={{ ...card, textAlign: "center", flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{listenerView.covered}</div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.05em" }}>PLAYLISTS</div>
            </div>
            <div style={{ ...card, textAlign: "center", flex: 1, minWidth: 120 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#facc15" }}>{listenerView.lowSignal}</div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: "0.05em" }}>LOW SIGNAL</div>
            </div>
          </div>

          {listenerView.lowSignal > 0 && (
            <div style={{ ...card, padding: "12px 16px", marginBottom: 20, borderColor: "rgba(250,204,21,0.25)" }}>
              <div style={{ fontSize: 12, color: "#facc15", fontWeight: 600, marginBottom: 4 }}>
                Read low-signal playlists with caution
              </div>
              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.5 }}>
                On {listenerView.lowSignal} of {listenerView.covered} playlists, week-to-week variation is no larger
                than ordinary day-to-day variation, so a flagged week there may be noise rather than a real change.
                Those rows are marked <span style={{ color: "#facc15" }}>low signal</span> below.
              </div>
            </div>
          )}

          {listenerView.flags.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 40, color: "#555" }}>
              No weeks clear the {listenerView.cfg.label.toLowerCase()} threshold. Try a higher sensitivity.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Week</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Playlist</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Change</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Per day</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Week total</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Ranking shift</th>
              </tr></thead>
              <tbody>
                {listenerView.flags.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((f, i) => {
                  const rel = (listeners.reliability || {})[f.pid];
                  const weak = rel && rel.signal !== null && rel.signal < 1;
                  const rd = listenerView.rankDelta[f.pid];
                  const sameWeek = f.week === (data && data.weekKey);
                  return (
                    <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "10px 12px", color: "#aaa", fontWeight: 500 }}>
                        {f.week}
                        {f.days < 7 && <span style={{ color: "#666", fontSize: 10 }}> ({f.days}d)</span>}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <SpotifyLink pid={f.pid} />
                        {weak && <div style={{ fontSize: 10, color: "#facc15" }}>low signal</div>}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span style={{
                          padding: "2px 10px", borderRadius: 4, fontWeight: 700, fontSize: 13,
                          background: f.z > 0 ? "rgba(29,185,84,0.15)" : "rgba(239,68,68,0.15)",
                          color: f.z > 0 ? "#1DB954" : "#ef4444"
                        }}>
                          {f.z > 0 ? "\u25b2" : "\u25bc"} {Math.abs(f.pctChg).toFixed(0)}%
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#ddd" }}>
                        {f.baseline.toFixed(1)} \u2192 <strong>{f.perDay.toFixed(1)}</strong>
                      </td>
                      <td style={{ padding: "10px 12px", color: "#888" }}>{f.total.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px" }}>
                        {!sameWeek || !rd ? (
                          <span style={{ color: "#555", fontSize: 11 }}>
                            {sameWeek ? "no ranking data" : "\u2014"}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: rd.dAvg < 0 ? "#1DB954" : rd.dAvg > 0 ? "#ef4444" : "#888" }}>
                            {rd.dAvg < 0 ? "\u25b2" : rd.dAvg > 0 ? "\u25bc" : ""} {Math.abs(rd.dAvg).toFixed(1)} avg pos
                            {rd.dCount !== 0 && <span style={{ color: "#666" }}>, {rd.dCount > 0 ? "+" : ""}{rd.dCount} kw</span>}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <Paginator total={listenerView.flags.length} />

          <div style={{ fontSize: 11, color: "#555", marginTop: 16, lineHeight: 1.6 }}>
            The ranking-shift column is populated only for flags in the week you are viewing
            ({data && data.weekKey}), compared against {prevData ? prevData.weekKey : "your chosen compare week"},
            because only those two snapshots are loaded. Change the week picker above to line up a different flag.
          </div>
        </div>
      )}

    </div>
  );
}

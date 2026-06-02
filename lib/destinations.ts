/* ------------------------------------------------------------------ */
/*  Known destinations worldwide with fun descriptions                 */
/* ------------------------------------------------------------------ */

export interface Destination {
  name: string;
  lat: number;
  lon: number;
  preposition: string; // "bis zum", "bis zur", "bis nach"
  description: string;
}

export const DESTINATIONS: Destination[] = [
  // Europe close range (50-500 km)
  { name: "Schloss Neuschwanstein", lat: 47.5576, lon: 10.7498, preposition: "bis zum", description: "das Märchenschloss von König Ludwig II. in Bayern" },
  { name: "Eiffelturm", lat: 48.8584, lon: 2.2945, preposition: "bis zum", description: "das 330 Meter hohe Wahrzeichen von Paris" },
  { name: "Mailänder Dom", lat: 45.4642, lon: 9.1900, preposition: "bis zum", description: "die grösste Kirche Italiens mit 3'400 Statuen" },
  { name: "Colosseum", lat: 41.8902, lon: 12.4922, preposition: "bis zum", description: "das grösste Amphitheater der Antike in Rom" },
  { name: "Manneken Pis", lat: 50.8450, lon: 4.3499, preposition: "bis zum", description: "die berühmte 61-cm-Bronzefigur eines pinkelnden Jungen in Brüssel" },
  { name: "Brandenburger Tor", lat: 52.5163, lon: 13.3777, preposition: "bis zum", description: "das Symbol der deutschen Wiedervereinigung in Berlin" },
  { name: "Anne-Frank-Haus", lat: 52.3752, lon: 4.8840, preposition: "bis zum", description: "das Museum im Versteck der Familie Frank in Amsterdam" },
  { name: "Sagrada Família", lat: 41.4036, lon: 2.1744, preposition: "bis zur", description: "Gaudís unvollendete Basilika in Barcelona – seit 1882 im Bau" },
  { name: "Parthenon", lat: 37.9715, lon: 23.7267, preposition: "bis zum", description: "den antiken Tempel der Göttin Athene auf der Akropolis" },
  { name: "Stonehenge", lat: 51.1789, lon: -1.8262, preposition: "bis nach", description: "den mysteriösen Steinkreis aus der Jungsteinzeit in England" },
  { name: "Schiefen Turm von Pisa", lat: 43.7230, lon: 10.3966, preposition: "bis zum", description: "den berühmten schiefen Glockenturm – 3.97° Neigung" },
  { name: "Dubrovnik", lat: 42.6507, lon: 18.0944, preposition: "bis nach", description: "die «Perle der Adria» und Drehort von Game of Thrones" },
  { name: "Nordkap", lat: 71.1685, lon: 25.7838, preposition: "bis zum", description: "den nördlichsten Punkt Europas auf einer 307 m hohen Klippe" },

  // Medium range (500-3000 km)
  { name: "Hagia Sophia", lat: 41.0086, lon: 28.9802, preposition: "bis zur", description: "die 1'500 Jahre alte Kathedrale in Istanbul" },
  { name: "Blauen Moschee", lat: 41.0054, lon: 28.9768, preposition: "bis zur", description: "die Sultanahmet-Moschee mit ihren sechs Minaretten in Istanbul" },
  { name: "Pyramiden von Gizeh", lat: 29.9792, lon: 31.1342, preposition: "bis zu den", description: "die letzten erhaltenen der Sieben Weltwunder – über 4'500 Jahre alt" },
  { name: "Toten Meer", lat: 31.5, lon: 35.5, preposition: "bis zum", description: "den tiefsten Punkt der Erde – 430 m unter dem Meeresspiegel" },
  { name: "Polarkreis", lat: 66.5, lon: 25.0, preposition: "bis zum", description: "die magische Linie, ab der die Mitternachtssonne scheint" },
  { name: "Sahara", lat: 23.0, lon: 12.0, preposition: "bis in die", description: "die grösste Heisswüste der Welt – so gross wie die USA" },
  { name: "Kilimandscharo", lat: -3.0674, lon: 37.3556, preposition: "bis zum", description: "den höchsten freistehenden Berg der Welt in Tansania (5'895 m)" },
  { name: "Marrakesch", lat: 31.6295, lon: -7.9811, preposition: "bis nach", description: "die «Rote Stadt» Marokkos mit dem berühmten Djemaa el Fna" },
  { name: "Reykjavik", lat: 64.1466, lon: -21.9426, preposition: "bis nach", description: "die nördlichste Hauptstadt der Welt auf Island" },

  // Long range (3000-8000 km)
  { name: "Freiheitsstatue", lat: 40.6892, lon: -74.0445, preposition: "bis zur", description: "Lady Liberty in New York – ein Geschenk Frankreichs von 1886" },
  { name: "Times Square", lat: 40.7580, lon: -73.9855, preposition: "bis zum", description: "den meistbesuchten Platz der Welt in Manhattan" },
  { name: "Niagarafälle", lat: 43.0896, lon: -79.0849, preposition: "bis zu den", description: "die berühmten Wasserfälle an der Grenze USA/Kanada" },
  { name: "Taj Mahal", lat: 27.1751, lon: 78.0421, preposition: "bis zum", description: "das Mausoleum der Liebe in Indien – gebaut aus weissem Marmor" },
  { name: "Himalaya", lat: 27.9881, lon: 86.9250, preposition: "bis zum", description: "das Dach der Welt – Mount Everest mit 8'849 m" },
  { name: "Chinesischen Mauer", lat: 40.4319, lon: 116.5704, preposition: "bis zur", description: "das längste Bauwerk der Welt – über 21'000 km lang" },
  { name: "Angkor Wat", lat: 13.4125, lon: 103.8670, preposition: "bis nach", description: "die grösste Tempelanlage der Welt in Kambodscha" },
  { name: "Kapstadt", lat: -33.9249, lon: 18.4241, preposition: "bis nach", description: "die «Mutterstadt» Südafrikas am Tafelberg" },
  { name: "Victoriafälle", lat: -17.9243, lon: 25.8572, preposition: "bis zu den", description: "den breitesten Wasserfall der Welt an der Grenze Sambia/Simbabwe" },
  { name: "Dubai Burj Khalifa", lat: 25.1972, lon: 55.2744, preposition: "bis zum", description: "das höchste Gebäude der Welt – 828 Meter hoch" },
  { name: "Petra", lat: 30.3285, lon: 35.4444, preposition: "bis nach", description: "die in Felsen gehauene Stadt der Nabatäer in Jordanien" },
  { name: "Moskau Roter Platz", lat: 55.7539, lon: 37.6208, preposition: "bis zum", description: "den Roten Platz mit der farbenfrohen Basilius-Kathedrale" },

  // Very long range (8000-15000 km)
  { name: "Machu Picchu", lat: -13.1631, lon: -72.5450, preposition: "bis nach", description: "die verlorene Stadt der Inka auf 2'430 m Höhe in Peru" },
  { name: "Galápagos-Inseln", lat: -0.9538, lon: -89.6173, preposition: "bis zu den", description: "Darwins Evolutionslabor im Pazifik – Heimat der Riesenschildkröten" },
  { name: "Cristo Redentor", lat: -22.9519, lon: -43.2105, preposition: "bis zum", description: "die 30 Meter hohe Christusstatue über Rio de Janeiro" },
  { name: "Iguazú-Wasserfälle", lat: -25.6953, lon: -54.4367, preposition: "bis zu den", description: "275 Wasserfälle auf 2.7 km Breite – Argentinien/Brasilien" },
  { name: "Grand Canyon", lat: 36.1069, lon: -112.1129, preposition: "bis zum", description: "die 1.6 km tiefe Schlucht in Arizona – 6 Millionen Jahre alt" },
  { name: "Golden Gate Bridge", lat: 37.8199, lon: -122.4783, preposition: "bis zur", description: "die ikonische rote Hängebrücke in San Francisco" },
  { name: "Hollywood Sign", lat: 34.1341, lon: -118.3215, preposition: "bis zum", description: "das berühmte Schild in den Hollywood Hills von Los Angeles" },
  { name: "Chichén Itzá", lat: 20.6843, lon: -88.5678, preposition: "bis nach", description: "die Maya-Pyramide El Castillo in Mexiko" },
  { name: "Tokio", lat: 35.6762, lon: 139.6503, preposition: "bis nach", description: "die grösste Metropole der Welt mit 37 Millionen Einwohnern" },
  { name: "Mount Fuji", lat: 35.3606, lon: 138.7274, preposition: "bis zum", description: "Japans heiligen Berg – 3'776 m hoher Vulkan" },
  { name: "Peking Verbotene Stadt", lat: 39.9163, lon: 116.3972, preposition: "bis zur", description: "den grössten Palastkomplex der Welt mit 9'999 Räumen" },
  { name: "Bali", lat: -8.3405, lon: 115.0920, preposition: "bis nach", description: "die «Insel der Götter» in Indonesien" },
  { name: "Serengeti", lat: -2.3333, lon: 34.8333, preposition: "bis in die", description: "die endlose Savanne Tansanias – Heimat der grossen Tierwanderung" },
  { name: "Nairobi", lat: -1.2921, lon: 36.8219, preposition: "bis nach", description: "Kenias Hauptstadt – die einzige Grossstadt mit Nationalpark" },
  { name: "Singapur", lat: 1.3521, lon: 103.8198, preposition: "bis nach", description: "den Stadtstaat an der Spitze Malaysias" },

  // Ultra long range (15000-20000 km)
  { name: "Sydney Opera House", lat: -33.8568, lon: 151.2153, preposition: "bis zum", description: "das segelförmige Opernhaus im Hafen von Sydney" },
  { name: "Uluru (Ayers Rock)", lat: -25.3444, lon: 131.0369, preposition: "bis zum", description: "den heiligen roten Felsen der Aborigines in Australiens Outback" },
  { name: "Great Barrier Reef", lat: -18.2871, lon: 147.6992, preposition: "bis zum", description: "das grösste Korallenriff der Welt – 2'300 km lang" },
  { name: "Osterinsel", lat: -27.1127, lon: -109.3497, preposition: "bis zur", description: "die mysteriöse Insel mit den 887 Moai-Steinfiguren" },
  { name: "Feuerland", lat: -54.8019, lon: -68.3030, preposition: "bis nach", description: "das «Ende der Welt» an der Südspitze Südamerikas" },
  { name: "Antarktis", lat: -72.0, lon: 2.5, preposition: "bis in die", description: "den kältesten Kontinent – minus 89.2°C wurden hier gemessen" },
  { name: "Fiji-Inseln", lat: -17.7134, lon: 178.0650, preposition: "bis zu den", description: "das tropische Paradies mit 333 Inseln im Südpazifik" },
  { name: "Hawaii", lat: 21.3069, lon: -157.8583, preposition: "bis nach", description: "das Surferparadies mitten im Pazifik" },
  { name: "Nuku'alofa", lat: -21.2087, lon: -175.1982, preposition: "bis nach", description: "die Hauptstadt von Tonga – eines der ersten Länder, das den neuen Tag begrüsst" },
  { name: "Neuseeland", lat: -41.2865, lon: 174.7762, preposition: "bis nach", description: "das Land der Kiwis und Hobbits am anderen Ende der Welt" },
  { name: "Patagonien", lat: -50.0, lon: -72.0, preposition: "bis nach", description: "die windgepeitschte Wildnis am Ende Südamerikas" },
  { name: "Tahiti", lat: -17.6509, lon: -149.4260, preposition: "bis nach", description: "die Trauminsel Französisch-Polynesiens im Südpazifik" },

  // Near-antipode range (18000-20037 km)
  { name: "Chatham-Inseln", lat: -43.8853, lon: -176.4578, preposition: "bis zu den", description: "die abgelegene Inselgruppe östlich von Neuseeland – einer der ersten Orte der Welt, die den Sonnenaufgang sehen" },
  { name: "Antipoden-Inseln", lat: -49.6833, lon: 178.7667, preposition: "bis zu den", description: "die fast genau gegenüber der Schweiz liegenden unbewohnten Inseln im Südpazifik" },

  // === Additional 130 destinations ===
  // Europe close (100-500km)
  { name: "Matterhorn", lat: 45.9763, lon: 7.6586, preposition: "bis zum", description: "das meistfotografierte Bergpanorama der Welt – Vorlage für das Toblerone-Logo" },
  { name: "Hallstatt", lat: 47.5622, lon: 13.6493, preposition: "bis nach", description: "das Bilderbuchdorf, das als Vorbild für Arendelle in Disneys «Frozen» diente" },
  { name: "Zugspitze", lat: 47.4211, lon: 10.9854, preposition: "bis zur", description: "den höchsten Berg Deutschlands – von hier sieht man bei klarem Wetter sechs Länder" },
  { name: "Plitvitzer Seen", lat: 44.8804, lon: 15.6162, preposition: "bis zu den", description: "die 16 smaragdgrünen Kaskadenseen in Kroatien – die Kalksinterbarrieren wachsen noch heute" },
  { name: "Škocjaner Höhlen", lat: 45.6636, lon: 13.9967, preposition: "bis zu den", description: "die slowenischen Höhlen mit einer unterirdischen Schlucht, in die die Niagarafälle passen würden" },
  { name: "Hohenzollern", lat: 48.3228, lon: 9.0470, preposition: "bis zur", description: "die Stammburg des letzten deutschen Kaiserhauses auf einem dramatischen Kegelberg" },
  { name: "Berchtesgadener Königssee", lat: 47.5989, lon: 12.9977, preposition: "bis zum", description: "den kristallklaren See, wo nur Elektroboote fahren dürfen" },
  { name: "Säntis", lat: 47.2495, lon: 9.3432, preposition: "bis zum", description: "den Ostschweizer Gipfel, von dem man sechs Länder gleichzeitig sieht" },
  { name: "Aletschgletscher", lat: 46.5000, lon: 8.0833, preposition: "bis zum", description: "den längsten Gletscher der Alpen – 23 km lang" },
  { name: "Bodensee-Pfahlbauten", lat: 47.7572, lon: 9.2636, preposition: "bis zu den", description: "das UNESCO-Welterbe, das zeigt wie Menschen vor 5'000 Jahren über dem Wasser lebten" },
  { name: "Legoland Günzburg", lat: 48.4481, lon: 10.2716, preposition: "bis zum", description: "den Freizeitpark mit über 60 Millionen verbauten Legosteinen" },
  { name: "Grotte di Frasassi", lat: 43.3956, lon: 12.9686, preposition: "bis zu den", description: "die Höhlen mit der grössten unterirdischen Halle Europas – der Mailänder Dom passt hinein" },

  // Wider Europe (500-2000km)
  { name: "Wieliczka Salzbergwerk", lat: 49.9833, lon: 20.0578, preposition: "bis zum", description: "das Salzbergwerk bei Krakau mit einer Kapelle – Kronleuchter, Altar und alles aus Salz gemeisselt" },
  { name: "Prager Astronomische Uhr", lat: 50.0870, lon: 14.4207, preposition: "bis zur", description: "die drittälteste noch funktionierende astronomische Uhr der Welt – seit 1410" },
  { name: "Warschauer Altstadt", lat: 52.2497, lon: 21.0122, preposition: "bis zur", description: "die komplett aus Fotos und Erinnerungen wiederaufgebaute Altstadt – trotzdem UNESCO-Welterbe" },
  { name: "Kopenhagener Meerjungfrau", lat: 55.6929, lon: 12.5993, preposition: "bis zur", description: "die meistenttäuschende Touristenattraktion der Welt – nur 1.25 Meter gross" },
  { name: "Lofoten", lat: 68.1533, lon: 13.9997, preposition: "bis zu den", description: "die Inseln nördlich des Polarkreises mit den wärmsten Wintern dieser Breite dank des Golfstroms" },
  { name: "Trolltunga", lat: 60.1240, lon: 6.7400, preposition: "bis zur", description: "den Felsvorsprung der 700 m über dem See hängt – Instagram machte ihn weltberühmt" },
  { name: "Stromboli", lat: 38.7892, lon: 15.2132, preposition: "bis nach", description: "den Vulkan, der seit 2'000 Jahren fast ununterbrochen aktiv ist" },
  { name: "Cappadocia Feenkamine", lat: 38.6431, lon: 34.8289, preposition: "bis zu den", description: "die Tuffkegel in der Türkei, in denen heute noch Menschen in Höhlen wohnen" },
  { name: "Pamukkale", lat: 37.9137, lon: 29.1187, preposition: "bis nach", description: "die weissen Kalkterrassen der Türkei – schon die Römer badeten hier" },
  { name: "Meteora-Klöster", lat: 39.7217, lon: 21.6306, preposition: "bis zu den", description: "die Klöster auf 400 m hohen Felsnadeln – Mönche wurden per Seilwinde hochgezogen" },
  { name: "Knossos", lat: 35.2983, lon: 25.1632, preposition: "bis nach", description: "den minoischen Palast mit 1'500 Räumen – Vorbild für das Labyrinth des Minotaurus" },
  { name: "Blaue Grotte Capri", lat: 40.5570, lon: 14.1962, preposition: "bis zur", description: "die Meeresgrotte, wo eindringendes Licht ein magisches blaues Leuchten erzeugt" },
  { name: "Alhambra Granada", lat: 37.1761, lon: -3.5881, preposition: "bis zur", description: "das letzte Bollwerk der Mauren – 1492 übergeben, am selben Tag als Kolumbus ablegte" },
  { name: "Giant's Causeway", lat: 55.2408, lon: -6.5116, preposition: "bis zum", description: "die 40'000 perfekt sechseckigen Basaltsäulen in Nordirland" },
  { name: "Skellig Michael", lat: 51.7727, lon: -10.5391, preposition: "bis nach", description: "das Felsenkloster vor Irland – Drehort der letzten Star-Wars-Szenen" },
  { name: "White Cliffs of Dover", lat: 51.1279, lon: 1.3134, preposition: "bis zu den", description: "die Kreidefelsen aus 500 Millionen Meeresschnecken" },
  { name: "Rügen Kreidefelsen", lat: 54.5795, lon: 13.6429, preposition: "bis zu den", description: "die weissen Klippen, die Caspar David Friedrich in seinem berühmtesten Gemälde verewigte" },
  { name: "Drachenfels am Rhein", lat: 50.6558, lon: 7.1867, preposition: "bis zum", description: "den meistbestiegenen Berg Deutschlands – hier erschlug Siegfried der Sage nach den Drachen" },
  { name: "Herculaneum", lat: 40.8059, lon: 14.3479, preposition: "bis nach", description: "die vom Vesuv begrabene Stadt, wo sogar Holz und Essen konserviert blieben" },
  { name: "Lanzarote Timanfaya", lat: 29.0085, lon: -13.7555, preposition: "bis zum", description: "den Nationalpark, wo die Erde so heiss ist, dass sich Papier von selbst entzündet" },

  // Medium range (2000-5000km)
  { name: "Svalbard Longyearbyen", lat: 78.2232, lon: 15.6267, preposition: "bis nach", description: "den Ort auf Spitzbergen, wo es verboten ist zu sterben – Leichen verwesen nicht im Permafrost" },
  { name: "Geysir Island", lat: 64.3121, lon: -20.3018, preposition: "bis zum", description: "den Namensgeber aller Geysire – sein Nachbar Strokkur sprudelt alle 5–10 Minuten" },
  { name: "Blaue Lagune Island", lat: 63.8800, lon: -22.4500, preposition: "bis zur", description: "das milchigblaue Abkühlwasser eines Geothermalkraftwerks – heute Luxus-Spa" },
  { name: "Wadi Rum", lat: 29.5833, lon: 35.4167, preposition: "bis zum", description: "die Mars-Landschaft in Jordanien – Filmkulisse für «The Martian», «Star Wars» und «Dune»" },
  { name: "Sokotra", lat: 12.4634, lon: 53.8237, preposition: "bis nach", description: "die Insel mit dem Drachenblutsbaum – 37% der Pflanzen wachsen nirgendwo sonst auf der Erde" },
  { name: "Timbuktu", lat: 16.7666, lon: -3.0026, preposition: "bis nach", description: "die Stadt in Mali mit 700'000 mittelalterlichen Manuskripten" },
  { name: "Nubische Pyramiden", lat: 16.9399, lon: 33.7497, preposition: "bis zu den", description: "die über 200 Pyramiden im Sudan – mehr als in Ägypten, aber fast unbekannt" },
  { name: "Lalibela Felsenkirchen", lat: 12.0320, lon: 39.0474, preposition: "bis zu den", description: "die elf Kirchen in Äthiopien, die komplett aus dem Fels gehauen wurden" },
  { name: "Fes Medina", lat: 34.0547, lon: -4.9998, preposition: "bis zur", description: "das grösste autofreie Stadtgebiet der Welt – seit dem Mittelalter nur Fussgänger und Esel" },
  { name: "Nemrut Dagi", lat: 37.9810, lon: 38.7411, preposition: "bis zum", description: "den Berg in Ostanatolien mit den kolossalen Götterköpfen eines grössenwahnsinnigen Königs" },
  { name: "Karthago", lat: 36.8590, lon: 10.3218, preposition: "bis nach", description: "Roms grössten Rivalen – 146 v. Chr. so gründlich zerstört, dass die Römer Salz streuten" },

  // Long range (5000-10000km)
  { name: "Varanasi Ghats", lat: 25.3176, lon: 82.9739, preposition: "bis zu den", description: "den heiligsten Ort des Hinduismus – hier brennen seit 3'000 Jahren ununterbrochen Feuer" },
  { name: "Sigiriya Sri Lanka", lat: 7.9572, lon: 80.7603, preposition: "bis zur", description: "die Palastfestung auf einem 200 m hohen Monolithen in Sri Lanka" },
  { name: "Bagan Myanmar", lat: 21.1718, lon: 94.8585, preposition: "bis zum", description: "die Ebene mit über 2'000 buddhistischen Tempeln – im 11. Jh. waren es über 10'000" },
  { name: "Ha Long Bucht", lat: 20.9101, lon: 107.1839, preposition: "bis zur", description: "die Bucht mit 1'600 Kalksteininseln – ein Drache soll sie beim Tauchen erschaffen haben" },
  { name: "Borobudur Java", lat: -7.6079, lon: 110.2038, preposition: "bis nach", description: "den grössten buddhistischen Tempel der Welt – 800 Jahre unter Vulkanasche begraben" },
  { name: "Petronas Towers", lat: 3.1579, lon: 101.7119, preposition: "bis zu den", description: "die Zwillingstürme in Kuala Lumpur mit der Skybridge in der 41. Etage" },
  { name: "Okavango Delta", lat: -19.3000, lon: 22.8167, preposition: "bis zum", description: "das grösste Binnendelta der Welt – der Fluss mündet nicht ins Meer, sondern in die Wüste" },
  { name: "Sossusvlei Namibia", lat: -24.7210, lon: 15.3483, preposition: "bis nach", description: "die höchsten Sanddünen der Welt – rot durch Eisenoxid" },
  { name: "Titicacasee", lat: -15.8402, lon: -69.3359, preposition: "bis zum", description: "den höchsten schiffbaren See der Welt auf 3'812 m – mit schwimmenden Schilfinseln" },
  { name: "Salar de Uyuni", lat: -20.1338, lon: -67.4891, preposition: "bis zum", description: "die grösste Salzfläche der Welt – nach Regen spiegelt sie den Himmel perfekt" },
  { name: "Yellowstone Old Faithful", lat: 44.4604, lon: -110.8281, preposition: "bis zum", description: "den Geysir, der so pünktlich ausbricht, dass Ranger die Zeiten im Voraus ankündigen" },
  { name: "Antelope Canyon", lat: 36.8619, lon: -111.3743, preposition: "bis zum", description: "die von Überschwemmungen geschnittene Schlucht – das meistfotografierte Motiv Amerikas" },

  // Very long range (10000-15000km)
  { name: "Zhangjiajie Sandsteinpfeiler", lat: 29.1255, lon: 110.4882, preposition: "bis zu den", description: "die schwebenden Felsen, die als Inspiration für die Berge in «Avatar» dienten" },
  { name: "Terrakotta-Armee Xian", lat: 34.3842, lon: 109.2793, preposition: "bis zur", description: "die 8'000 Tonsoldaten – 1974 zufällig von einem Bauern beim Brunnenbohren entdeckt" },
  { name: "Fushimi Inari Kyoto", lat: 34.9671, lon: 135.7727, preposition: "bis nach", description: "den Schrein mit 10'000 orangeroten Torii-Toren, die sich 4 km den Berg hinaufwinden" },
  { name: "Miyajima Torii-Tor", lat: 34.2964, lon: 132.3194, preposition: "bis zum", description: "das rote Tor, das bei Flut im Meer zu schweben scheint" },
  { name: "Atacama-Wüste", lat: -24.6272, lon: -70.4044, preposition: "bis zur", description: "den trockensten Ort der Erde – hier stehen fast alle grossen Teleskope der Welt" },
  { name: "Perito Moreno Gletscher", lat: -50.4955, lon: -73.1270, preposition: "bis zum", description: "einen der wenigen Gletscher, der trotz Klimawandel wächst – und spektakulär zusammenbricht" },
  { name: "Amazonas bei Manaus", lat: -3.0435, lon: -60.0277, preposition: "bis zum", description: "den Ort, wo zwei Flüsse 10 km nebeneinander fliessen ohne sich zu vermischen" },
  { name: "Monument Valley", lat: 36.9983, lon: -110.0983, preposition: "bis zum", description: "die Western-Filmkulisse im Navajo-Territorium" },

  // Ultra long range (15000-20037km)
  { name: "Twelve Apostles Australien", lat: -38.6634, lon: 143.1051, preposition: "bis zu den", description: "die Felsnadeln an der Great Ocean Road – ursprünglich acht, seit 2005 nur noch sieben" },
  { name: "Bungle Bungle", lat: -17.3831, lon: 128.4028, preposition: "bis zu den", description: "die orange-schwarz gestreiften Sandsteindome in Westaustralien – erst 1983 entdeckt" },
  { name: "Waitomo-Glühwürmchenhöhlen", lat: -38.2630, lon: 175.1066, preposition: "bis zu den", description: "die Höhlen in Neuseeland, wo Millionen leuchtender Larven einen Sternenhimmel imitieren" },
  { name: "Tongariro", lat: -39.2000, lon: 175.5500, preposition: "bis zum", description: "die Vulkanlandschaft, die als Mordor in «Herr der Ringe» diente" },
  { name: "Vanuatu Tanna Vulkan", lat: -19.5233, lon: 169.4350, preposition: "bis zum", description: "einen der zugänglichsten aktiven Vulkane – man spaziert bis an den spuckenden Kraterrand" },
  { name: "Tristan da Cunha", lat: -37.1050, lon: -12.2783, preposition: "bis nach", description: "die abgelegenste bewohnte Insel der Welt – 250 Einwohner, acht Nachnamen" },
  { name: "Bouvetøya", lat: -54.4208, lon: 3.3464, preposition: "bis zur", description: "die einsamste Insel der Welt – der nächste Kontinent liegt 1'700 km entfernt" },
  { name: "Campbell Island", lat: -52.5500, lon: 169.1500, preposition: "bis nach", description: "die Insel mit der reinsten Luft der Erde – CO₂-Referenzwert, weit weg von jeder Industrie" },

  // === Additional 100 destinations ===
// 100-500km from Zurich (15 entries)
  { name: "Mont Blanc", lat: 45.8326, lon: 6.8652, preposition: "bis zum", description: "den höchsten Berg Westeuropas – 4'807 m, und der Tunnel darunter ist 11.6 km lang" },
  { name: "Markusplatz Venedig", lat: 45.4341, lon: 12.3388, preposition: "bis zum", description: "den Platz, der regelmässig überschwemmt wird – Gummistiefel sind hier Modeaccessoire" },
  { name: "Strassburger Münster", lat: 48.5818, lon: 7.7510, preposition: "bis zum", description: "die Kathedrale, die 227 Jahre lang das höchste Gebäude der Welt war" },
  { name: "Schloss Versailles", lat: 48.8049, lon: 2.1204, preposition: "bis zum", description: "das Schloss mit 2'300 Räumen – die Spiegelgalerie hat 357 Spiegel" },
  { name: "Miniatur Wunderland Hamburg", lat: 53.5437, lon: 9.9888, preposition: "bis zum", description: "die grösste Modelleisenbahn der Welt – über 1'000 Züge auf 16 km Gleisen" },
  { name: "Keukenhof", lat: 52.2697, lon: 4.5462, preposition: "bis zum", description: "den grössten Blumengarten der Welt bei Amsterdam – 7 Millionen Tulpen pro Saison" },
  { name: "Basteibrücke Sächsische Schweiz", lat: 50.9626, lon: 14.0731, preposition: "bis zur", description: "die Brücke über 40 m hohen Sandsteinfelsen – seit 1851 ein Touristenmagnet" },
  { name: "Semmeringbahn", lat: 47.6333, lon: 15.8500, preposition: "bis zur", description: "die erste Gebirgseisenbahn der Welt – 1854 eröffnet und heute UNESCO-Welterbe" },
  { name: "Postojna-Höhle", lat: 45.7828, lon: 14.2044, preposition: "bis zur", description: "die Höhle mit eigenem Eisenbahnnetz – der Grottenolm hier wird bis zu 100 Jahre alt" },
  { name: "Schloss Schönbrunn Wien", lat: 48.1845, lon: 16.3122, preposition: "bis zum", description: "die kaiserliche Sommerresidenz mit dem ältesten Zoo der Welt im Garten" },
  { name: "Cinque Terre", lat: 44.1270, lon: 9.7100, preposition: "bis zu den", description: "die fünf pastellfarbenen Dörfer an der ligurischen Küste – nur zu Fuss oder per Zug erreichbar" },
  { name: "Dolomiten Drei Zinnen", lat: 46.6187, lon: 12.3030, preposition: "bis zu den", description: "die drei markanten Felstürme der Dolomiten – bis zu 2'999 m hoch" },
  { name: "Schwarzwald Kuckucksuhr", lat: 48.1502, lon: 8.2232, preposition: "bis zur", description: "die grösste Kuckucksuhr der Welt in Triberg – der Kuckuck ist so gross wie ein Kind" },
  { name: "Mont-Saint-Michel", lat: 48.6361, lon: -1.5115, preposition: "bis zum", description: "die Klosterinsel in der Normandie – bei Flut eine Insel, bei Ebbe zu Fuss erreichbar" },
  { name: "Mosel Steillagen", lat: 50.1092, lon: 7.0731, preposition: "bis zu den", description: "die steilsten Weinberge Europas – bis zu 65° Neigung, nur per Hand zu bearbeiten" },

  // 500-2000km from Zurich (20 entries)
  { name: "Edinburgh Castle", lat: 55.9486, lon: -3.1999, preposition: "bis zum", description: "die Festung auf einem erloschenen Vulkan – Kanone feuert täglich um 13 Uhr" },
  { name: "Cliffs of Moher", lat: 52.9715, lon: -9.4309, preposition: "bis zu den", description: "die 214 m hohen Klippen an Irlands Westküste – bei klarem Wetter sieht man die Aran-Inseln" },
  { name: "Akropolis-Museum Athen", lat: 37.9685, lon: 23.7284, preposition: "bis zum", description: "das Museum mit Glasboden – man sieht beim Besuch auf die antike Stadt darunter" },
  { name: "Pompeji", lat: 40.7509, lon: 14.4869, preposition: "bis nach", description: "die vom Vesuv 79 n. Chr. verschüttete Stadt – Brotlaibe sind noch erkennbar" },
  { name: "Blaue Moschee Mazar-i-Sharif", lat: 36.7068, lon: 67.1148, preposition: "bis zur", description: "die Moschee, zu der jedes Frühjahr Tausende weisse Tauben pilgern" },
  { name: "Burg Bran Transsilvanien", lat: 45.5150, lon: 25.3672, preposition: "bis zur", description: "das angebliche Schloss von Graf Dracula – Bram Stoker war allerdings nie dort" },
  { name: "Preikestolen", lat: 58.9863, lon: 6.1905, preposition: "bis zum", description: "die flache Felsplattform 604 m über dem Lysefjord – ohne Geländer" },
  { name: "Vatikanische Museen", lat: 41.9065, lon: 12.4536, preposition: "bis zu den", description: "die Museen mit 7 km Korridoren voller Kunst – die Sixtinische Kapelle ist der Höhepunkt" },
  { name: "La Tomatina Buñol", lat: 39.4200, lon: -0.7900, preposition: "bis nach", description: "das Dorf bei Valencia, wo jährlich 150 Tonnen Tomaten geworfen werden" },
  { name: "Färöer-Inseln", lat: 61.8926, lon: -6.9118, preposition: "bis zu den", description: "die 18 Inseln im Nordatlantik – mehr Schafe als Menschen, und der See über dem Meer" },
  { name: "Blue Lagoon Malta", lat: 36.0610, lon: 14.1856, preposition: "bis zur", description: "die winzige Bucht zwischen Comino und Cominotto mit absurd türkisem Wasser" },
  { name: "Plitvicer Bärenhöhle", lat: 44.7635, lon: 15.3610, preposition: "bis zur", description: "die Höhle voller Tropfsteine, die vor 1 Million Jahren entstand" },
  { name: "Tromsø Polarmuseum", lat: 69.6496, lon: 18.9560, preposition: "bis zum", description: "die arktische Stadt, in der die Sonne 69 Tage lang nicht untergeht" },
  { name: "Blaue Grotte Malta", lat: 35.8235, lon: 14.4550, preposition: "bis zur", description: "die Meereshöhle, in der Phosphoreszenz das Wasser neonblau färbt" },
  { name: "Valletta", lat: 35.8989, lon: 14.5146, preposition: "bis nach", description: "die kleinste EU-Hauptstadt – die gesamte Altstadt ist UNESCO-Welterbe" },
  { name: "Plinius' Vulkan Vesuv", lat: 40.8218, lon: 14.4289, preposition: "bis zum", description: "den einzigen aktiven Vulkan auf dem europäischen Festland – 3 Millionen Menschen leben im Schatten" },
  { name: "Geirangerfjord", lat: 62.1048, lon: 7.0949, preposition: "bis zum", description: "den UNESCO-Fjord mit verlassenen Bergbauernhöfen an 250 m hohen Felswänden" },
  { name: "Samarkand Registan", lat: 39.6547, lon: 66.9597, preposition: "bis zum", description: "den legendären Platz an der Seidenstrasse – Timur liess hier die schönsten Mosaike der Welt bauen" },
  { name: "Plovdiv Altstadt", lat: 42.1500, lon: 24.7500, preposition: "bis nach", description: "eine der ältesten durchgehend bewohnten Städte der Welt – seit 6'000 v. Chr." },
  { name: "Lapplands Eishotel", lat: 67.8558, lon: 20.2253, preposition: "bis zum", description: "das Hotel in Schweden, das jeden Winter neu aus Eis gebaut wird – Zimmertemperatur: –5°C" },

  // 2000-5000km from Zurich (20 entries)
  { name: "Göbekli Tepe", lat: 37.2233, lon: 38.9224, preposition: "bis zum", description: "den ältesten Tempel der Menschheit – 7'000 Jahre älter als Stonehenge" },
  { name: "Totes-Meer-Schriftrollen Qumran", lat: 31.7413, lon: 35.4593, preposition: "bis nach", description: "den Fundort der ältesten Bibeltexte – zufällig 1947 von einem Ziegenhirten entdeckt" },
  { name: "Sansibar Stone Town", lat: -6.1622, lon: 39.1921, preposition: "bis nach", description: "die Gewürzinsel mit labyrinthischen Gassen – Geburtsort von Freddie Mercury" },
  { name: "Dogon-Klippen Mali", lat: 14.4000, lon: -3.5667, preposition: "bis zu den", description: "die Klippen, an denen das Volk der Dogon Dörfer in die Felswand gebaut hat" },
  { name: "Damaraland Felsgravuren", lat: -20.4833, lon: 14.5333, preposition: "bis zu den", description: "die über 6'000 Jahre alten Steinritzungen in Namibia – die grösste Sammlung Afrikas" },
  { name: "Derweze Tor zur Hölle", lat: 40.2525, lon: 58.4397, preposition: "bis zum", description: "den Gaskrater in Turkmenistan, der seit 1971 ununterbrochen brennt" },
  { name: "Bukhara Altstadt", lat: 39.7681, lon: 64.4556, preposition: "bis nach", description: "die Stadt an der Seidenstrasse mit dem Poi-Kalon-Komplex – sogar Dschingis Khan verschonte ihn" },
  { name: "Jerash Jordanien", lat: 32.2747, lon: 35.8911, preposition: "bis nach", description: "eine der besterhaltenen römischen Provinzstädte ausserhalb Italiens" },
  { name: "Djemila Algerien", lat: 36.3214, lon: 5.7364, preposition: "bis nach", description: "die römische Ruinenstadt auf 900 m Höhe – eines der besterhaltenen Mosaiken Nordafrikas" },
  { name: "Île de Gorée Senegal", lat: 14.6667, lon: -17.3986, preposition: "bis zur", description: "die Insel vor Dakar – Symbol der Sklaverei mit dem berühmten «Haus der Sklaven»" },
  { name: "Aral-See Schiffsfriedhof", lat: 45.0000, lon: 58.5000, preposition: "bis zum", description: "den ausgetrockneten See in Usbekistan – rostige Schiffe stehen mitten in der Wüste" },
  { name: "Perm-36 Gulag-Museum", lat: 57.6000, lon: 56.5667, preposition: "bis zum", description: "das einzige erhaltene Gulag-Lager Russlands – bis 1987 in Betrieb" },
  { name: "Baalbek Tempel", lat: 34.0068, lon: 36.2039, preposition: "bis zum", description: "die Tempelruinen im Libanon mit dem grössten je verbauten Steinblock – 1'000 Tonnen schwer" },
  { name: "Danakil-Senke Äthiopien", lat: 14.2417, lon: 40.2950, preposition: "bis zur", description: "den heissesten bewohnten Ort der Erde – durchschnittlich 34.4°C, mit Lavaseen und Schwefelfeldern" },
  { name: "Felsenstadt Uplistsikhe", lat: 41.9667, lon: 44.2000, preposition: "bis zur", description: "die 3'000 Jahre alte Höhlenstadt in Georgien – komplett aus dem Fels geschlagen" },
  { name: "Norilsk Russland", lat: 69.3535, lon: 88.2027, preposition: "bis nach", description: "die nördlichste Grossstadt der Welt – im Winter –50°C, für Ausländer bis 2019 gesperrt" },
  { name: "Dallol Äthiopien", lat: 14.2425, lon: 40.2956, preposition: "bis nach", description: "den Ort mit dem höchsten Jahresdurchschnitt der Welt – neongelbe Schwefellandschaften wie auf einem fremden Planeten" },
  { name: "Victoria-See", lat: -1.0667, lon: 33.4167, preposition: "bis zum", description: "den grössten See Afrikas – fast so gross wie Bayern" },
  { name: "Aksum Obelisken", lat: 14.1211, lon: 38.7189, preposition: "bis zu den", description: "die 1'700 Jahre alten Stelen in Äthiopien – eine wurde von Italien geraubt und 2005 zurückgegeben" },
  { name: "Kappadokien Untergrundstadt Derinkuyu", lat: 38.3736, lon: 34.7347, preposition: "bis zur", description: "die unterirdische Stadt für 20'000 Menschen auf 8 Stockwerken – mit Kirche und Weinkeller" },

  // 5000-10000km from Zurich (20 entries)
  { name: "Potala-Palast Lhasa", lat: 29.6525, lon: 91.1172, preposition: "bis zum", description: "die Winterresidenz des Dalai Lama auf 3'700 m – 1'000 Räume und 10'000 Schreine" },
  { name: "Tempel von Khajuraho", lat: 24.8318, lon: 79.9199, preposition: "bis zu den", description: "die Tempel in Indien mit den freizügigsten Skulpturen der Welt – und das auf heiligem Grund" },
  { name: "Tempelstadt Hampi", lat: 15.3350, lon: 76.4600, preposition: "bis nach", description: "die Ruinenstadt mit über 1'600 Relikten – einst reicher als Rom" },
  { name: "Meiji-Schrein Tokio", lat: 35.6764, lon: 139.6993, preposition: "bis zum", description: "den Shinto-Schrein mitten in Tokio – umgeben von 100'000 gespendeten Bäumen" },
  { name: "Nara Hirschpark", lat: 34.6851, lon: 135.8048, preposition: "bis zum", description: "die Stadt in Japan, wo über 1'200 heilige Hirsche frei herumlaufen und sich verbeugen" },
  { name: "Luang Prabang", lat: 19.8856, lon: 102.1347, preposition: "bis nach", description: "die Stadt in Laos, wo jeden Morgen hunderte Mönche barfuss durch die Strassen ziehen" },
  { name: "Banaue Reisterrassen", lat: 16.9167, lon: 121.0500, preposition: "bis zu den", description: "die 2'000 Jahre alten Reisterrassen auf den Philippinen – aneinandergereiht halb so lang wie die Erde" },
  { name: "Prambanan Java", lat: -7.7520, lon: 110.4914, preposition: "bis nach", description: "die grösste hinduistische Tempelanlage Indonesiens – 240 Türme in konzentrischen Ringen" },
  { name: "Banff Nationalpark", lat: 51.4968, lon: -115.9281, preposition: "bis zum", description: "den ältesten Nationalpark Kanadas – türkise Seen, die ihre Farbe von Gletschermehl bekommen" },
  { name: "Niagara-on-the-Lake", lat: 43.2551, lon: -79.0715, preposition: "bis nach", description: "das charmante Weinbaudorf direkt neben den tosenden Niagarafällen – berühmt für Eiswein" },
  { name: "Denali Alaska", lat: 63.0692, lon: -151.0070, preposition: "bis zum", description: "den höchsten Berg Nordamerikas – 6'190 m, und die Basis-zu-Gipfel-Höhe übertrifft den Everest" },
  { name: "Teotihuacán Mexiko", lat: 19.6925, lon: -98.8438, preposition: "bis nach", description: "die Pyramidenstadt, die schon die Azteken als Ruine vorfanden – niemand weiss, wer sie baute" },
  { name: "Havanna Malecón", lat: 23.1451, lon: -82.3590, preposition: "bis zum", description: "die 8 km lange Uferpromenade in Kubas Hauptstadt – mit Oldtimern aus den 1950ern" },
  { name: "Cartagena Altstadt", lat: 10.3910, lon: -75.5144, preposition: "bis nach", description: "die karibische Festungsstadt in Kolumbien – Gabriel García Márquez' Lieblingskulisse" },
  { name: "Galerie der Nacht Kolmanskop", lat: -26.7033, lon: 15.2278, preposition: "bis nach", description: "die Geisterstadt in Namibia, wo Wüstensand durch die Fenster ehemaliger Diamantenhäuser weht" },
  { name: "Krüger-Nationalpark", lat: -23.9884, lon: 31.5547, preposition: "bis zum", description: "Südafrikas grösstes Wildreservat – fast so gross wie die Schweiz, mit den Big Five" },
  { name: "Mekong-Delta", lat: 10.0341, lon: 105.7222, preposition: "bis zum", description: "das Flusslabyrinth in Vietnam mit schwimmenden Märkten, auf denen vom Boot aus gehandelt wird" },
  { name: "Shirakawa-gō", lat: 36.2558, lon: 136.9056, preposition: "bis nach", description: "das japanische Dorf mit steilen Strohdächern – die Häuser halten meterhoch Schnee aus" },
  { name: "Jiuzhaigou-Tal", lat: 33.2600, lon: 103.9200, preposition: "bis zum", description: "das Tal in China mit über 100 bunten Seen – das Wasser schimmert in 5 verschiedenen Farben" },
  { name: "Socotra Drachenblutbaum", lat: 12.5158, lon: 54.0583, preposition: "bis zum", description: "den Baum, der aussieht wie ein umgedrehter Regenschirm – sein roter Saft galt als Drachenblut" },

  // 10000-15000km from Zurich (15 entries)
  { name: "Nazca-Linien", lat: -14.7350, lon: -75.1300, preposition: "bis zu den", description: "die riesigen Bodenzeichnungen in Peru – nur aus der Luft erkennbar, bis zu 200 m gross" },
  { name: "Isla de los Muñecos Mexiko", lat: 19.2886, lon: -99.0903, preposition: "bis zur", description: "die Insel der Puppen bei Mexiko-Stadt – Hunderte verstümmelte Puppen hängen in den Bäumen" },
  { name: "Coober Pedy", lat: -29.0135, lon: 134.7544, preposition: "bis nach", description: "die australische Opalstadt, wo die Bewohner wegen der Hitze unterirdisch leben – Kirchen inklusive" },
  { name: "Moai-Steinbruch Rano Raraku", lat: -27.1256, lon: -109.3117, preposition: "bis zum", description: "die Werkstatt der Moai – 397 unfertige Statuen stecken noch im Vulkanfels" },
  { name: "Salto Ángel Venezuela", lat: 5.9701, lon: -62.5362, preposition: "bis zum", description: "den höchsten Wasserfall der Welt – 979 m, das Wasser verdunstet teilweise bevor es unten ankommt" },
  { name: "Galápagos Tortuga Bay", lat: -0.7680, lon: -90.3233, preposition: "bis zur", description: "den Strand, wo Meeresiguane neben Touristen sonnenbaden – ohne jede Scheu" },
  { name: "Titikaka Isla del Sol", lat: -16.0167, lon: -69.1667, preposition: "bis zur", description: "die heilige Insel der Inka – laut Legende Geburtsort der Sonne" },
  { name: "Ushuaia", lat: -54.8019, lon: -68.3030, preposition: "bis nach", description: "die südlichste Stadt der Welt – Startpunkt für Antarktis-Expeditionen" },
  { name: "Bonneville Salt Flats", lat: 40.7577, lon: -113.8908, preposition: "bis zu den", description: "die Salzebene in Utah, wo Landgeschwindigkeitsrekorde gebrochen werden – über 1'000 km/h" },
  { name: "Fly Geyser Nevada", lat: 40.8594, lon: -119.3319, preposition: "bis zum", description: "den versehentlich 1964 erschaffenen Geysir – Algen färben ihn in surreale Neonfarben" },
  { name: "Door to Hell Turkmenistan", lat: 40.2528, lon: 58.4397, preposition: "bis zum", description: "den brennenden Gaskrater in der Karakum-Wüste – seit über 50 Jahren in Flammen" },
  { name: "Hang Sơn Đoòng Vietnam", lat: 17.5433, lon: 106.1453, preposition: "bis zur", description: "die grösste Höhle der Welt – so gross, dass ein Jumbo-Jet hineinpassen würde" },
  { name: "Raja Ampat Indonesien", lat: -0.2300, lon: 130.5167, preposition: "bis nach", description: "das Tauchparadies mit der grössten Artenvielfalt der Meere – 75% aller bekannten Korallenarten" },
  { name: "Lake Hillier Australien", lat: -34.0944, lon: 123.2030, preposition: "bis zum", description: "den See in Westaustralien, der knallrosa ist – und niemand weiss genau warum" },
  { name: "Spotted Lake Kanada", lat: 49.0786, lon: -119.5692, preposition: "bis zum", description: "den See in British Columbia, der im Sommer in bunte Flecken aus Mineralien zerfällt" },

  // 15000-20037km from Zurich (10 entries)
  { name: "Milford Sound", lat: -44.6414, lon: 167.8975, preposition: "bis zum", description: "den neuseeländischen Fjord, den Rudyard Kipling das «achte Weltwunder» nannte" },
  { name: "Hobbiton Matamata", lat: -37.8722, lon: 175.6836, preposition: "bis nach", description: "das echte Auenland aus «Herr der Ringe» – 44 Hobbithöhlen stehen noch" },
  { name: "Rotorua Geothermal", lat: -38.1368, lon: 176.2497, preposition: "bis nach", description: "die Stadt, die nach Schwefel riecht – kochende Schlammpools mitten im Stadtpark" },
  { name: "Abel Tasman Nationalpark", lat: -40.8500, lon: 173.0000, preposition: "bis zum", description: "den kleinsten Nationalpark Neuseelands – goldene Strände und Robbenkolonien" },
  { name: "Franz-Josef-Gletscher NZ", lat: -43.3881, lon: 170.1833, preposition: "bis zum", description: "den Gletscher, der fast bis zum Regenwald hinunterreicht – einer der steilsten der Welt" },
  { name: "Tasmanien Cradle Mountain", lat: -41.6500, lon: 145.9500, preposition: "bis zum", description: "den Berg auf Tasmanien, wo der Tasmanische Teufel noch in freier Wildbahn lebt" },
  { name: "Tonga Schwimmen mit Walen", lat: -18.6500, lon: -174.0000, preposition: "bis nach", description: "eines der wenigen Länder, wo man legal mit Buckelwalen schnorcheln darf" },
  { name: "Rarotonga Cookinseln", lat: -21.2367, lon: -159.7667, preposition: "bis nach", description: "die winzige Insel im Südpazifik – eine Busrunde dauert 50 Minuten, es gibt keinen Stau" },
  { name: "Pitcairn-Inseln", lat: -25.0667, lon: -130.1000, preposition: "bis zu den", description: "die Heimat der Nachfahren der Bounty-Meuterer – 50 Einwohner, eine der kleinsten Demokratien der Welt" },
  { name: "McMurdo-Station Antarktis", lat: -77.8419, lon: 166.6863, preposition: "bis zur", description: "die grösste Forschungsstation der Antarktis – mit eigenem Geldautomaten und Bowlingbahn" },
];

/* ------------------------------------------------------------------ */
/*  Haversine distance calculation                                     */
/* ------------------------------------------------------------------ */

const EARTH_RADIUS = 6371.0088;
const EARTH_CIRC = 40075;
const MAX_RING = 20037.5;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}

/* ------------------------------------------------------------------ */
/*  Distance regime calculation                                        */
/* ------------------------------------------------------------------ */

export type Regime = "NORMAL" | "PAST_ANTIPODE" | "WORLD_LAPS";

export interface DistanceResult {
  totalKm: number;
  effectiveTarget: number;
  laps: number;
  regime: Regime;
  pastAntipode: boolean;
}

export function calculateRegime(totalKm: number): DistanceResult {
  const laps = Math.floor(totalKm / EARTH_CIRC);
  const rest = totalKm % EARTH_CIRC;
  let effectiveTarget: number;
  let pastAntipode = false;

  if (rest <= MAX_RING) {
    effectiveTarget = rest;
  } else {
    effectiveTarget = EARTH_CIRC - rest;
    pastAntipode = true;
  }

  let regime: Regime;
  if (laps >= 1) {
    regime = "WORLD_LAPS";
  } else if (pastAntipode) {
    regime = "PAST_ANTIPODE";
  } else {
    regime = "NORMAL";
  }

  return { totalKm, effectiveTarget, laps, regime, pastAntipode };
}

/* ------------------------------------------------------------------ */
/*  Find best matching destination                                     */
/* ------------------------------------------------------------------ */

export interface MatchResult {
  destination: Destination;
  actualDistance: number;
  deviation: number;
  regime: Regime;
  laps: number;
  sentence: string;
}

export function findDestination(
  fromLat: number,
  fromLon: number,
  totalKm: number,
  companyName: string
): MatchResult | null {
  if (totalKm < 1) return null;

  const { effectiveTarget, laps, regime } = calculateRegime(totalKm);

  // Find best match
  let bestMatch: { dest: Destination; dist: number; dev: number } | null = null;

  for (const dest of DESTINATIONS) {
    const dist = haversine(fromLat, fromLon, dest.lat, dest.lon);
    const dev = Math.abs(dist - effectiveTarget);

    if (!bestMatch || dev < bestMatch.dev) {
      bestMatch = { dest, dist, dev };
    }
  }

  if (!bestMatch) return null;

  // Determine qualifier: "fast" if shorter, "weiter als" if longer
  const d = bestMatch.dest;
  const isShort = effectiveTarget < bestMatch.dist;
  const isLong = effectiveTarget > bestMatch.dist;
  const qualifier = isShort ? "fast " : isLong ? "weiter als " : "";

  let sentence: string;

  if (regime === "NORMAL") {
    sentence = `Wow! ${companyName} ist ${qualifier}${d.preposition} ${d.name} geradelt – ${d.description}.`;
  } else if (regime === "PAST_ANTIPODE") {
    sentence = `Unglaublich! ${companyName} ist am entferntesten Punkt der Erde vorbeigeradelt und auf der Rückseite des Planeten ${qualifier}${d.preposition} ${d.name} gerollt – ${d.description}.`;
  } else {
    sentence = `Wahnsinn! ${companyName} ist ${laps}× um die Welt geradelt und dann noch ${qualifier}${d.preposition} ${d.name} – ${d.description}.`;
  }

  return {
    destination: d,
    actualDistance: Math.round(bestMatch.dist),
    deviation: Math.round(bestMatch.dev),
    regime,
    laps,
    sentence,
  };
}

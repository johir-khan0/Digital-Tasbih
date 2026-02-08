export interface TasbihState {
  count: number;
  totalCount: number;
  currentCycle: number;
  maxInCycle: number;
  tasbihName: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  count: number;
  timestamp: number;
}

export enum TasbihType {
  SUBHANALLAH = 'SubhanAllah (سُبْحَانَ اللَّهِ)',
  ALHAMDULILLAH = 'Alhamdulillah (الْحَمْدُ لِلَّهِ)',
  ALLAHUAKBAR = 'Allahu Akbar (اللَّهُ أَكْبَرُ)',
  LA_ILAHA_ILLALLAH = 'La ilaha illallah (لَا إِلٰهَ إِلَّا اللَّهُ)',
  SUBHANALLAHI_WA_BIHAMDIHI = 'SubhanAllahi wa bihamdihi (سُبْحَانَ اللَّهِ وَبِحَمْدِهِ)',
  ASTAGHFIRULLAH = 'Astaghfirullah (أَسْتَغْفِرُ اللَّهَ)',
  LA_HAWLA = 'La hawla wa la quwwata illa billah (لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ)',
  DUROOD = 'Sallallahu Alaihi Wasallam (صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ)',
  SUBHANALLAHI_WA_BIHAMDIHI_AZIM = 'SubhanAllahi wa bihamdihi, SubhanAllahil Azim (سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ)',
  HASBUNALLAHU = 'Hasbunallahu wa nimal wakil (حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ)',
  FOUR_BEST_WORDS = 'SubhanAllah, Alhamdulillah, La ilaha illallah, Allahu Akbar (سُبْحَانَ اللَّهِ ، الْحَمْدُ لِلَّهِ ، لَا إِلٰهَ إِلَّا اللَّهُ ، اللَّهُ أَكْبَرُ)'
}

export interface CycleItem {
  name: string;
  target: number;
  isCustom?: boolean;
}

export interface TasbihCombination {
  id: string;
  title: string;
  description: string;
  reference?: string;
  cycles: CycleItem[];
}

export interface Quote {
  text: string;
  reference: string;
}

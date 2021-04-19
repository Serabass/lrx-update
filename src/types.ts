export interface LRXDocumentTitle {
  title: string;
}

export interface LRXGeneralLineEntry {
  content: string;
}

export interface LRXGeneralLine {
  type: string;
  avgRate: number;
  content: LRXGeneralLineEntry[];
}

export interface LRXDocumentBlock {
  avgRate: number;
  header: {
    title: string;
  };
  body: LRXGeneralLine[];
}

export interface LRXDocument {
  title: LRXDocumentTitle;
  blocks: LRXDocumentBlock[];
}

export interface LRXChordSpace {
  start: string;
  end: string;
}

export interface LRXChord {
  space: LRXChordSpace;
  note: string;
  mod: string;
  suffix: string;
}

export interface LRXChordsLine {
  type: "CHORDS_LINE";
  chords: LRXChord[];
}

export type OnEntryClickedCallback = (entry: LRXGeneralLineEntry) => void;

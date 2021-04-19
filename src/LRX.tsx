import {hot} from "react-hot-loader";
import React from "react";
// @ts-ignore
import parser from './parser.pegjs';
import './lrx.sass';

interface LRXDocument {
    title: LRXDocumentTitle;
    blocks: LRXDocumentBlock[]
}

interface LRXDocumentTitle {
    title: string;
}

interface LRXDocumentBlock {
    header: {
        title: string;
    };
    body: LRXGeneralLine[];
}

interface LRXGeneralLine {
    type: string;
}

interface LRXChordSpace {
    start: string;
    end: string;
}

interface LRXChord {
    space: LRXChordSpace;
    note: string;
    mod: string;
    suffix: string;
}

interface LRXChordsLine {
    type: 'CHORDS_LINE';
    chords: LRXChord[];
}

const LRX = ({contents}: any) => {
    let lrxDoc: LRXDocument = parser.parse(contents.replace(/^\s+/));
    return <pre className="lrx-document">
        <h1>{lrxDoc.title.title}</h1>

        {lrxDoc.blocks.map((block, i) => <LRXBlock block={block} key={i} />)}
    </pre>;
};

export function LRXBlock({block}: { block: LRXDocumentBlock }) {
    return <div className="lrx-block">
        <h3 className="lrx-block-header">[{block.header.title}]</h3>
        {block.body.map((line, i) => <LRXLine line={line} key={i} />)}
    </div>
}

export function LRXLine({line}: { line: LRXGeneralLine }) {
    switch (line.type) {
        case 'EMPTY_LINE':
            return <p />;

        case 'CHORDS_LINE':
            return <LRXChordLine line={line as LRXChordsLine} />;

        case 'LINE':
            return <LRXLyricsLine line={line} />;

        default:
            return <p>UNK: {line.type}</p>
    }
}

export function LRXChordLine({line}: { line: LRXChordsLine }) {
    return <p>
        {line.chords.map((chord, i: number) => <span className="chord" key={i}>
            {chord.space.start}{chord.note}{chord.mod || ''}{chord.suffix || ''}{chord.space.end}
        </span>)}
    </p>
}

export function LRXLyricsLine({line}: any) {
    return <p>
        {line.content.map((entry: any, i: number) => <span key={i}>{entry.content}</span>)}
    </p>
}

export default hot(module)(LRX);

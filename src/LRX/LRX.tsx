import React, { useState } from "react";
import { hot } from "react-hot-loader";
import "./lrx.sass";
import {
  LRXChordsLine,
  LRXDocument,
  LRXGeneralLineEntry
} from "../common/types";
import { LRXBlock } from "./LRXBlock";
import "antd/dist/antd.css";
import { Typography, Affix, Row, Col, Divider } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { Chord } from "./LRXChordLine";
import { createUseLocalStorage } from "../hooks/useLocalStorage";
import { If } from "../common/if";
import { ChordTransposer } from "../chords/chord-transposer";
import { Info } from "../info";

export interface LRXProps {
  doc: LRXDocument;
  audioUrl?: string;
}

let useLocalStorage = createUseLocalStorage("lrx");

function extractChords(doc: LRXDocument) {
  let res: string[] = [];
  debugger;
  let line = doc.blocks.reduce<string[][]>((a, b) => {
    return [
      ...a,
      b.body
        .filter((l) => l.type === "CHORDS_LINE")
        .map((l) =>
          ((l as unknown) as LRXChordsLine).chords.map((chord) => {
            return chord.note + (chord.suffix ?? "") + (chord.mod ?? "");
          })
        )
    ];
  }, []);

  debugger;
  for (let chords of line) {
    for (let chord of chords) {
      for (let el of chord) {
        if (!res.includes(el)) {
          res.push(el);
        }
      }
    }
  }

  return res;
}

const LRX = ({ doc, audioUrl }: LRXProps) => {
  debugger;
  let [transpose, setTranspose] = useLocalStorage<number>("transpose", 0);
  let [activeEntry, setActiveEntry] = useState<LRXGeneralLineEntry>();
  let [currentTime, setCurrentTime] = useState<number>(0);
  let maxRate = Math.max(...doc.blocks.map((b) => b.avgRate));
  let songChords = extractChords(doc);
  debugger;

  let activeReportLines = doc.report.lines.filter(
    (line) => line.n === activeEntry?.bm.n
  );

  return (
    <div className="wrapper">
      <Row>
        <Col md={24}>
          <If condition={!!audioUrl}>
            <audio
              src={audioUrl}
              controls
              style={{
                width: "100%",
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: 9999
              }}
              onTimeUpdate={(e) => {
                setCurrentTime(e.currentTarget.currentTime);
                console.log(e.currentTarget.currentTime);
              }}
            />
          </If>
        </Col>
      </Row>

      <Row>
        <Col md={24}>
          <ErrorBoundary>
            <pre className="lrx-document">
              <div className="lrx-toolbox">
                <ChordTransposer
                  value={transpose}
                  min={-6}
                  max={6}
                  buttonsType="dashed"
                  onValueChanged={(value) => {
                    setTranspose(value);
                  }}
                />
              </div>
              <Divider />
              <Typography.Title level={2}>{doc.title.title}</Typography.Title>

              <div>
                {songChords.map((chord, i) => (
                  <Chord chord={chord} transpose={transpose} key={i} />
                ))}
              </div>

              <div className="lrx-document-wrapper">
                {doc.blocks.map((block, i) => (
                  <LRXBlock
                    maxRate={maxRate}
                    block={block}
                    key={i}
                    transpose={transpose}
                    currentTime={currentTime}
                    activeEntry={activeEntry}
                    onEntryClicked={(entry) => {
                      setActiveEntry(entry);
                    }}
                  />
                ))}
              </div>
              <div className="lrx-document-info">
                <Affix>
                  <Info
                    activeEntry={activeEntry}
                    activeReportLines={activeReportLines}
                  />
                </Affix>
              </div>
            </pre>
          </ErrorBoundary>
        </Col>
      </Row>
    </div>
  );
};

export default hot(module)(LRX);

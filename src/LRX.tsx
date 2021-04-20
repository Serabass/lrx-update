import React, { useState } from "react";
import { hot } from "react-hot-loader";
// @ts-ignore
import parser from "./parser.pegjs";
import "./lrx.sass";
import { LRXDocument, LRXGeneralLineEntry } from "./types";
import { LRXBlock } from "./LRXBlock";
import "antd/dist/antd.css";
import { Info } from "./info";
import { InputNumber, Typography, Affix, Row, Col, Divider } from "antd";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";
import { ChordTransposer } from "./chord-transposer";

export interface LRXProps {
  contents: string;
  audioUrl?: string;
}

const LRX = ({ contents, audioUrl }: LRXProps) => {
  let lrxDoc: LRXDocument = parser.parse(contents.replace(/^\s+/, ""));
  let [transpose, setTranspose] = useState<number>(0);
  let [activeEntry, setActiveEntry] = useState<LRXGeneralLineEntry>();
  let [currentTime, setCurrentTime] = useState<number>(0);

  let activeReportLines = lrxDoc.report.lines.filter(
    (line) => line.n === activeEntry?.bm.n
  );

  return (
    <div className="wrapper">
      <Row>
        <Col>
          {audioUrl ? (
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
          ) : null}
        </Col>
      </Row>

      <Row>
        <Col>
          <ErrorBoundary>
            <pre className="lrx-document">
              <div className="lrx-toolbox">
                <ChordTransposer
                  value={transpose}
                  min={-6}
                  max={6}
                  onValueChanged={() => {}}
                />
              </div>
              <Divider />
              <Typography.Title level={2}>
                {lrxDoc.title.title}
              </Typography.Title>

              <div className="lrx-document-wrapper">
                {lrxDoc.blocks.map((block, i) => (
                  <LRXBlock
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

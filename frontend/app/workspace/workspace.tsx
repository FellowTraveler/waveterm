// Copyright 2024, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { ModalsRenderer } from "@/app/modals/modalsrenderer";
import { TabBar } from "@/app/tab/tabbar";
import { TabContent } from "@/app/tab/tabcontent";
import { atoms, createBlock } from "@/store/global";
import * as util from "@/util/util";
import * as jotai from "jotai";
import * as React from "react";
import { CenteredDiv } from "../element/quickelems";

import "./workspace.less";

const iconRegex = /^[a-z0-9-]+$/;

const Widgets = React.memo(() => {
    const settingsConfig = jotai.useAtomValue(atoms.settingsConfigAtom);
    const newWidgetModalVisible = React.useState(false);
    const helpWidget: WidgetsConfigType = {
        icon: "circle-question",
        label: "help",
        blockdef: {
            meta: {
                view: "help",
            },
        },
    };
    const showHelp = settingsConfig?.["widget:showhelp"] ?? true;
    const showDivider = settingsConfig?.defaultwidgets?.length > 0 && settingsConfig?.widgets?.length > 0;
    return (
        <div className="workspace-widgets">
            {settingsConfig?.defaultwidgets?.map((data, idx) => <Widget key={`defwidget-${idx}`} widget={data} />)}
            {showDivider ? <div className="widget-divider" /> : null}
            {settingsConfig?.widgets?.map((data, idx) => <Widget key={`widget-${idx}`} widget={data} />)}
            {showHelp ? (
                <>
                    <div className="widget-spacer" />
                    <Widget key="help" widget={helpWidget} />
                </>
            ) : null}
        </div>
    );
});

async function handleWidgetSelect(blockDef: BlockDef) {
    createBlock(blockDef);
}

function isIconValid(icon: string): boolean {
    if (util.isBlank(icon)) {
        return false;
    }
    return icon.match(iconRegex) != null;
}

function getIconClass(icon: string): string {
    if (!isIconValid(icon)) {
        return "fa fa-regular fa-browser fa-fw";
    }
    return `fa fa-solid fa-${icon} fa-fw`;
}

const Widget = React.memo(({ widget }: { widget: WidgetsConfigType }) => {
    return (
        <div
            className="widget"
            onClick={() => handleWidgetSelect(widget.blockdef)}
            title={widget.description || widget.label}
        >
            <div className="widget-icon" style={{ color: widget.color }}>
                <i className={getIconClass(widget.icon)}></i>
            </div>
            {!util.isBlank(widget.label) ? <div className="widget-label">{widget.label}</div> : null}
        </div>
    );
});

const WorkspaceElem = React.memo(() => {
    const windowData = jotai.useAtomValue(atoms.waveWindow);
    const activeTabId = windowData?.activetabid;
    const ws = jotai.useAtomValue(atoms.workspace);

    return (
        <div className="workspace">
            <TabBar key={ws.oid} workspace={ws} />
            <div className="workspace-tabcontent">
                {activeTabId == "" ? (
                    <CenteredDiv>No Active Tab</CenteredDiv>
                ) : (
                    <>
                        <TabContent key={activeTabId} tabId={activeTabId} />
                        <Widgets />
                        <ModalsRenderer />
                    </>
                )}
            </div>
        </div>
    );
});

export { WorkspaceElem as Workspace };

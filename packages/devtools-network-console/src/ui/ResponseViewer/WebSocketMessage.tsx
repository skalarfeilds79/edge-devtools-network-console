// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import JsonView from 'react-json-view';
import { css } from 'glamor';

interface WebSocketMessageProps {
    dir: 'send' | 'recv' | 'status';
    time?: number;
    message: any;
}

export default function WebSocketMessage(props: WebSocketMessageProps) {
    let isStatus = false;
    let arrow;
    let style;
    switch(props.dir) {
        case 'recv':
            arrow = <>&darr;</>;
            style = MESSAGE_STYLE_RECV;
            break;
        case 'send':
            arrow = <>&uarr;</>;
            style = MESSAGE_STYLE_SEND;
            break;
        case 'status':
        default:
            style = MESSAGE_STYLE_STATUS;
            isStatus = true;
            break;
    }

    const [message, kind]: [any, 'obj' | 'text'] = useMemo(() => {
        try {
            return [JSON.parse(props.message), 'obj'];
        }
        catch {
            return [props.message, 'text'];
        }
    }, [props.message]);

    return (
        <div {...style}>
            {!isStatus && <div {...DESCRIPTOR_STYLE}>
                <div {...ARROW_STYLE}>{arrow}</div>
                {(props.time !== undefined) && <div {...TIMER_STYLE}>{props.time}ms</div>}
            </div>}
            <div className="json-view-with-transparent-background">
                {
                    (kind === 'text' ? (
                        <code>
                            {message}
                        </code>
                    ) : (
                        <JsonView
                            src={message}
                            displayDataTypes={false}
                            enableClipboard={false}
                            iconStyle="triangle"
                            theme="shapeshifter:inverted"
                            shouldCollapse={cfp => {
                                return cfp.namespace.length > 1;
                            }}
                            />
                    ))
                }
            </div>
        </div>
    );
}

var MESSAGE_STYLE_BASE = css({
    width: '90%',
    display: 'grid',
    gridTemplateColumns: '85px auto',
    borderRadius: '4px',
    padding: '15px',
    marginTop: '5px',
});

var MESSAGE_STYLE_RECV = css(MESSAGE_STYLE_BASE, {
    alignSelf: 'flex-start',
    backgroundColor: '#dfd',
});

var MESSAGE_STYLE_SEND = css(MESSAGE_STYLE_BASE, {
    alignSelf: 'flex-end',
    backgroundColor: '#ddf',
});

var MESSAGE_STYLE_STATUS = css(MESSAGE_STYLE_BASE, {
    width: '95%',
    backgroundColor: '#ddd',
});

var DESCRIPTOR_STYLE = css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '15px',
});

var TIMER_STYLE = css({
    fontSize: '10px',
});

var ARROW_STYLE = css({
    fontSize: '24px',
    fontWeight: 'bolder',
});

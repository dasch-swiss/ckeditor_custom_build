/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {Command} from '@ckeditor/ckeditor5-core';
import {findAttributeRange} from '@ckeditor/ckeditor5-typing';
import {toMap} from '@ckeditor/ckeditor5-utils';
import getRangeText from './utils.js';

export default class FootnoteCommand extends Command {
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const firstRange = selection.getFirstRange();

        if (firstRange.isCollapsed) {
            if (selection.hasAttribute('footnote')) {
                const attributeValue = selection.getAttribute('footnote');
                const range = findAttributeRange(selection.getFirstPosition(), 'footnote', attributeValue, model);

                this.value = {
                    abbr: '[Footnote]',
                    title: attributeValue,
                    range: range
                };
            } else {
                this.value = null;
            }
        }
        else {
            if (selection.hasAttribute('footnote')) {
                const attributeValue = selection.getAttribute('footnote');
                const range = findAttributeRange(selection.getFirstPosition(), 'footnote', attributeValue, model);

                if (range.containsRange(firstRange, true)) {
                    this.value = {
                        abbr: getRangeText(firstRange),
                        title: attributeValue,
                        range: firstRange
                    };
                } else {
                    this.value = null;
                }
            } else {
                this.value = null;
            }
        }

        this.isEnabled = model.schema.checkAttributeInSelection(selection, 'footnote');
    }


    execute(content) {
        const model = this.editor.model;
        const selection = model.document.selection;

        model.change(writer => {

            if (this.value) {
                const {end: positionAfter} = model.insertContent(
                    writer.createText('[Footnote]', {footnote: content}),
                    this.value.range
                );
                // Put the selection at the end of the inserted footnote.
                writer.setSelection(positionAfter);
            }
            else {
                const lastPosition = selection.getLastPosition();

                // Collect all attributes of the user selection (could be "bold", "italic", etc.)
                const attributes = toMap(selection.getAttributes());

                // Put the new attribute to the map of attributes.
                attributes.set('footnote', content);

                // Inject the new text node with the footnote text with all selection attributes.
                const {end: positionAfter} = model.insertContent(writer.createText('[Footnote]', attributes), lastPosition);

                // Put the selection at the end of the inserted footnote. Using an end of a range returned from
                // insertContent() just in case nodes with the same attributes were merged.
                writer.setSelection(positionAfter);
            }
            writer.removeSelectionAttribute('footnote');
        });
    }
}
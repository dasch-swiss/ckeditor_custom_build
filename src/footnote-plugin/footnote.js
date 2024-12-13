/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import FootnoteEditing from './footnote-editing';
import FootnoteUi from './footnote-ui';

export default class Footnote extends Plugin {
    static get requires() {
        return [ FootnoteEditing, FootnoteUi ];
    }
}
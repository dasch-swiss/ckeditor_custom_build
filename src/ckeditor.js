/**
 * @license Copyright (c) 2014-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough.js';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript.js';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript.js';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock.js';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting.js';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters.js';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials.js';
import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import Footnote from "./footnote-plugin/footnote";

class Editor extends ClassicEditor { }

// Plugins to include in the build.
Editor.builtinPlugins = [
    Autoformat,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    Essentials,
    Heading,
    HorizontalLine,
    Italic,
    Link,
    List,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersEssentials,
    SpecialCharactersMathematical,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableToolbar,
    TextTransformation,
    Underline,
Footnote];

// Editor configuration.
Editor.defaultConfig = {

    toolbar: {
        items: [
            'heading',
            'bold',
            '|',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            '|',
            'removeFormat',
            '|',
            'undo',
            'redo',
            '-',
            'abbreviation',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            'horizontalLine',
            '|',
            'blockQuote',
            'code',
            'codeBlock',
            'insertTable',
            'specialCharacters',
            '|',
            'sourceEditing'],
        shouldNotGroupWhenFull: true
    },
    language: 'en',
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    }
};

export default Editor;

/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */


import {
    ButtonView,
    FocusCycler,
    View,
    submitHandler,
} from '@ckeditor/ckeditor5-ui';
import {FocusTracker, KeystrokeHandler} from '@ckeditor/ckeditor5-utils';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import {Paragraph} from "@ckeditor/ckeditor5-paragraph";
import {List} from "@ckeditor/ckeditor5-list";
import {Essentials} from "@ckeditor/ckeditor5-essentials";
import {Bold, Italic} from '@ckeditor/ckeditor5-basic-styles';
import {Heading} from '@ckeditor/ckeditor5-heading';
import {icons} from '@ckeditor/ckeditor5-core';

export default class FormView extends View {
    constructor(locale) {
        super(locale);

        this.focusTracker = new FocusTracker();
        this.keystrokes = new KeystrokeHandler();

        this.contentEditor = null;

        this.saveButtonView = this._createButton('Save', icons.check, 'ck-button-save');
        this.saveButtonView.type = 'submit';

        this.cancelButtonView = this._createButton('Cancel', icons.cancel, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        this.childViews = this.createCollection([
            this.saveButtonView,
            this.cancelButtonView
        ]);

        this._focusCycler = new FocusCycler({
            focusables: this.childViews,
            focusTracker: this.focusTracker,
            keystrokeHandler: this.keystrokes,
            actions: {
                focusPrevious: 'shift + tab',
                focusNext: 'tab'
            }
        });

        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ck', 'ck-abbr-form'],
                tabindex: '-1'
            },
            children: [
                {
                    tag: 'div',
                    attributes: {
                        class: 'ck-content-editor'
                    }
                },
                this.saveButtonView,
                this.cancelButtonView
            ]
        });
    }

    render() {
        super.render();

        submitHandler({
            view: this
        });

        this.childViews._items.forEach(view => {
            this.focusTracker.add(view.element);
        });

        this.keystrokes.listenTo(this.element);

        const contentEditorElement = document.createElement('div');
        contentEditorElement.classList.add('ck-content-editor');
        this.element.appendChild(contentEditorElement);


        console.log('created', contentEditorElement);
        ClassicEditor.create(contentEditorElement, {
            plugins: [Essentials, Bold, Italic, Heading, List, Paragraph],
            toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList']
        })
            .then(editor => {
                this.contentEditor = editor;
                console.log('contenteditor', editor);
            })
            .catch(error => {
                console.error(error);
            });
    }

    destroy() {
        super.destroy();

        this.focusTracker.destroy();
        this.keystrokes.destroy();

        if (this.contentEditor) {
            this.contentEditor.destroy();
        }
    }

    focus() {
        if (this.contentEditor) {
            this.contentEditor.editing.view.focus();
        }
    }

    _createButton(label, icon, className) {
        const button = new ButtonView();
        button.set({
            label,
            icon,
            tooltip: true,
            class: className
        });
        return button;
    }
}
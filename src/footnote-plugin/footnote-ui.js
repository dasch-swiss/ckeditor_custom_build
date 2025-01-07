import {Plugin} from '@ckeditor/ckeditor5-core';
import {ButtonView, ContextualBalloon, clickOutsideHandler} from '@ckeditor/ckeditor5-ui';
import FormView from './footnote-view';
import './footnote-style.css';

export default class FootnoteUi extends Plugin {
    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        const editor = this.editor;

        // Create the balloon and the form view.
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();

        editor.ui.componentFactory.add('abbreviation', () => {
            const button = new ButtonView();

            button.label = 'Footnote';
            button.tooltip = true;
            button.withText = true;

            // Show the UI on button click.
            this.listenTo(button, 'execute', () => {
                this._showUI();
            });


            return button;
        });

        // Listen for click events on the editor's view document.
        this.listenTo(editor.editing.view.document, 'click', (evt, data) => {
            const domEvent = data.domEvent;
            const target = domEvent.target;

            if (target.tagName === 'FOOTNOTE') {
                this._showUI();
            }
        });

        editor.editing.view.document.on('keydown', (evt, data) => {
            if (data.keyCode === 39) { // Right arrow key
                const selection = editor.model.document.selection;
                const position = selection.getFirstPosition();
                const node = position.parent._children._nodes[position.parent.childCount -1];

                if (position.isAtEnd) {
                    if (node && node.hasAttribute('abbreviation')) {
                        editor.model.change(writer => {
                            writer.insertText(' ', writer.createPositionAt(position.parent, 'end'));
                        });
                        data.preventDefault();
                    }
                }
            }
        });
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new FormView(editor.locale);

        // Execute the command after clicking the "Save" button.
        this.listenTo(formView, 'submit', () => {
            // Grab values from the abbreviation and content input fields.
            editor.execute('addAbbreviation', formView.contentEditor.getData());

            // Hide the form view after submit.
            this._hideUI();
        });

        // Hide the form view after clicking the "Cancel" button.
        this.listenTo(formView, 'cancel', () => {
            this._hideUI();
        });

        // Hide the form view when clicking outside the balloon.
        clickOutsideHandler({
            emitter: formView,
            activator: () => this._balloon.visibleView === formView && !this._multipleBalloonsOpened(),
            contextElements: [this._balloon.view.element],
            callback: () => {
                this._hideUI();
            }
        });

        formView.keystrokes.set('Esc', (data, cancel) => {
            this._hideUI();
            cancel();
        });

        return formView;
    }

    _multipleBalloonsOpened() {
        const visibleBalloonPanels = document.getElementsByClassName('ck-balloon-panel_visible');
        const filteredBalloonPanels = Array.from(visibleBalloonPanels).filter(element =>
            !element.classList.contains('ck-powered-by-balloon')
        );

        return filteredBalloonPanels.length > 1;
    }

    _showUI() {
        // Check the value of the command.
        const commandValue = this.editor.commands.get('addAbbreviation').value;

        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });


        // Fill the form using the state (value) of the command.
        setTimeout(() => {
            if (commandValue) {
                this.formView.contentEditor.setData(commandValue.title);
            } else {
                this.formView.contentEditor.setData('');
            }
        }, 100);

        this.formView.focus();
    }

    _hideUI() {
        // Clear the input field values and reset the form.
        this.formView.contentEditor.setData('');
        this.formView.element.reset();

        this._balloon.remove(this.formView);

        // Focus the editing view after inserting the abbreviation so the user can start typing the content
        // right away and keep the editor focused.
        this.editor.editing.view.focus();
    }

    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        let target = null;

        // Set a target position by converting view selection range to DOM
        target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

        return {
            target
        };
    }
}
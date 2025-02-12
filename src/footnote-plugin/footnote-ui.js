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

        editor.ui.componentFactory.add('footnote', () => {
            const button = new ButtonView();

            button.label = 'Footnote';
            button.tooltip = true;
            button.withText = true;
            button.icon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <!-- Square Border -->
                <rect x="0" y="-960" width="960" height="960" stroke="black" fill="transparent" stroke-width="100"/>
                <!-- Superscript T and 1 -->
                <text x="120" y="-250" font-family="Arial" font-size="700" fill="black">T</text>
                <text x="600" y="-550" font-family="Arial" font-size="400" fill="black">1</text>
            </svg>`;


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
            const selection = editor.model.document.selection;
            const firstPosition = selection.getFirstPosition();
            const lastPosition = selection.getLastPosition();

            const typingKeys = [32, 65, 67, 68, 70, 73, 74, 75, 76, 77, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 13]; // Space, alphabetic keys, Enter key, etc.
            const eraseKeys = [8, 46]; // Backspace or Delete key

            if (typingKeys.includes(data.keyCode)) {
                const node = firstPosition.parent._children._nodes[firstPosition.index];
                if (node?.hasAttribute('footnote')) {
                    data.preventDefault(); // Prevent writing
                }
            } else if (data.keyCode === 39 && firstPosition.isAtEnd) { // Right arrow key
                const node = firstPosition.parent._children._nodes[firstPosition.parent.childCount - 1];
                if (node.hasAttribute('footnote')) {
                    editor.model.change(writer => {
                        writer.insertText(' ', writer.createPositionAt(firstPosition.parent, 'end'));
                    });
                    data.preventDefault();
                }
            } else if (data.keyCode === 37) { // Left arrow key
                const myNode = firstPosition.parent._children._nodes[0];  // Check the first child for footnote (move left)

                if (firstPosition.isAtStart && myNode?.hasAttribute('footnote')) {
                    editor.model.change(writer => {
                        const startPosition = writer.createPositionAt(firstPosition, 'start');
                        if (startPosition) {
                            writer.insertText(' ', startPosition);
                        }
                    });
                    data.preventDefault();
                }
            }
        });
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new FormView(editor.locale);

        // Execute the command after clicking the "Save" button.
        this.listenTo(formView, 'submit', () => {
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
import { ButtonView, ContextualBalloon, Plugin, clickOutsideHandler } from '@ckeditor/ckeditor5-dev-webpack-plugin';
import FormView from './abbreviationview';
import getRangeText from './utils.js';
// import '../styles.css';

export default class AbbreviationUI extends Plugin {
    static get requires() {
        return [ ContextualBalloon ];
    }

    init() {
        const editor = this.editor;

        // Create the balloon and the form view.
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.formView = this._createFormView();

        editor.ui.componentFactory.add('abbreviation', () => {
            const button = new ButtonView();

            button.label = 'Abbreviation';
            button.tooltip = true;
            button.withText = true;

            // Show the UI on button click.
            this.listenTo(button, 'execute', () => {
                this._showUI();
            });

            return button;
        });
    }

    _createFormView() {
        const editor = this.editor;
        const formView = new FormView(editor.locale);

        // Execute the command after clicking the "Save" button.
        this.listenTo(formView, 'submit', () => {
            // Grab values from the abbreviation and content input fields.
            const value = {
                abbr: formView.abbrInputView.fieldView.element.value,
                content: formView.contentEditor.getData()
            };
            editor.execute('addAbbreviation', value);

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
            activator: () => this._balloon.visibleView === formView,
            contextElements: [this._balloon.view.element],
            callback: () => this._hideUI()
        });

        formView.keystrokes.set('Esc', (data, cancel) => {
            this._hideUI();
            cancel();
        });

        return formView;
    }

    _showUI() {
        const selection = this.editor.model.document.selection;

        // Check the value of the command.
        const commandValue = this.editor.commands.get('addAbbreviation').value;

        this._balloon.add({
            view: this.formView,
            position: this._getBalloonPositionData()
        });

        // Disable the input when the selection is not collapsed.
        this.formView.abbrInputView.isEnabled = selection.getFirstRange().isCollapsed;

        // Fill the form using the state (value) of the command.
        if (commandValue) {
            this.formView.abbrInputView.fieldView.value = commandValue.abbr;
            setTimeout(() => {
            this.formView.contentEditor.setData(commandValue.title);
            }, 100);
        } else {
            const selectedText = getRangeText(selection.getFirstRange());

            this.formView.abbrInputView.fieldView.value = selectedText;
            this.formView.contentEditor.setData('');
        }

        this.formView.focus();
    }

    _hideUI() {
        // Clear the input field values and reset the form.
        this.formView.abbrInputView.fieldView.value = '';
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
/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import FootnoteCommand from './footnote-command';
import {escapeHtml, unescapeHtml} from "./encoding";

export default class FootnoteEditing extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add(
            'addAbbreviation', new FootnoteCommand( this.editor )
        );
    }
    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.extend( '$text', {
            allowAttributes: [ 'footnote' ]
        } );
    }
    _defineConverters() {
        const conversion = this.editor.conversion;

        // Conversion from a model attribute to a view element
        conversion.for( 'downcast' ).attributeToElement( {
            model: 'footnote',

            // Callback function provides access to the model attribute value
            // and the DowncastWriter
            view: ( modelAttributeValue, conversionApi ) => {
                const { writer } = conversionApi;
                return writer.createAttributeElement( 'footnote', {
                    g
                    content: modelAttributeValue ? escapeHtml(modelAttributeValue) : null
                } );
            }
        } );

        // Conversion from a view element to a model attribute
        conversion.for( 'upcast' ).elementToAttribute( {
            view: {
                name: 'footnote',
                attributes: [ 'content' ]
            },
            model: {
                key: 'footnote',

                // Callback function provides access to the view element
                value: viewElement => {
                    return unescapeHtml(viewElement.getAttribute( 'content' ));
                }
            }
        } );
    }
}
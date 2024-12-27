/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import AbbreviationCommand from './abbreviationcommand';

export default class AbbreviationEditing extends Plugin {
    init() {
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add(
            'addAbbreviation', new AbbreviationCommand( this.editor )
        );
    }
    _defineSchema() {
        const schema = this.editor.model.schema;

        // Extend the text node's schema to accept the abbreviation attribute.
        schema.extend( '$text', {
            allowAttributes: [ 'abbreviation' ]
        } );
    }
    _defineConverters() {
        const conversion = this.editor.conversion;

        // Conversion from a model attribute to a view element
        conversion.for( 'downcast' ).attributeToElement( {
            model: 'abbreviation',

            // Callback function provides access to the model attribute value
            // and the DowncastWriter
            view: ( modelAttributeValue, conversionApi ) => {
                const { writer } = conversionApi;
                console.log('julien downcast', modelAttributeValue);
                return writer.createAttributeElement( 'abbr', {
                    content: modelAttributeValue
                } );
            }
        } );

        // Conversion from a view element to a model attribute
        conversion.for( 'upcast' ).elementToAttribute( {
            view: {
                name: 'abbr',
                attributes: [ 'content' ]
            },
            model: {
                key: 'abbreviation',

                // Callback function provides access to the view element
                value: viewElement => {
                    console.log('julien upcast', viewElement.getAttribute('content'));
                    return viewElement.getAttribute( 'content' );
                }
            }
        } );
    }
}
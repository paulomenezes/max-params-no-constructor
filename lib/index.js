/**
 * Originated from https://github.com/eslint/eslint/blob/master/lib/rules/max-params.js
 * @author Ilya Volodin
 * With some updates
 * @fileoverview Detect functions with too many parameters without the constructor
 * @author Paulo
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const astUtils = require('./ast-utils');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
  rules: {
    'max-params-no-constructor': {
      meta: {
        type: 'suggestion',

        docs: {
          description:
            'enforce a maximum number of parameters in function definitions without the constructor',
          category: 'Stylistic Issues',
          recommended: false,
        },

        schema: [
          {
            oneOf: [
              {
                type: 'integer',
                minimum: 0,
              },
              {
                type: 'object',
                properties: {
                  maximum: {
                    type: 'integer',
                    minimum: 0,
                  },
                  max: {
                    type: 'integer',
                    minimum: 0,
                  },
                },
                additionalProperties: false,
              },
            ],
          },
        ],
        messages: {
          exceed: '{{name}} has too many parameters ({{count}}). Maximum allowed is {{max}}.',
        },
      },

      create(context) {
        const sourceCode = context.getSourceCode();
        const option = context.options[0];
        let numParams = 3;

        if (
          typeof option === 'object' &&
          (Object.prototype.hasOwnProperty.call(option, 'maximum') ||
            Object.prototype.hasOwnProperty.call(option, 'max'))
        ) {
          numParams = option.maximum || option.max;
        }

        if (typeof option === 'number') {
          numParams = option;
        }

        /**
         * Checks a function to see if it has too many parameters.
         * @param {ASTNode} node The node to check.
         * @returns {void}
         * @private
         */
        function checkFunction(node) {
          if (node.params.length > numParams && node.parent.kind !== 'constructor') {
            context.report({
              loc: astUtils.getFunctionHeadLoc(node, sourceCode),
              node,
              messageId: 'exceed',
              data: {
                name: astUtils.getFunctionNameWithKind(node),
                count: node.params.length,
                max: numParams,
              },
            });
          }
        }

        return {
          FunctionDeclaration: checkFunction,
          ArrowFunctionExpression: checkFunction,
          FunctionExpression: checkFunction,
        };
      },
    },
  },
};

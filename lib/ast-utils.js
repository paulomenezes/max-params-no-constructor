/**
 * Functions from: https://github.com/eslint/eslint/blob/master/lib/rules/utils/ast-utils.js
 * @fileoverview Common utils for AST.
 * @author Gyandeep Singh
 */

function isNullLiteral(node) {
  return node.type === 'Literal' && node.value === null && !node.regex && !node.bigint;
}

function getStaticStringValue(node) {
  switch (node.type) {
    case 'Literal':
      if (node.value === null) {
        if (isNullLiteral(node)) {
          return String(node.value); // "null"
        }
        if (node.regex) {
          return `/${node.regex.pattern}/${node.regex.flags}`;
        }
        if (node.bigint) {
          return node.bigint;
        }
        // Otherwise, this is an unknown literal. The function will return null.
      } else {
        return String(node.value);
      }
      break;
    case 'TemplateLiteral':
      if (node.expressions.length === 0 && node.quasis.length === 1) {
        return node.quasis[0].value.cooked;
      }
      break;
    // No default
  }

  return null;
}

function getStaticPropertyName(node) {
  let prop;

  switch (node && node.type) {
    case 'ChainExpression':
      return getStaticPropertyName(node.expression);
    case 'Property':
    case 'MethodDefinition':
      prop = node.key;
      break;
    case 'MemberExpression':
      prop = node.property;
      break;
    // No default
  }

  if (prop) {
    if (prop.type === 'Identifier' && !node.computed) {
      return prop.name;
    }
    return getStaticStringValue(prop);
  }

  return null;
}

function getFunctionNameWithKind(node) {
  const { parent } = node;
  const tokens = [];

  if (parent.type === 'MethodDefinition' && parent.static) {
    tokens.push('static');
  }

  if (node.async) {
    tokens.push('async');
  }

  if (node.generator) {
    tokens.push('generator');
  }

  if (node.type === 'ArrowFunctionExpression') {
    tokens.push('arrow', 'function');
  } else if (parent.type === 'Property' || parent.type === 'MethodDefinition') {
    if (parent.kind === 'constructor') {
      return 'constructor';
    }
    if (parent.kind === 'get') {
      tokens.push('getter');
    } else if (parent.kind === 'set') {
      tokens.push('setter');
    } else {
      tokens.push('method');
    }
  } else {
    tokens.push('function');
  }

  if (node.id) {
    tokens.push(`'${node.id.name}'`);
  } else {
    const name = getStaticPropertyName(parent);
    if (name !== null) {
      tokens.push(`'${name}'`);
    }
  }
  return tokens.join(' ');
}

function isOpeningParenToken(token) {
  return token.value === '(' && token.type === 'Punctuator';
}

function isArrowToken(token) {
  return token.value === '=>' && token.type === 'Punctuator';
}

function getOpeningParenOfParams(node, sourceCode) {
  return node.id
    ? sourceCode.getTokenAfter(node.id, isOpeningParenToken)
    : sourceCode.getFirstToken(node, isOpeningParenToken);
}

function getFunctionHeadLoc(node, sourceCode) {
  const { parent } = node;
  let start = null;
  let end = null;

  if (node.type === 'ArrowFunctionExpression') {
    const arrowToken = sourceCode.getTokenBefore(node.body, isArrowToken);
    start = arrowToken.loc.start;
    end = arrowToken.loc.end;
  } else if (parent.type === 'Property' || parent.type === 'MethodDefinition') {
    start = parent.loc.start;
    end = getOpeningParenOfParams(node, sourceCode).loc.start;
  } else {
    start = node.loc.start;
    end = getOpeningParenOfParams(node, sourceCode).loc.start;
  }

  return {
    start: Object.assign({}, start),
    end: Object.assign({}, end),
  };
}

module.exports = {
  getFunctionNameWithKind,
  getFunctionHeadLoc,
};

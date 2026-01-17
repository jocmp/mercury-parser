// This module attempts to square cheerio with jquery
// so that node-specific quirks/features of cheerio
// will also work in the browser. This mostly involves
// shimming a few functions and rewriting the jquery
// constructor so it sandboxes most of its operations
// and doesn't mutate existing dom elements in the page.

import jQuery from 'jquery';

const PARSER_CLASS = 'mercury-parsing-container';
let PARSING_NODE;

jQuery.noConflict();
const $ = (selector, context, rootjQuery, contextOverride = true) => {
  if (contextOverride) {
    if (context && typeof context === 'string') {
      context = PARSING_NODE.find(context);
    } else if (!context) {
      context = PARSING_NODE;
    }
  }

  return new jQuery.fn.init(selector, context, rootjQuery); // eslint-disable-line new-cap
};

// eslint-disable-next-line no-multi-assign
$.fn = $.prototype = jQuery.fn;
jQuery.extend($, jQuery); // copy's trim, extend etc to $

const removeUnusedTags = $node => {
  // remove scripts and stylesheets
  $node.find('script, style, link[rel="stylesheet"]').remove();

  return $node;
};

$.cloneHtml = () => {
  const html = removeUnusedTags($('html', null, null, false).clone());

  return html
    .children()
    .wrap('<div />')
    .wrap('<div />');
};

$.root = () => $('*').first();

$.browser = true;

const isContainer = $node => {
  const el = $node.get(0);
  if (el && el.tagName) {
    return el.tagName.toLowerCase() === 'container';
  }

  return false;
};

$.html = $node => {
  if ($node) {
    // we never want to return a parsing container, only its children
    if (isContainer($node) || isContainer($node.children('container'))) {
      return $node.children('container').html() || $node.html();
    }

    return $('<div>')
      .append($node.eq(0).clone())
      .html();
  }

  const $body = removeUnusedTags($('body', null, null, false).clone());
  const $head = removeUnusedTags($('head', null, null, false).clone());

  if (PARSING_NODE && PARSING_NODE.length > 0) {
    return PARSING_NODE.children().html();
  }

  const html = $('<container />')
    .append($(`<container>${$head.html()}</container>`))
    .append($(`<container>${$body.html()}</container>`))
    .wrap('<container />')
    .parent()
    .html();

  return html;
};

// eslint-disable-next-line no-unused-vars
$.load = (html, opts = {}, returnHtml = false) => {
  if (!html) {
    html = $.cloneHtml();
  } else {
    // Ensure html is a string (handles Buffer from fs.readFileSync)
    if (typeof html !== 'string') {
      html = html.toString ? html.toString() : String(html);
    }
    // For full HTML documents, use DOMParser and append nodes directly to preserve
    // meta tags. jQuery's .html() uses innerHTML which strips meta in body context.
    // For small snippets, use jQuery's .html() to avoid DOMParser overhead.
    const isFullDocument = /<head[\s>]/i.test(html) || /<html[\s>]/i.test(html);
    if (isFullDocument) {
      // eslint-disable-next-line no-undef
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const container = $('<container />');
      const containerEl = container.get(0);
      // Append head elements (meta, title, etc.) as DOM nodes - bypasses innerHTML
      Array.from(doc.head.children).forEach(el => {
        containerEl.appendChild(el.cloneNode(true));
      });
      // Append body children as DOM nodes
      Array.from(doc.body.childNodes).forEach(node => {
        containerEl.appendChild(node.cloneNode(true));
      });
      html = container;
    } else {
      html = $('<container />').html(html);
    }
  }

  PARSING_NODE =
    PARSING_NODE || $(`<div class="${PARSER_CLASS}" style="display:none;" />`);

  // Strip scripts
  html = removeUnusedTags(html);

  // Remove comments
  html
    .find('*')
    .contents()
    .each(function() {
      // eslint-disable-next-line no-undef
      if (this.nodeType === Node.COMMENT_NODE) {
        $(this).remove();
      }
    });

  // Use DOM appendChild instead of .html() to preserve meta tags
  const parsingEl = PARSING_NODE.get(0);
  parsingEl.innerHTML = '';
  parsingEl.appendChild(html.get(0));

  if (returnHtml) return { $, html: html.html() };

  return $;
};

export default $;

/* eslint-env browser */
// Browser shim for cheerio - uses native DOM APIs
// This provides a cheerio-like API for browser use

let PARSING_NODE_HTML = '';

// Helper to convert NodeList to Array
const toArray = nodeList => Array.prototype.slice.call(nodeList);

// Simple wrapper around querySelectorAll that returns a cheerio-like object
function createCheerioWrapper(elements, context) {
  const wrapper = function(selector, ctx) {
    if (typeof selector === 'string') {
      if (selector.startsWith('<')) {
        // Create element from HTML string
        const temp = document.createElement('div');
        temp.innerHTML = selector;
        return createCheerioWrapper(toArray(temp.childNodes), context);
      }
      // Query selector
      const searchContext = ctx || context || document;
      const searchRoot =
        searchContext.nodeType === 1
          ? searchContext
          : searchContext[0] || document;
      const found = toArray(searchRoot.querySelectorAll(selector));
      return createCheerioWrapper(found, context);
    }
    if (selector && selector.nodeType) {
      return createCheerioWrapper([selector], context);
    }
    if (Array.isArray(selector)) {
      return createCheerioWrapper(selector, context);
    }
    return createCheerioWrapper([], context);
  };

  // Array-like properties - use defineProperty since function.length is read-only
  Object.defineProperty(wrapper, 'length', {
    value: elements.length,
    writable: true,
    configurable: true,
  });
  elements.forEach((el, i) => {
    wrapper[i] = el;
  });

  wrapper.get = idx => (idx === undefined ? elements.slice() : elements[idx]);
  wrapper.first = () => createCheerioWrapper(elements.slice(0, 1), context);
  wrapper.last = () => createCheerioWrapper(elements.slice(-1), context);
  wrapper.eq = idx => createCheerioWrapper([elements[idx]], context);

  wrapper.each = function(fn) {
    elements.forEach((el, i) => fn.call(el, i, el));
    return wrapper;
  };

  wrapper.map = function(fn) {
    const result = elements.map((el, i) => fn.call(el, i, el));
    // Cheerio's map returns an object with toArray(), not a plain array
    result.toArray = () => result;
    return result;
  };

  wrapper.filter = function(selector) {
    if (typeof selector === 'function') {
      return createCheerioWrapper(
        elements.filter((el, i) => selector.call(el, i, el)),
        context
      );
    }
    return createCheerioWrapper(
      elements.filter(el => el.matches && el.matches(selector)),
      context
    );
  };

  wrapper.find = function(selector) {
    const found = [];
    elements.forEach(el => {
      if (el.querySelectorAll) {
        found.push(...toArray(el.querySelectorAll(selector)));
      }
    });
    return createCheerioWrapper(found, context);
  };

  wrapper.children = function(selector) {
    const children = [];
    elements.forEach(el => {
      if (el.children) {
        children.push(...toArray(el.children));
      }
    });
    if (selector) {
      return createCheerioWrapper(
        children.filter(el => el.matches && el.matches(selector)),
        context
      );
    }
    return createCheerioWrapper(children, context);
  };

  wrapper.parent = function() {
    const parents = elements
      .map(el => el.parentNode)
      .filter((p, i, arr) => p && arr.indexOf(p) === i);
    return createCheerioWrapper(parents, context);
  };

  wrapper.parents = function(selector) {
    const allParents = [];
    elements.forEach(el => {
      let parent = el.parentNode;
      while (parent && parent !== document) {
        if (!selector || (parent.matches && parent.matches(selector))) {
          if (allParents.indexOf(parent) === -1) {
            allParents.push(parent);
          }
        }
        parent = parent.parentNode;
      }
    });
    return createCheerioWrapper(allParents, context);
  };

  wrapper.closest = function(selector) {
    const closest = [];
    elements.forEach(el => {
      const found = el.closest ? el.closest(selector) : null;
      if (found && closest.indexOf(found) === -1) {
        closest.push(found);
      }
    });
    return createCheerioWrapper(closest, context);
  };

  wrapper.contents = function() {
    const contents = [];
    elements.forEach(el => {
      if (el.childNodes) {
        contents.push(...toArray(el.childNodes));
      }
    });
    return createCheerioWrapper(contents, context);
  };

  wrapper.text = function(val) {
    if (val !== undefined) {
      elements.forEach(el => {
        el.textContent = val;
      });
      return wrapper;
    }
    return elements.map(el => el.textContent || '').join('');
  };

  wrapper.html = function(val) {
    if (val !== undefined) {
      elements.forEach(el => {
        el.innerHTML = val;
      });
      return wrapper;
    }
    if (elements.length === 0) return '';
    return elements[0].innerHTML;
  };

  wrapper.attr = function(name, val) {
    if (val !== undefined) {
      elements.forEach(el => {
        if (el.setAttribute) el.setAttribute(name, val);
      });
      return wrapper;
    }
    if (elements.length === 0) return undefined;
    return elements[0].getAttribute
      ? elements[0].getAttribute(name)
      : undefined;
  };

  wrapper.removeAttr = function(name) {
    elements.forEach(el => {
      if (el.removeAttribute) el.removeAttribute(name);
    });
    return wrapper;
  };

  wrapper.hasClass = function(className) {
    return elements.some(
      el => el.classList && el.classList.contains(className)
    );
  };

  wrapper.addClass = function(className) {
    elements.forEach(el => {
      if (el.classList) el.classList.add(className);
    });
    return wrapper;
  };

  wrapper.removeClass = function(className) {
    elements.forEach(el => {
      if (el.classList) el.classList.remove(className);
    });
    return wrapper;
  };

  wrapper.append = function(content) {
    elements.forEach(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('beforeend', content);
      } else if (content.get) {
        content.get().forEach(child => el.appendChild(child));
      } else if (content.nodeType) {
        el.appendChild(content);
      }
    });
    return wrapper;
  };

  wrapper.prepend = function(content) {
    elements.forEach(el => {
      if (typeof content === 'string') {
        el.insertAdjacentHTML('afterbegin', content);
      } else if (content.get) {
        const first = el.firstChild;
        content.get().forEach(child => el.insertBefore(child, first));
      }
    });
    return wrapper;
  };

  wrapper.remove = function() {
    elements.forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    return wrapper;
  };

  wrapper.replaceWith = function(content) {
    elements.forEach(el => {
      if (el.parentNode) {
        const temp = document.createElement('div');
        temp.innerHTML = typeof content === 'string' ? content : content.html();
        const newNodes = toArray(temp.childNodes);
        newNodes.forEach(node => el.parentNode.insertBefore(node, el));
        el.parentNode.removeChild(el);
      }
    });
    return wrapper;
  };

  wrapper.clone = function() {
    return createCheerioWrapper(
      elements.map(el => el.cloneNode(true)),
      context
    );
  };

  wrapper.is = function(selector) {
    return elements.some(el => el.matches && el.matches(selector));
  };

  wrapper.not = function(selector) {
    return createCheerioWrapper(
      elements.filter(el => !el.matches || !el.matches(selector)),
      context
    );
  };

  wrapper.prev = function() {
    return createCheerioWrapper(
      elements.map(el => el.previousElementSibling).filter(Boolean),
      context
    );
  };

  wrapper.next = function() {
    return createCheerioWrapper(
      elements.map(el => el.nextElementSibling).filter(Boolean),
      context
    );
  };

  wrapper.wrap = function(wrapperHtml) {
    elements.forEach(el => {
      const temp = document.createElement('div');
      temp.innerHTML = wrapperHtml;
      const wrapperEl = temp.firstElementChild;
      if (el.parentNode) {
        el.parentNode.insertBefore(wrapperEl, el);
        wrapperEl.appendChild(el);
      }
    });
    return wrapper;
  };

  return wrapper;
}

// Main $ function - creates the cheerio-like interface
const $ = function(selector, context) {
  return createCheerioWrapper([], document)(selector, context);
};

$.cloneHtml = function() {
  const html = document.documentElement.cloneNode(true);

  // Remove scripts and stylesheets
  toArray(
    html.querySelectorAll('script, style, link[rel="stylesheet"]')
  ).forEach(el => el.remove());

  return $.load(html.outerHTML);
};

$.root = () => createCheerioWrapper([document.documentElement], document);

$.browser = true;

$.html = function($node) {
  if ($node) {
    if ($node.length === 0) return '';
    const el = $node.get(0);
    return el.outerHTML || '';
  }
  return PARSING_NODE_HTML;
};

$.text = function($node) {
  if ($node) {
    return $node.text();
  }
  return document.body ? document.body.textContent : '';
};

// eslint-disable-next-line no-unused-vars
$.load = function(html, opts = {}, isFragment = true) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  PARSING_NODE_HTML = doc.documentElement.outerHTML;

  const rootElements = isFragment
    ? toArray(doc.body.childNodes)
    : [doc.documentElement];

  const loaded$ = function(selector, context) {
    if (typeof selector === 'string') {
      if (selector.startsWith('<')) {
        const temp = document.createElement('div');
        temp.innerHTML = selector;
        return createCheerioWrapper(toArray(temp.childNodes), doc);
      }
      if (selector === ':root' || selector === 'html') {
        return createCheerioWrapper([doc.documentElement], doc);
      }
      const searchRoot = context ? context.get(0) || doc : doc;
      return createCheerioWrapper(
        toArray(searchRoot.querySelectorAll(selector)),
        doc
      );
    }
    if (selector && selector.nodeType) {
      return createCheerioWrapper([selector], doc);
    }
    return createCheerioWrapper(rootElements, doc);
  };

  loaded$.html = function($node) {
    if ($node) {
      if ($node.length === 0) return '';
      const el = $node.get(0);
      return el.outerHTML || '';
    }
    return doc.body ? doc.body.innerHTML : '';
  };

  loaded$.text = function($node) {
    if ($node) {
      return $node.text();
    }
    return doc.body ? doc.body.textContent : '';
  };

  loaded$.root = () => createCheerioWrapper([doc.documentElement], doc);
  loaded$.browser = true;
  loaded$.load = $.load;
  loaded$.cloneHtml = $.cloneHtml;
  loaded$.contains = (container, contained) =>
    container !== contained && container.contains(contained);

  return loaded$;
};

$.contains = (container, contained) =>
  container !== contained && container.contains(contained);

// Named exports for `import * as cheerio from 'cheerio'` usage
export const { load } = $;
export const { contains } = $;

export default $;

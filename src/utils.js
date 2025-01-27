/**
 * Determine the type of a variable/object. Includes "array" and "element" beyond the normal types.
 * @param {Object} obj - The object to determine the type of.
 * @returns {"undefined"|"string"|"number"|"function"|"array"|"element"|"object"|"unknown"} The type of the object.
 */ 
export const objType = function objType(obj) {
  var type = typeof obj;
  if (type === 'undefined')                                 return 'undefined';
  else if (type === 'string' || obj instanceof String)      return 'string';
  else if (type === 'number' || obj instanceof Number)      return 'number';
  else if (type === 'function' || obj instanceof Function)  return 'function';
  else if (!!obj && obj.constructor === Array)              return 'array';
  else if (obj && obj.nodeType === 1)                       return 'element';
  else if (type === 'object')                               return 'object';
  else                                                      return 'unknown';
};


/** 
 * Create an HTML element with optional className, innerHTML, and style.
 * @param {string} tagName - The tag name of the element to create.
 * @param {Object} opt - The options for the element.
 * @param {string} opt.className - The class name of the element.
 * @param {string} opt.innerHTML - The inner HTML of the element.
 * @param {Object} opt.style - The style of the element.
 * @returns {Element} The created element.
 */
export const createElement = function createElement(tagName, opt) {
  var el = document.createElement(tagName);
  if (opt.className)  el.className = opt.className;
  if (opt.innerHTML) {
    el.innerHTML = opt.innerHTML;
    var scripts = el.getElementsByTagName('script');
    for (var i = scripts.length; i-- > 0; null) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
  }
  for (var key in opt.style) {
    el.style[key] = opt.style[key];
  }
  return el;
};


/**
 * Deep-clone a node and preserve contents/properties.
 * @param {Element} node - The node to clone.
 * @param {boolean} javascriptEnabled - Whether to clone script nodes.
 * @returns {Element} The cloned node.
 */
export const cloneNode = function cloneNode(node, javascriptEnabled) {
  // Recursively clone the node.
  var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);
  for (var child = node.firstChild; child; child = child.nextSibling) {
    if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
      clone.appendChild(cloneNode(child, javascriptEnabled));
    }
  }

  if (node.nodeType === 1) {
    // Preserve contents/properties of special nodes.
    if (node.nodeName === 'CANVAS') {
      clone.width = node.width;
      clone.height = node.height;
      clone.getContext('2d').drawImage(node, 0, 0);
    } else if (node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
      clone.value = node.value;
    }

    // Preserve the node's scroll position when it loads.
    clone.addEventListener('load', function() {
      clone.scrollTop = node.scrollTop;
      clone.scrollLeft = node.scrollLeft;
    }, true);
  }

  // Return the cloned node.
  return clone;
}


/**
 * Convert units from px using the conversion value 'k' from jsPDF.  If an object is passed in, the conversion is applied to all properties.
 * @param {number|Object} obj - The value or object to convert.
 * @param {number} k - The conversion value from jsPDF.
 * @returns {number|Object} The converted value or object.
 */
export const unitConvert = function unitConvert(obj, k) {
  if (objType(obj) === 'number') {
    return obj * 72 / 96 / k;
  } else {
    var newObj = {};
    for (var key in obj) {
      newObj[key] = obj[key] * 72 / 96 / k;
    }
    return newObj;
  }
};


/**
 * Convert units to px using the conversion value 'k' from jsPDF.
 * @param {number} val - The value to convert.
 * @param {number} k - The conversion value from jsPDF.
 * @returns {number} The converted value.
 */ 
export const toPx = function toPx(val, k) {
  return Math.floor(val * k / 72 * 96);
}

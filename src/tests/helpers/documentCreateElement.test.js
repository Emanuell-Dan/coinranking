const documentCreateElement = require('../../helpers/documentCreateElement').default;

document.body.innerHTML = '<div id="parent"><h1 id="heading">Lorem Ipsum Heading</h1></div>';
const parent = document.getElementById('parent');
let child;

describe('creates a new HTML element which appends itself to a given parent', () => {
  test('a paragraph with a class and inner html', () => {
    child = documentCreateElement(parent, child, 'p', {class: 'child'}, 'Lorem Ipsum');
    
    expect(child.tagName).toEqual('P');
    expect(child.innerHTML).toEqual('Lorem Ipsum');
    expect(child.classList).toContain('child');
  });

  test('an input with a class and type attributes', () => {
    child = documentCreateElement(parent, child, 'input', {class: 'child', type: 'button'});
    
    expect(child.tagName).toEqual('INPUT');
    expect(child.classList).toContain('child');
    expect(child.type).toEqual('button');
  });

  test('a span with a class, inner html and an event', () => {
    const foo = jest.fn();
    child = documentCreateElement(parent, child, 'span', {class: 'child'}, 'Lorem Ipsum', {type: 'click', listener: foo});
    
    expect(child.tagName).toEqual('SPAN');
    expect(child.classList).toContain('child');
    expect(child.innerHTML).toEqual('Lorem Ipsum');
  });
});

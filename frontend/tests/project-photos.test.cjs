const assert = require('node:assert/strict');
const test = require('node:test');
const loadTs = require('./helpers/load-ts.cjs');

function setup() {
  const readers = [];
  const { PortfolioFormComponent } = loadTs(
    'app/components/portfolio-form/portfolio-form.component.ts',
    { '@angular/core': { Component: () => target => target }, '@angular/forms': {} },
    { FileReader: class { constructor() { readers.push(this); } readAsDataURL() {} } }
  );
  const projects = {
    controls: [{}, {}, {}],
    get length() { return this.controls.length; },
    at(index) { return this.controls[index]; },
    removeAt(index) { this.controls.splice(index, 1); }
  };
  const component = Object.create(PortfolioFormComponent.prototype);
  component.portfolioForm = { get: () => projects };
  component.projectPhotoPreviews = { 0: 'first', 1: 'second', 2: 'third' };
  component.projectPhotoFiles = { 0: { name: 'first' }, 1: { name: 'second' }, 2: { name: 'third' } };
  return { component, readers };
}

test('removing the first project moves its successors and their photos together', () => {
  const { component } = setup();
  component.removeProject(0);
  assert.equal(component.getProjectPhotoPreview(0), 'second');
  assert.equal(component.getProjectPhotoPreview(1), 'third');
  assert.equal(component.getProjectPhotoPreview(2), null);
  assert.equal(component.projectPhotoFiles[0].name, 'second');
  assert.equal(component.projectPhotoFiles[1].name, 'third');
  assert.equal(component.projectPhotoFiles[2], undefined);
});

test('removing the middle project preserves the preceding photo', () => {
  const { component } = setup();
  component.removeProject(1);
  assert.equal(component.getProjectPhotoPreview(0), 'first');
  assert.equal(component.getProjectPhotoPreview(1), 'third');
  assert.equal(component.getProjectPhotoPreview(2), null);
});

test('an image read follows its project when a preceding project is removed', () => {
  const { component, readers } = setup();
  component.onProjectPhotoSelected({ target: { files: [{ type: 'image/png', size: 20 }] } }, 2);
  component.removeProject(0);
  readers[0].onload({ target: { result: 'loaded-third' } });
  assert.equal(component.getProjectPhotoPreview(1), 'loaded-third');
  assert.equal(component.getProjectPhotoPreview(2), null);
});

test('a completed image read cannot restore a deleted project photo', () => {
  const { component, readers } = setup();
  component.onProjectPhotoSelected({ target: { files: [{ type: 'image/png', size: 20 }] } }, 1);
  component.removeProject(1);
  readers[0].onload({ target: { result: 'deleted-photo' } });
  assert.equal(component.getProjectPhotoPreview(1), 'third');
});

test('clearing a photo prevents a pending read from restoring it', () => {
  const { component, readers } = setup();
  component.onProjectPhotoSelected({ target: { files: [{ type: 'image/png', size: 20 }] } }, 1);
  component.removeProjectPhoto(1);
  readers[0].onload({ target: { result: 'cleared-photo' } });
  assert.equal(component.getProjectPhotoPreview(1), null);
});

import Component from '@ember/component';

export default Component.extend({
  init() {
    this._super(...arguments);
    const values = this.get('values');
    if (!Array.isArray(values)) this.set('values', []);
  },
});

/**
 * CSE183 Assignment 3 - Basic
 */
class Templater {
  /**
   * Create a templater
   * @param {string} template - A {{ }} tagged string
   */
  constructor(template) {
    this.template = template;
  }

  /**
   * Apply map to template to generate string
   * @param {object} map Object with propeties matching tags in template
   * @param {boolean} strict Throw an Error if any tags in template are
   *     not found in map
   * @return {string} template with all tags replaced
   * @throws An Error if strict is set and any tags in template are not
   *     found in map
   */
  apply(map, strict) {
    if (this.template==undefined) {
      return this.template;
    }
    let s = this.template;
    let t = '';
    const keys = Object.keys(map);
    for (let i = 0; i<keys.length; i++) {
      const x = '{{' + keys[i] + '}}';
      while (s.search(x)!=-1) {
        s = s.replace(x, map[keys[i]]);
      }
    }
    let x = s.search('{');
    if (strict == true && x!=-1) {
      throw new Error('Missing key');
    } else {
      if (x != -1) {
        while (x != -1) {
          while (s[x]!= '}') {
            t = t + s[x];
            x++;
          }
          t = t + '}} ';
          s = s.replace(t, '');
          x = s.search('{');
        }
      }
      return s;
    }
  }
}

module.exports = Templater;

import assert from 'assert';
import * as cheerio from 'cheerio';

import { scoreNode, scoreParagraph } from './index';

describe('scoreNode(node)', () => {
  it('scores P, LI, SPAN, and PRE using scoreParagraph', () => {
    const $ = cheerio.load('<p><em>Foo</em> bar</p>');
    const node = $('p').first();

    const score = scoreNode(node);
    const pScore = scoreParagraph(node);

    assert.strictEqual(score, pScore);
    assert.strictEqual(score, 0);
  });

  it('scores P, LI, SPAN, and PRE using scoreParagraph', () => {
    const $ = cheerio.load(`
      <p>Lorem ipsum dolor sit amet</p>
    `);
    const node = $('p').first();

    const score = scoreNode(node);
    const pScore = scoreParagraph(node);

    assert.strictEqual(score, pScore);
    assert.strictEqual(score, 1);
  });

  it('scores P, LI, SPAN, and PRE using scoreParagraph', () => {
    const $ = cheerio.load(`
      <p>Lorem ipsum, dolor sit, amet</p>
    `);
    const node = $('p').first();

    const score = scoreNode(node);
    const pScore = scoreParagraph(node);

    assert.strictEqual(score, pScore);
    assert.strictEqual(score, 3);
  });

  it('scores P, LI, SPAN, and PRE using scoreParagraph', () => {
    const $ = cheerio.load(`
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu.</p>
    `);
    const node = $('p').first();

    const score = scoreNode(node);
    const pScore = scoreParagraph(node);

    assert.strictEqual(score, pScore);
    assert.strictEqual(score, 19);
  });

  it('scores divs with 5', () => {
    const $ = cheerio.load(`
      <div>Lorem ipsum, dolor sit, amet</div>
    `);
    const node = $('div').first();

    const score = scoreNode(node);

    assert.strictEqual(score, 5);
  });

  it('scores the blockquote family with 3', () => {
    const $ = cheerio.load(`
      <blockquote>Lorem ipsum, dolor sit, amet</blockquote>
    `);
    const node = $('blockquote').first();

    const score = scoreNode(node);

    assert.strictEqual(score, 3);
  });

  it('scores a form with negative 3', () => {
    const $ = cheerio.load(`
      <form><label>Lorem ipsum, dolor sit, amet</label></form>
    `);
    const node = $('form').first();

    const score = scoreNode(node);

    assert.strictEqual(score, -3);
  });

  it('scores a TH element with negative 5', () => {
    // Wrap th in table structure for valid HTML parsing in Cheerio 1.x
    const $ = cheerio.load(`
      <table><thead><tr><th>Lorem ipsum, dolor sit, amet</th></tr></thead></table>
    `);
    const node = $('th').first();

    const score = scoreNode(node);

    assert.strictEqual(score, -5);
  });
});

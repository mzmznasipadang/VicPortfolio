import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Run the real component with only React's browser hooks and storage substituted.
const require = createRequire(import.meta.url);
const source = readFileSync(new URL('../components/cookie-consent.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source.replaceAll('import.meta.env.BASE_URL', "'/'"), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
}).outputText;

for (const readFails of [true, false]) {
  for (const writeFails of [false, true]) {
    for (const choice of ['Accept', 'Decline']) {
      let visible = false;
      let effect;
      let stored;
      const component = { exports: {} };
      runInNewContext(compiled, {
        exports: component.exports,
        require: (id) => id === 'react' ? {
          useState: () => [visible, (value) => { visible = value; }],
          useEffect: (callback) => { effect = callback; },
        } : id === 'react/jsx-runtime' ? require(id) : { Button: 'button' },
        localStorage: {
          getItem: () => { if (readFails) throw new Error('Storage blocked'); return stored; },
          setItem: (key, value) => { if (writeFails) throw new Error('Storage blocked'); stored = value; },
        },
        requestAnimationFrame: (callback) => { callback(); return 1; },
        cancelAnimationFrame: () => {},
      });
      const render = component.exports.CookieConsent;
      assert.equal(render(), null);
      assert.doesNotThrow(() => effect(), 'Blocked storage reads must show the banner');
      const banner = render();
      assert.ok(banner, 'A visitor without a saved preference must see the banner');
      const buttons = banner.props.children[1].props.children;
      assert.doesNotThrow(() => buttons.find((button) => button.props.children === choice).props.onClick(), 'Blocked storage writes must still dismiss the banner');
      assert.equal(render(), null, `${choice} must dismiss the banner`);
      if (!writeFails) assert.equal(stored, choice === 'Accept' ? 'accepted' : 'declined');
      if (!readFails && !writeFails) {
        effect();
        assert.equal(render(), null, 'A saved choice must keep the banner dismissed');
      }
    }
  }
}
console.log('Consent storage checks passed');

import { defineComponent, h } from 'vue';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const pascal = (name) =>
  name
    .split('-')
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join('');

export function createIcon(name, variants) {
  return defineComponent({
    name: `${pascal(name)}Icon`,
    props: {
      size: { type: [Number, String], default: 24 },
      variant: { type: String, default: 'line' },
      title: { type: String, default: undefined },
    },
    setup(props) {
      return () => {
        const body = variants[props.variant] ?? variants.line;
        return h('svg', {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 1.5,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          width: props.size,
          height: props.size,
          ...(props.title ? { role: 'img', 'aria-label': props.title } : { 'aria-hidden': 'true' }),
          innerHTML: (props.title ? `<title>${esc(props.title)}</title>` : '') + body,
        });
      };
    },
  });
}

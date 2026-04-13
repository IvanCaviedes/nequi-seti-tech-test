/**
 * Prevents Angular change detection from
 * running with certain Web Component callbacks
 */
// eslint-disable-next-line no-underscore-dangle

type CustomWindow = Window & {
  __Zone_disable_customElements?: boolean;
};

(window as CustomWindow).__Zone_disable_customElements = true;

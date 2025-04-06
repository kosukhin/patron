customElements.define(
  "link-dynamic",
  class extends HTMLElement {
    constructor() {
      super();
      const href = this.getAttribute("href");
      const content = this.innerHTML;
      this.innerHTML = `<span class="dynamic-navigation"><a
            class="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-white bg-slate-900"
            href="${href}"
        >${content}</a></span>`;
    }
  },
);

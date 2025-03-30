customElements.define('link-reloadable', class extends HTMLElement {
    constructor() {
        super();
        const href = this.getAttribute('href');
        const target = this.getAttribute('target-blank') !== null ? 'target="_blank"' : '';
        const content = this.innerHTML;
        this.innerHTML = `<a
            class="inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-white bg-slate-900"
            href="${href}"
            ${target}
        >${content}</a>`
    }
});

const template = document.createElement('template');

template.innerHTML = `<style>
@import "/css/bootstrap/bootstrap.min.css";
@import "/css/nav-bar.css";
</style>

<nav class="navbar navbar-expand-lg bg-transparent">
  <div class="container">
    <a class="navbar-brand text-white" href="/">Rule of Thumb</a>
    <button
      type="button"
      class="navbar-toggler text-white border-0"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i data-feather="menu"></i>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
      <div class="navbar-nav">
        <a class="nav-link text-white active" aria-current="page" href="#">Home</a>
        <a class="nav-link text-white" href="#">past trials</a>
        <a class="nav-link text-white" href="#">how it works</a>
        <a class="nav-link text-white" href="#">login / sign up</a>
        <a class="nav-link text-white" href="#"><i data-feather="search"></i></a>
      </div>
    </div>
  </div>
</nav>`;

class NavBar extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get longitude() {
    return this.getAttribute('longitude');
  }

  get latitude() {
    return this.getAttribute('latitude');
  }

  connectedCallback() {
  }
}

window.customElements.define('nav-bar', NavBar);

const itemsWrapperTpl = document.createElement('template');
const itemTpl = document.createElement('template');

itemsWrapperTpl.innerHTML = `
<style>
  @import "/css/bootstrap/bootstrap.min.css";
  @import "/css/custom.css";
</style>

<div class="items-holder flex-column"></div>
`;

class ListCharacters extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(itemsWrapperTpl.content.cloneNode(true));
    this.voteSelected = 0;
    this.svg = {
      up: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>',
      down: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-down"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>'
    };

    this.swapClassName = this.swapClassName.bind(this);
    this.voteButtonOnClick = this.voteButtonOnClick.bind(this);
    this.checkButtonOnClick = this.checkButtonOnClick.bind(this);
  }

  get title() {
    return this.getAttribute('title');
  }

  get data() {
    const xmlHttp = new XMLHttpRequest();
    const url = `http://rule-of-thumb.local/data.php`

    xmlHttp.open('GET', url, false);
    xmlHttp.send(null);

    return JSON.parse(xmlHttp.responseText).data;
  }

  swapClassName(el, className) {
    const index = el.className.indexOf(className);

    if (-1 === index) { // add
      el.className = `${el.className} ${className}`;
    }
    else { // rem
      el.className = el.className.replace(className, '').trim();
    }
  }

  checkButtonOnClick(event) {
    const btn = event.currentTarget;
    this.voteSelected = Number(btn.getAttribute('data-value'));
    this.swapClassName(btn, 'btn-selected');
  }

  voteButtonOnClick(event) {
    const url = `http://rule-of-thumb.local/vote.php`
    console.log('Vote: ', this.voteSelected);
    console.log('Index: ', event.currentTarget.getAttribute('data-index'));

    const data = JSON.stringify({
      "index": 5,
      "vote": 1
    });
    const xhr = new XMLHttpRequest();

    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === this.DONE) {
        console.log(this.responseText);
      }
    });

    xhr.open('POST', url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
  }

  getDaysAgo(dateOrigin) {
    const date_1 = new Date(dateOrigin);
    const date_2 = new Date();
    const difference = date_2.getTime() - date_1.getTime();

    return Math.ceil(difference / (1000 * 3600 * 24));
  }

  createVoteButton (down = false, className = ''){
    const elBtn = document.createElement('button');
    const classNameUp = 'btn btn-up border-radius-0 text-white';
    const classNameDown = 'btn btn-down border-radius-0 text-white';
    const svgStr = down === true ? this.svg.down : this.svg.up;
    const doc = new DOMParser().parseFromString(svgStr, 'application/xml');
    elBtn.className = (down === true ? classNameDown : classNameUp) + ` ${className}`;

    elBtn.appendChild(
      elBtn.ownerDocument.importNode(doc.documentElement, true)
    )

    return elBtn;
  }

  createInfoBar(valueUp, valueDown) {
    const divOuter = document.createElement('div');
    const divUp = document.createElement('div');
    const divDown = document.createElement('div');
    const spanUp = document.createElement('span');
    const spanDown = document.createElement('span');
    const docUp = new DOMParser().parseFromString(this.svg.up, 'application/xml');
    const docDown = new DOMParser().parseFromString(this.svg.down, 'application/xml');

    divOuter.className = 'bar-info d-flex';
    divUp.className = 'up py-2 px-3';
    divDown.className = 'flex-fill py-2 px-3 text-right bg-down';
    spanUp.className = 'ms-2';
    spanDown.className = 'me-2';

    spanUp.innerHTML = `${valueUp}%`;
    divUp.style.cssText = `width: ${valueUp}%;`;
    divUp.appendChild(divUp.ownerDocument.importNode(docUp.documentElement, true));
    divUp.appendChild(spanUp);

    spanDown.innerHTML = `${valueDown}%`;
    divDown.appendChild(spanDown);
    divDown.appendChild(divDown.ownerDocument.importNode(docDown.documentElement, true));

    divOuter.appendChild(divUp);
    divOuter.appendChild(divDown);

    return divOuter;
  }

  createListItem(item, itemIndex) {
    const itemEl = document.createElement('div');
    const image = document.createElement('img');

    itemEl.className = 'list-item text-white mb-4';
    image.onload = (event) => {
      console.log('ITEM LOADED', item);
    };

    itemEl.appendChild(image);

    // Content
    const divContent = document.createElement('div');
    const divLeft = document.createElement('div');
    const divCenter = document.createElement('div');
    const divRight = document.createElement('div');
    const header = document.createElement('h2');
    const pDescription = document.createElement('p');
    const pTimeAgo = document.createElement('p');
    const divActions = document.createElement('div');
    const buttonCheckUp = this.createVoteButton(false, 'mx-1 ms-0');
    const buttonCheckDown = this.createVoteButton(true, 'mx-1');
    const buttonVote = document.createElement('button');

    divLeft.appendChild(item.votes.negative > item.votes.positive
      ? this.createVoteButton(true)
      : this.createVoteButton(false));

    divContent.className = 'content d-flex';
    divLeft.className = 'flex-fill';
    divCenter.className = 'width-40 py-2 px-0';
    divRight.className = 'pt-4 pe-4';
    pTimeAgo.className = 'mb-1 text-right';
    divActions.className = '';
    buttonVote.className = 'btn bg-black border-1 border-radius-0 border-white text-white mx-1 me-0';

    header.innerHTML = item.name;
    pDescription.innerHTML = item.description;
    pTimeAgo.innerHTML = `${this.getDaysAgo(item.lastUpdated)} days ago`;
    buttonVote.innerHTML = 'Vote Now';

    buttonCheckUp.setAttribute('data-value', '1');
    // buttonCheckUp.setAttribute('data-index', itemIndex);
    buttonCheckDown.setAttribute('data-value', '-1');
    buttonVote.setAttribute('data-index', itemIndex);
    buttonCheckUp.addEventListener('click', this.checkButtonOnClick, false);
    buttonCheckDown.addEventListener('click', this.checkButtonOnClick, false);
    buttonVote.addEventListener('click', this.voteButtonOnClick, false);

    divCenter.appendChild(header);
    divCenter.appendChild(pDescription);
    divActions.appendChild(buttonCheckUp);
    divActions.appendChild(buttonCheckDown);
    divActions.appendChild(buttonVote);
    divRight.appendChild(pTimeAgo);
    divRight.appendChild(divActions);

    divContent.appendChild(divLeft);
    divContent.appendChild(divCenter);
    divContent.appendChild(divRight);

    const valueUp = item.votes.positive;
    const valueDown = item.votes.negative;
    const valueTotal = valueUp + valueDown;
    const percentageUp = Math.round((valueUp * 100) / valueTotal);
    const percentageDown = 100 - percentageUp;

    itemEl.appendChild(divContent);
    itemEl.appendChild(this.createInfoBar(percentageUp, percentageDown));
    image.src = `/images/characters/${item.picture}`;

    return itemEl;
  }

  connectedCallback() {
    const data = this.data;
    this.$list = this._shadowRoot.querySelector('.items-holder');

    for (let i = 0; i < data.length; i++) {
      this.$list.appendChild(this.createListItem(data[i], i));
    }
  }
}

window.customElements.define('list-characters', ListCharacters);

import {LitElement, html, css} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';
import {customElement, property} from 'lit/decorators.js';

@customElement('jio-navbar-link')
export class NavbarLink extends LitElement {
  static override styles = css`
.nav-link {
  color: rgba(255, 255, 255, 0.55);
  display: block;
  padding: 0.5em 0;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  text-decoration: none;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
}
.dropdown-item {
  background-color: transparent;
  border: 0;
  clear: both;
  color: #212529;
  display: block;
  font-weight: 400;
  padding: 0.25em 1rem;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
}

.dropdown-item:focus,
.dropdown-item:hover {
  background-color: #cbd3da;
  color: #16181b;
  text-decoration: none;
}

.active {
	color: #fff;
	text-decoration: none;
	background-color: #0070EB;
}


.dropdown-item.active,
.dropdown-item:active {
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
}

  `;

  @property()
  href = "";

  /**
   * Eg plugins.jenkins.io
   */
  @property()
  property = 'https://www.jenkins.io';

  @property()
  class = "";

  @property()
  locationPathname = location.pathname;

  override render() {
    let title;
    // ifDefined only checks defined, not empty
    if (this.title) {
      title = this.title;
    }
    const {isActive, href} = relOrAbsoluteLink(this.href, this.property, this.locationPathname);
    return html`<a class=${`nav-link ${this.class} ${isActive ? "active" : ""}`} title=${ifDefined(title)} href=${href}>
        <slot></slot>
      </a>`;
  }
}

export const relOrAbsoluteLink = (href: string, property: string, locationPathname = location.pathname) => {
  const parsedMenuItem = new URL(href, 'https://www.jenkins.io');
  const parsedPropertyUrl = new URL(property);
  let isActive = false;

  if (parsedPropertyUrl.host === parsedMenuItem.host) {
    // if its one of my properties, then its a relative link
    href = parsedMenuItem.toString().substring(parsedMenuItem.toString().split('/').slice(0, 3).join('/').length);
    if (locationPathname && locationPathname.startsWith(parsedMenuItem.pathname)) {
      isActive = true;
    }
  } else if (parsedPropertyUrl.host !== parsedMenuItem.host) {
    // if its a different property, then full url
    href = parsedMenuItem.toString();
  } else {
    throw new Error(href);
  }
  return {isActive, href};
};

declare global {
  interface HTMLElementTagNameMap {
    'jio-navbar-link': NavbarLink;
  }
}




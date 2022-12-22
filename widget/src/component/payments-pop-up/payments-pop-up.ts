import { PaymentsPopUpCopy, STRING_TEMPLATE_NAME } from "@data/enum/copy";
import { LitElement, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { replaceTemplateInString } from "@util/string";
import { trackEvent } from "@util/fetch";
import { TrackingType } from "@data/enum/tracking";
import { styles } from "./styles";
import CompanyLogoString from "@asset/image/company-logo.png";
import TruckImageString from "@asset/icon/truck.svg";
import CardImageString from "@asset/icon/card.svg";
import PayImageString from "@asset/icon/pay.svg";

@customElement("payments-pop-up")
export class PaymentsPopUp extends LitElement {
  static styles = styles;

  @property({ type: String }) instalmentFeeString!: string;
  @query(".pop-up-content") $popUpContent!: HTMLDivElement;

  connectedCallback() {
    super.connectedCallback();
    trackEvent({ type: TrackingType.popUpOpened });
    window.addEventListener("mouseup", this._handleWindowClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("mouseup", this._handleWindowClick);
  }

  private _handleWindowClick = () => {
    this._emitClose();
  };

  private _handlePopUpClick(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _emitClose = () => {
    trackEvent({ type: TrackingType.popUpClosed });
    this.dispatchEvent(new CustomEvent("close"));
  };

  private _icons = [
    {
      imageUrl: PayImageString,
      altText: PaymentsPopUpCopy.PAY_ALT_TEXT,
    },
    {
      imageUrl: TruckImageString,
      altText: PaymentsPopUpCopy.TRUCK_ALT_TEXT,
    },
    {
      imageUrl: CardImageString,
      altText: PaymentsPopUpCopy.CARD_ALT_TEXT,
    },
  ];

  private get _parsedFooterDescription() {
    return replaceTemplateInString(
      STRING_TEMPLATE_NAME.INSTALMENT_FEE,
      PaymentsPopUpCopy.FOOTER_DESCRIPTION,
      this.instalmentFeeString
    );
  }

  private _renderSteps() {
    return html`<div class="steps-wrapper">
      ${repeat(
        [
          PaymentsPopUpCopy.STEPS_ONE,
          PaymentsPopUpCopy.STEPS_TWO,
          PaymentsPopUpCopy.STEPS_THREE,
        ],
        (stepCopy, index) => {
          return html`<div class="step">
            <p>${stepCopy}</p>
            <img
              class="step-image"
              src=${this._icons[index].imageUrl}
              alt=${this._icons[index].altText}
            />
          </div>`;
        }
      )}
    </div>`;
  }

  render() {
    return html`<div
      class="pop-up-content center"
      @mouseup=${this._handlePopUpClick}
    >
      <div class="headline-container">
        <h3 class="title">${PaymentsPopUpCopy.TITLE}</h3>
        <button
          class="close-button"
          @click=${this._emitClose}
          aria-label=${PaymentsPopUpCopy.CLOSE_BUTTON}
        >
          X
        </button>
      </div>
      ${this._renderSteps()}
      <div>
        <h3 class="title">${PaymentsPopUpCopy.FOOTER_TITLE}</h3>
        <p class="footer-description">${this._parsedFooterDescription}</p>
        <img
          class="logo"
          src=${CompanyLogoString}
          alt=${PaymentsPopUpCopy.LOGO_ALT_TEXT}
        />
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "payments-pop-up": PaymentsPopUp;
  }
}

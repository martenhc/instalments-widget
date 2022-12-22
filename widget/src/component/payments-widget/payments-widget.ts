import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { PaymentsWidgetCopy } from "@data/enum/copy";
import { getCreditAgreements, trackEvent } from "@util/fetch";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { CreditAgreements } from "@data/type/credit-agreement";
import { TrackingType } from "@data/enum/tracking";
import { styles } from "./styles";
import { LOCAL_STORAGE_TRACKING_ITEM_NAME } from "@data/type/tracking";
import "@component/payments-pop-up/payments-pop-up";

@customElement("payments-widget")
export class PaymentsWidget extends LitElement {
  static styles = styles;

  @property({ type: Number }) productPrice!: number;

  @state() _isLoading = true;
  @state() _isMounted = true;
  @state() _isPopUpOpen = false;
  @state() _isOverMaxFinancedAmount = false;
  @state() _creditAgreements: CreditAgreements = [];

  @state() private _selectedAgreementIndex = 0;

  private get _selectedAgreementInstalmentFeeString() {
    return this._creditAgreements[this._selectedAgreementIndex].instalmentFee
      .string;
  }

  private get _selectedInstalmentCount() {
    return this._creditAgreements[this._selectedAgreementIndex].instalmentCount;
  }

  connectedCallback(): void {
    super.connectedCallback();
    trackEvent({
      type: TrackingType.widgetRendered,
      productPrice: this.productPrice,
    });
    this._setOrUpdateCreditAgreements();
    localStorage?.setItem(
      LOCAL_STORAGE_TRACKING_ITEM_NAME,
      `${Date.now()}-${Math.random() * 100}`
    );
  }

  disconnectedCallback(): void {
    trackEvent({ type: TrackingType.widgetRemoved });
    this._isMounted = false;
  }

  updateProductPrice(_productPrice: number) {
    this.productPrice = _productPrice;
    this._setOrUpdateCreditAgreements();
    trackEvent({
      type: TrackingType.productPriceChanged,
      productPrice: this.productPrice,
    });
  }

  private _setOrUpdateCreditAgreements() {
    this._isLoading = true;

    getCreditAgreements(this.productPrice).then((creditAgreements) => {
      // Don't try to trigger renders if the component is not mounted.
      if (!this._isMounted) return;

      this._isOverMaxFinancedAmount =
        creditAgreements[0].maxFinancedAmount.value < this.productPrice;

      this._isLoading = false;
      this._creditAgreements = creditAgreements;
    });
  }

  private _onMoreInfoButtonClick() {
    this._isPopUpOpen = true;
  }

  private _onPopUpClose() {
    this._isPopUpOpen = false;
  }

  private _onSelectChange(event: Event) {
    this._selectedAgreementIndex = parseInt(
      (event.target as HTMLSelectElement).value
    );

    trackEvent({
      type: TrackingType.simulatorInstalmentChanged,
      selectedInstalment: this._selectedInstalmentCount,
    });
  }

  private _renderInstalmentOptions() {
    return html`<select
      aria-label=${PaymentsWidgetCopy.INSTALMENT_SELECT}
      class="instalment-drop-down"
      @change=${this._onSelectChange}
    >
      ${repeat(
        this._creditAgreements,
        (
          {
            instalmentCount,
            instalmentTotal: { string: instalmentTotalString },
          },
          index: number
        ) => {
          return html`<option
            class=${this._selectedAgreementIndex === index ? "selected" : ""}
            value=${index}
          >
            ${instalmentCount} ${PaymentsWidgetCopy.INSTALMENTS_OF}
            ${instalmentTotalString}
          </option>`;
        }
      )}
    </select>`;
  }

  private _renderPopUp() {
    return html`${when(this._isPopUpOpen, () => {
      return html`<payments-pop-up
        .instalmentFeeString=${this._selectedAgreementInstalmentFeeString}
        @close=${this._onPopUpClose}
      ></payments-pop-up>`;
    })}`;
  }

  render() {
    return html`<section class="widget-container">
      ${when(
        this._isLoading,
        function () {
          return html`<h3>${PaymentsWidgetCopy.LOADING}</h3>`;
        },
        () => {
          return when(
            this._isOverMaxFinancedAmount,
            function () {
              return html`<h3 class="value-error">
                ${PaymentsWidgetCopy.VALUE_ERROR}
              </h3>`;
            },
            () => {
              return html`<div>
                <div class="headline">
                  <h3 class="title">${PaymentsWidgetCopy.HEADLINE}</h3>
                  <!-- Making this a button to be semantically correct for screen readers -->
                  <button
                    class="more-info-button"
                    @click=${this._onMoreInfoButtonClick}
                  >
                    ${PaymentsWidgetCopy.MORE_INFO}
                  </button>
                </div>
                ${this._renderInstalmentOptions()} ${this._renderPopUp()}
              </div>`;
            }
          );
        }
      )}
    </section>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "payments-widget": PaymentsWidget;
  }
}

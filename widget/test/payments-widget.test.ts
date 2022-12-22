import { beforeEach, describe, expect, it } from "vitest";
import { waitForElement } from "./util";
import {
  creaditAgreementsMockResponseExpensive,
  creaditAgreementsMockResponseCheap,
} from "./response-mocks";
import "@component/payments-widget/payments-widget";

function getElementInPaymentsWidget(
  selector: string
): () => HTMLElement | null | undefined {
  return () =>
    document.body
      .querySelector("payments-widget")
      ?.shadowRoot?.querySelector(selector);
}

describe("Payments Widget tests", async function () {
  beforeEach(async function () {
    document.body.innerHTML = `<payments-widget productPrice="${creaditAgreementsMockResponseCheap[0].total_with_tax.value}"></payments-widget>`;

    // Wait for the widget to be mounted
    await waitForElement(getElementInPaymentsWidget(".more-info-button"));
  });

  it("should open a 'more-info' pop-up when button is clicked", async function () {
    // We don't need to wait for this button because it's part of the element that we want during beforeEach.
    // This is true for any element inside "payments-widget" from this point on.
    const moreInfoButton = getElementInPaymentsWidget(".more-info-button")();
    moreInfoButton.click();
    const paymentsPopUp = await waitForElement(
      getElementInPaymentsWidget("payments-pop-up")
    );

    expect(!!paymentsPopUp).toBe(true);
  });

  // This is a test derived of the Backend logic.
  it("should have the right amount of options for initial product price", async function () {
    const instalmentSelect = getElementInPaymentsWidget("select")();
    expect(instalmentSelect.children.length).toEqual(
      creaditAgreementsMockResponseCheap.length
    );
  });

  // Idem previous test
  it("should have the right amount of options when product price is updated", async function () {
    const paymentsWidget = document.body.querySelector("payments-widget");
    paymentsWidget.updateProductPrice(
      creaditAgreementsMockResponseExpensive[0].total_with_tax.value
    );

    const select = await waitForElement(getElementInPaymentsWidget("select"));

    expect(select.children.length).toEqual(
      creaditAgreementsMockResponseExpensive.length
    );
  });

  it("should update the select element text when product price changes", async function () {
    const paymentsWidget = document.body.querySelector("payments-widget");

    paymentsWidget.updateProductPrice(
      creaditAgreementsMockResponseExpensive[0].total_with_tax.value
    );

    const select = await waitForElement(getElementInPaymentsWidget("select"));

    const selectText = (
      (select as HTMLSelectElement).options[0] as HTMLOptionElement
    ).text;

    expect(selectText).toContain(
      creaditAgreementsMockResponseExpensive[0].instalment_count
    );
    expect(selectText).toContain(
      creaditAgreementsMockResponseExpensive[0].instalment_total.string
    );
  });

  it("should show error message if value is too high", async function () {
    const paymentsWidget = document.body.querySelector("payments-widget");

    paymentsWidget.updateProductPrice(
      creaditAgreementsMockResponseExpensive[0].max_financed_amount.value + 10
    );

    const errorMessage = await waitForElement(
      getElementInPaymentsWidget(".value-error")
    );

    expect(!!errorMessage).toBe(true);
  });

  it("should trigger change event successfully when value changes", async function () {
    const select = (await waitForElement(
      getElementInPaymentsWidget("select")
    )) as HTMLSelectElement;

    select.value = "1";
    select.dispatchEvent(new Event("change"));

    const selectedOption = (await waitForElement(
      getElementInPaymentsWidget("option.selected")
    )) as HTMLOptionElement;

    expect(selectedOption.value).toEqual("1");
  });
});

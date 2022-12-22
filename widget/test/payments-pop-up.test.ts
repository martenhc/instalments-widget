import { beforeEach, describe, expect, it, vi } from "vitest";
import { creaditAgreementsMockResponseCheap } from "./response-mocks";
import { waitForElement } from "./util";
import { PaymentsPopUpCopy, STRING_TEMPLATE_NAME } from "@data/enum/copy";
import { replaceTemplateInString } from "@util/string";
import "@component/payments-pop-up/payments-pop-up";

function getElementInPaymentsPopUp(
  selector: string
): () => HTMLElement | null | undefined {
  return () =>
    document.body
      .querySelector("payments-pop-up")
      ?.shadowRoot?.querySelector(selector);
}

describe("Payments Pop-Up tests", async function () {
  beforeEach(async function () {
    document.body.innerHTML = `<payments-pop-up
        instalmentFeeString="${creaditAgreementsMockResponseCheap[0].instalment_fee.string}"
      ></payments-pop-up>`;

    // Wait for the pop up to be mounted
    await waitForElement(getElementInPaymentsPopUp(".pop-up-content"));
  });

  it("should render the right fee amount in the footer description", async function () {
    const footerDescriptionText = (
      await waitForElement(getElementInPaymentsPopUp(".footer-description"))
    )?.textContent;

    const expectedText = replaceTemplateInString(
      STRING_TEMPLATE_NAME.INSTALMENT_FEE,
      PaymentsPopUpCopy.FOOTER_DESCRIPTION,
      creaditAgreementsMockResponseCheap[0].instalment_fee.string
    );

    expect(footerDescriptionText).toEqual(expectedText);
  });

  it("should trigger close event", async function () {
    const spyClick = vi.fn();
    const closeButton = await waitForElement(
      getElementInPaymentsPopUp(".close-button")
    );
    const paymentsPopUp = document.body.querySelector("payments-pop-up");

    paymentsPopUp.addEventListener("close", spyClick);
    closeButton.click();

    expect(spyClick).toHaveBeenCalled();
  });

  it("should not close on content area click", async function () {
    const spyClick = vi.fn();
    const popUpElement = await waitForElement(
      getElementInPaymentsPopUp(".pop-up-content")
    );
    const paymentsPopUp = document.body.querySelector("payments-pop-up");

    paymentsPopUp.addEventListener("close", spyClick);
    popUpElement.click();

    expect(spyClick).toHaveBeenCalledTimes(0);
  });
});

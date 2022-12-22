import { fetch } from "cross-fetch";
import { afterAll, afterEach, beforeAll } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";
import {
  creaditAgreementsMockResponseCheap,
  creaditAgreementsMockResponseExpensive,
} from "./response-mocks";
import {
  CreditAgreements,
  CreditAgreementsResponse,
} from "@data/type/credit-agreement";
import { parseObjectArrayVariableNames } from "@util/fetch";

// Add `fetch` polyfill.
global.fetch = fetch;

const restHandlers = [
  rest.get(
    `${import.meta.env.VAR_API_DOMAIN}/credit_agreements`,
    (request, response, context) => {
      const totalWithTax = request.url.searchParams.get("totalWithTax");

      const creaditAgreementsMock =
        parseInt(totalWithTax) ===
        creaditAgreementsMockResponseCheap[0].total_with_tax.value
          ? creaditAgreementsMockResponseCheap
          : creaditAgreementsMockResponseExpensive;

      const parsedResponse = parseObjectArrayVariableNames<
        CreditAgreementsResponse,
        CreditAgreements
      >(creaditAgreementsMock);

      return response(context.status(200), context.json(parsedResponse));
    }
  ),

  rest.post(
    `${import.meta.env.VAR_API_DOMAIN}/events`,
    (_, response, context) => {
      const statusCode =
        Math.floor(Math.random() * 2 + 1) % 2 === 0 ? 200 : 500;

      return response(context.status(statusCode));
    }
  ),
];

const testServer = setupServer(...restHandlers);

// Start testServer before all tests
beforeAll(() => testServer.listen({ onUnhandledRequest: "error" }));

//  Close testServer after all tests
afterAll(() => testServer.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  testServer.resetHandlers();
});

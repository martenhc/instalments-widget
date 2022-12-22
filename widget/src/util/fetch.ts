import EnvVariables from "@data/enum/env-variables";
import {
  CreditAgreementsResponse,
  CreditAgreements,
} from "@data/type/credit-agreement";
import {
  LOCAL_STORAGE_TRACKING_ITEM_NAME,
  TrackingEventData,
} from "@data/type/tracking";
import { convertToCamelCase } from "./string";

// Convert snake_case variable names to camelCase to work with JS standards.
// This is not the case in any of our API responses, but we could make it recursive
// by calling itself should any _currentValue_ be of type object.
export function parseObjectArrayVariableNames<
  InputType extends Array<any>,
  OutputType
>(data: InputType): OutputType {
  return data.reduce(function (accumulatedArray, currentValue) {
    accumulatedArray.push(
      Object.keys(currentValue).reduce(function (
        accumulatedProps,
        currentPropName
      ) {
        const camelCasePropName = convertToCamelCase(currentPropName);
        accumulatedProps[camelCasePropName] = currentValue[currentPropName];

        return accumulatedProps;
      },
      {})
    );

    return accumulatedArray;
  }, []);
}

export async function getCreditAgreements(totalWithTax: number) {
  let response: Response;

  try {
    response = await fetch(
      `${
        import.meta.env[EnvVariables.VAR_API_DOMAIN]
      }/credit_agreements?totalWithTax=${totalWithTax}`
    );
  } catch (error) {
    // Logging _check server_ error message only for test review reasons.
    console.log(
      `Make sure to have the backend service running in ${
        import.meta.env.VAR_API_DOMAIN
      }! ${error}`
    );
  }

  const data: CreditAgreementsResponse = await response.json();

  return parseObjectArrayVariableNames<
    CreditAgreementsResponse,
    CreditAgreements
  >(data);
}

/**
 * Tries to track an event N amount of times before silently failing.
 *
 * @param {TrackingEventData} trackingEventData Event data to be tracked.
 * @param {number} retries Optional. Number of retries. Defaults to 3.
 */
export async function trackEvent(
  trackingEventData: TrackingEventData,
  retries: number = 3
) {
  if (retries === 0) {
    // Uncomment for console logs on failed tracking.
    // console.log("Tracking failed");
    return;
  }

  fetch(`${import.meta.env[EnvVariables.VAR_API_DOMAIN]}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source: window.location.hostname,
      context: "checkoutWidget",
      sessionId: localStorage?.getItem(LOCAL_STORAGE_TRACKING_ITEM_NAME),
      userTime: new Date().toLocaleString("es-ES", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
      ...trackingEventData,
    }),
  })
    .then(function ({ status }) {
      if (status !== 200) {
        retries = retries - 1;
        setTimeout(function () {
          trackEvent(trackingEventData, retries);
        }, 500);
      }
    })
    .catch(function (error) {
      // Logging _check server_ error message only for test review reasons.
      console.log(
        `Make sure to have the backend service running in ${
          import.meta.env.VAR_API_DOMAIN
        }! ${error}`
      );
    });
}

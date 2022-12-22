import { css } from "lit";

export const styles = css`
  :host {
    font-family: "Google Inter Regular", Arial, sans-serif;
    font-size: 1.4rem;
    line-height: 1.7rem;

    /* Colors */
    --brand-color: #4ba18c;
    --black: #000;
    --light-grey: #f8f9f9;
    --translucent-black: #00000050;
    --white: #fff;
  }

  .widget-container {
    background-color: var(--light-grey);
    border: 0.2rem solid;
    border-color: var(--brand-color);
    border-radius: 0.5rem;
    margin: 1.5rem;
    max-width: 32.4rem;
    padding: 1rem 1.5rem;
    width: 100%;
  }

  .headline {
    display: grid;
    grid-template-columns: 70% 30%;
    margin-bottom: 1rem;
  }

  .more-info-button {
    background: none;
    border: none;
    color: var(--brand-color);
    cursor: pointer;
    font-weight: bolder;
    padding: 0;
    text-align: right;
    text-decoration: underline;
  }

  .title {
    margin-block-end: 0rem;
    margin-block-start: 0rem;
  }

  .instalment-drop-down {
    width: 100%;
  }

  .instalment-drop-down:focus {
    outline: 0;
    -webkit-box-shadow: 0px 0px 3px 1px var(--brand-color);
    box-shadow: 0px 0px 3px 1px var(--brand-color);
  }

  .value-error {
    font-size: 1.3rem;
    color: var(--brand-color);
  }
`;

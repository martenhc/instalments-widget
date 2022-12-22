import { css } from "lit";

export const styles = css`
  :host {
    background-color: var(--translucent-black);
    height: 100%;
    left: 0;
    top: 0;
    position: fixed;
    width: 100%;
    z-index: 1;
  }

  .center {
    left: 50%;
    margin: 0;
    position: absolute;
    top: 10%;
    transform: translate(-50%);
  }

  .pop-up-content {
    background-color: var(--white);
    border: solid 0.2rem;
    border-color: var(--brand-color);
    color: var(--black);
    height: 42rem;
    padding: 2rem;
    width: 32rem;
    border-radius: 0.8rem;
  }

  .title {
    color: var(--brand-color);
    margin-block-end: 0rem;
    margin-block-start: 0rem;
  }

  .headline-container {
    display: grid;
    grid-template-columns: 90% 10%;
    margin: 0.5rem 0rem 2rem;
  }

  .close-button {
    background: none;
    border: none;
    color: var(--brand-color);
    cursor: pointer;
    font-weight: bolder;
  }

  .steps-wrapper {
    margin-bottom: 4rem;
  }

  .step {
    align-items: center;
    display: grid;
    grid-template-columns: 76% 24%;
    margin: 1rem 0rem;
    min-height: 6.5rem;
  }

  .step-image {
    margin: auto;
    width: 95%;
  }

  .logo {
    display: block;
    height: 3rem;
    margin: auto;
  }
`;

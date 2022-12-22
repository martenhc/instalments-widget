# Payments widget

# Table of contents

1. [Tech choice](#tech-choice)
2. [Testing setup](#testing-setup)
3. [Widget implementation](#widget-implementation)
4. [How to run this project](#how-to-run-this-project)
5. [Distribution](#distribution)
6. [Relevant scripts](#relevant-scripts)
7. [Environment file](#environment-file)
8. [Notes](#notes)
9. [Improvement possibilities](#improvement-possibilities)

## Tech choice

As the goal of the exercise is to come up with a widget that can be embedded in any site as effortlessly as possible, going for [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) seems like the right way to go mainly due to the **Shadow DOM feature**, which encapsulates our component and prevents collisions with the implementing site.

I used [Lit](https://lit.dev/), since it adds reactivity features to the Web Components, and is [very lightweight](https://blog.logrocket.com/lit-vs-react-comparison-guide/#:~:text=Lit%20has%20a%20minified%20memory,other%20cool%20features%2C%20as%20well.).
You will find that Lit is the only non-dev dependency of this project.

## Testing setup

I am using [Mock Service Worker](https://mswjs.io/) for testing. It is configured to intercept and respond to network requests, so tests can be run without the risk of connecting to an actual API.
MSW setup can be found in the `test` folder's [setup file](https://github.com/martenhc/payments-widget/blob/development/widget/test/setup.ts).

## Widget implementation

**Before we begin!**
Keep in mind that the format of the value to use in the component's `productPrice` attribute and the `updateProductPrice` method is as follows:

- The last two digits are the price's decimals. E.g.: If your product's price is `$450,00`, use `45000`.

**Instructions:**

1. Add a reference to the widget script in the head: `<script type="module" src="./path/to/script/payments-widget.min.js"></script>`. [[example]](https://github.com/martenhc/payments-widget/blob/development/merchant-site/product-page.html#L13)
2. Implement the widget with its initial value where desired: `<payments-widget productPrice="{product_price}"></payments-widget>`, or update the `productPrice` attribute depending on your needs. [[example]](https://github.com/martenhc/payments-widget/blob/development/merchant-site/product-page.html#L76)
3. Handle the product price update by getting a reference to the component and calling the `updateProductPrice` method. [[example]](https://github.com/martenhc/payments-widget/blob/development/merchant-site/main.js#L15)

Here is an example in jQuery:

```javascript
$("payments-widget")[0].updateProductPrice(
  $("{attribute_holder_selector}")[0].attr("data-widget-price")
);
```

...where the relevant component's `data-widget-price` attribute complies with the product price requirements stated above. [<example>](https://github.com/martenhc/payments-widget/blob/development/merchant-site/product-page.html#L52)

Keep in mind that **there is a limit for the amount that can be financed**.
See the [Maximum financed amout](#maximum-financed-amount) section for details.

## How to run this project

You can run the local dev server or the merchant site, which already has the widget implemented.
In any case, you have to make sure that you run the local backend server first.
From this folder:

- `cd ../api`
  - `npm ci` if this is your first time running it.
- `npm run start`

Once that is running:

- Run the frontend dev server. In this folder:

  - `npm ci` if this is the first time you are running it.
  - `npm run dev`

OR

- Run the merchant site. I usually go for a simple PHP server in these cases, but chose the script you like the most. If you are like me and have PHP installed, you can run from this folder:

  - `cd ../merchant-site && php -S localhost:1337`

Remember that the html file is not called `index.html`, so you will have to navigate to `http://localhost:1337/product-page.html`

## Distribution

The script can be delivered directly to the clients, via CDN, or published as a package and served via UNPKG, for example.

## Relevant scripts

- `dev`: Run dev environment.
- `build`: Run tests and build widget. The build configuration will ignore the dev page and only export the `payments-widget` module. **It also exports a gzipped version.**
- `coverage`: Get test code coverage
- `test`: Run tests.

## Environment file

Env configurations contain values that can change depending on the environment, or sensitive information that shouldn't be published anywhere.

In order to successfully run this project locally, add a file named `.env.local` in this directory.
If you are following the instructions in this project, the default content of this files should be:

`VAR_API_DOMAIN=http://localhost:8080`

This will connect to your local API running on port 8080. If you decided to run the API in a different port, or have deployed the API somewhere, adjust the value accordingly.
[Read more about Vite's .env files handling.](https://vitejs.dev/guide/env-and-mode.html#env-files)

## Notes

### API changes

I have added a 500ms delay in the agreement success response in order to emulate an external network request and show the loading functionality.

### Maximum financed amount

The BE response contains a `MAX_FINANCED_AMOUNT` value. Even though there is nothing about that in the READMEs, I considered this to be product price limit after which instalments are not provided. In this case, a message explaining the situation will be displayed in the widget.

### Build minification

At the moment of this writing, Vite ignores minification options when exporting in _lib_ mode. [See discussion](https://github.com/vitejs/vite/issues/6555).
A postbuild process will be run after build to minify the built module scripts.

### Accessibility change

In order to make the experience more accessible, I have added a close button that was not part of the design prototype.
The company logo was moved to the bottom of the component.

---

## Improvement possibilities

- Some transition animations could be added, for example when opening the pop-up, or loading new values in the widget.
- Testing can possibly be improved. There is not a lot of documentation on Vitest + Lit out there yet.
- Reactive styling could be added.
- Some deps could be updated.
- Find a way to compress HTML and CSS in the .min.js file. Related to [this issue](#build-minification)

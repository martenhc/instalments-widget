import EnvVariables from "@data/enum/env-variables";
declare global {
  interface ImportMeta {
    readonly env: {
      readonly [EnvVariables.VAR_API_DOMAIN]: string;
    };
  }
}

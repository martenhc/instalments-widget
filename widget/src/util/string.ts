import { STRING_TEMPLATE_NAME } from "@data/enum/copy";

export const convertToCamelCase = function (string: string) {
  return string.replace(/_([a-z])/g, function (matchGroup) {
    return matchGroup[1].toUpperCase();
  });
};

export const replaceTemplateInString = function (
  templateName: keyof typeof STRING_TEMPLATE_NAME,
  string: string,
  value: string
) {
  return string.replace(`{${templateName}}`, value);
};

import { Slugify } from "./slugify";

export const formatStorePhoneNumber = (
  instruction: string
): string | string[] => {
  const countryCode = "(+27)";
  const countPhoneNumbers: number = instruction.split(countryCode).length - 1;

  if (countPhoneNumbers >= 1) {
    const stripAlphabets = instruction.replace(/[A-Za-z]/g, "");
    const phoneNumbers = stripAlphabets.substring(
      stripAlphabets.indexOf(countryCode) + 0
    );

    return phoneNumbers.split(",");
  }

  return instruction;
};

export const getTelNumbers = (instruction: string): string => {
  const telephoneNumbers = formatStorePhoneNumber(instruction);
  let telNum: string = "";

  const extractTelNumber = (value: string): void => {
    telNum += value + " ";
  };

  if (Array.isArray(telephoneNumbers)) {
    telephoneNumbers.forEach(extractTelNumber);

    return telNum;
  } else {
    return telephoneNumbers;
  }
};

export const formatId = (
  title: string,
  state: string,
  postalCode: number,
  id: number
): string => {
  const webUrl = "https://bash.com/store/";
  return `${webUrl}${Slugify(`${title} ${state} ${postalCode}/${id}`)}`;
};

export const textParser = (text: string, group: SpecificationGroup) => {
  const {
    friendlyName,
    address: { city, state },
  } = group;

  return text
    .replace(/{storeName}/gi, friendlyName)
    .replace(/{storeCity}/gi, city ?? "")
    .replace(/{storeState}/gi, state ?? "");
};

export const getImages = (imageSelector: string) => {
  const images: string[] = [];

  if (imageSelector) {
    const elements: NodeListOf<HTMLImageElement> =
      document.querySelectorAll(imageSelector);

    if (elements.length) {
      for (let i = 0; i < elements.length; i++) {
        const { src } = elements[i];

        if (src) {
          images.push(src);
        }
      }
    }
  } else {
    return images;
  }

  return images;
};

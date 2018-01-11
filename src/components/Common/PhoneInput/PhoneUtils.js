//@flow

import {parse, asYouType, isValidNumber} from 'libphonenumber-js'


export default class PhoneUtils {
    static getFormattedPhone(number): { isValid: boolean, phoneFormatted: string, phone: string } {


        if (number.length > 0 && number[0] !== '+') {
            number = '+' + number;
        }

        const formatter = new asYouType();
        let formattedText = formatter.input(number);
        let parsed = parse(formattedText);
        let isValid = isValidNumber(parsed);

        if (!isValid && number.length > 2 && number[1] === '8') {
            const rusFormatter = new asYouType();
            let rusNumber = number.replaceAt(1, "7");
            let rusFormattedText = rusFormatter.input(rusNumber);
            let rusParsed = parse(rusFormattedText);
            let rusIsValid = isValidNumber(rusParsed);
            if (rusIsValid) {
                formattedText = rusFormattedText.replaceAt(1, "8");
                isValid = true;
                number = rusNumber;
            }
        }

        return {isValid: isValid, phoneFormatted: formattedText, phone: number.substring(1).replace(/\s/g, '')}
    }
}
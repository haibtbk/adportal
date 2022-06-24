import { vsprintf } from 'sprintf-js'
import store from '../redux/store'

const getMessageFromId = (id) => {
    const localize = store.getState()?.localize
    if (localize[id]) {
        return localize[id];
    } else {
        return id;
    }
}

export const capitalize = ([first, ...rest]) =>
    first.toUpperCase() + rest.join('')

export const capitalizeString = (message) => {
    if (!message || message.length <= 0) {
        return message
    }
    let result = message[0].toUpperCase()
    for (let i = 1; i < message.length; i += 1) {
        if (message[i - 1] === ' ' && message[i] !== ' ') {
            result += message[i].toUpperCase()
        } else if (message[i - 1] !== ' ' && message[i] !== ' ') {
            result += message[i].toLowerCase()
        } else if (message[i - 1] !== ' ' && message[i] === ' ') {
            result += message[i]
        }
    }
    return result
};

class Translate {
    MESSAGES_NORMAL = 0;
    MESSAGES_UPPERCASE = 1;
    MESSAGES_LOWERCASE = 2;
    MESSAGES_UPPERCASE_FIRST_CHAR = 3;
    MESSAGES_UPPERCASE_FIRST_CHAR_OF_WORD = 4;

    formatMessage(id, type, properties, textDefault = null) {
        if (id === '' || !id || typeof id !== 'string') {
            return '';
        }

        const messageType = type || this.MESSAGES_NORMAL;
        let message = getMessageFromId(id);
        message = textDefault || message.replace(/_/g, ' ');
        message = vsprintf(message, properties);

        switch (messageType) {
            case this.MESSAGES_NORMAL:
                break;
            case this.MESSAGES_LOWERCASE:
                message = message.toLowerCase();
                break;
            case this.MESSAGES_UPPERCASE:
                message = message.toUpperCase();
                break;
            case this.MESSAGES_UPPERCASE_FIRST_CHAR:
                message = capitalize(message);
                break;
            case this.MESSAGES_UPPERCASE_FIRST_CHAR_OF_WORD:
                message = capitalizeString(message);
                break;
            default:
                break;
        }
        return message;
    }
}

const translate = new Translate();

export const t = (
    id,
    properties,
    type = translate.MESSAGES_NORMAL,
    textDefault = null,
) => translate.formatMessage(id, type, properties, textDefault);

export const t1 = (id, properties, textDefault = null) =>
    translate.formatMessage(
        id,
        translate.MESSAGES_UPPERCASE_FIRST_CHAR,
        properties,
        textDefault,
    );

export const t2 = (id, properties, textDefault = null) =>
    translate.formatMessage(
        id,
        translate.MESSAGES_UPPERCASE_FIRST_CHAR_OF_WORD,
        properties,
    );

export const t3 = (id, properties, textDefault = null) =>
    translate.formatMessage(
        id,
        translate.MESSAGES_UPPERCASE,
        properties,
        textDefault,
    );

export const t4 = (id, properties, textDefault = null) =>
    translate.formatMessage(
        id,
        translate.MESSAGES_LOWERCASE,
        properties,
        textDefault,
    );

export default t;
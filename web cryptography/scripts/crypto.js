const getCryptoKey = (password_asBytes, salt, usages, iterationsCount = 100000) => {
    return window.crypto.subtle.importKey(
        "raw",
        password_asBytes,
        'PBKDF2',
        false,
        ['deriveKey']
    )
        .then(password_Key => {
            return window.crypto.subtle.deriveKey({
                name: 'PBKDF2',
                salt,
                iterations: iterationsCount,
                hash: { name: 'SHA-256' }
            }, password_Key, { name: 'AES-GCM', length: 256 }, false, usages);
        })
        .then(aes_cryptoKey_256 => {
            return aes_cryptoKey_256;
        })
}
const BYTE_TO_CHAR = (BYTE_obj) => {
    BYTE_obj = BYTE_obj.replace(/0/g, 'A');
    BYTE_obj = BYTE_obj.replace(/1/g, 'B');
    BYTE_obj = BYTE_obj.replace(/2/g, 'C');
    BYTE_obj = BYTE_obj.replace(/3/g, 'D');
    BYTE_obj = BYTE_obj.replace(/4/g, 'E');
    BYTE_obj = BYTE_obj.replace(/5/g, 'F');
    BYTE_obj = BYTE_obj.replace(/6/g, 'G');
    BYTE_obj = BYTE_obj.replace(/7/g, 'H');
    BYTE_obj = BYTE_obj.replace(/8/g, 'I');
    BYTE_obj = BYTE_obj.replace(/9/g, 'J');
    BYTE_obj = BYTE_obj.replace(/{/g, 'K');
    BYTE_obj = BYTE_obj.replace(/}/g, 'L');
    BYTE_obj = BYTE_obj.replace(/_/g, 'M');
    BYTE_obj = BYTE_obj.replace(/"/g, 'N');
    BYTE_obj = BYTE_obj.replace(/:/g, 'O');
    BYTE_obj = BYTE_obj.replace(/,/g, 'P');
    return BYTE_obj;
}
const CHAR_TO_BYTE = (CHAR_obj) => {
    CHAR_obj = CHAR_obj.replace(/A/g, '0');
    CHAR_obj = CHAR_obj.replace(/B/g, '1');
    CHAR_obj = CHAR_obj.replace(/C/g, '2');
    CHAR_obj = CHAR_obj.replace(/D/g, '3');
    CHAR_obj = CHAR_obj.replace(/E/g, '4');
    CHAR_obj = CHAR_obj.replace(/F/g, '5');
    CHAR_obj = CHAR_obj.replace(/G/g, '6');
    CHAR_obj = CHAR_obj.replace(/H/g, '7');
    CHAR_obj = CHAR_obj.replace(/I/g, '8');
    CHAR_obj = CHAR_obj.replace(/J/g, '9');
    CHAR_obj = CHAR_obj.replace(/K/g, '{');
    CHAR_obj = CHAR_obj.replace(/L/g, '}');
    CHAR_obj = CHAR_obj.replace(/M/g, '_');
    CHAR_obj = CHAR_obj.replace(/N/g, '"');
    CHAR_obj = CHAR_obj.replace(/O/g, ':');
    CHAR_obj = CHAR_obj.replace(/P/g, ',');
    return CHAR_obj;
}
let encrypt = (data, password, hashing_iterationsCount = 100000) => {
    const data_asBytes = new TextEncoder("utf-8").encode(data);
    const password_asBytes = new TextEncoder("utf-8").encode(password);
    const salt = window.crypto.getRandomValues(new Uint8Array(32));
    const get_aes_encryptoKey_256_request = getCryptoKey(password_asBytes, salt, ['encrypt'], hashing_iterationsCount);
    return get_aes_encryptoKey_256_request.then(aes_encryptoKey_256 => {
        const initialvector = window.crypto.getRandomValues(new Uint8Array(12));
        return window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: initialvector },
            aes_encryptoKey_256,
            data_asBytes
        ).then(encrypted_data => {
            // encrypted_data is: ArrayBuffer
            const encrypted_data_as_bytes = new Uint8Array(encrypted_data);
            encrypted_data_object = {
                salt: salt,
                initialvector: initialvector,
                encrypted_data_as_bytes: encrypted_data_as_bytes
            }
            let encryptedString = BYTE_TO_CHAR(JSON.stringify(encrypted_data_object));
            return encryptedString;
        })
            .catch(err => console.error(err))
    })
}
let decrypt = (encrypted_data_object_string, password, hashing_iterationsCount = 100000) => {
    const password_asBytes = new TextEncoder("utf-8").encode(password);
    const encrypted_data_object = JSON.parse(CHAR_TO_BYTE(encrypted_data_object_string));

    let salt_array = [];
    for (const key in encrypted_data_object.salt) {
        salt_array.push(encrypted_data_object.salt[key]);
    }
    const salt = new Uint8Array(salt_array);

    let initialvector_array = [];
    for (const key in encrypted_data_object.initialvector) {
        initialvector_array.push(encrypted_data_object.initialvector[key]);
    }
    const initialvector = new Uint8Array(initialvector_array);

    let encrypted_data_as_bytes_array = [];
    for (const key in encrypted_data_object.encrypted_data_as_bytes) {
        encrypted_data_as_bytes_array.push(encrypted_data_object.encrypted_data_as_bytes[key]);
    }
    const encrypted_data_as_bytes = new Uint8Array(encrypted_data_as_bytes_array);

    const get_aes_decryptoKey_256_request = getCryptoKey(password_asBytes, salt, ['decrypt'], hashing_iterationsCount);
    return get_aes_decryptoKey_256_request.then(aes_decryptoKey_256 => {
        return window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: initialvector },
            aes_decryptoKey_256,
            encrypted_data_as_bytes
        ).then(decrypted_data => {
            // decrypted_data is: ArrayBuffer
            const decrypted_data_asBytes = new Uint8Array(decrypted_data);
            return new TextDecoder().decode(decrypted_data_asBytes);
        })
        .catch(err => console.error(err))
    })
}
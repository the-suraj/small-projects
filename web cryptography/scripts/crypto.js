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
    // reserved: s, iv, d free: abelt
    BYTE_obj = BYTE_obj.replace(/0/g, 'c');
    BYTE_obj = BYTE_obj.replace(/1/g, 'f');
    BYTE_obj = BYTE_obj.replace(/2/g, 'g');
    BYTE_obj = BYTE_obj.replace(/3/g, 'h');
    BYTE_obj = BYTE_obj.replace(/4/g, 'j');
    BYTE_obj = BYTE_obj.replace(/5/g, 'k');
    BYTE_obj = BYTE_obj.replace(/6/g, 'm');
    BYTE_obj = BYTE_obj.replace(/7/g, 'n');
    BYTE_obj = BYTE_obj.replace(/8/g, 'o');
    BYTE_obj = BYTE_obj.replace(/9/g, 'p');
    BYTE_obj = BYTE_obj.replace(/{/g, 'q');
    BYTE_obj = BYTE_obj.replace(/}/g, 'u');
    BYTE_obj = BYTE_obj.replace(/_/g, 'w');
    BYTE_obj = BYTE_obj.replace(/"/g, 'x');
    BYTE_obj = BYTE_obj.replace(/:/g, 'y');
    BYTE_obj = BYTE_obj.replace(/,/g, 'z');
    // reserved: s, iv, d free: abelt
    return BYTE_obj;
}
const CHAR_TO_BYTE = (CHAR_obj) => {
    CHAR_obj = CHAR_obj.replace(/c/g, '0');
    CHAR_obj = CHAR_obj.replace(/f/g, '1');
    CHAR_obj = CHAR_obj.replace(/g/g, '2');
    CHAR_obj = CHAR_obj.replace(/h/g, '3');
    CHAR_obj = CHAR_obj.replace(/j/g, '4');
    CHAR_obj = CHAR_obj.replace(/k/g, '5');
    CHAR_obj = CHAR_obj.replace(/m/g, '6');
    CHAR_obj = CHAR_obj.replace(/n/g, '7');
    CHAR_obj = CHAR_obj.replace(/o/g, '8');
    CHAR_obj = CHAR_obj.replace(/p/g, '9');
    CHAR_obj = CHAR_obj.replace(/q/g, '{');
    CHAR_obj = CHAR_obj.replace(/u/g, '}');
    CHAR_obj = CHAR_obj.replace(/w/g, '_');
    CHAR_obj = CHAR_obj.replace(/x/g, '"');
    CHAR_obj = CHAR_obj.replace(/y/g, ':');
    CHAR_obj = CHAR_obj.replace(/z/g, ',');
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
                s: salt,
                iv: initialvector,
                d: encrypted_data_as_bytes
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
    for (const key in encrypted_data_object.s) {
        salt_array.push(encrypted_data_object.s[key]);
    }
    const salt = new Uint8Array(salt_array);

    let initialvector_array = [];
    for (const key in encrypted_data_object.iv) {
        initialvector_array.push(encrypted_data_object.iv[key]);
    }
    const initialvector = new Uint8Array(initialvector_array);

    let encrypted_data_as_bytes_array = [];
    for (const key in encrypted_data_object.d) {
        encrypted_data_as_bytes_array.push(encrypted_data_object.d[key]);
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
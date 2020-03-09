/**
 * 
 * @param {ArrayBuffer} password_asBytes - user's password
 * @param {ArrayBuffer} salt - seed
 * @param {Array} usages - array of string defining the use of key
 * @param {Number} iterationsCount - number of times the key will be hashed
 */
const getCryptoKey = (password_asBytes, salt, usages, iterationsCount = 1000) => {
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
let encrypt = (data, password, hashing_iterationsCount = 1000) => {
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
            let encryptedString = JSON.stringify(encrypted_data_object);
            return encryptedString;
        })
            .catch(err => console.error(err))
    })
}
let decrypt = (encrypted_data_object_string, password, hashing_iterationsCount = 1000) => {
    const password_asBytes = new TextEncoder("utf-8").encode(password);
    const encrypted_data_object = JSON.parse(encrypted_data_object_string);

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
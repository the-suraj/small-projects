const iterationsCount = 1000000;
const getCryptoKey = (password_asBytes, salt, usages) => {
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
let encrypt = (data, password) => {
    const data_asBytes = new TextEncoder("utf-8").encode(data);
    const password_asBytes = new TextEncoder("utf-8").encode(password);
    const salt = window.crypto.getRandomValues(new Uint8Array(32));
    const get_aes_encryptoKey_256_request = getCryptoKey(password_asBytes, salt, ['encrypt']);
    return get_aes_encryptoKey_256_request.then(aes_encryptoKey_256 => {
        const initialVector = window.crypto.getRandomValues(new Uint8Array(12));
        return window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: initialVector },
            aes_encryptoKey_256,
            data_asBytes
        ).then(encrypted_data => {
            // encrypted_data is: ArrayBuffer
            const encrypted_data_asBytes = new Uint8Array(encrypted_data);
            encrypted_data_object = {
                salt: salt,
                initialVector: initialVector,
                encrypted_data_asBytes: encrypted_data_asBytes
            }
            return JSON.stringify(encrypted_data_object);
        })
            .catch(err => console.error(err))
    })
}
let decrypt = (encrypted_data_object_string, password) => {
    const password_asBytes = new TextEncoder("utf-8").encode(password);
    const encrypted_data_object = JSON.parse(encrypted_data_object_string);

    let salt_array = [];
    for (const key in encrypted_data_object.salt) {
        salt_array.push(encrypted_data_object.salt[key]);
    }
    const salt = new Uint8Array(salt_array);

    let initialVector_array = [];
    for (const key in encrypted_data_object.initialVector) {
        initialVector_array.push(encrypted_data_object.initialVector[key]);
    }
    const initialVector = new Uint8Array(initialVector_array);

    let encrypted_data_asBytes_array = [];
    for (const key in encrypted_data_object.encrypted_data_asBytes) {
        encrypted_data_asBytes_array.push(encrypted_data_object.encrypted_data_asBytes[key]);
    }
    const encrypted_data_asBytes = new Uint8Array(encrypted_data_asBytes_array);

    const get_aes_decryptoKey_256_request = getCryptoKey(password_asBytes, salt, ['decrypt']);
    return get_aes_decryptoKey_256_request.then(aes_decryptoKey_256 => {
        return window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: initialVector },
            aes_decryptoKey_256,
            encrypted_data_asBytes
        ).then(decrypted_data => {
            // decrypted_data is: ArrayBuffer
            const decrypted_data_asBytes = new Uint8Array(decrypted_data);
            return new TextDecoder().decode(decrypted_data_asBytes);
        })
        .catch(err => console.error(err))
    })
}
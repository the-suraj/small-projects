const data_input = document.getElementById('data_input');
const password_input = document.getElementById('password_input');
const output = document.getElementById('output');
const encrypt_button = document.getElementById('encrypt_button');
const decrypt_button = document.getElementById('decrypt_button');


// const salt = window.crypto.getRandomValues(new Uint8Array(32));
// console.log(salt);
// const decoder = new TextDecoder();
// const str = decoder.decode(salt); // String "€"
// console.log('decoded:', str);

// const encoder = new TextEncoder();
// const array = encoder.encode(str); // Uint8Array(3) [226, 130, 172]
// console.log('encoded:', array);



const encrypter_function = () => {
    output.value = '';
    let encrypter_promise = encrypt(data_input.value, password_input.value);
    encrypter_promise.then(encrypted_data => {
        // console.log([{data: data_input.value}, {encrypted_data: encrypted_data}]);
        output.value = encrypted_data;
    });
}
const decrypter_function = () => {
    data_input.value = '';
    let decrypter_promise = decrypt(output.value, password_input.value);
    decrypter_promise.then(decrypted_data => {
        // console.log([{data: output.value}, {decrypted_data: decrypted_data}]);
        data_input.value = decrypted_data;
    });
}

encrypt_button.addEventListener('click', encrypter_function);
decrypt_button.addEventListener('click', decrypter_function);
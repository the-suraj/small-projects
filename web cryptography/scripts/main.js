const data_input = document.getElementById('data_input');
const password_input = document.getElementById('password_input');
const output = document.getElementById('output');
const encrypt_button = document.getElementById('encrypt_button');
const decrypt_button = document.getElementById('decrypt_button');


const encrypter_function = () => {
    output.value = '';
    let encrypter_promise = encrypt(data_input.value, password_input.value);
    encrypter_promise.then(encrypted_data => {
        output.value = btoa(encrypted_data);
    });
}
const decrypter_function = () => {
    data_input.value = '';
    let decrypter_promise = decrypt(atob(output.value), password_input.value);
    decrypter_promise.then(decrypted_data => {
        data_input.value = decrypted_data;
    });
}

encrypt_button.addEventListener('click', encrypter_function);
decrypt_button.addEventListener('click', decrypter_function);
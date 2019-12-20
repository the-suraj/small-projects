const add_user_function = () => {
    if (age_input.value && email_input.value && userName_input.value && phoneNumber_input.value) {

        let user = {
            age: parseInt(age_input.value),
            email: email_input.value,
            name: userName_input.value,
            phone: phoneNumber_input.value
        }
        addNewUsers([user]);
    } else {
        console.warn('Invalid Input');
    }
}

const userName_input = document.getElementById('userName_input');
const phoneNumber_input = document.getElementById('phoneNumber_input');
const age_input = document.getElementById('age_input');
const email_input = document.getElementById('email_input');
const add_user_button = document.getElementById('add_user_button');

add_user_button.addEventListener('click', add_user_function);
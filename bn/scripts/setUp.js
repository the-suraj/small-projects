let setBrandName = () => {
    reversedBrandName = document.getElementById('take-brandName-input').value.split("").reverse().join("");
    mainBrandName.innerHTML = '';
    for (let index = 0; index < reversedBrandName.length; index++) {
        let elm = `<span id="letter-${index + 1}" data-value="${reversedBrandName[index].charCodeAt(0) - 96}">${reversedBrandName[index]}</span>`;
        mainBrandName.insertAdjacentHTML("afterbegin", elm);
    }

}
document.getElementById('take-brandName-confirm-btn').addEventListener('click', setBrandName);
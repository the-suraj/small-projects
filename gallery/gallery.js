const log = console.log;
const imgContainers = document.querySelectorAll('.gallery-container .gallery .img-container');
const imgs = document.querySelectorAll('.gallery-container .gallery .img-container .image');
let update_transform_origin = (event) => {
    let rect = event.target.getBoundingClientRect();
    xp = event.offsetX / rect.width * 100;
    yp = event.offsetY / rect.height * 100;
    event.target.style.transformOrigin = `${xp}% ${yp}%`;
}
let maxHeightOfImage = 0;
let maxWidthOfImage = 0;

imgContainers.forEach(img_container => {
    img_container.addEventListener('mouseover', update_transform_origin);
    img_container.addEventListener('mousemove', update_transform_origin);
});

imgs.forEach(img => {
    if (img.naturalWidth > maxWidthOfImage) {
        maxWidthOfImage = img.naturalWidth;
    }
    if (img.naturalHeight > maxHeightOfImage) {
        maxHeightOfImage = img.naturalHeight;
    }
})

imgs.forEach(img => {
    let wBh = Math.round(img.naturalWidth / img.naturalHeight);
    let hBw = Math.round(img.naturalHeight / img.naturalWidth);

    if (wBh > 1) {
        img.parentElement.style.gridColumn = `span ${wBh}`;
    }
    if (hBw > 1) {
        img.parentElement.style.gridRow = `span ${hBw}`;
    }
});

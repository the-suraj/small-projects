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
    if(img.naturalWidth > maxWidthOfImage) {
        maxWidthOfImage = img.naturalWidth;
    }
    if(img.naturalHeight > maxHeightOfImage) {
        maxHeightOfImage = img.naturalHeight;
    }
})

imgs.forEach(img => {
    let wBh = img.naturalWidth / img.naturalHeight;
    let hBw = img.naturalHeight / img.naturalWidth;

    img.parentElement.style.gridColumn = `span ${Math.round(wBh)}`;

    img.parentElement.style.gridRow = `span ${Math.round(hBw)}`;

    // img.parentElement.style.gridRow = `span ${Math.round(4*hBw)} / auto`;
});

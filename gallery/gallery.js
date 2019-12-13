let update_transform_origin = (event) => {
    let rect = event.target.getBoundingClientRect();
    xp = event.offsetX/rect.width*100;
    yp = event.offsetY/rect.height*100;
    event.target.style.transformOrigin = `${xp}% ${yp}%`;
}

document.querySelectorAll('.gallery-container .gallery .img-container')
    .forEach(img_container => {
        img_container.addEventListener('mouseover', update_transform_origin);
        // img_container.addEventListener('mousemove', update_transform_origin);
    });

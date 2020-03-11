const log = console.log;

let update_transform_origin = (event) => {
    let rect = event.target.getBoundingClientRect();
    xp = event.offsetX / rect.width * 100;
    yp = event.offsetY / rect.height * 100;
    event.target.style.transformOrigin = `${xp}% ${yp}%`;
}

document.querySelectorAll('.gallery-container .gallery .img-container')
    .forEach(img_container => {
        img_container.addEventListener('mouseover', update_transform_origin);
        img_container.addEventListener('mousemove', update_transform_origin);
    });

document.querySelectorAll('.gallery-container .gallery .img-container .image')
    .forEach(img => {
        let wBh = img.naturalWidth/img.naturalHeight;
        let hBw = img.naturalHeight/img.naturalWidth;
        // if(wBh > hBw) {
        //     // img.parentElement.style.gridColumn = `span ${Math.round(4*wBh)} / auto`;
        //     log(`column: span ${Math.round(4*wBh)} / auto`);
        // } else if (hBw > wBh) {
        //     img.parentElement.style.gridRow = `span ${Math.round(4*hBw)} / auto`;
        //     log(`Row: span ${Math.round(4*wBh)} / auto`);
        // }
        
        img.parentElement.style.gridRow = `span ${Math.round(4*hBw)} / auto`;
    });

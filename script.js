const sliders = document.getElementsByClassName("slider");
const sliderRightMargin = 20;
const sliderTransitionTime = 300;

let sliderCardWidth = 366.67;
let sliderCardsAtOnce = 3;

for (let i = 0; i < sliders.length; i++) {
    const slider = sliders[i];
    const movingBlock = slider.getElementsByClassName("slider_moving_block")[0];
    const leftButton = slider.getElementsByClassName("slide_left_button")[0];
    const rightButton = slider.getElementsByClassName("slide_right_button")[0];

    const numberOfCards = movingBlock.children.length;
    let movingBlockPosition = 0;
    let firstSliderCardIndex = 0;
    let scrollLock = false;
    let slidePointerPosition = 0;

    function firstCardToLast() {
        const firstChild = movingBlock.firstElementChild;
        movingBlock.appendChild(firstChild);
    }

    function lastCardToFirst() {
        const lastChild = movingBlock.lastElementChild;
        movingBlock.insertBefore(lastChild, movingBlock.firstElementChild);
    }

    function beginSliding(e) {
        if (scrollLock === true) return;

        movingBlock.classList.add("disable_transitions");
        movingBlock.onpointermove = slide;
        movingBlock.setPointerCapture(e.pointerId);
        slidePointerPosition = e.clientX;
    }

    function stopSliding(e) {
        movingBlock.classList.remove("disable_transitions");
        movingBlock.onpointermove = null;
        movingBlock.releasePointerCapture(e.pointerId);

        const sliderRect = slider.getBoundingClientRect();
        const movingBlockRect = movingBlock.getBoundingClientRect();
        const position = sliderRect.left - movingBlockRect.left;
        const nearestMovingBlockPosition = Math.round(position / sliderCardWidth)
        movingBlockPosition = nearestMovingBlockPosition;

        movingBlock.style.transform = `translateX(${-(sliderCardWidth + sliderRightMargin) * movingBlockPosition}px)`;
    }

    function slide(e) {
        const firstChild = movingBlock.firstElementChild;
        const lastChild = movingBlock.lastElementChild;
        const sliderRect = slider.getBoundingClientRect();

        const firstChildRect = firstChild.getBoundingClientRect();
        const lastChildRect = lastChild.getBoundingClientRect();

        if (sliderRect.left < firstChildRect.left) {
            movingBlockPosition += 1;
            lastCardToFirst();
        } else if (sliderRect.right > lastChildRect.right) {
            movingBlockPosition -= 1;
            firstCardToLast();
        }
        
        movingBlock.style.transform = `translate(${-(slidePointerPosition - e.clientX) - movingBlockPosition * (sliderCardWidth + sliderRightMargin)}px)`;
    }

    movingBlock.onpointerdown = beginSliding;
    movingBlock.onpointerup = stopSliding;

    function slideLeft(releaseScrollLock = true) {
        scrollLock = true;

        if (movingBlockPosition === 0) {
            lastCardToFirst();
            movingBlock.classList.add("disable_transitions");
            movingBlock.style.transform = `translateX(${-(sliderCardWidth + sliderRightMargin) * (movingBlockPosition + 1)}px)`;
            setTimeout(() => {
                movingBlock.classList.remove("disable_transitions");
                setTimeout(() => {
                    movingBlock.style.transform = `translateX(${-(sliderCardWidth + sliderRightMargin) * movingBlockPosition}px)`;
                }, 10);
            }, 10);
        } else {
            movingBlockPosition--;
            movingBlock.style.transform = `translateX(${-(sliderCardWidth + sliderRightMargin) * movingBlockPosition}px)`;
        }

        if (firstSliderCardIndex > 0) {
            firstSliderCardIndex--;
        } else {
            firstSliderCardIndex = numberOfCards - 1;
        }

        if (releaseScrollLock === true) {
            setTimeout(() => {
                scrollLock = false;
            }, sliderTransitionTime + 21);
        }
    }

    leftButton.addEventListener("click", () => {
        if (scrollLock === true) return;
        slideLeft();
    });

    function slideRight(releaseScrollLock = true) {
        scrollLock = true;

        if (movingBlockPosition + sliderCardsAtOnce >= numberOfCards) {
            firstCardToLast();
            movingBlock.classList.add("disable_transitions");
            movingBlock.style.transform = `translateX(${-(sliderCardWidth + sliderRightMargin) * (movingBlockPosition - 1)}px)`;
            setTimeout(() => {
                movingBlock.classList.remove("disable_transitions");
                setTimeout(() => {
                    movingBlock.style.transform = `translateX(${-(sliderCardWidth + sliderRightMargin) * movingBlockPosition}px)`;
                }, 10);
            }, 10);
        } else {
            movingBlockPosition++;
            movingBlock.style.transform = `translateX(${-(sliderCardWidth + sliderRightMargin) * movingBlockPosition}px)`;
        }

        if (firstSliderCardIndex < numberOfCards - 1) {
            firstSliderCardIndex++;
        } else {
            firstSliderCardIndex = 0;
        }

        if (releaseScrollLock === true) {
            setTimeout(() => {
                scrollLock = false;
            }, sliderTransitionTime + 21);
        }
    }

    rightButton.addEventListener("click", () => {
        if (scrollLock === true) return;
        slideRight();
    });

    const miniButtons = slider.getElementsByClassName("mini_buttons")[0].getElementsByClassName("mini_button");
    for (let b = 0; b < miniButtons.length; b++) {
        const miniButton = miniButtons[b];

        miniButton.addEventListener("click", () => {
            if (scrollLock === true) return;
            if (firstSliderCardIndex === b) return;


            if ((firstSliderCardIndex + 1) % numberOfCards === b) {
                slideRight();
            } else if ((firstSliderCardIndex - 1 === b) || (firstSliderCardIndex === 0 && b === numberOfCards - 1)) {
                slideLeft();
            } else {
                scrollLock = true;

                const rightDifference = b - firstSliderCardIndex;
                for (let s = 0; s < rightDifference; s++) {
                    slideRight(false);
                }

                setTimeout(() => {
                    scrollLock = false;
                }, sliderTransitionTime + 21);
            }
        });
    }
}

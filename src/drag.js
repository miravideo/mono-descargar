
const MOVE_KEY = 'hasMove'
const X_KEY = 'offsetX'
const Y_KEY = 'offsetY'

export const enableDrag = function (buttonClass) {
  let $dragItem = null;
  let initialX, initialY;

  const moveStart = (e) => {
    $dragItem = $(e.target);
    while (!$dragItem.hasClass(buttonClass)) {
      $dragItem = $dragItem.parent()
    }

    $dragItem.attr(MOVE_KEY, 0);
    const offsetX = $dragItem.attr(X_KEY) || 0;
    const offsetY = $dragItem.attr(Y_KEY) || 0;
    if (e.type === "touchstart") {
      initialX = e.touches[0].clientX - offsetX;
      initialY = e.touches[0].clientY - offsetY;
    } else {
      initialX = e.clientX - offsetX;
      initialY = e.clientY - offsetY;
    }
    return true;
  }

  const move = (e) => {
    if (!$dragItem) return true;
    e.preventDefault();

    let deltaX, deltaY;
    if (e.type === "touchmove") {
      deltaX = e.touches[0].clientX - initialX;
      deltaY = e.touches[0].clientY - initialY;
    } else {
      deltaX = e.clientX - initialX;
      deltaY = e.clientY - initialY;
    }

    $dragItem.css('transform', `translate3d(${deltaX}px, ${deltaY}px, 0) scale(1.0)`)
              .attr(MOVE_KEY, Math.abs(deltaX) + Math.abs(deltaY))
              .attr(X_KEY, deltaX).attr(Y_KEY, deltaY);
    return true;
  }

  const moveEnd = (e) => {
    if ($dragItem && $dragItem.attr(MOVE_KEY) > 0) {
      let $item = $dragItem;
      setTimeout(() => {
        $item.attr(MOVE_KEY, 0);
      }, 500)
    }
    $dragItem = null;
    e.preventDefault();
    return true;
  }

  $(document.body).on("touchstart", `.${buttonClass}`, function (e) {
    return moveStart(e);
  }).on("mousedown", `.${buttonClass}`, function (e) {
    return moveStart(e);
  }).on("touchmove", function(e) {
    return move(e);
  }).on("mousemove", function(e) {
    return move(e);
  }).on("mouseup", function (e) {
    return moveEnd(e);
  }).on("touchend", function (e) {
    return moveEnd(e);
  });
};
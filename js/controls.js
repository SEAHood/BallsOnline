define(["require", "exports"], function (require, exports) {
    var Controls = (function () {
        function Controls() {
            this.controlState = {
                jumping: false,
                space: false,
                left: false,
                up: false,
                right: false,
                down: false
            };
            var controlState = this.controlState;
            // When the user presses a key 
            $(document).keydown(function (e) {
                if (!$(e.target).is('input')) {
                    var prevent = true;
                    // Update the state of the attached control to "true"
                    switch (e.keyCode) {
                        case 32:
                            controlState.space = true;
                            break;
                        case 37:
                        case 65:
                            controlState.left = true;
                            break;
                        case 38:
                        case 87:
                            controlState.up = true;
                            break;
                        case 39:
                        case 68:
                            controlState.right = true;
                            break;
                        case 40:
                        case 83:
                            controlState.down = true;
                            break;
                        default:
                            prevent = false;
                    }
                    // Avoid the browser to react unexpectedly
                    if (prevent) {
                        e.preventDefault();
                    }
                    else {
                        return;
                    }
                }
                // Update the character's direction
                //user.setDirection(controls);
            });
            // When the user releases a key
            $(document).keyup(function (e) {
                var prevent = true;
                // Update the state of the attached control to "false"
                switch (e.keyCode) {
                    case 32:
                        controlState.space = false;
                        break;
                    case 37:
                    case 65:
                        controlState.left = false;
                        break;
                    case 38:
                    case 87:
                        controlState.up = false;
                        break;
                    case 39:
                    case 68:
                        controlState.right = false;
                        break;
                    case 40:
                    case 83:
                        controlState.down = false;
                        break;
                    default:
                        prevent = false;
                }
                // Avoid the browser to react unexpectedly
                if (prevent) {
                    e.preventDefault();
                }
                else {
                    return;
                }
                // Update the character's direction
                //user.setDirection(controls);
            });
        }
        Controls.prototype.isActive = function () {
            for (var i in this.controlState) {
                var isActive = this.controlState[i];
                if (isActive) {
                    return true;
                }
            }
            return false;
        };
        Controls.prototype.getControlState = function () {
        };
        return Controls;
    })();
    return Controls;
});

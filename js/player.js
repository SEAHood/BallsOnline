define(["require", "exports", "physijs", "./controls"], function (require, exports, PhysiJS, Controls) {
    var Player = (function () {
        function Player(color) {
            console.log("creating player");
            this.controls = new Controls();
            this.isAlive = true;
            this.guid = this.generateGuid();
            this.color = this.generateColor();
            this.username = '1234';
            var friction = 1; // high friction
            var restitution = 1; // low restitution
            var material = PhysiJS.createMaterial(new THREE.MeshLambertMaterial({ color: this.color }), friction, restitution);
            //var mat = new THREE.MeshLambertMaterial({ color: this.color });
            //this.mesh = new THREE.Mesh(new THREE.SphereGeometry(5,32,32), new THREE.MeshLambertMaterial({ color: this.color }));
            this.mesh = new PhysiJS.SphereMesh(new THREE.SphereGeometry(5, 32, 32), material);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.x = 500;
            this.mesh.position.y = 1250;
            this.mesh.position.z = 0;
            // Enable CCD if the object moves more than 1 meter in one simulation frame
            this.mesh.setCcdMotionThreshold(1);
            // Set the radius of the embedded sphere such that it is smaller than the object
            this.mesh.setCcdSweptSphereRadius(4.5);
        }
        Player.prototype.generateGuid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };
        Player.prototype.generateColor = function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        Player.prototype.reset = function () {
            this.mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
            this.mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
            //this.mesh.set
            this.mesh.position.set(500, 1250, 0);
            this.mesh.__dirtyPosition = true;
        };
        Player.prototype.update = function () {
            var currentControls = this.controls.controlState;
            console.log(this.controls.isActive);
            if (this.mesh.position.y < -100) {
                this.reset();
                this.isAlive = false;
            }
            if (this.mesh.position.y <= 0) {
                currentControls.jumping = false;
            }
            //var velocity = player.mesh.getLinearVelocity();
            if (this.controls.isActive) {
                var velocity = new THREE.Vector3(0, 0, 0);
                //velocity = player.mesh.getLinearVelocity();
                if (currentControls.space && !currentControls.jumping) {
                    var pVelocity = this.mesh.getLinearVelocity();
                    if (typeof pVelocity === 'undefined') {
                        pVelocity = new THREE.Vector3(0, 0, 0);
                    }
                    pVelocity.setY(100);
                    this.mesh.setLinearVelocity(pVelocity);
                    currentControls.jumping = true;
                    this.mesh.addEventListener('collision', function () {
                        currentControls.jumping = false;
                        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
                    });
                }
                if (currentControls.up)
                    velocity.setZ(5000);
                if (currentControls.down)
                    velocity.setZ(-5000);
                if (currentControls.left)
                    velocity.setX(5000);
                if (currentControls.right)
                    velocity.setX(-5000);
                this.mesh.applyCentralImpulse(velocity);
            }
            else {
                var drag = 0.5;
                pVelocity = this.mesh.getLinearVelocity();
                if (pVelocity.x > 0) {
                    pVelocity.setX(pVelocity.x - drag);
                }
                else if (pVelocity.x < 0) {
                    pVelocity.setX(pVelocity.x + drag);
                }
                if (pVelocity.z > 0) {
                    pVelocity.setZ(pVelocity.z - drag);
                }
                else if (pVelocity.z < 0) {
                    pVelocity.setZ(pVelocity.z + drag);
                }
                this.mesh.setLinearVelocity(pVelocity);
            }
            //TODO: REFACTOR EVERYTHING OMG
            var speedLimit = 300;
            var pVelocity = this.mesh.getLinearVelocity();
            if (pVelocity.x > speedLimit) {
                this.mesh.setLinearVelocity(new THREE.Vector3(speedLimit, pVelocity.y, pVelocity.z));
            }
            pVelocity = this.mesh.getLinearVelocity();
            if (pVelocity.y > speedLimit) {
                this.mesh.setLinearVelocity(new THREE.Vector3(pVelocity.x, speedLimit, pVelocity.z));
            }
            pVelocity = this.mesh.getLinearVelocity();
            if (pVelocity.z > speedLimit) {
                this.mesh.setLinearVelocity(new THREE.Vector3(pVelocity.x, pVelocity.y, speedLimit));
            }
            pVelocity = this.mesh.getLinearVelocity();
            if (pVelocity.x < -speedLimit) {
                this.mesh.setLinearVelocity(new THREE.Vector3(-speedLimit, pVelocity.y, pVelocity.z));
            }
            pVelocity = this.mesh.getLinearVelocity();
            if (pVelocity.y < -speedLimit) {
                this.mesh.setLinearVelocity(new THREE.Vector3(pVelocity.x, -speedLimit, pVelocity.z));
            }
            pVelocity = this.mesh.getLinearVelocity();
            if (pVelocity.z < -speedLimit) {
                this.mesh.setLinearVelocity(new THREE.Vector3(pVelocity.x, pVelocity.y, -speedLimit));
            }
        };
        return Player;
    })();
    return Player;
});

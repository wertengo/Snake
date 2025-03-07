import {
    Scene,
    Mesh,
    MeshBuilder,
    PhysicsImpostor,
    Vector3,
    PhysicsJoint,
    PhysicsAggregate,
    PhysicsShapeType,
    DistanceConstraint,
    PointerDragBehavior,
    Quaternion
} from "@babylonjs/core";

export class Snake {
    private scene: Scene;
    private snakeParts: Mesh[] = [];
    private physicsAggregates: PhysicsAggregate[] = [];
    private boxSize: number;
    private meshCounter = 0;

    constructor(scene: Scene, boxSize = 0.5) {
        this.scene = scene;
        this.boxSize = boxSize;
        this.createSnake();
    }

    private createSnake() {
        for (let i = 0; i < 4; i++) {
            const box = MeshBuilder.CreateBox(`box${i}`, { size: this.boxSize }, this.scene);
            // box.position.y = this.boxSize / 2;
            box.position.y = 4;
            box.position.z = i * this.boxSize * 2;
            box.metadata = { id: this.meshCounter++ }; 
            console.log(`Created mesh with ID: ${box.metadata.id}`);

            const dragBehavior = new PointerDragBehavior({});
            dragBehavior.moveAttached = true;
            dragBehavior.useObjectOrientationForDragging = false;

            dragBehavior.onDragStartObservable.add(() => {
                console.log(`Dragging started for box ${box.metadata.id}`);
                // boxAggregate.body.disablePreStep = true;
                boxAggregate.body.setMassProperties({ mass: 0.1 });
            });

            dragBehavior.onDragObservable.add((event) => {
                console.log(`Dragging box ${box.metadata.id}`, event.delta);
                box.position.addInPlace(event.delta);
                const rotation = box.rotationQuaternion || Quaternion.Identity();
                boxAggregate.body.setTargetTransform(box.position, rotation);
            });

            dragBehavior.onDragEndObservable.add(() => {
                console.log(`Dragging ended for box ${box.metadata.id}`);
                // boxAggregate.body.disablePreStep = false; 
                boxAggregate.body.setMassProperties({ mass: 1 });

                boxAggregate.body.setLinearVelocity(Vector3.Zero()); 
                boxAggregate.body.setAngularVelocity(Vector3.Zero()); 
                const rotation = box.rotationQuaternion || Quaternion.Identity();
                boxAggregate.body.setTargetTransform(box.position, rotation);
            });

            box.addBehavior(dragBehavior);

            const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1 }, this.scene);
    
            if(i > 0){
                // const previousPart = this.snakeParts[i - 1];
                // const distanceJoint = new DistanceConstraint(2, this.scene);
                // // previousPart.physicsBody?.addConstraint(boxAggregate.body, distanceJoint);
                // previousPart.physicsAggregate.body.addConstraint(boxAggregate.body, distanceJoint);
                const previousPartAggregate = this.physicsAggregates[i - 1];

                const distanceJoint = new DistanceConstraint(
                    2,
                    this.scene
                );

                previousPartAggregate.body.addConstraint(boxAggregate.body, distanceJoint);
            }
         
            this.snakeParts.push(box);
            this.physicsAggregates.push(boxAggregate);
        }
    }

    // public moveSnake(direction: Vector3) {
    //     this.snakeParts.forEach(part => {
    //         part.position.addInPlace(direction);
    //     });
    // }
}
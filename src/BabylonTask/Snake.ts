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
    PhysicsConstraint,
    PointerDragBehavior,
    Quaternion,
    PhysicsConstraintType,
    StandardMaterial,
    Color3,
    Observable
} from "@babylonjs/core";

export class Snake {
    private scene: Scene;
    private snakeParts: Mesh[] = [];
    private physicsAggregates: PhysicsAggregate[] = [];
    private boxSize: number;
    private meshCounter = 1;
    private selectedMesh: Mesh | null = null;

    public onMeshSelectedObservable: Observable<string>;
    public lastSelectedMeshId: string | null = null;

    constructor(scene: Scene, boxSize = 0.5) {
        this.scene = scene;
        this.boxSize = boxSize;
        this.onMeshSelectedObservable = new Observable<string>();
        this.createSnake();
    }

    private createSnake() {

        // const phisycsMaterial = new PhysicsMaterialCombineMode("physicsMaterial", this.scene);
        // phisycsMaterial.friction = 0.5;
        // phisycsMaterial.restitution = 0.1;

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
                this.selectedMesh = box;
                this.lastSelectedMeshId = box.metadata.id;

                console.log(`Dragging started for box ${box.metadata.id}`);
                boxAggregate.body.disablePreStep = true;
                this.onMeshSelectedObservable.notifyObservers(box.metadata.id);
                boxAggregate.body.setMassProperties({ mass: 1 });
                

                // boxAggregate.body.setLinearVelocity(Vector3.Zero());
                // boxAggregate.body.setAngularVelocity(Vector3.Zero());
                // const rotation = box.rotationQuaternion || Quaternion.Identity();
                // boxAggregate.body.setTargetTransform(box.position, rotation);
            });

            dragBehavior.onDragObservable.add((event) => {
                console.log(`Dragging box ${box.metadata.id}`, event.delta);
                box.position.addInPlace(event.delta);
                const rotation = box.rotationQuaternion || Quaternion.Identity();
                boxAggregate.body.setTargetTransform(box.position, rotation);
            });

            dragBehavior.onDragEndObservable.add(() => {
                console.log(`Dragging ended for box ${box.metadata.id}`);
                boxAggregate.body.disablePreStep = false; 
                boxAggregate.body.setMassProperties({ mass: 10 });

                boxAggregate.body.setLinearVelocity(Vector3.Zero());
                boxAggregate.body.setAngularVelocity(Vector3.Zero());
                const rotation = box.rotationQuaternion || Quaternion.Identity();
                boxAggregate.body.setTargetTransform(box.position, rotation);
            });

            box.addBehavior(dragBehavior);

            const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX,
                {
                    mass: 10,
                    friction: 0.5,
                    restitution: 0.1
                }, this.scene);

            if (i > 0) {
                // const previousPart = this.snakeParts[i - 1];
                // const distanceJoint = new DistanceConstraint(2, this.scene);
                // // previousPart.physicsBody?.addConstraint(boxAggregate.body, distanceJoint);
                // previousPart.physicsAggregate.body.addConstraint(boxAggregate.body, distanceJoint);
                const previousPartAggregate = this.physicsAggregates[i - 1];

                // distance

                // const distanceJoint = new DistanceConstraint(
                //     this.boxSize,
                //     this.scene
                // );

                // previousPartAggregate.body.addConstraint(boxAggregate.body, distanceJoint);

                //Ball and Socket

                // const constraint = new PhysicsConstraint(
                //     PhysicsConstraintType.BALL_AND_SOCKET, 
                //     {
                //         pivotA: new Vector3(0, 0, -this.boxSize / 2), // Точка соединения на предыдущем кубике
                //         pivotB: new Vector3(0, 0, this.boxSize / 2),  // Точка соединения на текущем кубике
                //         axisA: Vector3.Up(),                         // Ось соединения
                //         axisB: Vector3.Up(),
                //         collision: false,                             // Разрешить коллизии между соединенными телами
                //     },
                //     this.scene
                // );

                // previousPartAggregate.body.addConstraint(boxAggregate.body, constraint);


                //Lock

                const constraint = new PhysicsConstraint(
                    PhysicsConstraintType.LOCK, 
                    {
                        pivotA: new Vector3(0, 0, -this.boxSize / 2), // Точка соединения на предыдущем кубике
                        pivotB: new Vector3(0, 0, this.boxSize / 2),  // Точка соединения на текущем кубике
                        axisA: Vector3.Up(),                         // Ось соединения
                        axisB: Vector3.Up(),
                        collision: true,                             // Разрешить коллизии между соединенными телами
                    },
                    this.scene
                );

                // Привязываем ограничение к двум физическим телам
                previousPartAggregate.body.addConstraint(boxAggregate.body, constraint);
            }

            this.snakeParts.push(box);
            this.physicsAggregates.push(boxAggregate);
        }
    }

    // public changeMaterial(color: string) {
    //     if (this.selectedMesh) {
    //         const material = new StandardMaterial("material", this.scene);
    //         material.diffuseColor = Color3.FromHexString(color);
    //         this.selectedMesh.material = material;
    //     }
    // }
    public changeMaterial(meshId: string, color: string) {
        const mesh = this.snakeParts.find((m) => m.metadata.id === meshId);
        if (mesh) {
            const material = new StandardMaterial("material", this.scene);
            material.diffuseColor = Color3.FromHexString(color);
            mesh.material = material;
        }
    }

    // public moveSnake(direction: Vector3) {
    //     this.snakeParts.forEach(part => {
    //         part.position.addInPlace(direction);
    //     });
    // }
}
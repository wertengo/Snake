// import {
//     Scene,
//     Mesh,
//     MeshBuilder,
//     PhysicsImpostor,
//     PhysicsEngine,
//     DistanceJoint,
//     DistanceConstraint,
//     Vector3,
//     BallAndSocketConstraint,
//     DistanceJointData
// } from "@babylonjs/core";
import {
    Scene,
    Mesh,
    MeshBuilder,
    PhysicsImpostor,
    Vector3,
    PhysicsJoint
} from "@babylonjs/core";

export class Snake {
    private scene: Scene;
    private snakeParts: Mesh[] = [];
    private boxSize: number;

    constructor(scene: Scene, boxSize = 0.5) {
        this.scene = scene;
        this.boxSize = boxSize;
        this.createSnake();
    }

    // private createSnake() {
    //     for (let i = 0; i < 4; i++) {
    //         const box = MeshBuilder.CreateBox(`box${i}`, { size: this.boxSize }, this.scene);
    //         box.position.y = this.boxSize / 2;
    //         // box.position.y = 1;
    //         box.position.z = i * this.boxSize * 2;
    //         box.physicsImpostor = new PhysicsImpostor(
    //             box, 
    //             PhysicsImpostor.BoxImpostor, 
    //             { 
    //                 mass: 10 
    //             }, this.scene);

    //             // if (i > 0) {
    //             //     const previousPart = this.snakeParts[i - 1];
    //             //     if (previousPart && previousPart.physicsImpostor && box.physicsImpostor) {
    //             //         const constraint = new DistanceConstraint({
    //             //             attachedMeshA: previousPart,
    //             //             attachedMeshB: box,
    //             //             pivotA: new Vector3(0, 0, this.boxSize / 2),
    //             //             pivotB: new Vector3(0, 0, -this.boxSize / 2),
    //             //             maxDistance: this.boxSize * 2
    //             //         });
    //             //         this.scene.addConstraint(constraint);
    //             //     }
    //             // }

    //         this.snakeParts.push(box);
    //     }
    // }

    private createSnake() {
        const distanceMultiplier = 3
        for (let i = 0; i < 4; i++) {
            const box = MeshBuilder.CreateBox(`box${i}`, { size: this.boxSize }, this.scene);
            box.position.y = this.boxSize / 2;
            box.position.z = i * this.boxSize * 2 * distanceMultiplier;
            box.physicsImpostor = new PhysicsImpostor(
                box, 
                PhysicsImpostor.BoxImpostor, 
                { 
                    mass: 10 
                }, this.scene);
    
            this.snakeParts.push(box);
    
            if (i > 0) {
                const previousPart = this.snakeParts[i - 1];
                
                // Создаем Ball-and-Socket Joint
                const joint = new PhysicsJoint(PhysicsJoint.BallAndSocketJoint, {
                    mainPivot: new Vector3(0, 0, (this.boxSize * distanceMultiplier) / 2), // Точка соединения на предыдущем объекте
                    connectedPivot: new Vector3(0, 0, (-this.boxSize * distanceMultiplier) / 2), // Точка соединения на текущем объекте
                });
    
                // Применяем соединение к объектам
                previousPart.physicsImpostor?.addJoint(box.physicsImpostor, joint);
            }
        }
    }

    public moveSnake(direction: Vector3) {
        this.snakeParts.forEach(part => {
            part.position.addInPlace(direction);
        });
    }
}
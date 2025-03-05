import {
    Scene,
    Mesh,
    MeshBuilder,
    PhysicsImpostor,
    Vector3,
    PhysicsJoint,
    PhysicsAggregate,
    PhysicsShapeType,
    DistanceConstraint
} from "@babylonjs/core";

export class Snake {
    private scene: Scene;
    private snakeParts: Mesh[] = [];
    private physicsAggregates: PhysicsAggregate[] = [];
    private boxSize: number;

    constructor(scene: Scene, boxSize = 0.5) {
        this.scene = scene;
        this.boxSize = boxSize;
        this.createSnake();
    }

    private createSnake() {
        const distanceMultiplier = 3
        for (let i = 0; i < 4; i++) {
            const box = MeshBuilder.CreateBox(`box${i}`, { size: this.boxSize }, this.scene);
            // box.position.y = this.boxSize / 2;
            box.position.y = 4;
            box.position.z = i * this.boxSize * 2 * distanceMultiplier;
            box.metadata = i;
            const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 10 }, this.scene);
    
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

    public moveSnake(direction: Vector3) {
        this.snakeParts.forEach(part => {
            part.position.addInPlace(direction);
        });
    }
}
import {
    Scene,
    Engine,
    Camera,
    PhysicsImpostor,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    PhysicsAggregate,
    PhysicsShapeType
} from "@babylonjs/core";
import { Snake } from "./Snake";
import HavokPhysics from '@babylonjs/havok';
import { HavokPlugin } from '@babylonjs/core/Physics/v2/Plugins/havokPlugin';

export class BasicScene {

    scene!: Scene;
    engine: Engine;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.initializeScene().then(() => {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        }).catch(error => {
            console.error("Error initializing scene:", error);
        });
    }

    async initializeScene(): Promise<void> {
        this.scene = this.CreateScene();
        await this.enablePhysic();
        this.CreateImpostor();
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);

        const camera = new FreeCamera("camera", new Vector3(0, 1, 0), this.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        hemiLight.intensity = 0.5;

        return scene;
    }

    async enablePhysic(): Promise<void> {
        const havok = await HavokPhysics();
        this.scene.enablePhysics(
            new Vector3(0, -9.81, 0),
            new HavokPlugin(false, havok)
        );
    }

    CreateImpostor(): void {
        const ground = MeshBuilder.CreateGround("ground",
            {
                width: 20,
                height: 20

            }, this.scene);

        const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, this.scene);
        
        const snake = new Snake(this.scene);
    }

}

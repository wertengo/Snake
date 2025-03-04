import {
    Scene,
    Engine,
    Camera,
    PhysicsImpostor,
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    CannonJSPlugin,
} from "@babylonjs/core";
import { Snake } from "./Snake";
import * as CANNON from "cannon";
// import { PhysicsEngine, HavokPlugin } from "@babylonjs/core/Physics";

export class BasicScene {

    scene: Scene;
    engine: Engine;

    constructor(private canvas: HTMLCanvasElement) {
        this.engine = new Engine(this.canvas, true);
        this.scene = this.CreateScene();
        const snake = new Snake(this.scene);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        })
    }

    CreateScene(): Scene {
        const scene = new Scene(this.engine);
        // scene.enablePhysics();
        const camera = new FreeCamera("camera", new Vector3(0, 1, 0), this.scene);
        camera.attachControl();
        camera.speed = 0.25;

        const hemiLight = new HemisphericLight(
            "hemiLight",
            new Vector3(0, 1, 0),
            this.scene
        );

        hemiLight.intensity = 0.5;

        scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON));
        // scene.enablePhysics(new Vector3(0, -9.81, 0), new HavokPlugin());

        const ground = MeshBuilder.CreateGround("ground",
            {
                width: 20,
                height: 20

            }, this.scene);
        ground.physicsImpostor = new PhysicsImpostor(
            ground,
            PhysicsImpostor.BoxImpostor,
            {
                mass: 0
            }, scene);

        // const snake = new Snake(this.scene);

        // const ball = MeshBuilder.CreateSphere("ball",{
        //     diameter: 1
        // },this.scene);

        // ball.position = new Vector3(0, 1, 0);
        // ball.position.x = 1;

        // scene.enablePhysics(new Vector3(0, -9.81, 0), new CannonJSPlugin(true, 10, CANNON));

        return scene;
    }

}


// import {
//     Scene,
//     Engine,
//     FreeCamera,
//     Vector3,
//     HemisphericLight,
//     MeshBuilder,
//     PhysicsImpostor,
// } from "@babylonjs/core";
// import { Snake } from "./Snake";
// import HavokPhysics from "@babylonjs/havok";
// import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

// export class BasicScene {
//     scene!: Scene;
//     engine: Engine;

//     constructor(private canvas: HTMLCanvasElement) {
//         this.engine = new Engine(this.canvas, true);
//         this.initScene();
//     }

//     async initScene() {
//         // Загружаем Havok
//         const havokInstance = await HavokPhysics();
//         const havokPlugin = new HavokPlugin(true, havokInstance);

//         // Создаем сцену
//         this.scene = new Scene(this.engine);

//         // Включаем физический движок
//         this.scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

//         // Камера
//         const camera = new FreeCamera("camera", new Vector3(0, 5, -10), this.scene);
//         camera.setTarget(Vector3.Zero());
//         camera.attachControl(this.canvas, true);

//         // Свет
//         const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
//         light.intensity = 0.7;

//         // Земля
//         const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 }, this.scene);
//         ground.physicsImpostor = new PhysicsImpostor(
//             ground,
//             PhysicsImpostor.BoxImpostor,
//             { mass: 0 },
//             this.scene
//         );

//         // Змея
//         const snake = new Snake(this.scene);

//         // Рендер-луп
//         this.engine.runRenderLoop(() => {
//             this.scene.render();
//         });
//     }
// }
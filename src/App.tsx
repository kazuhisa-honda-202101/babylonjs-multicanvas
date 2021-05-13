import React from 'react';
import {
    ArcRotateCamera,
    Engine,
    Mesh,
    Scene,
    Tools,
    Vector3, PointerInfo, PointerEventTypes,
    StandardMaterial, MeshBuilder, Color3, HemisphericLight
} from "@babylonjs/core";


class App extends React.Component<React.HTMLAttributes<HTMLCanvasElement>,
    {}> {

    private scene?: Scene;
    private engine?: Engine;
    private canvas1?: HTMLCanvasElement
    private canvas2?: HTMLCanvasElement
    private button?: HTMLButtonElement
    private camera1?: ArcRotateCamera
    private camera2?: ArcRotateCamera

    onCanvasLoaded1 = (c: HTMLCanvasElement) => {
        if (c !== null) { this.canvas1 = c; }
    }
    onCanvasLoaded2 = (c: HTMLCanvasElement) => {
        if (c !== null) { this.canvas2 = c; }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <canvas ref={this.onCanvasLoaded1} style={{ width: "300px", height: "200px", margin: "20px" }} />
                    <canvas ref={this.onCanvasLoaded2} style={{ width: "300px", height: "200px", margin: "20px" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                    <button onClick={() => this.enableCanvas1()}>キャンバス1を操作</button>
                    &nbsp; <button onClick={() => this.enableCanvas2()}>キャンバス2を操作</button>
                </div>
            </React.Fragment>
        )
    }

    enableCanvas1() {
        // カメラ操作対象を切り替え
        this.camera2?.detachControl()
        this.camera1?.attachControl()
        // ポインター操作対象を切り替え
        // Events: https://doc.babylonjs.com/divingDeeper/scene/multiCanvas
        this.scene?.detachControl();
        (this.engine!).inputElement = this.canvas1!
        this.scene?.attachControl();
    }

    enableCanvas2() {
        // カメラ操作対象を切り替え
        this.camera1?.detachControl()
        this.camera2?.attachControl()
        // ポインター操作対象を切り替え
        // Events: https://doc.babylonjs.com/divingDeeper/scene/multiCanvas
        this.scene?.detachControl();
        (this.engine!).inputElement = this.canvas2!
        this.scene?.attachControl();
    }

    componentDidMount() {
        console.log(this.button)
        const canvas1 = this.canvas1;
        const canvas2 = this.canvas2;
        const dummyCanvas = document.createElement("canvas") // ここ重要
        if (!canvas1 || !canvas2) throw new Error("canvas not found")
        const engine = this.engine = new Engine(
            dummyCanvas,
            true
        );
        engine.inputElement = canvas1;
        this.scene = new Scene(this.engine);
        const scene = this.scene
        scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    console.log("pointer down", pointerInfo)
                    break;
                case PointerEventTypes.POINTERUP:
                    console.log("pointer up", pointerInfo)
                    break;
                case PointerEventTypes.POINTERMOVE:
                    break;
            }
        })
        // 光源の設定
        const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        // カメラ
        const camera1 = this.camera1 = createCamera('camera1', scene)
        const camera2 = this.camera2 = createCamera('camera2', scene)
        { camera1.attachControl(); } // 最初はcanvas1のカメラを有効化

        engine.registerView(canvas1, camera1)
        engine.registerView(canvas2, camera2)
        createMesh(scene)
        // 画面描画ループ
        engine.runRenderLoop(() => {
            scene.render()
        });
    }
}

const createCamera = (name: string, scene: Scene) => {
    // カメラの設定 ArcRotateCamera
    const camera = new ArcRotateCamera(name, Tools.ToRadians(90),
        Tools.ToRadians(65), 10, Vector3.Zero(), scene);
    camera.setPosition(new Vector3(0.0, 90.0, 0.0));
    camera.setTarget(Vector3.Zero());
    camera.speed = 1

    return camera;
}


const createMesh = (scene: Scene) => {
    // 適当なメッシュ作成
    const pathArray: Vector3[][] = []
    for (let x = -50; x < 50; x++) {
        const v: Vector3[] = []
        for (let y = -50; y < 50; y++) {
            v.push(new Vector3(x, Math.random(), y))
        }
        pathArray.push(v)
    }
    const mesh = MeshBuilder.CreateRibbon("map", {
        pathArray,
        sideOrientation: Mesh.DOUBLESIDE,
        updatable: true,
    }, scene);

    let mapMaterial = new StandardMaterial("mapMaterial", scene)
    mapMaterial.wireframe = true
    mapMaterial.diffuseColor = Color3.FromHexString("#56CCFF")
    mapMaterial.alpha = 0.5
    return mesh;
}

export default App;

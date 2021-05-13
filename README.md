# 複数canvasを扱う際のポイント

## ダミーのcanvas作成
`new Engine` の際に渡すcanvasは、画面上のものではなく`document.createElement("canvas")`で作成したダミーのものを渡す。
```ts
const dummyCanvas = document.createElement("canvas")
const engine = new Engine(dummyCanvas, true);
```
参考：

https://www.babylonjs.com/demos/views/

https://github.com/BabylonJS/Website/blob/master/build/Demos/Views/index.html


## registerViewでキャンバス、カメラ紐づけ

```ts
engine.registerView(canvas1, camera1)
engine.registerView(canvas2, camera2)
```

## camera.detachControl、camera.attachControlでカメラ操作切替

```ts
// カメラ操作対象を切り替え（1→2の場合）
this.camera1.detachControl()
this.camera2.attachControl()
// カメラ操作対象を切り替え（2→1の場合）
this.camera2.detachControl()
this.camera1.attachControl()
```

## scene.detachControl, scene.attachControlでマウスポインター操作対象切替

参考：https://doc.babylonjs.com/divingDeeper/scene/multiCanvas

```ts
// マウスポインター操作対象を切り替え（1→2）
this.scene.detachControl();
this.engine.inputElement = this.canvas2
this.scene.attachControl();
// マウスポインター操作対象を切り替え（2→1）
this.scene.detachControl();
this.engine.inputElement = this.canvas1
this.scene.attachControl();
```

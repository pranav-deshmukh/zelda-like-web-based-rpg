import { Direction, Position } from "@/components/common/types";
import { AnimationComponent, AnimationConfig } from "@/components/game-object/animation-component";
import { ControlsComponent } from "@/components/game-object/controls-component";
import { DirectionComponent } from "@/components/game-object/direction-component";
import { SpeedComponent } from "@/components/game-object/speed-component";
import { InputComponent } from "@/components/input/input-component";
import { StateMachine } from "@/components/state-machine/state-machine";

export type CharacterConfig = {
    scene: Phaser.Scene;
    position: Position;
    assetKey: string;
    frame?:number;
    inputComponent: InputComponent;
    animationConfig:AnimationConfig;
    speed:number;
    id?:string;
    isPlayer:boolean;
}

export abstract class CharacterGameObject extends Phaser.Physics.Arcade.Sprite {
    protected _controlsComponent: ControlsComponent;
    protected _speedComponent:SpeedComponent;
    protected _animationComponent:AnimationComponent;
    protected _directionComponent:DirectionComponent;
    protected _stateMachine:StateMachine;
    protected _isPlayer:boolean;

    constructor(config:CharacterConfig){
        const {scene, position, assetKey, frame, speed, animationConfig, inputComponent, id, isPlayer} = config;
        const {x, y} = position;

       super(scene, x, y, assetKey, frame || 0);

       scene.add.existing(this);
       scene.physics.add.existing(this);

        //add shared components
       this._controlsComponent = new ControlsComponent(this, inputComponent);
       this._speedComponent = new SpeedComponent(this, speed);
       this._directionComponent = new DirectionComponent(this);
       this._animationComponent = new AnimationComponent(this, animationConfig);

       //create state machine
       this._stateMachine = new StateMachine(id);

       this._isPlayer = isPlayer;;
    }

    get isEnemy():boolean{
        return !this._isPlayer;
    }

    get controls(): InputComponent {
        return this._controlsComponent.controls;
    }

    get speed(): number {
        return this._speedComponent.speed;
    }

    get direction():Direction{
        return this._directionComponent.direction;
    }

    set direction(value:Direction){
        this._directionComponent.direction = value;
    }

    get animationComponent(): AnimationComponent {
        return this._animationComponent;
    }

    public update(): void {
        
        this._stateMachine.update();
    }

    
}
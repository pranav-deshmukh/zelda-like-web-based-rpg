import { PLAYER_ANIMATION_KEYS } from "@/components/common/assets";
import { Position } from "@/components/common/types";
import { isArcadePhysicsBody } from "@/components/common/utils";
import { ControlsComponent } from "@/components/game-object/controls-component";
import { InputComponent } from "@/components/input/input-component";
import { StateMachine } from "@/components/state-machine/state-machine";
import { CHARACTER_STATES } from "@/components/state-machine/states/character/character-states";
import { IdleState } from "@/components/state-machine/states/character/idle-state";

export type PlayerConfig = {
    scene: Phaser.Scene;
    position: Position;
    assetKey: string;
    frame?:number;
    controls: InputComponent;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
    #controlsComponent: ControlsComponent;
    #stateMachine:StateMachine

    constructor(config:PlayerConfig){
        const {scene, position, assetKey, frame} = config;
        const {x, y} = position;

       super(scene, x, y, assetKey, frame || 0);

       scene.add.existing(this);
       scene.physics.add.existing(this);

       this.#controlsComponent = new ControlsComponent(this, config.controls);

       this.play({key:PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat:-1});

       this.#stateMachine = new StateMachine('player');
       this.#stateMachine.addState(new IdleState(this));
       this.#stateMachine.setState(CHARACTER_STATES.IDLE_STATE);

       config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
       config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
           config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
       });
    }

    update(): void {
        const controls = this.#controlsComponent.controls;
        if(controls.isUpDown) {
            this.play({key:PLAYER_ANIMATION_KEYS.WALK_UP, repeat:-1}, true);
            this.#updateVelocity(false, -1);
        }
        else if(controls.isDownDown) {
            this.play({key:PLAYER_ANIMATION_KEYS.WALK_DOWN, repeat:-1}, true);
            this.#updateVelocity(false, 1);
        }
        else{
            this.#updateVelocity(false, 0);
        }

        const isMovingVertically = controls.isUpDown || controls.isDownDown;
        if(controls.isLeftDown) {
            this.setFlipX(true);
            this.#updateVelocity(true, -1);
            if(!isMovingVertically) {
                this.play({key:PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat:-1}, true);
            }
        }
        else if(controls.isRightDown) {
            this.setFlipX(false);
            this.#updateVelocity(true, 1);
            if(!isMovingVertically) {
                this.play({key:PLAYER_ANIMATION_KEYS.WALK_SIDE, repeat:-1}, true);
            }
        }
        else{
            this.#updateVelocity(true, 0);
        }

        if(!controls.isLeftDown && !controls.isRightDown && !controls.isUpDown && !controls.isDownDown) {
            this.play({key:PLAYER_ANIMATION_KEYS.IDLE_DOWN, repeat:-1}, true);
        }

        this.#normalizeVelocity();
    }

    #updateVelocity(isX:boolean, value:number):void {
        if(!isArcadePhysicsBody(this.body)) {
            return;
        }
        if(isX) {
            this.body.velocity.x = value;
            return;
        }
        this.body.velocity.y = value;
    }

    #normalizeVelocity():void {
        if(!isArcadePhysicsBody(this.body)) {
            return;
        }
        this.body.velocity.normalize().scale(80);
    }
}
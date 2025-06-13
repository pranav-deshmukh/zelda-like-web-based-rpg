import { Player } from "@/components/game-objects/player/player";
import { BaseCharacterState } from "./base-character-state";
import { CHARACTER_STATES } from "./character-states";
import { PLAYER_ANIMATION_KEYS } from "@/components/common/assets";
import { isArcadePhysicsBody } from "@/components/common/utils";

export class IdleState extends BaseCharacterState {
    constructor(gameObject:Player) {
        super(CHARACTER_STATES.IDLE_STATE, gameObject);
    }

    public onEnter(): void {
        
        this._gameObject.animationComponent.playAnimation(`IDLE_${this._gameObject.direction}`)

        if(isArcadePhysicsBody(this._gameObject.body)){
            this._gameObject.body.velocity.x = 0;
            this._gameObject.body.velocity.y = 0;
        }
    }

    public onUpdate(): void {
        const controls = this._gameObject.controls;
        if(!controls.isLeftDown && !controls.isRightDown && !controls.isUpDown && !controls.isDownDown) {
            return;
        }
        this._stateMachine.setState(CHARACTER_STATES.MOVE_STATE)
    }
}
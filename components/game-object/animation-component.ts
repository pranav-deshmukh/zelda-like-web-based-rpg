import { CharacterAnimation, GameObject } from "../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";

export type AnimationConfig = {
    [key in CharacterAnimation]?:{key:string; repeat:number; ignoreIfPlaying:boolean}; 
}
export class AnimationComponent extends BaseGameObjectComponent {
    declare protected gameObject: Phaser.GameObjects.Sprite;
    #config:AnimationConfig;
    constructor(gameObject:GameObject, config:AnimationConfig) {
        super(gameObject);
        this.#config = config; 
    }

    public getAnimationKey(CharacterAnimationKey:CharacterAnimation):string|undefined{
        if(this.#config[CharacterAnimationKey]===undefined){
            return undefined;
        }
        return this.#config[CharacterAnimationKey].key;
    }

    public playAnimation(CharacterAnimationKey:CharacterAnimation, callback?:()=>void):void{
        if(this.#config[CharacterAnimationKey]===undefined){
            if(callback) callback();
            return;
        }
        const animationConfig:Phaser.Types.Animations.PlayAnimationConfig={
            key: this.#config[CharacterAnimationKey].key,
            repeat: this.#config[CharacterAnimationKey].repeat,
            timeScale: 1,
        }
        if(callback){
            const animationKey=Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + this.#config[CharacterAnimationKey].key;
            this.gameObject.once(animationKey, ()=>{
                callback();
            })
        }
        this.gameObject.play(animationConfig, this.#config[CharacterAnimationKey].ignoreIfPlaying);
    }

    public isAnimationPlaying():boolean{
        return this.gameObject.anims.isPlaying;
    }
}
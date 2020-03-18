import { ChartState } from '@t/store/store';
import { Rect } from '@t/options';
import Store from '../store/store';
import Painter from '@src/painter';
import EventEmitter from '../eventEmitter';

type ComponentType = 'component' | 'series' | 'legend' | 'axis' | 'tooltip' | 'plot';

export default abstract class Component {
  name = 'Component';

  type: ComponentType = 'component';

  rect: Rect = {
    x: 0,
    y: 0,
    height: 0,
    width: 0
  };

  isShow = true;

  store: Store;

  eventBus: EventEmitter;

  models!: any; // @TODO: 정의

  drawModels!: any; // @TODO: 정의

  responders!: any[]; // @TODO: 정의

  constructor({ store, eventBus }: { store: Store; eventBus: EventEmitter }) {
    this.store = store;
    this.eventBus = eventBus;
  }

  abstract initialize(args: any): void;

  abstract render(state: ChartState, computed: Record<string, any>): void;

  update(delta: number) {
    if (!this.drawModels) {
      return;
    }

    if (Array.isArray(this.models)) {
      this.updateModels(this.drawModels, this.models, delta);
    } else {
      Object.keys(this.models).forEach(type => {
        const currentModels = this.drawModels[type];
        const targetModels = this.models[type];

        this.updateModels(currentModels, targetModels, delta);
      });
    }
  }

  updateModels(currentModels, targetModels, delta) {
    currentModels.forEach((current: Record<string, any>, index: number) => {
      const target = targetModels[index];

      Object.keys(current).forEach(key => {
        if (key[0] !== '_' && key !== 'text') {
          if (typeof current[key] === 'number') {
            current[key] = current[key] + (target[key] - current[key]) * delta;
          } else if (key === 'opacity') {
            // 투명도도 서서히 증가 시키면 좋을듯
          } else {
            current[key] = target[key];
          }
        }
      });
    });
  }

  syncModels() {
    if (!this.drawModels) {
      return;
    }

    Object.keys(this.models).forEach(type => {
      const currentModels = this.drawModels[type];
      const targetModels = this.models[type];

      if (currentModels.length < targetModels.length) {
        this.drawModels[type] = currentModels.concat(
          targetModels.slice(currentModels.length, targetModels.length)
        );
      } else if (currentModels.length > targetModels.length) {
        this.drawModels[type].splice(targetModels.length, currentModels.length);
      }
    });
  }

  beforeDraw?(painter: Painter): void;

  onClick?(responseData: any): void;

  onMousemove?(responseData: any): void;

  draw(painter: Painter) {
    const models = this.drawModels ? this.drawModels : this.models;

    if (Array.isArray(models)) {
      painter.paintForEach(models);
    } else {
      Object.keys(models).forEach(item => {
        painter.paintForEach(models[item]);
      });
    }
  }
}

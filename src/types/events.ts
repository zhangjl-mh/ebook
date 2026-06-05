export interface UniTouchPoint {
  clientX: number;
  clientY: number;
  pageX?: number;
  pageY?: number;
  identifier?: number;
}

export interface UniTouchEvent {
  touches?: ArrayLike<UniTouchPoint>;
  changedTouches?: ArrayLike<UniTouchPoint>;
}

export interface UniValueChangeEvent<T = unknown> {
  detail: {
    value: T;
  };
}

export type UniSliderChangeEvent = UniValueChangeEvent<number | string>;

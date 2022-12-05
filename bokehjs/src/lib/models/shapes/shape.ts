import {Renderer, RendererView} from "../renderers/renderer"
import * as p from "core/properties"

export abstract class ShapeView extends RendererView {
  override model: Shape

  abstract paint(): void

  protected _render(): void {
    this.paint()
  }

  override get needs_clip(): boolean {
    return true
  }
}

export namespace Shape {
  export type Attrs = p.AttrsOf<Props>
  export type Props = Renderer.Props
  export type Visuals = Renderer.Visuals
}

export interface Shape extends Shape.Attrs {}

export abstract class Shape extends Renderer {
  override properties: Shape.Props
  override __view_type__: ShapeView

  static override __module__ = "bokeh.models.shapes"

  constructor(attrs?: Partial<Shape.Attrs>) {
    super(attrs)
  }

  static {
    this.override<Shape.Props>({
      level: "annotation",
    })
  }
}

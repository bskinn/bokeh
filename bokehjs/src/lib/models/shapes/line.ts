import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import * as p from "core/properties"
import {SXY} from "./common"

export class LineView extends PathView {
  override model: Line
  override visuals: Line.Visuals

  get p0(): SXY {
    return {sx: 0, sy: 0}
  }

  get p1(): SXY {
    return {sx: 0, sy: 0}
  }

  paint(): void {
    const {ctx} = this.layer
    ctx.beginPath()
    const {p0, p1} = this
    ctx.moveTo(p0.sx, p0.sy)
    ctx.lineTo(p1.sx, p1.sy)
    this.visuals.line.apply(ctx)
  }
}

export namespace Line {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    p0: p.Property<Coordinate>
    p1: p.Property<Coordinate>
  }

  export type Visuals = Path.Visuals
}

export interface Line extends Line.Attrs {}

export class Line extends Path {
  override properties: Line.Props
  override __view_type__: LineView

  constructor(attrs?: Partial<Line.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = LineView

    this.define<Line.Props>(({Ref}) => ({
      p0: [ Ref(Coordinate) ],
      p1: [ Ref(Coordinate) ],
    }))
  }
}

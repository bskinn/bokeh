import {Path, PathView} from "./path"
import {Coordinate} from "../coordinates/coordinate"
import * as p from "core/properties"
import {SXY} from "./common"

export class BezierView extends PathView {
  override model: Bezier
  override visuals: Bezier.Visuals

  get p0(): SXY {
    return {sx: 0, sy: 0}
  }

  get p1(): SXY {
    return {sx: 0, sy: 0}
  }

  get cp0(): SXY {
    return {sx: 0, sy: 0}
  }

  get cp1(): SXY | null {
    const {cp1} = this.model
    return cp1 == null ? null : {sx: 0, sy: 0}
  }

  paint(): void {
    const {ctx} = this.layer

    ctx.beginPath()
    const {p0, p1, cp0, cp1} = this
    ctx.moveTo(p0.sx, p0.sy)

    if (cp1 != null) {
      ctx.bezierCurveTo(cp0.sx, cp0.sy, cp1.sx, cp1.sy, p1.sx, p1.sy)
    } else {
      ctx.quadraticCurveTo(cp0.sx, cp0.sy, p1.sx, p1.sy)
    }

    this.visuals.line.apply(ctx)
  }
}

export namespace Bezier {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Path.Props & {
    p0: p.Property<Coordinate>
    p1: p.Property<Coordinate>
    cp0: p.Property<Coordinate>
    cp1: p.Property<Coordinate | null>
  }

  export type Visuals = Path.Visuals
}

export interface Bezier extends Bezier.Attrs {}

export class Bezier extends Path {
  override properties: Bezier.Props
  override __view_type__: BezierView

  constructor(attrs?: Partial<Bezier.Attrs>) {
    super(attrs)
  }

  static {
    this.prototype.default_view = BezierView

    this.define<Bezier.Props>(({Ref, Nullable}) => ({
      p0: [ Ref(Coordinate) ],
      p1: [ Ref(Coordinate) ],
      cp0: [ Ref(Coordinate) ],
      cp1: [ Nullable(Ref(Coordinate)), null ],
    }))
  }
}
